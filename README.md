# Mavrk.ink

[![Mavrk](https://img.shields.io/badge/Mavrk-DeFi%20Platform-blue)](https://mavrk.ink)
[![Ink Chain](https://img.shields.io/badge/Built%20for-Ink%20L2-purple)](https://inkchain.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Revolutionary DeFi Platform** - Completely free token creation with gasless deployments and instant liquidity provision on Ink Layer 2.

## 🚀 Overview

Mavrk.ink is a comprehensive DeFi ecosystem built on the Ink Layer 2 chain that revolutionizes token deployment, trading, and cross-chain operations. Unlike traditional platforms that require significant capital upfront, Mavrk enables **completely free token launches** with **gasless deployments** and **instant liquidity provision**.

### Key Innovations

- ✨ **Zero-Cost Token Creation** - Gasless deployments via Gelato ERC-2771 sponsorship
- 💰 **25% Creator Earnings** - Automatic fee distribution from all trading activity
- 🌉 **Multi-Chain Bridge** - Seamless asset transfers across 7+ major chains
- 🔒 **Secure LP Locking** - All liquidity positions permanently locked
- ⚡ **Ultra-Low Fees** - Fraction-of-a-cent transactions on Ink L2

## 📁 Repository Structure

```
mavrk.ink/
├── Smart Contracts/
│   ├── Mavrk Token Factory/        # Token deployment factory
│   ├── Mavrk Token Locker/         # ERC-20 token time-lock contract
│   ├── Mavrk LP Locker/            # LP NFT locking and fee distribution
│   └── Reservoir (Relay) UniswapV3 Contracts/  # DEX integration
├── docs/                           # Comprehensive documentation
│   ├── getting-started/            # Introduction and quick start guides
│   ├── how-to-use/                 # User guides for all features
│   └── network/                    # Network configuration and addresses
└── README.md                        # This file
```

## 🏗️ Smart Contracts

### Core Contracts

#### MavrkTokenFactory
**Purpose**: Main factory contract for deploying tokens with liquidity

**Key Features**:
- Deploys ERC-20 tokens with ERC-2771 support for gasless transactions
- Creates Uniswap V3 concentrated liquidity pools
- Automatically locks LP NFTs in MavrkLocker
- Tracks creators for fee distribution
- Supports multiple pool manager tiers (1 ETH, 2 ETH, 3 ETH)

**Address**: `0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424`

#### MavrkTokenStandard
**Purpose**: Standard ERC-20 token contract

**Specifications**:
- Total Supply: 1,000,000,000 tokens (18 decimals)
- ERC-2771 support for gasless transactions
- ERC-20 compliant with standard transfer/approve functions

#### MavrkTokenLocker
**Purpose**: Time-lock contract for any ERC-20 token

**Features**:
- Lock any ERC-20 token for custom durations
- Multiple locks per user per token
- No early withdrawal (locks are final)
- Gas-optimized storage patterns
- Reentrancy protection

**Address**: `0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA`

#### MavrkLocker
**Purpose**: LP NFT locking and fee distribution

**Features**:
- Permanently locks LP position NFTs
- Collects trading fees from Uniswap V3 positions
- Distributes fees: 40% Mavrk, 40% Ink, 20% Creator
- Tracks all locked LP positions
- Creator-based fee collection

**Fee Distribution**:
- **40%** to Mavrk platform wallet
- **40%** to Ink network wallet
- **20%** to token creator

## 🌐 Network Configuration

### Ink Layer 2
- **Chain ID**: 57073
- **RPC URL**: `https://rpc.inkonchain.com`
- **Explorer**: [explorer.inkonchain.com](https://explorer.inkonchain.com)
- **Native Token**: ETH (WETH: `0x4200000000000000000000000000000000000006`)

### Supported Bridge Chains
- Ethereum Mainnet (Chain ID: 1)
- Base Mainnet (Chain ID: 8453)
- Polygon (Chain ID: 137)
- Optimism (Chain ID: 10)
- Arbitrum One (Chain ID: 42161)
- Avalanche C-Chain (Chain ID: 43114)
- Binance Smart Chain (Chain ID: 56)

## ✨ Features

### 🎯 Token Creation
- **Gasless Deployment**: Sponsored by Gelato ERC-2771
- **Wallet-less Option**: Temporary wallet generation for users
- **Instant Liquidity**: 100% token supply added to Uniswap V3 pools
- **Automatic Pool Creation**: Optimal fee tier and WETH pairing
- **Permanent Security**: LP NFTs locked in MavrkLocker

### 💰 Creator Earnings
- **25% Fee Share**: Token creators earn from all trading activity
- **Automatic Collection**: Fees collected and distributed automatically
- **Real-time Tracking**: Monitor earnings in profile dashboard
- **Fair Distribution**: Transparent fee distribution system

### 🌉 Cross-Chain Bridge
- **Multi-Chain Support**: Bridge to/from 7+ major chains
- **Relay Protocol**: Professional-grade bridge infrastructure
- **Real-time Balances**: Track balances across all chains
- **Percentage Inputs**: Quick selection with 25%, 50%, 75%, Max buttons

### 💼 Wallet Management
- **Token Holdings**: Add/remove any ERC-20 token
- **Token Locking**: Lock tokens for custom durations
- **Send/Receive**: Transfer tokens with QR code support
- **USD Tracking**: Real-time USD values for all tokens

### 🔒 Token Locker
- **Any ERC-20 Token**: Lock any token on Ink L2
- **Custom Durations**: Lock for any number of days
- **Multiple Locks**: Create multiple locks per token
- **Secure**: No early withdrawal, reentrancy protection

## 🚀 Getting Started

### For Token Creators

1. **Visit** [mavrk.ink](https://mavrk.ink)
2. **Navigate** to the Explore section
3. **Click** "Create Token"
4. **Fill** in token details (name, symbol, description, social links)
5. **Choose** gasless (free) or self-funded deployment
6. **Deploy** and your token is immediately tradeable!

### For Traders

1. **Connect** your Web3 wallet
2. **Browse** tokens in the Explore section
3. **Trade** with real-time pricing from Relay Protocol API
4. **Bridge** assets from other chains
5. **Lock** tokens for commitment strategies

### For Developers

Smart contract addresses are documented in [contract-addresses.md](docs/network/contract-addresses.md). These contracts are deployed and operational on Ink L2.

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Getting Started](docs/getting-started/introduction.md)** - Complete platform overview
- **[What is Mavrk?](docs/getting-started/what-is-mavrk.md)** - Understanding the platform
- **[Quick Start Guide](docs/getting-started/quick-start.md)** - Get up and running in 5 minutes
- **[Creating Tokens](docs/how-to-use/creating-tokens.md)** - Token deployment guide
- **[Token Locker](docs/how-to-use/token-locker.md)** - Lock any ERC-20 token
- **[Bridge Operations](docs/how-to-use/bridge-operations.md)** - Cross-chain transfers
- **[Wallet Management](docs/how-to-use/wallet-management.md)** - Portfolio features
- **[Contract Addresses](docs/network/contract-addresses.md)** - All smart contract addresses

## 🔐 Security

Mavrk.ink contracts are professionally audited and verified on Ink Explorer:
- MavrkTokenFactory: Fully audited ✅
- MavrkTokenLocker: Fully audited ✅
- MavrkLocker: Fully audited ✅

All contracts use OpenZeppelin security standards with reentrancy protection, input validation, and proper access controls.

## 💡 How It Works

### Token Creation Flow

1. **User Initiates**: Submit token details via UI
2. **Factory Deploys**: MavrkTokenFactory creates ERC-20 token
3. **LP Creation**: Uniswap V3 pool created with optimal parameters
4. **Liquidity Added**: 100% token supply added to pool
5. **NFT Locked**: LP position NFT transferred to MavrkLocker
6. **Trading Active**: Token immediately tradeable

### Fee Collection Flow

1. **Trading Occurs**: Users trade tokens on Uniswap V3
2. **Fees Accumulate**: Trading fees accumulate in LP position
3. **Collection Trigger**: Fee wallets or creators collect fees
4. **Distribution**: Fees split 40/40/20 automatically
5. **Withdrawal**: Recipients receive their share

### Bridge Flow

1. **User Initiates**: Select source and destination chains
2. **Amount Entry**: Enter amount using percentage buttons
3. **Transaction**: Submit bridge transaction on source chain
4. **Relay Processing**: Relay Protocol validates and processes
5. **Asset Delivery**: Assets minted on destination chain
6. **Completion**: User receives bridged assets

## ⚠️ Important Notice

**This repository contains public documentation and contract information for Mavrk.ink.**

- Contract addresses are provided for transparency and verification
- Documentation is provided for user education
- Code is NOT open source and NOT available for copying or integration
- Structure and architecture are proprietary to Mavrk.ink

## 📧 Contact

Reach out if necessary:

### Founder
- **Email**: cruelhandeth@gmail.com
- **X (Twitter)**: [@deployerone](https://x.com/deployerone)
- **Telegram**: [@deployerone](https://t.me/deployerone)

### Business Development & Growth Team
For partnerships, marketing, or integration inquiries:

- **Cryptopunk24**: [X](https://x.com/cryptopunk24) | [Telegram](https://t.me/cryptopunk24)
- **Bob**: [Telegram](https://t.me/S1rBob)

## 🌐 Links

- **Website**: [mavrk.ink](https://mavrk.ink)
- **Explorer**: [explorer.inkonchain.com](https://explorer.inkonchain.com)
- **Documentation**: See `docs/` directory
- **Ink Network**: [inkchain.com](https://inkchain.com)

## ⚠️ Disclaimer

This platform is for educational and experimental purposes only. Token creation and trading involve significant risks. Always do your own research before investing. The team is not responsible for any financial losses.

---

**Built on Ink Layer 2**

*Mavrk.ink - The future of token creation and DeFi.*

