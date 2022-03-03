#!/usr/bin/env node

const path = require("path");
const {promises: fs} = require("fs");
const simpleGit = require("simple-git");
const semverInc = require("semver/functions/inc");
const prompt = require("chosen");

const {LINE, RELEASE_TYPES} = require("./toolbox/constants");
const {traversePackages} = require("./toolbox/traverse");

/** @type {simpleGit.SimpleGit} */
const git = simpleGit();

monorepoRelease().catch(error => {
  console.log(new Array(80).fill("=").join(""));
  console.error(error);
  process.exit(1);
});

/**
 * Creates new releases for all packages
 */
async function monorepoRelease() {
  // get the root path to the git repo
  const rootPath = await git.revparse(["--show-toplevel"]);
  const packagesPath = path.resolve(rootPath, "packages");

  // iterate over the things inside the packages/ folder
  const packagesIterator = await traversePackages(packagesPath);
  for (const packageMeta of packagesIterator) {
    const {folderName, manifest} = packageMeta;

    const packageName = manifest.name;
    const packageVersion = manifest.version;
    const packageTag = `${packageName}@${packageVersion}`;

    let commitsInvolved = [];
    try {
      commitsInvolved = await summaryCommits(folderName, packageTag);
    }
    catch {
      console.log(LINE);
      console.log(`Package ${folderName} has no previous releases, a first one must be done manually.`);
      continue;
    }

    // if any of these commits touched a file of this package
    if (commitsInvolved.length > 0) {
      console.log(LINE);
      console.log(`Changes found for package ${packageName} v${packageVersion}:`);
      console.log(commitsInvolved.join("\n"));

      const newRelease = await incrementVersion(packageMeta, commitsInvolved);
      newRelease && console.log(`Created version release ${newRelease}`);
    }
  }
}

/**
 * Returns an array with the commit message for all commits since `packageTag`
 * where a file inside `folderName` or its subfolders was modified.
 * @param {string} folderName
 * @param {string} packageTag
 * @returns {Promise<string[]>}
 */
async function summaryCommits(folderName, packageTag) {
  // translate the tag/release into its associated commit hash
  const packageCommit = await git.revparse(["--short", packageTag]);

  // get a list of commits since relevant tag/release
  const commitsSince = await git.raw(["rev-list", `${packageCommit}..HEAD`])
    .then(result => result.split("\n").filter(Boolean));

  const commitsInvolved = [];

  // for each commit that can have possibly modified the package
  for (const commitHash of commitsSince) {
    // get the [commit hash + commit message], and list of files changed
    const [commitMeta, ...updatedFiles] = await git
      .show([commitHash, "--name-only", "--pretty=format:* [%h] %s"])
      .then(result => result.split("\n").filter(Boolean));

    // if any of the files involved in this commit is from this package
    if (updatedFiles.join("\n").includes(`packages/${folderName}`)) {
      // save the commit meta in a list
      commitsInvolved.unshift(commitMeta);
    }
  }

  return commitsInvolved;
}

/**
 * Asks the user through a prompt which type of SemVer increment wants to apply
 * to the defined package, and updates its package.json field.
 * @param {PackageMeta} pkgMeta
 * @param {string[]} commitsInvolved
 * @returns {string | false}
 */
async function incrementVersion(pkgMeta, commitsInvolved) {
  const {manifest, manifestPath} = pkgMeta;
  const {name: packageName, version: currVersion} = manifest;

  // ask the user which kind of increment apply to the version
  const incrementType = await new Promise((resolve, reject) => {
    console.log("Which type of version increment apply?");
    prompt.choose(["skip", ...RELEASE_TYPES], answer => {
      answer ? resolve(answer) : reject("Operation canceled by the user.");
    }, {});
  });

  if (incrementType === "skip") {
    console.log(`Skipping version increment for package ${packageName}`);
    return false;
  }

  const nextVersion = semverInc(currVersion, incrementType);
  const nextTag = `${packageName}@${nextVersion}`;

  // bump version on manifest and commit
  const updatedManifest = JSON.stringify({...manifest, version: nextVersion}, null, 2);
  await fs.writeFile(manifestPath, `${updatedManifest}\r\n`, {encoding: "utf8"});
  await git.commit(nextTag, [manifestPath]);

  // create a new tag for the release
  const nextTagTitle = `Release ${packageName} v${nextVersion}\n`;
  const tagMessage = [nextTagTitle].concat(commitsInvolved).join("\n");
  await git.addAnnotatedTag(nextTag, tagMessage);

  return nextTag;
}
