/**
 * LinearVesting contract wrapper
 */

import { Contract, Signer } from 'ethers';
import { LINEAR_VESTING_ABI } from '../abis/LinearVesting';
import { ERC20_ABI } from '../abis/ERC20';
import { CONTRACT_ADDRESSES } from '../constants';
import { VestingParams } from '../types';

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
   * Create a linear vesting schedule
   */
  async createVesting(params: VestingParams): Promise<string> {
    try {
      console.log(`📅 Creating vesting schedule for ${params.beneficiary}`);

      // Check allowance
      const tokenContract = new Contract(params.tokenAddress, ERC20_ABI, this.signer);
      const allowance = await tokenContract.allowance(
        await this.signer.getAddress(),
        CONTRACT_ADDRESSES.LINEAR_VESTING
      );

      // Approve if needed
      if (allowance < params.amount) {
        console.log('⏳ Approving token spending...');
        const approveTx = await tokenContract.approve(
          CONTRACT_ADDRESSES.LINEAR_VESTING,
          params.amount
        );
        await approveTx.wait();
        console.log('✅ Tokens approved');
      }

      // Create vesting schedule
      const tx = await this.contract.createVestingSchedule(
        params.beneficiary,
        params.tokenAddress,
        params.amount,
        params.startTime,
        params.cliffDuration,
        params.vestingDuration
      );

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
   * Release vested tokens
   */
  async release(tokenAddress: string): Promise<string> {
    const tx = await this.contract.release(tokenAddress);
    const receipt = await tx.wait();
    return receipt.hash;
  }

  /**
   * Get vesting schedule for a beneficiary
   */
  async getVestingSchedule(beneficiary: string, tokenAddress: string) {
    return await this.contract.getVestingSchedule(beneficiary, tokenAddress);
  }

  /**
   * Compute amount of tokens that can be released
   */
  async getReleasableAmount(beneficiary: string, tokenAddress: string): Promise<bigint> {
    return await this.contract.computeReleasableAmount(beneficiary, tokenAddress);
  }
}

