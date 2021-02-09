"use strict";

const {red} = require("kleur");
const fs = require("fs");
const path = require("path");

function printError(message) {
  console.error(`${red("Error:")} ${message}`);
}

function makeDirectory(targetPath) {
  try {
    fs.mkdirSync(targetPath);
  } catch (e) {
    const contents = fs.readdirSync(targetPath);
    if (contents.length > 0) {
      printError("The target directory already exists and isn't empty.");
      process.exit(1);
    }
  }
}

function applyTemplate(string, values) {
  return string
    .replace(/\$TEMPLATE_NAME/g, values.name)
    .replace(/\$TEMPLATE_SERVER/g, values.serverUrl)
    .replace(/\$TEMPLATE_TITLE/g, values.title);
}

function copyTemplateFile(fileName, targetPath) {
  return fs.copyFileSync(
    require.resolve(`../template/${fileName}`),
    path.join(targetPath, fileName)
  );
}

function readTemplateFile(fileName) {
  return fs.readFileSync(require.resolve(`../template/${fileName}`), "utf8");
}

function writeFile(fileName, targetPath, contents) {
  return fs.writeFileSync(path.join(targetPath, fileName), contents);
}

function slugify(string) {
  return `${string}`.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\s/g, "-");
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
