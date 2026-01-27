# Versioning Guide

This project uses semantic versioning (SemVer) with automated GitHub releases. Version numbers follow the format `MAJOR.MINOR.PATCH` (e.g., `1.2.3`).

## Version Numbering

- **MAJOR** (x.0.0): Breaking changes that are incompatible with previous versions
- **MINOR** (x.y.0): New features that are backwards compatible
- **PATCH** (x.y.z): Bug fixes and minor changes that are backwards compatible

## Automated Versioning Workflow

The project includes a GitHub Actions workflow that automatically:
- Creates GitHub releases when version tags are pushed
- Generates changelogs from commit messages
- Builds and packages the application
- Attaches release artifacts

## How to Create a New Release

### Option 1: Using GitHub Actions (Recommended)

1. Go to your repository on GitHub
2. Navigate to **Actions** tab
3. Select **Version and Release** workflow
4. Click **Run workflow**
5. Choose the version bump type:
   - **patch**: For bug fixes (1.0.0 → 1.0.1)
   - **minor**: For new features (1.0.0 → 1.1.0)
   - **major**: For breaking changes (1.0.0 → 2.0.0)
   - **manual**: Specify exact version (e.g., 1.2.3)
6. Click **Run workflow**

The workflow will:
- Update `package.json` version
- Create a git commit
- Create a git tag
- Push changes to the repository
- Create a GitHub release with changelog
- Build and attach release artifacts

### Option 2: Using Local Scripts

1. **Bump version locally:**
   ```bash
   # Patch version (1.0.0 → 1.0.1)
   npm run version:patch
   
   # Minor version (1.0.0 → 1.1.0)
   npm run version:minor
   
   # Major version (1.0.0 → 2.0.0)
   npm run version:major
   ```

2. **Review and commit changes:**
   ```bash
   git diff
   git add package.json package-lock.json
   git commit -m "chore: bump version to X.Y.Z"
   ```

3. **Create and push tag:**
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin main
   git push origin vX.Y.Z
   ```

   The GitHub Actions workflow will automatically detect the tag and create a release.

### Option 3: Manual Tag Creation

If you prefer to create tags manually:

```bash
# Update version in package.json first
npm version patch|minor|major --no-git-tag-version

# Create tag
git tag -a vX.Y.Z -m "Release vX.Y.Z"

# Push tag
git push origin vX.Y.Z
```

## Checking Current Version

To see the current version:

```bash
npm run version:current
# or
node -p "require('./package.json').version"
```

## Commit Message Format

For best changelog generation, use conventional commit messages:

- `feat:` - New features (bumps minor version)
- `fix:` - Bug fixes (bumps patch version)
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Maintenance tasks

Examples:
```
feat: add dark mode toggle
fix: resolve cookie consent reload issue
docs: update API integration guide
chore: bump version to 1.2.0
```

## Release Notes

Release notes are automatically generated from commit messages since the last tag. The workflow includes:
- All commits since the previous release
- Commit hash for reference
- Automatic formatting

## Workflow Triggers

The versioning workflow triggers on:

1. **Tag push**: When a tag matching `v*.*.*` is pushed (e.g., `v1.2.3`)
2. **Manual dispatch**: When manually triggered from GitHub Actions UI

## Permissions Required

The workflow requires the following GitHub permissions:
- `contents: write` - To create releases and tags
- `pull-requests: write` - For PR comments (if needed)

These are automatically granted via `GITHUB_TOKEN`.

## Troubleshooting

### Workflow fails to create release
- Ensure you have write permissions to the repository
- Check that the tag format is correct (`vX.Y.Z`)
- Verify `GITHUB_TOKEN` has necessary permissions

### Version script fails
- Ensure you're on the correct branch (usually `main` or `develop`)
- Make sure `package.json` is valid JSON
- Check that you have uncommitted changes (or commit them first)

### Tag already exists
- Delete the existing tag: `git tag -d vX.Y.Z` (local) and `git push origin :refs/tags/vX.Y.Z` (remote)
- Or use a different version number

## Best Practices

1. **Always test before releasing**: Run tests and build locally before creating a release
2. **Use semantic versioning**: Follow SemVer guidelines strictly
3. **Write clear commit messages**: They become your changelog
4. **Tag from main branch**: Create releases from stable branches only
5. **Review changelog**: Check auto-generated changelog before publishing release

## Integration with CI/CD

The versioning workflow integrates with your existing Azure Static Web Apps deployment:
- Releases are created independently
- Deployment happens on push to `main` branch (via existing workflow)
- Version tags help track which version is deployed

## Example Workflow

```bash
# 1. Make your changes and commit
git add .
git commit -m "feat: add new service section"

# 2. Push to remote
git push origin develop

# 3. Create PR and merge to main
# (via GitHub UI)

# 4. After merge, create release via GitHub Actions
# Go to Actions > Version and Release > Run workflow > minor

# Or locally:
npm run version:minor
git add package.json package-lock.json
git commit -m "chore: bump version to 1.1.0"
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0
```

## Related Documentation

- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
