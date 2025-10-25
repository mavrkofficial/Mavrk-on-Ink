# Token Locker System

The Mavrk Token Locker is a powerful, gas-efficient smart contract that allows users to lock any ERC-20 token for a specified period. This system provides secure, time-based token locking with no early withdrawal options, making it perfect for commitment strategies, vesting schedules, and long-term holding.

## Overview

The MavrkTokenLocker contract (`0xd2C5947A6777500D9b7ad55a4D48AeF855AE6aBA`) enables users to:

- **Lock any ERC-20 token** for custom durations
- **Multiple locks per token** - create multiple locks for the same token
- **Automatic time calculation** - precise day-based locking
- **Secure withdrawals** - only after lock period expires
- **Gas-optimized** - efficient storage and operations
- **Reentrancy protection** - secure against attacks

## Key Features

### 🔒 **Flexible Locking**
- **Any ERC-20 Token**: Lock any token on Ink L2
- **Custom Durations**: Lock for any number of days (1 day minimum)
- **Multiple Locks**: Create multiple locks per token per user
- **Precise Timing**: Lock periods calculated in exact days

### 🛡️ **Security Features**
- **No Early Withdrawal**: Locks are final - no emergency withdrawal
- **Reentrancy Protection**: Secure against reentrancy attacks
- **SafeERC20**: Safe token transfers with proper error handling
- **Input Validation**: Comprehensive validation of all inputs

### ⚡ **Gas Efficiency**
- **Optimized Storage**: Efficient struct packing
- **Batch Operations**: Withdraw multiple locks in one transaction
- **Minimal Overhead**: Low gas costs for all operations
- **View Functions**: Free read operations for lock information

## How to Use the Token Locker

### 1. Access the Token Locker

1. Navigate to the **"Profile"** section
2. Scroll down to the **"Wallet"** component
3. Click the **"Lock"** button at the top
4. The Token Locker interface will open

### 2. Select a Token to Lock

1. **Search for tokens** by name, symbol, or contract address
2. **Choose from your holdings** - tokens you've added to your wallet
3. **Select the token** you want to lock
4. The interface will show the token details and your balance

### 3. Set Lock Parameters

#### Amount to Lock
- **Manual Input**: Enter the exact amount you want to lock
- **Percentage Buttons**: Use 25%, 50%, 75%, or Max for quick selection
- **Balance Display**: See your current token balance
- **USD Value**: Real-time USD value of the amount

#### Lock Duration
- **Days Input**: Enter the number of days to lock (minimum 1 day)
- **Common Durations**: 7, 30, 90, 180, 365 days
- **Custom Periods**: Any number of days you prefer

### 4. Approve and Lock

1. **Approve Tokens**: First transaction to approve the locker contract
2. **Create Lock**: Second transaction to lock the tokens
3. **Confirmation**: Tokens are transferred to the locker contract
4. **Lock ID**: You'll receive a unique lock ID for tracking

## Lock Management

### Viewing Your Locks

In the Profile section, you can view all your active locks:

- **Lock ID**: Unique identifier for each lock
- **Token**: The locked token name and symbol
- **Amount Locked**: Exact amount of tokens locked
- **Lock Duration**: Total days the tokens are locked
- **Days Remaining**: Days until the lock expires
- **Status**: Locked, Unlocked, or Withdrawn

### Withdrawing Tokens

#### Individual Withdrawal
1. Find the lock you want to withdraw
2. Click **"Withdraw"** (only available when lock expires)
3. Confirm the transaction
4. Tokens are transferred back to your wallet

#### Batch Withdrawal
1. Use **"Withdraw All"** for a specific token
2. All expired locks for that token are withdrawn
3. Gas-efficient single transaction
4. All tokens transferred at once

## Contract Functions

### Core Functions

#### `newTokenLock(address _tokenAddress, uint256 _tokenAmount, uint256 _lockDays)`
Creates a new token lock for the caller.

**Parameters:**
- `_tokenAddress`: The ERC-20 token address to lock
- `_tokenAmount`: Amount of tokens to lock (with full decimals)
- `_lockDays`: Number of days to lock the tokens

**Requirements:**
- Token address must be valid
- Amount must be greater than 0
- Lock days must be greater than 0
- User must have sufficient token balance
- User must have approved the contract

#### `withdrawTokenLock(uint256 _lockId)`
Withdraws tokens from a specific lock after the lock period.

**Parameters:**
- `_lockId`: The ID of the lock to withdraw from

**Requirements:**
- Lock must exist
- Tokens must not have been withdrawn
- Lock period must have ended

#### `withdrawAllTokenLocks(address _tokenAddress)`
Withdraws all unlocked tokens for a specific token address.

**Parameters:**
- `_tokenAddress`: The token address to withdraw all unlocked locks for

### View Functions

#### `getLockInfo(address _user, uint256 _lockId)`
Returns detailed information about a specific lock.

**Returns:**
- `tokenAddress`: The token address
- `tokenAmount`: Amount of tokens locked
- `lockDays`: Total lock period in days
- `daysRemaining`: Days remaining (0 if unlocked)
- `isUnlocked`: Whether the lock period has ended
- `withdrawn`: Whether tokens have been withdrawn

#### `getUserLockIds(address _user)`
Returns all lock IDs for a specific user.

#### `getActiveLocks(address _user, address _tokenAddress)`
Returns all active (non-withdrawn) locks for a user and token.

## Important Considerations

### ⚠️ **No Early Withdrawal**
- **Locks are FINAL** - there is no early withdrawal option
- **Plan carefully** - only lock tokens you can afford to lose access to
- **Emergency situations** - consider this before locking large amounts

### 💰 **Token Amounts**
- **Full Decimals Required**: Enter amounts with full decimal precision
- **Example**: For 100 tokens with 18 decimals, enter `100000000000000000000`
- **Check Decimals**: Verify the token's decimal places before locking

### ⛽ **Gas Costs**
- **Approval Transaction**: Required before locking (one-time per token)
- **Lock Transaction**: Creates the lock and transfers tokens
- **Withdrawal Transaction**: Withdraws tokens when lock expires
- **View Functions**: Free to call (no gas required)

### 🔒 **Security**
- **Contract Security**: Audited and battle-tested
- **No Admin Keys**: No one can access your locked tokens
- **Reentrancy Protection**: Secure against common attacks
- **Safe Transfers**: Uses OpenZeppelin's SafeERC20

## Use Cases

### 🎯 **Commitment Strategies**
- **Long-term Holding**: Lock tokens to prevent impulsive selling
- **Investment Discipline**: Enforce holding periods for investments
- **DCA Strategies**: Lock tokens for regular dollar-cost averaging

### 🏢 **Vesting and Rewards**
- **Team Vesting**: Lock team tokens with gradual release
- **Reward Distribution**: Lock rewards until conditions are met
- **Staking Rewards**: Lock earned rewards for additional periods

### 💼 **Portfolio Management**
- **Risk Management**: Lock volatile tokens to reduce trading
- **Diversification**: Lock different tokens for different periods
- **Tax Planning**: Lock tokens for specific tax periods

## Best Practices

### 📋 **Before Locking**
1. **Verify Token Address**: Ensure you're locking the correct token
2. **Check Decimals**: Confirm the token's decimal places
3. **Test with Small Amount**: Try with a small amount first
4. **Plan Duration**: Choose appropriate lock periods
5. **Consider Alternatives**: Ensure you won't need the tokens

### 🔍 **During Lock Period**
1. **Track Lock Status**: Monitor your locks in the Profile section
2. **Plan Withdrawals**: Prepare for when locks expire
3. **Document Lock IDs**: Keep track of your lock IDs
4. **Monitor Token Value**: Watch token prices and market conditions

### 💸 **After Lock Expires**
1. **Withdraw Promptly**: Don't leave tokens in the contract unnecessarily
2. **Batch Withdrawals**: Use batch withdrawal for gas efficiency
3. **Verify Amounts**: Confirm you receive the expected amount
4. **Update Records**: Update your portfolio tracking

## Troubleshooting

### Common Issues

**"Insufficient token balance"**
- Check you have enough tokens in your wallet
- Verify the token address is correct
- Ensure you're on the right network (Ink L2)

**"Amount must be greater than 0"**
- Enter a valid amount greater than zero
- Check decimal places are correct
- Verify the amount format

**"Lock period not ended"**
- Wait until the lock period expires
- Check the lock end time
- Remember: no early withdrawal is allowed

**"Tokens already withdrawn"**
- This lock has already been withdrawn
- Check other locks for the same token
- Verify the lock ID is correct

### Getting Help

- **Technical Issues**: Contact founder [Email](mailto:cruelhandeth@gmail.com) | [Telegram](https://t.me/deployerone)
- **Contract Questions**: See documentation or contact support
- **Business Inquiries**: [Business Development Team](https://github.com/mavrk/ink#contact)

---

> **Remember**: The Token Locker is designed for commitment and security. Once you lock tokens, they cannot be withdrawn until the lock period expires. Plan carefully and only lock tokens you can afford to lose access to for the specified duration.
