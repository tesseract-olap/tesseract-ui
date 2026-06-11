# Publishing & Releases

This monorepo publishes several packages to npm under the `@datawheel` scope. Version management and publishing are handled by [Changesets](https://github.com/changesets/changesets) — no conventional commits required.

## Packages

| Package | npm | Version | Description |
|---------|-----|---------|-------------|
| `@datawheel/tesseract-explorer` | [npm](https://www.npmjs.com/package/@datawheel/tesseract-explorer) | 2.0.0 | Core React component for exploring tesseract-olap data |
| `@datawheel/tesseract-vizbuilder` | [npm](https://www.npmjs.com/package/@datawheel/tesseract-vizbuilder) | 0.5.1 | Charting plugin for tesseract-explorer |
| `@datawheel/tesseract-client` | [npm](https://www.npmjs.com/package/@datawheel/tesseract-client) | 1.0.0 | TypeScript types + query builder for tesseract-olap |
| `@datawheel/cube-audit` | [npm](https://www.npmjs.com/package/@datawheel/cube-audit) | 1.0.4 | CLI tool to audit OLAP server metadata annotations |
| `@datawheel/create-tesseract-ui` | [npm](https://www.npmjs.com/package/@datawheel/create-tesseract-ui) | 0.8.1 | Scaffolding CLI to create new tesseract-ui instances |

## How Changesets Work

Changesets are markdown files stored in `.changeset/`. Each file contains:
- Which packages changed
- The semver bump type for each (`patch`, `minor`, `major`)
- A human-written changelog entry

Unlike conventional-commits tooling, changesets don't parse your commit messages. You write the changelog entry yourself when you create the changeset. This means:

- Commit messages can be whatever is useful to developers (scoped commits, free text, ticket references)
- Changelogs are written for end-users, not generated from commit dumps
- A single PR can contain multiple changesets (e.g., one for a new feature, one for a bugfix)

## Workflow

### Step 1: Create a changeset alongside your code

When you make changes that should be released to npm, run:

```bash
pnpm changeset
```

This launches an interactive prompt:

```
🦋  Which packages have changed?
◯ @datawheel/tesseract-explorer
◯ @datawheel/tesseract-vizbuilder
...
```

1. **Select the packages** affected by your change (spacebar to select, enter to confirm).
2. **Choose the bump type** for each selected package (`patch`, `minor`, or `major`).
3. **Write a changelog entry** — a short description of the change from an end-user perspective.

This creates a file at `.changeset/<random-name>.md` looking like:

```md
---
"@datawheel/tesseract-explorer": minor
---

Add Portuguese group annotations to the dimension hierarchy view.
```

Commit and push this file as part of your PR. If your PR touches multiple unrelated changes, create multiple changeset files (run `pnpm changeset` again after the first one completes).

### Step 2: Merge the PR to master

After your PR (including the changeset file) is merged to `master`, the Release CI workflow runs. It detects the changeset files and creates or updates a **"Version Packages"** pull request. This PR:
- Consumes the changeset files (deletes them from `.changeset/`)
- Bumps version numbers in each affected `package.json`
- Updates `CHANGELOG.md` files with the changelog entries you wrote
- Updates internal workspace dependencies to use the new versions

The "Version Packages" PR is kept up to date as more changesets are merged.

### Step 3: Merge the Version Packages PR

When you're ready to release, merge the "Version Packages" PR. This triggers the publish step in CI:
- All packages are built (`pnpm run build`)
- Published to npm with `changeset publish`
- Git tags are created for each published version

## Writing Good Changelog Entries

A changelog entry should tell an end-user what changed from a functional perspective.

### Good examples:

```
Add Portuguese group annotations to the dimension hierarchy view.
```
```
Fix table rendering when measure values contain null data points.
```
```
Remove deprecated `useLegacyParser` option from query builder.
```

### Bad examples (too vague or developer-focused):

```
Refactored state management.  (user doesn't care about internals)
```
```
Fixed lint errors.  (not a user-facing change)
```
```
Updated dependencies.  (irrelevant to consumers)
```

If your change doesn't affect end-users (e.g., CI configuration, README typos, internal refactoring), you can create an empty changeset:

```bash
pnpm changeset --empty
```

## Choosing the Right Bump Type

| Bump | When to use |
|------|-------------|
| `patch` | Bug fixes, performance improvements, dependency updates with no API change |
| `minor` | New features, new exports, backwards-compatible additions |
| `major` | Breaking API changes, removed exports, changed behavior that requires consumer action |

Internal packages (demo apps, eslint-config) are marked `"private": true` in their `package.json` and are skipped by Changesets.

## How the Release CI Works

The release workflow (`.github/workflows/release.yml`) runs on every push to `master`:

1. **Checkout + Setup**: Node 22, pnpm 10, with caching
2. **Install**: `pnpm install --frozen-lockfile`
3. **Build**: `pnpm run build` (via Turbo)
4. **changesets/action**: This is the key step. It checks for changeset files:
   - If changeset files exist and haven't been versioned → it opens/updates a "Version Packages" PR
   - If changeset files have been consumed (the Version Packages PR was merged) → it publishes to npm

The action needs two tokens:
- `GITHUB_TOKEN`: Auto-provided by GitHub, used to create the Version Packages PR. Needs `contents: write` and `pull-requests: write` permissions.
- `NPM_TOKEN`: Must be set as a repository secret. Must have publish access for the `@datawheel` scope.

## Available Scripts

| Script | Purpose |
|--------|---------|
| `pnpm changeset` | Create a new changeset file (interactive) |
| `pnpm changeset --empty` | Mark a change as "no release needed" |
| `pnpm release:status` | Show which packages have pending changesets |
| `pnpm release:version` | Consume changesets and bump versions (called by CI) |
| `pnpm release:publish` | Build + publish to npm (called by CI) |
| `pnpm mono:release` | **Legacy** — interactive release (see below) |
| `pnpm mono:publish` | **Legacy** — manual publish (see below) |

## First-Time Package Setup

When adding a new package to the monorepo that should be published:

1. Ensure the package is NOT marked `"private": true` in its `package.json`.
2. Make sure it has a build script (`"build": "tsup"` or similar).
3. Publish the first version manually:
   ```bash
   cd packages/my-new-package
   npm publish --access public
   git tag "@datawheel/my-new-package@1.0.0"
   git push origin "@datawheel/my-new-package@1.0.0"
   ```
4. Subsequent releases go through the normal Changesets workflow.

## Legacy Scripts

The old release tooling is preserved at `scripts/release.js` and `scripts/publish.js` for manual use. These work without CI or Changesets:

```bash
# Interactive release: shows commits since last tag, prompts for bump type
pnpm mono:release

# Publish a specific package to npm
pnpm mono:publish tesseract-explorer
```

Prefer the Changesets workflow above. The legacy scripts are maintained for emergencies or when working offline.

## Troubleshooting

**"Some packages have been changed but no changesets were found"**

Changesets requires that every PR touching a publishable package includes a changeset. If your change truly doesn't need a release (docs, CI, refactoring), create an empty changeset:

```bash
pnpm changeset --empty
```

**"No packages matched" during `pnpm changeset`**

Your package may be marked `"private": true`. Only non-private packages can have changesets. If the package should be published, remove the `"private": true` field.

**CI creates version bumps but doesn't publish**

Check that `NPM_TOKEN` is set as a repository secret in GitHub and has write access to the `@datawheel` scope:

```bash
# Verify token has access
npm access list packages @datawheel/tesseract-explorer
```

**"Version Packages" PR not created**

Check the Release workflow logs on GitHub. Common causes:
- The workflow file has `branches: [master]` but you pushed to a different branch
- `GITHUB_TOKEN` doesn't have `contents: write` and `pull-requests: write` permissions
- There are no changeset files in `.changeset/`

**Node version issues**

This repo requires Node >= 18 and pnpm >= 10:

```bash
node --version    # should be >= 18
pnpm --version    # should be >= 10
```

If you use Nix, run `nix-shell` to get the correct toolchain.

## Configuration Reference

Changeset behavior is configured in `.changeset/config.json`:

| Key | Value | Meaning |
|-----|-------|---------|
| `access` | `public` | Publish to public npm registry (not restricted) |
| `baseBranch` | `master` | Compare against this branch to detect changes |
| `commit` | `false` | Don't add conventional commit footers to automated commits |
| `updateInternalDependencies` | `patch` | When a dependency gets bumped, bump dependents by patch |
| `changelog` | `@changesets/cli/changelog` | Default changelog format |

The `onlyUpdatePeerDependentsWhenOutOfRange` experimental option prevents peer-dependent bumps unless the peer range is actually broken.
