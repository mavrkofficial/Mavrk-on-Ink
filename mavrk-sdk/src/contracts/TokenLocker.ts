/**
 * TokenLocker contract wrapper
 */

import { Contract, Signer } from 'ethers';
import { TOKEN_LOCKER_ABI } from '../abis/TokenLocker';
import { ERC20_ABI } from '../abis/ERC20';
import { CONTRACT_ADDRESSES } from '../constants';

export class TokenLocker {
  private contract: Contract;
  private signer: Signer;

  constructor(signer: Signer) {
    this.signer = signer;
    this.contract = new Contract(
      CONTRACT_ADDRESSES.TOKEN_LOCKER,
      TOKEN_LOCKER_ABI,
      signer
    );
  }

  /**
   * Lock tokens for a specified duration (in days)
   * @param tokenAddress - ERC20 token to lock
   * @param amount - Amount to lock (in wei)
   * @param durationDays - Lock duration in days
   * @returns Transaction hash
   */
  async lock(
    tokenAddress: string,
    amount: bigint,
    durationDays: number
  ): Promise<string> {
    try {
      console.log(`🔒 Locking ${amount} tokens for ${durationDays} days`);

      // Check allowance
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, this.signer);
      const allowance = await tokenContract.allowance(
        await this.signer.getAddress(),
        CONTRACT_ADDRESSES.TOKEN_LOCKER
      );

      // Approve if needed
      if (allowance < amount) {
        console.log('⏳ Approving token spending...');
        const approveTx = await tokenContract.approve(
          CONTRACT_ADDRESSES.TOKEN_LOCKER,
          amount
        );
        await approveTx.wait();
        console.log('✅ Tokens approved');
      }

      // Create token lock (duration in days as per contract)
      const tx = await this.contract.newTokenLock(tokenAddress, amount, durationDays);

      console.log(`⏳ Lock transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`✅ Tokens locked successfully!`);

      return receipt.hash;
    } catch (error: any) {
      console.error('❌ Lock failed:', error);
      throw new Error(`Failed to lock tokens: ${error.message}`);
    }
  }

  /**
   * Withdraw a specific token lock after it expires
   */
  async withdraw(lockId: number): Promise<string> {
    const tx = await this.contract.withdrawTokenLock(lockId);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  /**
   * Withdraw all unlocked locks for a token
   */
  async withdrawAll(tokenAddress: string): Promise<string> {
    const tx = await this.contract.withdrawAllTokenLocks(tokenAddress);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  /**
   * Get all locks for a user and token
   */
  async getActiveLocks(userAddress: string, tokenAddress: string) {
    return await this.contract.getActiveLocks(userAddress, tokenAddress);
  }

  /**
   * Get lock info for a specific lock
   */
  async getLockInfo(userAddress: string, lockId: number) {
    return await this.contract.getLockInfo(userAddress, lockId);
  }
}

