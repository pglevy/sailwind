# Publishing Guide

## How publishing works

Sailwind lives in `appian/sailwind` (`origin`), but npm publishing runs from the maintainer's fork, `pglevy/sailwind`. The npm package trusts that repo and `publish.yml` through trusted publishing (OIDC), so no npm token is stored anywhere.

- **Pushing a `v*` tag to the fork** runs `publish.yml`: it builds the library, publishes to npm with provenance, and creates the fork's GitHub release.
- **Pushing a `v*` tag to `appian/sailwind`** does not publish. The publish job is skipped there. That tag and its release are for history and visibility.
- **The fork's `main` is a copy of `origin/main`.** Never commit to it. See [Day-to-day git flow](CONTRIBUTING.md#day-to-day-git-flow).
- **Releases and tags don't sync between repos.** Create them in both.

## Setup (One-Time)

### Configure npm Trusted Publishing (OIDC)

1. Go to https://www.npmjs.com/package/@pglevy/sailwind → Settings → Trusted Publisher
2. Add a connection: repo `pglevy/sailwind`, workflow `publish.yml`
3. Under "Publishing access", select "Require two-factor authentication or disallow tokens"
4. The config shows "Pending validation" until the first publish through it succeeds.

`publish.yml` upgrades npm before publishing, because trusted publishing needs npm 11.5.1 or later and Node 22 ships npm 10.

## Publishing Workflow

### Standard Release (Recommended)

`pnpm version` normally commits and tags on your local branch. That doesn't work when the bump has to go through a PR, because a merge can change the commit. Bump without tagging, merge, and tag after syncing.

```bash
# 1. Bump the version on a branch (choose one), without a tag
git fetch origin && git checkout main && git merge --ff-only origin/main
git checkout -b chore/release-x.y.z
pnpm version patch --no-git-tag-version  # 0.1.0 → 0.1.1 (bug fixes)
pnpm version minor --no-git-tag-version  # 0.1.0 → 0.2.0 (new features)
pnpm version major --no-git-tag-version  # 0.1.0 → 1.0.0 (breaking changes)
git commit -am "x.y.z"
git push fork chore/release-x.y.z
gh pr create --repo appian/sailwind --head <you>:chore/release-x.y.z

# 2. After the PR merges, sync main in both repos
git checkout main
git fetch origin
git merge --ff-only origin/main
git push fork main

# 3. Tag the merged commit and push the tag to the fork first (this publishes)
git tag vX.Y.Z
git push fork vX.Y.Z
# GitHub Actions on the fork will build, publish to npm with provenance,
# and create the fork's release. Watch it in the fork's Actions tab.

# 4. Mirror the tag and release to appian/sailwind
git push origin vX.Y.Z
gh release create vX.Y.Z --repo appian/sailwind --title "vX.Y.Z" --notes-file <notes-file>
```

### 5. Write the release notes

GitHub Releases is the project's changelog, so every release needs notes. Edit the release that the workflow created and include:

- **Breaking Changes**: anything that changes behavior for existing usages (see [CONTRIBUTING.md](CONTRIBUTING.md#breaking-changes)). Put this first. Write "None" if there aren't any.
- **Migration Notes**: what consumers need to change to upgrade, for each breaking change or deprecation.
- **Added / Changed / Fixed**: the rest of the release, grouped.
- **Linked PRs and issues** for each item.

### Manual Release (Fallback)

If you need to publish manually (will require OTP from authenticator):

```bash
pnpm run build:lib
pnpm publish --otp=<code>
```

## Visualizing Status

### npm Badge
Add to your README.md:

```markdown
[![npm version](https://img.shields.io/npm/v/@pglevy/sailwind.svg)](https://www.npmjs.com/package/@pglevy/sailwind)
[![npm downloads](https://img.shields.io/npm/dm/@pglevy/sailwind.svg)](https://www.npmjs.com/package/@pglevy/sailwind)
```

### GitHub Release Badge
```markdown
[![GitHub release](https://img.shields.io/github/v/release/pglevy/sailwind)](https://github.com/pglevy/sailwind/releases)
```

### Build Status Badge
```markdown
[![Publish Status](https://github.com/pglevy/sailwind/actions/workflows/publish.yml/badge.svg)](https://github.com/pglevy/sailwind/actions/workflows/publish.yml)
```

## Best Practices

### Version Numbering (Semantic Versioning)

While Sailwind is pre-1.0:
- **Patch** (0.x.y): Bug fixes, documentation updates
- **Minor** (0.x.0): New components and features, and breaking changes. Call out breaking changes at the top of the release notes.

After 1.0:
- **Patch** (x.y.z): Bug fixes, documentation updates
- **Minor** (x.y.0): New components, new features (backwards compatible)
- **Major** (x.0.0): Breaking changes to component APIs

### Pre-release Versions
For testing before official release:

```bash
# Create a beta version
pnpm version prerelease --preid=beta --no-git-tag-version  # 0.1.0 → 0.1.1-beta.0
# then follow the same PR, sync, and tag steps as a standard release

# Install beta in other projects
pnpm add @pglevy/sailwind@beta
```

## Troubleshooting

### Publish fails with an authentication error

- The trusted publisher on npm must match the repo and workflow exactly: `pglevy/sailwind` and `publish.yml`.
- The tag must be pushed to the fork, not `appian/sailwind`.
- Confirm the npm upgrade step in `publish.yml` ran. Trusted publishing needs npm 11.5.1 or later.
- `package.json` `repository.url` must match the fork, or provenance fails.

### Publish fails with "Git working directory is not clean"
pnpm is stricter than npm about git state. If publishing from CI on a tag checkout, use `pnpm publish --no-git-checks`. The GitHub Actions workflow already includes this flag.

### Publish fails with "404 Not Found" or "403 Forbidden"

Check the trusted publisher configuration on npm (see above). Also confirm `package.json` still has the `@pglevy/sailwind` name and that the version you're publishing doesn't already exist on npm.

### Tag already exists
```bash
# Delete remote and local tag, then re-create
git push --delete fork v0.1.1
git tag -d v0.1.1
git tag v0.1.1
git push fork v0.1.1
```

### Need to unpublish a version
```bash
# Within 72 hours of publishing
pnpm unpublish @pglevy/sailwind@0.1.1

# After 72 hours, you can only deprecate
pnpm deprecate @pglevy/sailwind@0.1.1 "This version has critical bugs, use 0.1.2+"
```

## Monitoring

- **npm package page**: https://www.npmjs.com/package/@pglevy/sailwind
- **GitHub releases**: https://github.com/pglevy/sailwind/releases
- **GitHub Actions**: https://github.com/pglevy/sailwind/actions
