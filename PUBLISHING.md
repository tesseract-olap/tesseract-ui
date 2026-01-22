# 📦 Publishing & Releases

This guide explains how to publish and create releases for packages in this Tesseract UI monorepo.

## 📋 Prerequisites

### 🔐 NPM Authentication
Make sure you have NPM access configured:

```bash
npm login
```

You must have write permissions for the `@datawheel/*` packages.

### 🏗️ Development Environment
- Node.js >= 18.0.0
- npm >= 8.11.0
- Git configured with credentials

## 🚀 Release and Publishing Process

### Step 1: Create a new release

Run the release command to detect changes and create new versions:

```bash
npm run mono:release
```

#### What this command does:

1. **Detects changes** in each package since the last release
2. **Analyzes commits** that affect each package
3. **Shows summary** of changes per package
4. **Asks for version type** for each package with changes

#### Available version types:

- `patch` - Minor changes (bug fixes) - `1.0.0` → `1.0.1`
- `minor` - New features (backward compatible) - `1.0.0` → `1.1.0`
- `major` - Breaking changes - `1.0.0` → `2.0.0`
- `prerelease` - Pre-release versions (alpha/beta) - `1.0.0` → `1.0.1-alpha.0`
- `prepatch/preminor/premajor` - Specific pre-versions
- `skip` - Skip this package

#### Example output:

```
----------------------------------------------------------------------
Changes found for package @datawheel/tesseract-explorer v2.0.0-alpha.17:
* [a1b2c3d] Fix defaultProps deprecation warning
* [e4f5g6h] Add Portuguese group annotations

Which type of version increment apply?
❯ patch
  minor
  major
  skip
```

### Step 2: Publish the package

Once the release is created, publish the package to NPM:

```bash
npm run mono:publish <package-name>
```

#### Examples:

```bash
# Publish tesseract-explorer
npm run mono:publish tesseract-explorer

# Publish vizbuilder
npm run mono:publish vizbuilder

# You can also use the directory name
npm run mono:publish tesseract-explorer
```

#### What this command does:

1. **Builds the package** using `npm run build`
2. **Runs dry-run** to verify everything is correct
3. **Publishes to NPM** the package from `packages/<package-name>/`

## 📝 Complete Workflow

### For a single package:

```bash
# 1. Make code changes
git add .
git commit -m "feat: add new feature"

# 2. Create release (increment version)
npm run mono:release

# 3. Publish to NPM
npm run mono:publish tesseract-explorer
```

### For multiple packages:

```bash
# 1. Make changes and commits
git add .
git commit -m "feat: update multiple packages"

# 2. Create releases for all affected packages
npm run mono:release

# 3. Publish each package individually
npm run mono:publish tesseract-explorer
npm run mono:publish vizbuilder
```

## 🔧 Available Scripts

### In root package.json:

```json
{
  "scripts": {
    "mono:release": "node scripts/release.js",
    "mono:publish": "node scripts/publish.js"
  }
}
```

### Custom scripts:

- **`scripts/release.js`** - Logic for automatically creating releases
- **`scripts/publish.js`** - Logic for publishing packages
- **`scripts/toolbox/`** - Utilities for the publishing workflow

## ⚙️ Technical Configuration

### Turbo (Parallel Building)

The project uses [Turbo](https://turbo.build/) for parallel building:

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

### Package Building

Each package is built with [tsup](https://tsup.egoist.sh/):

```json
// packages/tesseract-explorer/package.json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "prepublishOnly": "tsup"
  }
}
```

## 🚨 Important Notes

### First release of a package

If it's the **first time** you're publishing a package, the release script won't work automatically. You need to:

1. **Create the tag manually** for the first release
2. **Run release** normally for subsequent releases

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):

- **`PATCH`**: Bug fixes (1.0.0 → 1.0.1)
- **`MINOR`**: New backward-compatible features (1.0.0 → 1.1.0)
- **`MAJOR`**: Breaking changes (1.0.0 → 2.0.0)

### Automatic Publishing

Packages are published with the `@datawheel/` scope:
- `@datawheel/tesseract-explorer`
- `@datawheel/tesseract-vizbuilder`
- `@datawheel/cube-audit`
- `@datawheel/create-tesseract-ui`

## 🐛 Troubleshooting

### Error: "Package has no previous releases"

**Solution**: For new packages, create the first release manually:

```bash
# Update package.json manually
npm version patch  # or minor/major as appropriate

# Create tag
git tag "@datawheel/package-name@v1.0.0"

# Push tag
git push origin "@datawheel/package-name@v1.0.0"
```

### Error: "npm publish failed"

**Solution**: Verify:
- ✅ `npm login` configured correctly
- ✅ Write permissions for `@datawheel/*`
- ✅ No version conflicts
- ✅ Build completed successfully

### Error: "Cannot find module"

**Solution**: Make sure all dependencies are built first:

```bash
# Build entire monorepo
npm run build

# Or use turbo directly
npx turbo run build
```

## 📊 Package Status

You can check the publishing status on NPM:

- [@datawheel/tesseract-explorer](https://www.npmjs.com/package/@datawheel/tesseract-explorer)
- [@datawheel/tesseract-vizbuilder](https://www.npmjs.com/package/@datawheel/tesseract-vizbuilder)
- [@datawheel/cube-audit](https://www.npmjs.com/package/@datawheel/cube-audit)
- [@datawheel/create-tesseract-ui](https://www.npmjs.com/package/@datawheel/create-tesseract-ui)

## 📞 Contact

For questions about the publishing process, contact the development team.</contents>
</xai:function_call">PUBLISHING.md