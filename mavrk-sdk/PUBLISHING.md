# Publishing Guide for Mavrk SDK

This guide explains how to publish the Mavrk SDK to npm.

## One-Time Setup

### 1. Create npm Account

1. Go to https://www.npmjs.com/signup
2. Create account with:
   - Username: `mavrkofficial` (or your preferred username)
   - Email: your team email
   - Password: (strong password)
3. Enable 2FA for security: https://www.npmjs.com/settings/~/tfa

### 2. Login to npm

```bash
npm login
```

Enter your npm username, password, and 2FA code.

### 3. Claim @mavrk Namespace

The first person to publish a package with `@mavrk` scope will claim that namespace.

## Publishing Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the SDK

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 3. Test Locally (Optional)

Test the package locally before publishing:

```bash
# In the SDK directory
npm link

# In a test project
npm link @mavrk/sdk

# Test your code
node test-script.js

# Unlink when done
npm unlink @mavrk/sdk
```

### 4. Update Version

Follow semantic versioning (semver):

- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
- **Major** (1.0.0 → 2.0.0): Breaking changes

```bash
# For patches
npm version patch

# For minor updates
npm version minor

# For major updates
npm version major
```

### 5. Publish to npm

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (@mavrk).

### 6. Push to GitHub

```bash
git push origin main
git push --tags
```

## After Publishing

Your package will be available at:
- **npm:** https://www.npmjs.com/package/@mavrk/sdk
- **Install:** `npm install @mavrk/sdk`

### Verify Installation

Test that users can install your package:

```bash
# In a new directory
mkdir test-install && cd test-install
npm init -y
npm install @mavrk/sdk
```

## Automated Publishing (Optional)

You can automate publishing with GitHub Actions:

1. Get npm token: https://www.npmjs.com/settings/~/tokens
2. Add as GitHub secret: `NPM_TOKEN`
3. Create workflow file:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then publish by creating a GitHub release!

## Updating Documentation

After publishing, update:

1. **npm README** - Automatically shows from `README.md`
2. **GitHub releases** - Add release notes for each version
3. **Changelog** - Keep a `CHANGELOG.md` with version history

## Version History

Track your releases:

```markdown
# Changelog

## [1.0.0] - 2024-01-XX
### Added
- Initial release
- Token deployment
- Token locking
- Vesting schedules
- Supabase integration
- Price queries
- TVL queries
```

## Support

For issues during publishing:
- npm docs: https://docs.npmjs.com/
- npm support: https://www.npmjs.com/support
- GitHub Issues: https://github.com/mavrkofficial/Mavrk-on-Ink/issues

