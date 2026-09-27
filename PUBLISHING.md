# Publishing Guide

## Setup (One-Time)

### 1. Configure npm Trusted Publishing (OIDC)
This allows GitHub Actions to publish with provenance, linking the package to this repo.

1. Go to https://www.npmjs.com/package/@pglevy/sailwind → Settings → Trusted Publisher
2. Add a connection: repo `pglevy/sailwind`, workflow `publish.yml`
3. Under "Publishing access", select "Require two-factor authentication or a granular access token with bypass 2fa enabled"

### 2. Create npm Granular Access Token
A granular token with 2FA bypass is needed so CI can publish without an OTP.

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Granular Access Token"
3. Give it read/write permissions scoped to `@pglevy/sailwind`
4. Check "bypass 2fa" (the warning about using trusted publishing instead is fine — we're using both)
5. Copy the token

### 3. Add Token to GitHub
1. Go to your repo → Settings → Secrets and variables → Actions
2. Create (or update) a repository secret:
   - Name: `NPM_TOKEN`
   - Value: Paste your granular token
3. Click "Add secret"

## Publishing Workflow

### Standard Release (Recommended)

```bash
# 1. Make sure you're on main and up to date
git checkout main
git pull

# 2. Bump version (choose one)
pnpm run version:patch  # 0.1.0 → 0.1.1 (bug fixes)
pnpm run version:minor  # 0.1.0 → 0.2.0 (new features)
pnpm run version:major  # 0.1.0 → 1.0.0 (breaking changes)

# 3. Push the tag (this triggers the publish workflow)
git push --follow-tags

# 4. Wait ~2 minutes - GitHub Actions will:
#    - Build the library
#    - Publish to npm with provenance
#    - Create a GitHub release
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
pnpm version prerelease --preid=beta  # 0.1.0 → 0.1.1-beta.0
git push --follow-tags

# Install beta in other projects
pnpm add @pglevy/sailwind@beta
```

## Troubleshooting

### Publish fails with "EOTP" (one-time password required)
This means the `NPM_TOKEN` secret is a classic/automation token instead of a granular token with 2FA bypass. Generate a new granular access token on npmjs.com with "bypass 2fa" checked, and update the `NPM_TOKEN` GitHub secret.

### Publish fails with "Git working directory is not clean"
pnpm is stricter than npm about git state. If publishing from CI on a tag checkout, use `pnpm publish --no-git-checks`. The GitHub Actions workflow already includes this flag.

### Publish fails with "404 Not Found"
This usually means `NODE_AUTH_TOKEN` is missing from the publish step in the workflow. Make sure the workflow has:
```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Publish fails with "403 Forbidden"
- Check that `NPM_TOKEN` is set correctly in GitHub secrets
- Verify the granular token has read/write permissions for `@pglevy/sailwind`
- Ensure you're logged into npm: `pnpm whoami`

### Tag already exists
```bash
# Delete remote and local tag, then re-create
git push --delete origin v0.1.1
git tag -d v0.1.1
git tag v0.1.1
git push origin v0.1.1
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
