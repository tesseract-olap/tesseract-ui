#!/usr/bin/env node

const path = require("path");
const {promises: fs} = require("fs");
const simpleGit = require("simple-git");
const semverInc = require("semver/functions/inc");
const prompt = require("chosen");

const LINE = "----------------------------------------------------------------------";
const releaseType = ["prerelease", "prepatch", "patch", "preminor", "minor", "premajor", "major"];

monorepoRelease(simpleGit()).catch(error => {
  console.error(error);
  process.exit(1);
});

/**
 * Creates new releases for all packages
 * @param {simpleGit.SimpleGit} git
 */
async function monorepoRelease(git) {
  // get the root path to the git repo
  const rootPath = await git.revparse(["--show-toplevel"]);
  const packagesPath = path.resolve(rootPath, "packages");

  // iterate over the things inside the packages/ folder
  const files = await fs.readdir(packagesPath, {
    encoding: "utf8",
    withFileTypes: true
  });
  for (const file of files) {
    // only if it's a folder
    if (!file.isDirectory()) continue;

    const folderName = file.name;
    const packagePath = path.resolve(packagesPath, folderName);
    const manifestPath = path.resolve(packagePath, "package.json");
    const manifest = require(manifestPath);

    // and not a private package
    if (manifest.private) continue;

    const packageName = manifest.name;
    const packageVersion = manifest.version;
    const packageTag = `${packageName}@${packageVersion}`;

    // translate the last tag/release into its associated commit hash
    const packageCommit = await git.revparse(["--short", packageTag]);

    // get a list of commits since last tag/release
    const commitsSince = await git.raw(["rev-list", `${packageCommit}..HEAD`])
      .then(result => result.split("\n").filter(Boolean));

    const commitsInvolved = [];

    // for each commit that can have possibly modified the package
    for (const commitHash of commitsSince) {
      // get the commit hash, commit message, and list of files changed
      const [commitMeta, ...filesChanged] = await git
        .show([commitHash, "--name-only", `--pretty=format:* [%h] %s`])
        .then(result => result.split("\n").filter(Boolean));

      // if any of the files involved in this commit is from this package
      if (filesChanged.join("\n").includes(`packages/${folderName}`)) {
        // save the commit meta in a list
        commitsInvolved.unshift(commitMeta);
      }
    }

    // if any of these commits touched a file of this package
    if (commitsInvolved.length > 0) {
      console.log(`${LINE}
Changes found for package ${packageName} v${packageVersion}:
${commitsInvolved.join("\n")}
`);

      // ask the user which kind of increment apply to the version
      const incrementType = await new Promise((resolve, reject) => {
        console.log("Which type of version increment apply?");
        prompt.choose(releaseType, answer => {
          answer ? resolve(answer) : reject("Operation canceled by the user.");
        }, {});
      });
      const nextVersion = semverInc(packageVersion, incrementType);
      const nextTag = `${packageName}@${nextVersion}`;

      // bump version on manifest and commit
      await fs.writeFile(
        manifestPath,
        JSON.stringify({...manifest, version: nextVersion}, null, 2) + "\r\n",
        {encoding: "utf8"}
      );
      await git.commit(nextTag, [manifestPath]);

      // create a new tag for the release
      const nextTagTitle = `Release ${packageName} v${nextVersion}\n`;
      await git.addAnnotatedTag(nextTag, [nextTagTitle].concat(commitsInvolved).join("\n"));
    }
  }
}
