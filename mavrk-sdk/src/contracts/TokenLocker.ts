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
   * Lock tokens for a specified duration
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

      // Convert days to seconds
      const durationSeconds = durationDays * 24 * 60 * 60;

      // Lock tokens
      const tx = await this.contract.lock(
        tokenAddress,
        amount,
        durationSeconds
      );

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
   * Unlock tokens after lock period expires
   */
  async unlock(tokenAddress: string, lockIndex: number): Promise<string> {
    const tx = await this.contract.unlock(tokenAddress, lockIndex);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  /**
   * Get all locks for a user and token
   */
  async getUserLocks(userAddress: string, tokenAddress: string) {
    return await this.contract.getUserLocks(userAddress, tokenAddress);
  }

  /**
   * Get all locks for a specific token
   */
  async getTokenLocks(tokenAddress: string) {
    return await this.contract.getTokenLocks(tokenAddress);
  }
}

