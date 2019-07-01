"use strict";

const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

function printError(message) {
  console.error(`${chalk.red("Error:")} ${message}`);
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

module.exports = {
  copyTemplateFile,
  makeDirectory,
  printError,
  readTemplateFile,
  writeFile
};
