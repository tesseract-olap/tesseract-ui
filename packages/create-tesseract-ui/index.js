#!/usr/bin/env node

const {name, version} = require("./package.json");

const cac = require("cac");
const crossSpawn = require("cross-spawn");
const kleur = require("kleur");
const fs = require("fs");
const path = require("path");
const prompts = require("prompts");


const cli = cac.cac(name);
cli
  .command(
    "[directory]",
    "Create a tesseract-ui boilerplate in the defined directory.")
  .option(
    "-d, --debug",
    "Enables debug mode, to see the parsed values to use before executing the script.")
  .option(
    "-e, --env <machine>",
    "Sets the type of machine where this instance will run. Valid values are 'local' and 'production'.")
  .option(
    "-l, --locales <codes>",
    "A comma-separated list of locale codes the server is prepared to serve. Don't use spaces in between. The first one will be used by default in the UI.")
  .option(
    "-s, --server <url>",
    "Sets the URL for the tesseract server.")
  .option(
    "-t, --target <version>",
    "Specifies a version of the tesseract-explorer package. If not set, the latest version available will be used.")
  .action(async(directory = ".", options = {debug: false}) => {
    print("%s v%s\n", name, version);

    const resolvedPath = path.resolve(directory);
    if (options.debug) {
      debug("%s\n", fieldset("Target directory", kleur.green(resolvedPath)));
    }

    const resolvedOptions = await normalizeOptions(options);
    print("");

    if (options.debug) {
      // eslint-disable-next-line no-extra-parens
      const keys = /** @type {const} */ (["server", "env", "locales", "target"]);
      const content = keys.map(key => `- ${key}: '${kleur.green(resolvedOptions[key])}'`);
      debug("%s\n", fieldset("Options", content));

      const {shouldContinue} = await prompts({
        name: "shouldContinue",
        type: "confirm",
        message: "Continue with these parameters?"
      });
      if (!shouldContinue) return;
    }

    print(line());
    await cliAction(resolvedPath, resolvedOptions);
  });

cli.help();
cli.version(version);
cli.parse();

/**
 * @param {string} message
 * @param {string[]} args
 */
function print(message, ...args) {
  console.log(message, ...args);
}

/**
 * @param {string} message
 * @param {(string | Buffer)[]} args
 */
function error(message, ...args) {
  console.error(message, ...args);
}

/**
 * @param {string} message
 * @param {string[]} args
 */
function debug(message, ...args) {
  console.debug(message, ...args);
}

/**
 * @param {string} title
 * @param {string | string[]} content
 */
function fieldset(title, content) {
  const contentLines = (Array.isArray(content) ? content : content.split("\n")).map(line => `  ${  line}`);
  return [line(title)].concat(contentLines, line()).join("\n");
}

/**
 * @param {string} [message]
 */
function line(message = "") {
  message = message.trim();
  message += message ? " " : "";
  return message + "-".repeat(process.stdout.columns - message.length);
}

/**
 * @param {fs.PathLike} targetPath
 */
function makeDirectory(targetPath) {
  try {
    fs.mkdirSync(targetPath);
  }
  catch (e) {
    const contents = fs.readdirSync(targetPath);
    if (contents.length > 0) {
      error("The target directory already exists and isn't empty.");
      process.exit(1);
    }
  }
}

/**
 * @param {string} string
 * @param {{ projectName: string; serverLocales: string; serverURL: string; }} values
 */
function applyTemplate(string, values) {
  return string
    .replace(/\$TEMPLATE_NAME/g, values.projectName)
    .replace(/\$TEMPLATE_SERVERLOCALES/g, values.serverLocales)
    .replace(/\$TEMPLATE_SERVERURL/g, values.serverURL);
}

/**
 * @param {string} fileName
 * @param {string} targetPath
 */
function copyTemplateFile(fileName, targetPath) {
  return fs.copyFileSync(
    require.resolve(`./template/${fileName}`),
    path.join(targetPath, fileName)
  );
}

/**
 * @param {string} fileName
 */
function readTemplateFile(fileName) {
  return fs.readFileSync(require.resolve(`./template/${fileName}`), "utf8");
}

/**
 * @param {string} fileName
 * @param {string} targetPath
 * @param {string | NodeJS.ArrayBufferView} contents
 */
function writeFile(fileName, targetPath, contents) {
  return fs.writeFileSync(path.join(targetPath, fileName), contents);
}

/**
 * @param {string} string
 */
function slugify(string) {
  return `${string}`
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w-]/g, "")
    .replace(/_/g, "-")
    .replace(/^[^a-z]+|[^a-z]+$/g, "");
}

/**
 * @param {string} targetPath
 * @param {{ target: any; locales: any; server: any; env: string; }} options
 */
async function cliAction(targetPath, options) {
  print("Creating a new tesseract-ui instance\n");

  makeDirectory(targetPath);

  print("Checking the selected tesseract version exists...");
  const meta = checkTesseractMeta(targetPath, options.target);

  print("Creating files and applying configuration...");
  const targetName = path.basename(targetPath);
  createInstance(targetPath, meta, {
    explorerVersion: options.target,
    projectName: slugify(targetName) || "demo",
    serverLocales: options.locales,
    serverURL: options.server
  });

  print("Installing required dependencies...");

  const npm = crossSpawn.sync("npm", ["install", "--loglevel=error"], {
    cwd: targetPath,
    stdio: "ignore"
  });
  if (npm.stderr) {
    error(kleur.red("Error while installing dependencies:"));
    error("%s", npm.stderr);
    error(
      kleur.yellow("You can manually fix the error in the scaffolding folder, then run"),
      kleur.green("npm run update"),
      kleur.yellow("to finish the setup.")
    );
    process.exit(npm.status ?? 1);
  }

  if (options.env === "local") {
    print(line());
    print(`The tesseract-ui boilerplate is ready to run in development mode.
Use the command ${kleur.yellow("npm start")} to start the server.
After the startup is done, a message will give the URL the app is available.
To build a production bundle, run ${kleur.yellow("npm run build")}
The bundle will be generated in ${path.join(targetPath, "dist/")}`);
    return;
  }

  print("Building app...");

  const vite = crossSpawn.sync("npx", ["vite", "build"], {
    cwd: targetPath,
    stdio: "inherit"
  });
  if (vite.stderr) {
    error(kleur.red("Error while building the app bundle:"));
    error("%s", vite.stderr);
    error(
      kleur.yellow("You can manually fix the error in the scaffolding folder, then run"),
      kleur.green("npm run build"),
      kleur.yellow("to finish the setup.")
    );
    process.exit(vite.status ?? 1);
  }

  print(line());
  print("The tesseract-ui boilerplate was successfully built on");
  print(kleur.green(path.join(targetPath, "dist")));
  print("We suggest you to point the virtual server root folder to this path.");
}

/**
 * @param {string} targetPath
 * @param {string} version
 * @returns {{ peerDependencies: Record<string, string>; }}
 */
function checkTesseractMeta(targetPath, version) {
  const npm = crossSpawn.sync("npm", ["info", `@datawheel/tesseract-explorer@${version}`, "--json"], {
    cwd: targetPath,
    stdio: "pipe"
  });
  if (npm.status !== 0 && npm.status !== null) {
    error(kleur.red("Error while contacting npm API for metadata:"));
    error("%s", npm.stderr);
    process.exit(npm.status);
  }
  if (npm.stdout == null) {
    error(kleur.red("Specified version or tag for tesseract-explorer does not exist."));
    process.exit(1);
  }
  const meta = JSON.parse(npm.stdout.toString());
  return meta;
}

/**
 * @param {any} targetPath
 * @param {{ peerDependencies: Record<string, string>; }} meta
 * @param {{ explorerVersion: string; projectName: string; serverLocales: string; serverURL: string; }} values
 */
function createInstance(targetPath, meta, values) {
  copyTemplateFile("index.js", targetPath);

  const index = readTemplateFile("index.html");
  const indexFinal = applyTemplate(index, values);
  writeFile("index.html", targetPath, indexFinal);

  const viteConfig = readTemplateFile("vite.config.js");
  const viteConfigFinal = applyTemplate(viteConfig, values);
  writeFile("vite.config.js", targetPath, viteConfigFinal);

  const packageString = readTemplateFile("package.json");
  const targetPackage = JSON.parse(packageString);
  targetPackage.name = `${values.projectName}-explorer`;
  targetPackage.dependencies = {
    "normalize.css": "^8.0.0",
    ...meta.peerDependencies,
    "@datawheel/tesseract-explorer": values.explorerVersion
  };
  writeFile("package.json", targetPath, JSON.stringify(targetPackage, null, 2));

  const readme = readTemplateFile("README.md");
  const readmeFinal = applyTemplate(readme, values);
  writeFile("README.md", targetPath, readmeFinal);
}

/**
 * @param {string} string
 */
function isAbsoluteURL(string) {
  return (/https?:\/\/[\w-@:%.~=]{2,256}\b[\w-@:%\+.~/=]*/i).test(string);
}

/**
 * @param {string} string
 */
function isRelativeURL(string) {
  return (/^\/[\w-@:%\+.~/=]*/i).test(string);
}

/**
 * @param {string} string
 */
function isURL(string) {
  return isAbsoluteURL(string) || isRelativeURL(string);
}

/**
 * @param {{ server?: string; env?: string; locales?: string; target?: string }} options
 * @returns {Promise<{ server: string; env: string; locales: string; target: string }>}
 */
async function normalizeOptions(options) {
  const missingOptions = await prompts(
    [{
      name: "server",
      type: options.server ? false : "text",
      message: "Enter the full URL for the OLAP server",
      validate: isURL
    }, {
      name: "env",
      type: options.env ? false : "select",
      message: "Where will this instance run?",
      choices: [
        {title: "A local computer", value: "local"},
        {title: "A production server", value: "production"}
      ]
    }, {
      name: "locales",
      type: options.locales ? false : "text",
      message: "What locales is the server configured to use? Comma-separated, first will be the default",
      initial: "en"
    }, {
      name: "target",
      type: options.target ? false : "text",
      message: "Which version of tesseract-explorer do you want to use?",
      initial: "latest"
    }],
    {onCancel: () => process.exit()}
  );
  return {
    ...options,
    ...missingOptions,
    target: options.target || "latest"
  };
}
