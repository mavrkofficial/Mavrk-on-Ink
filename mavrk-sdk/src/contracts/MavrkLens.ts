/**
 * MavrkLens contract wrapper for querying TVL data
 */

import { Contract, Provider } from 'ethers';
import { MAVRK_LENS_ABI } from '../abis/MavrkLens';
import { CONTRACT_ADDRESSES } from '../constants';
import { TVLData } from '../types';

export class MavrkLens {
  private contract: Contract;

  constructor(provider: Provider) {
    this.contract = new Contract(
      CONTRACT_ADDRESSES.MAVRK_LENS,
      MAVRK_LENS_ABI,
      provider
    );
  }

  /**
   * Get liquidity locker TVL (locked LP positions)
   */
  async getLiquidityLockerTVL(): Promise<TVLData> {
    try {
      const positions = await this.contract.lockerTVL(true);
      
      let totalValueUSD = 0;
      for (const position of positions) {
        totalValueUSD += Number(position.valueUSD) / 1e18;
      }

      return {
        totalValueUSD,
        positionCount: positions.length
      };
    } catch (error) {
      console.error('Failed to fetch liquidity locker TVL:', error);
      return { totalValueUSD: 0, positionCount: 0 };
    }
  }

  /**
   * Get vesting schedules for a token
   */
  async getVestingSchedulesByToken(tokenAddress: string) {
    return await this.contract.vestingSchedulesByToken(tokenAddress);
  }

  /**
   * Get token locks for a specific token
   */
  async getTokenLocksByToken(tokenAddress: string) {
    return await this.contract.tokenLocksByToken(tokenAddress);
  }
}

