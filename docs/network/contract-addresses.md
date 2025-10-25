# Contract Addresses

This document provides the current contract addresses for the Mavrk.ink platform on Ink L2 (Chain ID: 57073).

## Core Contracts

### 🏭 **MavrkTokenFactory**
**Address**: `0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424`
**Purpose**: Deploys new MavrkTokenStandard contracts
**Features**:
- Gasless deployment support (ERC-2771)
- Automatic liquidity pool creation
- LP token locking in MavrkLocker
- Creator fee distribution setup

### 🪙 **MavrkTokenStandard**
**Template Contract**: Deployed per token
**Purpose**: Standard ERC-20 token with Mavrk features
**Features**:
- ERC-20 compliance with 18 decimals
- 1 billion total supply per token
- ERC-2771 gasless transaction support
- Automatic fee distribution to creators

### 🔒 **MavrkTokenLocker**
**Address**: `0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA`
**Purpose**: Time-lock contract for any ERC-20 token
**Features**:
- Lock any ERC-20 token for custom durations
- Multiple locks per user per token
- No early withdrawal (locks are final)
- Gas-optimized storage and operations
- Reentrancy protection

## DeFi Integration

### 🔄 **Uniswap V3 Factory**
**Address**: `0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424`
**Purpose**: Creates concentrated liquidity pools
**Features**:
- Automatic pool creation for new tokens
- Optimal fee tier selection
- WETH pairing for all tokens
- Concentrated liquidity management

### 🛣️ **Uniswap V3 SwapRouter02**
**Address**: `0x177778F19E89dD1012BdBe603F144088A95C4B53`
**Purpose**: Handles token swaps and routing
**Features**:
- Exact input single swaps
- Multi-hop routing support
- Fee collection integration
- Slippage protection

### 💰 **Fee Collection System**
**Purpose**: Collects and distributes platform fees from trading
**Fee Structure**:
- **75% Platform Fees**: Supports platform development
- **25% Creator Earnings**: Distributed to token creators
- **Automatic Collection**: Via MavrkLocker contract
- **Real-time Distribution**: Fees distributed immediately

## Bridge & Cross-Chain

### 🌉 **Relay Protocol**
**Integration**: Via Relay Protocol smart contracts
**Purpose**: Cross-chain asset bridging
**Supported Chains**:
- Ethereum Mainnet (Chain ID: 1)
- Base Mainnet (Chain ID: 8453)
- Polygon (Chain ID: 137)
- Optimism (Chain ID: 10)
- Arbitrum One (Chain ID: 42161)
- Avalanche C-Chain (Chain ID: 43114)
- Binance Smart Chain (Chain ID: 56)

### 🔗 **Gelato Network**
**Integration**: ERC-2771 gasless transactions
**Purpose**: Sponsored gasless deployments
**Features**:
- Gasless token creation
- Sponsored transaction fees
- Automatic gas estimation
- Meta-transaction support

## Network Configuration

### 🌐 **Ink L2 Network**
- **Chain ID**: 57073
- **RPC URL**: `https://rpc.inkonchain.com`
- **Explorer**: `https://explorer.inkonchain.com`
- **Currency**: ETH (native gas token)

### 🔧 **RPC Endpoints**
- **Primary**: `https://rpc.inkonchain.com`
- **Gelato RPC**: `https://rpc.gelato.digital/ink`
- **Backup**: `https://ink-rpc.vercel.app`

## Contract Verification

### ✅ **Verified Contracts**
All contracts are verified on Ink Explorer:
- **MavrkTokenFactory**: [View on Explorer](https://explorer.inkonchain.com/address/0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424)
- **MavrkTokenLocker**: [View on Explorer](https://explorer.inkonchain.com/address/0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA)
- **SwapRouter02**: [View on Explorer](https://explorer.inkonchain.com/address/0x177778F19E89dD1012BdBe603F144088A95C4B53)

### 📋 **ABI Information**
- **MavrkTokenFactory ABI**: Available in contracts repository
- **MavrkTokenLocker ABI**: Available in contracts repository
- **Standard ERC-20 ABI**: OpenZeppelin standard
- **Uniswap V3 ABI**: Available in Uniswap documentation

## Security Information

### 🔒 **Audit Status**
- **MavrkTokenFactory**: Audited and verified
- **MavrkTokenLocker**: Audited and verified
- **Integration Contracts**: Using audited Uniswap V3 contracts
- **Gelato Integration**: Using audited ERC-2771 implementation

### 🛡️ **Security Features**
- **Reentrancy Protection**: All contracts protected
- **Input Validation**: Comprehensive validation
- **Safe Transfers**: Using OpenZeppelin SafeERC20
- **Access Controls**: Proper permission management

## Fee Structure

### 💰 **Trading Fees**
- **Total LP Fee**: 0.3% (Uniswap V3 standard)
- **Platform Fee**: 0.225% (75% of total)
- **Creator Fee**: 0.075% (25% of total)
- **Collection**: Automatic via MavrkLocker

### ⛽ **Gas Fees**
- **Token Creation**: Free (gasless) or ~$0.02 (self-funded)
- **Token Locking**: ~$0.01 per lock
- **Token Swapping**: ~$0.005 per swap
- **Bridge Operations**: Varies by source chain

## Integration Guide

### 🔌 **For Developers**

#### Adding Mavrk Support
```solidity
// Import Mavrk contracts
import "@mavrk/contracts/MavrkTokenFactory.sol";
import "@mavrk/contracts/MavrkTokenLocker.sol";

// Use in your contracts
MavrkTokenFactory factory = MavrkTokenFactory(0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424);
MavrkTokenLocker locker = MavrkTokenLocker(0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA);
```

#### Web3 Integration
```javascript
// Contract addresses
const MAVRK_FACTORY = "0x640887A9ba3A9C53Ed27D0F7e8246A4F933f3424";
const MAVRK_LOCKER = "0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA";
const SWAP_ROUTER = "0x177778F19E89dD1012BdBe603F144088A95C4B53";
const FEE_WALLET = "0x5B4230b8F8D0dA9307cb995801d886189a31EEA7";
```

### 📊 **For Analytics**

#### Key Metrics to Track
- **Token Creation Rate**: New tokens deployed per day
- **Trading Volume**: Total volume across all tokens
- **Fee Collection**: Platform and creator fees collected
- **Lock Activity**: Tokens locked and unlocked
- **Bridge Volume**: Cross-chain asset transfers

## Updates and Changes

### 📅 **Version History**
- **v1.0**: Initial contract deployment
- **v1.1**: Added gasless deployment support
- **v1.2**: Integrated MavrkTokenLocker
- **v1.3**: Updated fee structure (25% creator, 75% platform)

### 🔄 **Upgrade Process**
- **Factory Contract**: Upgradeable via proxy pattern
- **Locker Contract**: Immutable (no upgrades needed)
- **Integration Contracts**: Using standard Uniswap V3 contracts

## Support and Resources

### 📚 **Documentation**
- **Contract Documentation**: Available in Smart Contracts directory
- **Integration Guides**: See [main README](https://github.com/mavrk/ink)
- **User Guides**: See [docs/](https://github.com/mavrk/ink/tree/master/docs)

### 🆘 **Getting Help**
- **Technical Issues**: Contact founder [Email](mailto:cruelhandeth@gmail.com) | [Telegram](https://t.me/deployerone)
- **Integration Support**: [Business Development Team](https://github.com/mavrk/ink#contact)
- **Business Inquiries**: See [Contact Section](https://github.com/mavrk/ink#contact)

---

> **Important**: Always verify contract addresses before interacting with them. Use the official explorer links to confirm you're using the correct addresses. Contract addresses are immutable once deployed, but always double-check for security.