"use strict";

const utils = require("./utils");

module.exports = function(values) {
  const {name, targetPath} = values;
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
  targetPackage.name = `${name}-explorer`;
  utils.writeFile("package.json", targetPath, JSON.stringify(targetPackage, null, 2));

  const readme = utils.readTemplateFile("README.md");
  const readmeFinal = utils.applyTemplate(readme, values);
  utils.writeFile("README.md", targetPath, readmeFinal);
};
