# Creating Tokens

Learn how to deploy your own token on Mavrk.ink with **completely free gasless deployment** or traditional self-funded options.

## Overview

Creating a token on Mavrk.ink is simple and offers two deployment methods:

### 🚀 **Gasless Deployment (Recommended)**
- **Zero cost** - completely free token creation
- **No wallet required** - platform generates temporary wallet
- **Gelato ERC-2771 sponsorship** - professional gasless infrastructure
- **Instant deployment** - no transaction confirmation needed

### 💰 **Self-Funded Deployment**
- **Traditional approach** - you pay gas fees
- **Requires wallet** - MetaMask or compatible Web3 wallet
- **Full control** - you control the deployment transaction
- **Minimal cost** - only a few cents on Ink L2

The platform automatically handles:
- Token deployment with ERC-2771 support
- Liquidity pool creation
- LP token locking in MavrkLocker
- Metadata storage and processing

## Step-by-Step Guide

### 1. Access Token Creation

1. Visit [mavrk.ink](https://mavrk.ink) and click **"Open App"**
2. Navigate to the **"Explore"** section
3. Click the **"Create Token"** button
4. You'll see the token creation form with deployment options

### 2. Choose Deployment Method

#### Option A: Gasless Deployment (Free)
1. Select **"Free"** deployment mode
2. No wallet connection required
3. Platform will generate a temporary wallet
4. **Save the private key** when prompted for future access

#### Option B: Self-Funded Deployment
1. Connect your Web3 wallet first
2. Select **"Self-Fund"** deployment mode
3. You'll pay gas fees (typically $0.02-$0.05)
4. Full control over the deployment transaction

### 3. Fill Token Details

#### Required Information
- **Token Name**: The full name of your token (e.g., "My Awesome Token")
- **Token Symbol**: Short symbol (e.g., "MAT") - usually 2-5 characters
- **Description**: Brief description of your token's purpose

#### Optional Information
- **Logo**: Upload a logo image (PNG, JPG, or SVG)
- **Cover Photo**: Upload a cover image for your token card
- **Website**: Your project's website URL
- **Twitter**: Twitter handle or URL
- **Telegram**: Telegram group or channel
- **Discord**: Discord server invite

#### LP Provider Selection
- **Relay**: Default LP provider (recommended)
- **Velodrome**: Alternative LP provider (coming soon)

### 4. Review and Deploy

1. Review all your token information
2. Click **"Deploy Token"**
3. A confirmation modal will appear with deployment details
4. Click **"Confirm Deployment"**

#### For Gasless Deployment:
- No transaction signature required
- Deployment happens automatically
- You'll receive a private key for the generated wallet

#### For Self-Funded Deployment:
- Sign the transaction in your wallet
- Wait for confirmation (5-10 seconds)
- Transaction will appear on Ink explorer

### 5. Wait for Confirmation

- **Gasless**: Deployment happens instantly (2-3 seconds)
- **Self-Funded**: Wait for transaction confirmation (5-10 seconds)
- You'll see a success message when complete
- Your token will appear in the discovery section immediately

## What Happens During Deployment

### 1. Token Creation
- **MavrkTokenFactory** deploys a new **MavrkTokenStandard** contract
- Token is created with **1 billion total supply** (18 decimals)
- Token includes **ERC-2771 support** for gasless operations
- All tokens are initially held by the factory contract

### 2. Liquidity Pool Setup
- A new **Uniswap V3 concentrated liquidity pool** is created
- **100% of the token supply** is added to the pool
- Pool is configured with **optimal parameters** for the selected tier
- **WETH pairing** is automatically established

### 3. LP Token Locking
- The **liquidity position NFT** is created
- NFT is **immediately transferred** to MavrkLocker contract
- Position is **permanently locked** for security
- **Creator address** is recorded for fee distribution

### 4. Metadata Storage
- Token metadata is **stored in Supabase**
- Images are **processed and optimized**
- Token becomes **discoverable** in Explore section
- **Social links** are validated and stored

### 5. Fee Distribution Setup
- **25% creator earnings** are automatically configured
- **75% platform fees** are set up
- **Automatic collection** system is activated
- **Real-time tracking** begins immediately

## Token Specifications

### Standard Details
- **Total Supply**: 1,000,000,000 tokens
- **Decimals**: 18
- **Standard**: ERC20 with ERC-2771 support
- **Transferable**: Yes, immediately after deployment
- **Gasless Transfers**: Supported (can be activated later)

### Liquidity Details
- **Initial Liquidity**: 100% of token supply
- **Pool Type**: Uniswap V3 Concentrated Liquidity
- **Fee Tier**: Optimized for the selected tier
- **Lock Status**: LP NFT permanently locked in MavrkLocker
- **Trading Pairs**: Token/WETH

### Fee Structure
- **Creator Earnings**: 25% of all LP trading fees
- **Platform Fees**: 75% to Mavrk for sustainability
- **Collection**: Automatic via MavrkLocker contract
- **Tracking**: Real-time in Profile section

## After Deployment

### For Token Creators
- **Profile Dashboard**: View all your tokens and earnings
- **Earnings Tracking**: Monitor 25% fee collection in real-time
- **Token Management**: Update social links and metadata
- **Portfolio Overview**: See total value and performance
- **Lock Management**: Use Token Locker for additional locking

### For Traders
- **Discovery**: Token appears in Explore section immediately
- **Real-time Pricing**: Instant quotes via Relay Protocol API (5x faster)
- **Trading**: Can be bought/sold immediately
- **Cross-chain**: Available for bridging operations
- **Social Features**: View creator info and social links

### For the Ecosystem
- **Fee Distribution**: 25% to creator, 75% to platform
- **Liquidity Security**: LP tokens permanently locked
- **Transparency**: All transactions visible on explorer
- **Innovation**: Pushing DeFi boundaries forward

## Best Practices

### Token Naming
- Choose a clear, descriptive name
- Use a memorable symbol
- Avoid names that could be confused with existing tokens

### Description
- Be clear about your token's purpose
- Include relevant keywords
- Keep it concise but informative

### Visual Assets
- Use high-quality images
- Ensure logos are clear at small sizes
- Follow consistent branding

### Social Links
- Provide active social channels
- Keep links updated
- Engage with your community

## Troubleshooting

### Common Issues

**Transaction Fails**
- Check you have enough ETH for gas
- Ensure you're on the correct network (Ink L2)
- Try increasing gas limit

**Token Not Appearing**
- Wait a few minutes for indexing
- Check the transaction on the explorer
- Refresh the page

**Image Upload Issues**
- Ensure file is under 5MB
- Use supported formats (PNG, JPG, SVG)
- Check your internet connection

### Getting Help

If you encounter issues:
1. Check our documentation for answers
2. Contact support: Founder [Email](mailto:cruelhandeth@gmail.com) | [Telegram](https://t.me/deployerone)
3. For business inquiries: [Business Development Team](https://github.com/mavrk/ink#contact)

## Cost Breakdown

- **Gas Fees**: ~$0.02 (varies with network congestion)
- **Platform Fee**: None
- **Total Cost**: Just gas fees!

This is significantly cheaper than traditional token launchpads that require thousands of dollars in upfront capital.
