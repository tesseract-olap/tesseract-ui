#!/usr/bin/env node

const path = require("node:path");
const {exec} = require("node:child_process");
const semver = require("semver");
const simpleGit = require("simple-git");
const { traversePackages } = require("./toolbox/traverse");
const { spawn } = require("./toolbox/command");

const git = simpleGit();

/**
 * Gets the latest published version of a package from the npm registry.
 * @param {string} packageName The name of the package.
 * @returns {Promise<string|null>} The latest version, or null if not published.
 */
function getPublishedVersion(packageName) {
    return new Promise((resolve) => {
        exec(`npm view ${packageName} version`, (error, stdout, stderr) => {
            if (error) {
                // E404 error means the package doesn't exist in the registry
                if (stderr.includes("404")) {
                    return resolve(null);
                }
                // for other errors, we can consider it as not found either to be safe
                return resolve(null);
            }
            resolve(stdout.trim());
        });
    });
}

/**
 * Builds and publishes a package.
 * @param {import("./toolbox/traverse").PackageMeta} packageMeta The metadata of the package to publish.
 */
async function publishPackage(packageMeta) {
    const { manifest, packagePath } = packageMeta;
    const packageName = manifest.name;
    console.log(`\nPublishing ${packageName}...`);

    // Build step
    if (manifest.scripts && manifest.scripts.build) {
        console.log(`Running build for ${packageName}...`);
        try {
            await spawn("npm", ["run", "build"], { cwd: packagePath });
            console.log(`Build successful for ${packageName}.`);
        } catch (error) {
            console.error(`Build failed for ${packageName}. Aborting publish.`);
            // A failed build is a critical error, so we should not proceed to publish.
            throw error;
        }
    } else {
        console.log(`No build script found for ${packageName}. Skipping build.`);
    }

    // Publish step
    console.log(`Publishing ${packageName}...`);
    // IMPORTANT: Remove `--dry-run` to perform a real publish to the registry.
    try {
        await spawn("npm", ["publish"], { cwd: packagePath });
        console.log(`Successfully published ${packageName}.`);
    } catch (error) {
        console.error(`Publish failed for ${packageName}.`);
        throw error;
    }
}

/**
 * Publishes packages that have a newer version than the one published on npm.
 * @param {string} [targetPackage] Optional package name or folder name to publish a specific package.
 */
async function monorepoPublish(targetPackage) {
    console.log("Checking for packages to publish...");

    const rootPath = await git.revparse(["--show-toplevel"]);
    const packagesPath = path.resolve(rootPath, "packages");

    const packagesToPublish = [];

    const packagesIterator = await traversePackages(packagesPath);
    for (const packageMeta of packagesIterator) {
        const { manifest, folderName } = packageMeta;
        const packageName = manifest.name;
        const localVersion = manifest.version;

        if (!packageName || !localVersion) {
            continue;
        }

        if (targetPackage && packageName !== targetPackage && folderName !== targetPackage) {
            continue;
        }

        const remoteVersion = await getPublishedVersion(packageName);

        if (!remoteVersion || semver.gt(localVersion, remoteVersion)) {
            console.log(`  - Found ${packageName}@${localVersion} (remote: ${remoteVersion || "N/A"})`);
            packagesToPublish.push(packageMeta);
        }
    }

    if (packagesToPublish.length === 0) {
        console.log("\nAll packages are up-to-date.");
        return;
    }

    console.log(`\nFound ${packagesToPublish.length} package(s) to publish.`);

    for (const packageMeta of packagesToPublish) {
        try {
            await publishPackage(packageMeta);
        }
        catch (e) {
            console.error(`An error occurred while publishing ${packageMeta.manifest.name}, stopping.`);
            process.exit(1);
        }
    }

    console.log("\nAll packages published successfully.");
}

const targetPackage = process.argv[2];
monorepoPublish(targetPackage).catch(error => {
  console.error("\nAn unexpected error occurred:");
  console.error(error);
  process.exit(1);
});
