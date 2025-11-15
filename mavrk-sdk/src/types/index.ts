/**
 * Core type definitions for Mavrk SDK
 */

export interface MavrkSDKConfig {
  /** Ethers signer for transactions */
  signer: any; // ethers.Signer
  /** Chain ID (default: 57073 for Ink L2) */
  chainId?: number;
  /** Custom RPC URL (optional) */
  rpcUrl?: string;
}

export interface DeployTokenParams {
  name: string;
  symbol: string;
  /** NonfungiblePositionManager address for the chosen DEX */
  npm: string;
}

export interface DeployTokenResult {
  tokenAddress: string;
  txHash: string;
}

export interface LockTokensParams {
  tokenAddress: string;
  amount: bigint;
  durationDays: number;
}

export interface VestingParams {
  tokenAddress: string;
  amount: bigint;
  /** Preset option: 1=30d, 2=60d, 3=90d, 4=180d */
  vestingOption: 1 | 2 | 3 | 4;
}

