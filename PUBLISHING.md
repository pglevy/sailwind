# Publishing Guide

## Setup (One-Time)

### 1. Create npm Access Token
1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Classic Token"
3. Select "Automation" type
4. Copy the token

### 2. Add Token to GitHub
1. Go to your repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Paste your npm token
5. Click "Add secret"

## Publishing Workflow

### Standard Release (Recommended)

```bash
# 1. Make sure you're on main and up to date
git checkout main
git pull

# 2. Bump version (choose one)
npm run version:patch  # 0.1.0 → 0.1.1 (bug fixes)
npm run version:minor  # 0.1.0 → 0.2.0 (new features)
npm run version:major  # 0.1.0 → 1.0.0 (breaking changes)

# 3. Push the tag (this triggers the publish workflow)
git push --follow-tags

# 4. Wait ~2 minutes - GitHub Actions will:
#    - Build the library
#    - Publish to npm
#    - Create a GitHub release
```

### Manual Release (Fallback)

If you need to publish manually:

```bash
npm run build:lib
npm publish
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
- **Patch** (0.1.x): Bug fixes, documentation updates
- **Minor** (0.x.0): New components, new features (backwards compatible)
- **Major** (x.0.0): Breaking changes to component APIs

### Pre-release Versions
For testing before official release:

```bash
# Create a beta version
npm version prerelease --preid=beta  # 0.1.0 → 0.1.1-beta.0
git push --follow-tags

# Install beta in other projects
npm install @pglevy/sailwind@beta
```

### Changelog
Consider maintaining a CHANGELOG.md:

```markdown
# Changelog

## [0.2.0] - 2025-11-25
### Added
- New ProgressBar component
- New Slider component

### Fixed
- TagField color contrast issues

## [0.1.0] - 2025-11-20
### Added
- Initial release with 15 SAIL components
```

## GitHub Packages vs npm

You're correct - you **can** use GitHub Packages, but npm is recommended because:

- ✅ **npm**: Public, no authentication needed for installation
- ❌ **GitHub Packages**: Requires authentication even for public packages

Stick with npm for better developer experience.

## Troubleshooting

### Publish fails with "403 Forbidden"
- Check that NPM_TOKEN is set correctly in GitHub secrets
- Verify token has "Automation" permissions
- Ensure you're logged into npm: `npm whoami`

### Tag already exists
```bash
# Delete local tag
git tag -d v0.1.1

# Delete remote tag
git push origin :refs/tags/v0.1.1

# Create new tag
npm run version:patch
git push --follow-tags
```

### Need to unpublish a version
```bash
# Within 72 hours of publishing
npm unpublish @pglevy/sailwind@0.1.1

# After 72 hours, you can only deprecate
npm deprecate @pglevy/sailwind@0.1.1 "This version has critical bugs, use 0.1.2+"
```

## Monitoring

- **npm package page**: https://www.npmjs.com/package/@pglevy/sailwind
- **GitHub releases**: https://github.com/pglevy/sailwind/releases
- **GitHub Actions**: https://github.com/pglevy/sailwind/actions
