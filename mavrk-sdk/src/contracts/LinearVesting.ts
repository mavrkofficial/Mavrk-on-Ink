/**
 * LinearVesting contract wrapper
 */

import { Contract, Signer } from 'ethers';
import { LINEAR_VESTING_ABI } from '../abis/LinearVesting';
import { ERC20_ABI } from '../abis/ERC20';
import { CONTRACT_ADDRESSES } from '../constants';

export class LinearVesting {
  private contract: Contract;
  private signer: Signer;

  constructor(signer: Signer) {
    this.signer = signer;
    this.contract = new Contract(
      CONTRACT_ADDRESSES.LINEAR_VESTING,
      LINEAR_VESTING_ABI,
      signer
    );
  }

  /**
   * Create a linear vesting schedule using preset options (1=30d,2=60d,3=90d,4=180d)
   * Approves token if needed.
   */
  async createVesting(tokenAddress: string, amount: bigint, vestingOption: 1 | 2 | 3 | 4): Promise<string> {
    try {
      console.log(`📅 Creating vesting schedule option ${vestingOption}`);

      // Check allowance
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, this.signer);
      const allowance = await tokenContract.allowance(
        await this.signer.getAddress(),
        CONTRACT_ADDRESSES.LINEAR_VESTING
      );

      // Approve if needed
      if (allowance < amount) {
        console.log('⏳ Approving token spending...');
        const approveTx = await tokenContract.approve(
          CONTRACT_ADDRESSES.LINEAR_VESTING,
          amount
        );
        await approveTx.wait();
        console.log('✅ Tokens approved');
      }

      // Create vesting schedule
      const tx = await this.contract.createVestingSchedule(tokenAddress, amount, vestingOption);

      console.log(`⏳ Vesting transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`✅ Vesting schedule created!`);

      return receipt.hash;
    } catch (error: any) {
      console.error('❌ Vesting creation failed:', error);
      throw new Error(`Failed to create vesting: ${error.message}`);
    }
  }

  /**
   * Claim all currently vested tokens for a vesting schedule
   */
  async claim(vestingId: number): Promise<string> {
    const tx = await this.contract.claimVestedTokens(vestingId);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  /**
   * Get vesting info for a vesting schedule
   */
  async getVestingInfo(userAddress: string, vestingId: number) {
    return await this.contract.getVestingInfo(userAddress, vestingId);
  }

  /**
   * Compute amount of tokens that can be claimed now
   */
  async getClaimableAmount(userAddress: string, vestingId: number): Promise<bigint> {
    return await this.contract.getClaimableAmount(userAddress, vestingId);
  }
}

