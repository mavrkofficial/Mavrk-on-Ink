Publishing (Maintainers Only)

This document is for maintainers of the public SDK package.

Prerequisites
- npm account with publish rights to the @mavrk scope
- Node.js >= 18

Build
- npm install
- npm run build
- Verify dist/ is generated and examples run

Versioning
- Use semantic versioning:
  - patch: fixes and docs-only updates
  - minor: backward-compatible features
  - major: breaking changes (document in CHANGELOG.md)
- Bump version: npm version patch|minor|major

Publish
- npm login
- npm publish --access public

Post-release
- Push tags: git push && git push --tags
- Update CHANGELOG.md if needed
- Communicate changes in repository releases

Notes
- Do not include internal credentials or environment details in this repo.
- The SDK intentionally excludes non-essential features (pricing, TVL, data backends).


