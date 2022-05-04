"use strict";

const {red} = require("kleur");
const fs = require("fs");
const path = require("path");

/**
 * @param {string} message
 */
function printError(message) {
  console.error(`${red("Error:")} ${message}`);
}

/**
 * @param {string} targetPath
 */
function makeDirectory(targetPath) {
  try {
    fs.mkdirSync(targetPath);
  }
  catch (e) {
    const contents = fs.readdirSync(targetPath);
    if (contents.length > 0) {
      printError("The target directory already exists and isn't empty.");
      process.exit(1);
    }
  }
}

/**
 * @param {string} string
 * @param {object} values
 * @param {string} values.name
 * @param {string} values.serverLocales
 * @param {string} values.serverUrl
 */
function applyTemplate(string, values) {
  return string
    .replace(/\$TEMPLATE_NAME/g, values.name)
    .replace(/\$TEMPLATE_SERVERLOCALES/g, values.serverLocales)
    .replace(/\$TEMPLATE_SERVERURL/g, values.serverUrl);
}

/**
 * @param {string} fileName
 * @param {string} targetPath
 */
function copyTemplateFile(fileName, targetPath) {
  return fs.copyFileSync(
    require.resolve(`../template/${fileName}`),
    path.join(targetPath, fileName)
  );
}

/**
 * @param {string} fileName
 */
function readTemplateFile(fileName) {
  return fs.readFileSync(require.resolve(`../template/${fileName}`), "utf8");
}

/**
 * @param {string} fileName
 * @param {string} targetPath
 * @param {string} contents
 */
function writeFile(fileName, targetPath, contents) {
  return fs.writeFileSync(path.join(targetPath, fileName), contents);
}

/**
 * @param {string} string
 */
function slugify(string) {
  return `${string}`.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w-]/g, "")
    .replace(/_/g, "-")
    .replace(/^[^a-z]+|[^a-z]+$/g, "");
}

module.exports = {
  applyTemplate,
  copyTemplateFile,
  makeDirectory,
  printError,
  readTemplateFile,
  slugify,
  writeFile
};
