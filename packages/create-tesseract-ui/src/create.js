"use strict";

const utils = require("./utils");

module.exports = function(values) {
  const {name, targetPath} = values;
  utils.copyTemplateFile("index.js", targetPath);

  const readme = utils.readTemplateFile("README.md");
  const readmeFinal = utils.applyTemplate(readme, values);
  utils.writeFile("README.md", targetPath, readmeFinal);

  const poiConfig = utils.readTemplateFile("poi.config.js");
  const poiConfigFinal = utils.applyTemplate(poiConfig, values);
  utils.writeFile("poi.config.js", targetPath, poiConfigFinal);

  const packageString = utils.readTemplateFile("package.json");
  const targetPackage = JSON.parse(packageString);
  targetPackage.name = `${name}-tesseract-ui`;
  utils.writeFile("package.json", targetPath, JSON.stringify(targetPackage, null, 2));
};
