#!/usr/bin/env node

const pkg = require("../package.json");

const cli = require("cac").cac(pkg.name);
const spawn = require("cross-spawn");
const {green, grey, red, yellow} = require("kleur");
const path = require("path");
const prompts = require("prompts");

const utils = require("./utils");
const validate = require("./validate");

const LINE = "-----------------------------------------------------------";

/**
 * @typedef CommandOptions
 * @property {string} env
 * Sets the type of machine where this instance will run.
 * @property {string} locales
 * A comma-separated list of locale codes the server is prepared to serve.
 * Don't use spaces in between. The first one will be used by default in the UI.
 * @property {string} server
 * Sets the URL for the tesseract server.
 * @property {string} target
 * Specifies a version of the tesseract-explorer package.
 * If not set, the latest version available will be used.
 */

/* eslint-disable indent */
cli
  .command("[directory]", "Create a tesseract-ui boilerplate in the defined directory.")
  .option("-e, --env <machine>",
          "Sets the type of machine where this instance will run. Valid values are 'local' and 'production'.")
  .option("-l, --locales <codes>",
          "A comma-separated list of locale codes the server is prepared to serve. Don't use spaces in between. The first one will be used by default in the UI.")
  .option("-s, --server <url>",
          "Sets the URL for the tesseract server.")
  .option("-t, --target <version>",
          "Specifies a version of the tesseract-explorer package. If not set, the latest version available will be used.")
  .action(async(directory = ".", options) => {
    console.log(pkg.name, `v${pkg.version}`, "\n");

    const [fullPath, fullOptions] = await normalizeOptions(directory, options);
    await cliAction(fullPath, fullOptions);
  });
/* eslint-enable indent */

cli.help();
cli.version(pkg.version);

cli.parse();

/**
 * @param {string} targetPath
 * @param {CommandOptions} options
 */
async function cliAction(targetPath, options) {

  console.log("Creating a new tesseract-ui instance");
  console.log(`Target directory: ${green(targetPath)}`);
  utils.makeDirectory(targetPath);

  console.log(LINE);

  console.log("Creating files and applying configuration...");
  const targetName = path.basename(targetPath);
  createInstance(targetPath, {
    name: utils.slugify(targetName) || "demo",
    serverLocales: options.locales,
    serverUrl: options.server,
    version: options.target || "next"
  });

  console.log(LINE);

  console.log("Installing required dependencies...");
  const npm = spawn.sync("npm", ["install", "--loglevel=error"], {
    cwd: targetPath,
    stdio: "ignore"
  });
  if (npm.stderr) {
    console.error(red("Error while installing dependencies:"));
    console.error(npm.stderr);
    console.error(yellow("You can manually fix the error in the scaffolding folder,"));
    console.error(yellow("then run"), green("npm run update"), yellow("to finish the setup."));
    process.exit(npm.status);
  }

  console.log(LINE);

  if (options.env === "production") {
    console.log("Building app...");
    const vite = spawn.sync("npx", ["vite", "build"], {cwd: targetPath, stdio: "inherit"});
    if (vite.stderr) {
      console.error(red("Error while building the app bundle:"));
      console.error(vite.stderr);
      console.error(yellow("You can manually fix the error in the scaffolding folder,"));
      console.error(yellow("then run"), green("npm run build"), yellow("to finish the setup."));
      process.exit(vite.status);
    }

    console.log(LINE);

    console.log("The tesseract-ui boilerplate was successfully built on");
    console.log(green(path.join(targetPath, "dist")));
    console.log("We suggest you to point the virtual server root folder to this path.");
  }
  else {
    console.log(`The tesseract-ui boilerplate is ready to run in development mode.
Use the command ${yellow("npm start")} to start the server.
After the startup is done, a message will give the URL the app is available.
To build a production bundle, run ${yellow("npm run build")}
The bundle will be generated in ${path.join(targetPath, "dist/")}`);
  }
}

/**
 * @param {string} targetPath
 * @param {object} values
 * @param {string} values.name
 * @param {string} values.version
 * @param {string} values.serverUrl
 * @param {string} values.serverLocales
 */
function createInstance(targetPath, values) {
  utils.copyTemplateFile("index.js", targetPath);
  utils.copyTemplateFile("style.css", targetPath);

  const index = utils.readTemplateFile("index.html");
  const indexFinal = utils.applyTemplate(index, values);
  utils.writeFile("index.html", targetPath, indexFinal);

  const viteConfig = utils.readTemplateFile("vite.config.js");
  const viteConfigFinal = utils.applyTemplate(viteConfig, values);
  utils.writeFile("vite.config.js", targetPath, viteConfigFinal);

  const packageString = utils.readTemplateFile("package.json");
  const targetPackage = JSON.parse(packageString);
  targetPackage.name = `${values.name}-explorer`;
  targetPackage.dependencies["@datawheel/tesseract-explorer"] = values.version;
  utils.writeFile("package.json", targetPath, JSON.stringify(targetPackage, null, 2));

  const readme = utils.readTemplateFile("README.md");
  const readmeFinal = utils.applyTemplate(readme, values);
  utils.writeFile("README.md", targetPath, readmeFinal);
}

/**
 *
 * @param {string} directory
 * @param {Partial<CommandOptions>} options
 * @returns {[string, CommandOptions]}
 */
async function normalizeOptions(directory, options) {
  const directoryPath = path.resolve(directory);

  const missingOptions = await prompts(
    [{
      name: "server",
      type: options.server ? false : "text",
      message: "Enter the full URL for the OLAP server",
      validate: validate.absoluteUrl
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
    }],
    {onCancel: () => process.exit()}
  );

  return [directoryPath, {...options, ...missingOptions}];
}

/**
 * @param {string} targetPath
 */
function printNginxExample(targetPath) {
  return `Configuration example for nginx:

If the app will be hosted on the root of a domain, set:
${grey(`server {
...
root       ${path.join(targetPath, "dist/")};
try_files  $uri $uri/ =404;
...
}`)}

If the app will be hosted in a /pathname/ use:
${grey(`server {
...
location ^~ /pathname {
alias      ${path.join(targetPath, "dist/")};
try_files  $uri $uri/ =404;
}
...
}`)}`;
}
