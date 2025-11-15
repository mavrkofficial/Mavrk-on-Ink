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

  console.log('Locking tokens...');
  console.log(`Token: ${tokenAddress}`);
  console.log(`Amount: ${ethers.formatEther(amountToLock)} tokens`);
  console.log(`Duration: ${lockDurationDays} days`);

  // Lock tokens
  const txHash = await mavrk.lockTokens({
    tokenAddress,
    amount: amountToLock,
    durationDays: lockDurationDays,
  });

  console.log(`Tokens locked successfully!`);
  console.log(`Transaction: ${txHash}`);

  // Get user's locks
  const userAddress = await wallet.getAddress();
  const { lockIds, amounts, endTimes } = await mavrk.tokenLocker.getActiveLocks(userAddress, tokenAddress);
  
  console.log(`\nYour active locks for this token:`);
  lockIds.forEach((id: bigint, index: number) => {
    const unlockDate = new Date(Number(endTimes[index]) * 1000);
    console.log(`Lock ${id}: ${ethers.formatEther(amounts[index])} tokens, unlocks at ${unlockDate.toLocaleString()}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

