"use strict";

const utils = require("./utils");

module.exports = function({targetPath, title, name, serverUrl, publicUrl}) {
  utils.copyTemplateFile("App.js", targetPath);
  utils.copyTemplateFile("index.js", targetPath);

  const readme = utils.readTemplateFile("poi.config.js");
  const readmeFinal = readme
    .replace(/\$TEMPLATE_NAME/g, name)
    .replace(/\$TEMPLATE_PUBLIC/g, publicUrl)
    .replace(/\$TEMPLATE_SERVER/g, serverUrl)
    .replace(/\$TEMPLATE_TITLE/g, title);
  utils.writeFile("README.md", targetPath, readmeFinal);

  const poiConfig = utils.readTemplateFile("poi.config.js");
  const poiConfigFinal = poiConfig
    .replace(/\$TEMPLATE_NAME/g, name)
    .replace(/\$TEMPLATE_PUBLIC/g, publicUrl)
    .replace(/\$TEMPLATE_SERVER/g, serverUrl)
    .replace(/\$TEMPLATE_TITLE/g, title);
  utils.writeFile("poi.config.js", targetPath, poiConfigFinal);

  const packageString = utils.readTemplateFile("package.json");
  const targetPackage = JSON.parse(packageString);
  targetPackage.name = `${name}-tesseract-ui`;
  utils.writeFile("package.json", targetPath, JSON.stringify(targetPackage, null, 2));
};
