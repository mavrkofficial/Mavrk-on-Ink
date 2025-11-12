# Changelog

All notable changes to the Mavrk SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of Mavrk SDK
- Token deployment with automatic liquidity pools
- Token locking functionality
- Linear vesting schedules
- Supabase integration for metadata storage
- Relay Protocol integration for price queries
- TVL (Total Value Locked) queries
- Full TypeScript support with type definitions
- Comprehensive documentation (README, Quick Start, Publishing, Development guides)
- Working examples for all major features

### Features
- **Deploy Tokens**: Create ERC-20 tokens with automatic Uniswap V3 liquidity
- **Lock Tokens**: Time-lock tokens for custom durations
- **Vesting**: Create linear vesting schedules with cliff periods
- **Query Data**: Fetch token metadata, prices, and TVL
- **Automatic Metadata Storage**: Images and metadata saved to Supabase automatically
- **Default Pool Manager Tier**: Auto-defaults to tier 1 (1 ETH liquidity)

### Required Fields
- Logo image (base64) - Required for all token deployments
- Cover photo (base64) - Required for all token deployments
- Category - Required for better token organization
- Name and Symbol - Standard ERC-20 requirements

### Contract Addresses (Ink L2)
- MavrkTokenFactory: `0xD827F74E292060D4B495b7b82d6f2470C59ce89d`
- MavrkTokenLocker: `0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA`
- MavrkLinearVesting: `0x9496Ff7A7BE0A91F582Baa96ac12a0A36300750c`
- MavrkLens: `0x89C17fEBb23d78802c85B541275a5689aec5852D`
- MavrkSwapRouter: `0x255a501d300647134b8569Ff2772Fbdf5564a32b`

### Dependencies
- ethers: ^6.9.0
- @supabase/supabase-js: ^2.39.0

### Documentation
- README.md - Main documentation
- QUICK_START.md - Step-by-step getting started guide
- PUBLISHING.md - npm publishing instructions
- DEVELOPMENT.md - Development workflow and contribution guide
- API_REFERENCE.md - Detailed API documentation

## [Unreleased]

### Planned Features
- Additional network support (beyond Ink L2)
- Batch token operations
- Advanced querying and filtering
- WebSocket support for real-time updates
- Gas estimation helpers
- Transaction retry logic
- More comprehensive examples

---

## Version History

- **1.0.0** - Initial public release

## Support

For issues, feature requests, or questions:
- GitHub Issues: https://github.com/mavrkofficial/Mavrk-on-Ink/issues
- Twitter: [@mavrkofficial](https://twitter.com/mavrkofficial)
- Website: [https://mavrk.ink](https://mavrk.ink)

