#!/usr/bin/env node

/* eslint-disable no-console */
/**
 * Version bump script
 * Updates package.json version and creates a git commit with tag
 * 
 * Usage:
 *   node scripts/version-bump.js [patch|minor|major]
 *   npm run version:patch
 *   npm run version:minor
 *   npm run version:major
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');

function getCurrentVersion() {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  return packageJson.version;
}

function bumpVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}. Use 'patch', 'minor', or 'major'`);
  }
}

function updatePackageJson(newVersion) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = newVersion;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

function main() {
  const type = process.argv[2];
  
  if (!type || !['patch', 'minor', 'major'].includes(type)) {
    console.error('Usage: node scripts/version-bump.js [patch|minor|major]');
    console.error('  patch: 1.0.0 -> 1.0.1 (bug fixes)');
    console.error('  minor: 1.0.0 -> 1.1.0 (new features, backwards compatible)');
    console.error('  major: 1.0.0 -> 2.0.0 (breaking changes)');
    process.exit(1);
  }
  
  try {
    const currentVersion = getCurrentVersion();
    const newVersion = bumpVersion(currentVersion, type);
    
    console.log(`Bumping version: ${currentVersion} -> ${newVersion}`);
    
    // Update package.json
    updatePackageJson(newVersion);
    console.log('✓ Updated package.json');
    
    // Update package-lock.json (if it exists)
    try {
      execSync('npm install --package-lock-only', { cwd: rootDir, stdio: 'inherit' });
      console.log('✓ Updated package-lock.json');
    } catch (error) {
      console.warn('⚠ Could not update package-lock.json:', error.message);
    }
    
    console.log('\nNext steps:');
    console.log(`1. Review changes: git diff`);
    console.log(`2. Commit changes: git add package.json package-lock.json`);
    console.log(`3. Commit: git commit -m "chore: bump version to ${newVersion}"`);
    console.log(`4. Create tag: git tag -a v${newVersion} -m "Release v${newVersion}"`);
    console.log(`5. Push: git push origin main && git push origin v${newVersion}`);
    console.log('\nOr use GitHub Actions workflow:');
    console.log('Go to Actions > Version and Release > Run workflow');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
