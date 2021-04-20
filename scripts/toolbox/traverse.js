const {promises: fs} = require("fs");
const path = require("path");

module.exports = {
  traversePackages
};

/**
 * @typedef PackageMeta
 * @property {string} folderName
 * @property {string} manifestPath
 * @property {any} manifest
 * @property {string} packagePath
 */

/**
 * @param {string} packagesPath
 * @returns {Promise<IterableIterator<PackageMeta>>}
 */
async function traversePackages(packagesPath) {
  const files = await fs.readdir(packagesPath, {
    encoding: "utf8",
    withFileTypes: true
  });

  let index = -1;

  /** */
  function next() {
    while (++index < files.length) {
      const file = files[index];

      if (!file.isDirectory()) continue;

      const folderName = file.name;
      const packagePath = path.resolve(packagesPath, folderName);
      const manifestPath = path.resolve(packagePath, "package.json");
      const manifest = require(manifestPath);

      if (manifest.private) continue;

      return {done: false, value: {folderName, manifestPath, manifest, packagePath}};
    }

    return {done: true, value: undefined};
  }

  const iterator = {next, [Symbol.iterator]: () => iterator};
  return iterator;
}
