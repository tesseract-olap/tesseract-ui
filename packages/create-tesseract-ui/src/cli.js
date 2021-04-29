#!/usr/bin/env node

const pkg = require("../package.json");

const cli = require("cac").cac(pkg.name);
const spawn = require("cross-spawn");
const {green, grey, yellow} = require("kleur");
const path = require("path");
const prompts = require("prompts");

const create = require("./create");
const utils = require("./utils");
const validate = require("./validate");

const LINE = "-----------------------------------------------------------";

cli
  .command("[directory]", "Create a tesseract-ui boilerplate in the defined directory.")
  .option("-e, --env <machine>", "Sets the type of machine where this instance will run.")
  .option("-s, --server <url>", "Sets the URL for the tesseract server.")
  .option("-n, --nginx", "If the environment is production, outputs an example nginx config for the static directory.")
  .action(cliAction);

cli.help();
cli.version(pkg.version);

cli.parse();

/**
 * @param {string} targetFolder
 * @param {object} options
 * @param {string} options.env
 * @param {string} options.server
 * @param {boolean} options.nginx
 */
async function cliAction(targetFolder = ".", options) {
  console.log(`${pkg.name} v${pkg.version}`);

  const targetPath = path.resolve(targetFolder);
  const targetName = path.basename(targetPath);
  utils.makeDirectory(targetPath);

  console.log(`${LINE}
Creating a new tesseract-ui instance
Target directory: ${green(targetPath)}
${LINE}`);

  const environment = await prompts(
    [{
      type: options.server ? false : "text",
      name: "server",
      message: "Enter the full URL for the OLAP server",
      validate: validate.absoluteUrl
    }, {
      type: options.env ? false : "select",
      name: "env",
      message: "Where will this instance run?",
      choices: [
        {title: "A local computer", value: "local"},
        {title: "A production server", value: "production"}
      ]
    }, {
      type: prev => options.nginx || prev !== "production" ? false : "confirm",
      name: "nginx",
      message: "Do you intend to use nginx to serve this app?"
    }],
    {onCancel: () => process.exit(0)}
  );
  Object.assign(options, environment);

  console.log(LINE);
  console.log("Creating files and applying configuration...");
  create({
    name: utils.slugify(targetName) || "demo",
    serverUrl: options.server,
    targetPath
  });

  console.log(LINE);
  console.log("Installing required dependencies...");
  spawn.sync("npm", ["install", "--loglevel=error"], {cwd: targetPath, stdio: "inherit"});

  if (options.env === "production") {
    console.log(LINE);
    console.log("Building app...");
    spawn.sync("npx", ["vite", "build"], {cwd: targetPath, stdio: "inherit"});

    console.log(LINE);
    console.log("The tesseract-ui boilerplate was successfully built on");
    console.log(green(path.join(targetPath, "dist")));

    if (options.nginx) {
      console.log(`${LINE}
Configuration example for nginx:

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
}`)}
`);
    }
    else {
      console.log("We suggest you to point the virtual server root folder to this path.");
    }
  }
  else {
    console.log(`${LINE}
The tesseract-ui boilerplate is ready to run in development mode.
Use the command ${yellow("npm start")} to start the server, the app will then
run on ${green("http://localhost:4000")}
To build a production bundle, run ${yellow("npm run build")}
The bundle will be generated in ${path.join(targetPath, "dist/")}
`);
  }
}
