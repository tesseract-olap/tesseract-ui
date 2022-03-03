#!/usr/bin/env node

const simpleGit = require("simple-git");
const {spawn, exec} = require("./toolbox/command");
const {traversePackages} = require("./toolbox/traverse");

monorepoPublish(simpleGit()).catch(error => {
  console.error(error);
  process.exit(1);
});

/**
 * Publishes a new version for a specific package
 *
 * @param {simpleGit.SimpleGit} git
 */
async function monorepoPublish(git) {
  const pkg = process.argv[2];

  // get the root path to the git repo
  const rootPath = await git.revparse(["--show-toplevel"]);
  const packagesPath = path.resolve(rootPath, "packages");

  // iterate over the things inside the packages/ folder
  const packagesIterator = await traversePackages(packagesPath);
  for (const packageMeta of packagesIterator) {
    const {manifest, folderName} = packageMeta;
    if ([folderName, manifest.name].includes(pkg)) {
      const build = await spawn("npm", ["run", "build"]);
      const publishTest = await spawn("npm", ["publish", packageMeta.packagePath, "--dry-run"]);
      const publish = await spawn("npm", ["publish", packageMeta.packagePath, "--dry-run"]);
      break;
    }
  }
}

