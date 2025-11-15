Contributing Guide

Thank you for your interest in improving the Mavrk SDK. This guide explains how to propose changes and the standards we follow.

Scope
- This SDK is intentionally minimal for integrators: TokenFactory, TokenLocker, LinearVesting.
- Please avoid adding features outside this scope (e.g., swap routing, price/TVL, data backends).

Getting started
- Requirements: Node.js >= 18, npm, TypeScript, Ethers v6.
- Install: npm install
- Build: npm run build
- Run examples: npx ts-node examples/deploy-token.ts

Code standards
- TypeScript strict mode; no any on public APIs.
- Clear, descriptive names; minimal comments focused on non-obvious reasoning.
- Early returns and shallow control flow; avoid unnecessary try/catch.
- Keep wrappers thin around on-chain ABIs; no side-effects or global state.

Commits and PRs
- Use concise messages: type(scope): summary (e.g., fix(token-locker): handle empty active locks)
- Reference issues when relevant.
- Add/update small unit tests if/when test infra is introduced.

Versioning and releases
- We follow semver: major.minor.patch.
- Breaking changes require a major version bump and clear migration notes in CHANGELOG.md.

Security
- Do not include secrets in code or docs.
- Report vulnerabilities privately to the maintainers (see repo contact).

License
- By contributing, you agree your contributions are licensed under the project’s MIT license.


