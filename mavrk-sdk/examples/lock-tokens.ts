/**
 * Example: Lock tokens for a specified duration
 */

import { MavrkSDK } from '@mavrk/sdk';
import { ethers } from 'ethers';

async function main() {
  // Setup
  const provider = new ethers.JsonRpcProvider('https://rpc-gel.inkonchain.com');
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY_HERE', provider);

  const mavrk = new MavrkSDK({ signer: wallet });

  // Token to lock
  const tokenAddress = '0x...'; // Your token address
  const amountToLock = ethers.parseEther('1000'); // 1000 tokens
  const lockDurationDays = 30; // 30 days

  console.log('🔒 Locking tokens...');
  console.log(`Token: ${tokenAddress}`);
  console.log(`Amount: ${ethers.formatEther(amountToLock)} tokens`);
  console.log(`Duration: ${lockDurationDays} days`);

  // Lock tokens
  const txHash = await mavrk.lockTokens({
    tokenAddress,
    amount: amountToLock,
    durationDays: lockDurationDays,
  });

  console.log(`✅ Tokens locked successfully!`);
  console.log(`🔗 Transaction: ${txHash}`);

  // Get user's locks
  const userAddress = await wallet.getAddress();
  const locks = await mavrk.tokenLocker.getUserLocks(userAddress, tokenAddress);
  
  console.log(`\n📊 Your locks for this token:`);
  locks.forEach((lock: any, index: number) => {
    const unlockDate = new Date(Number(lock.unlockTime) * 1000);
    console.log(`Lock ${index + 1}:`);
    console.log(`  Amount: ${ethers.formatEther(lock.amount)} tokens`);
    console.log(`  Unlock time: ${unlockDate.toLocaleString()}`);
    console.log(`  Withdrawn: ${lock.withdrawn ? 'Yes' : 'No'}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

