"use strict";

const utils = require("./utils");

function applyTemplate(string, values) {
  return string
    .replace(/\$TEMPLATE_NAME/g, values.name)
    .replace(/\$TEMPLATE_PUBLIC/g, values.publicUrl)
    .replace(/\$TEMPLATE_SERVER/g, values.serverUrl)
    .replace(/\$TEMPLATE_TITLE/g, values.title);
}

module.exports = function(values) {
  const {name, targetPath} = values;
  utils.copyTemplateFile("App.js", targetPath);
  utils.copyTemplateFile("index.js", targetPath);

  const readme = utils.readTemplateFile("README.md");
  const readmeFinal = applyTemplate(readme, values);
  utils.writeFile("README.md", targetPath, readmeFinal);

  const poiConfig = utils.readTemplateFile("poi.config.js");
  const poiConfigFinal = applyTemplate(poiConfig, values);
  utils.writeFile("poi.config.js", targetPath, poiConfigFinal);

  const packageString = utils.readTemplateFile("package.json");
  const targetPackage = JSON.parse(packageString);
  targetPackage.name = `${name}-tesseract-ui`;
  utils.writeFile("package.json", targetPath, JSON.stringify(targetPackage, null, 2));
};
