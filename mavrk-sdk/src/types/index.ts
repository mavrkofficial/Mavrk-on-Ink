/**
 * Core type definitions for Mavrk SDK
 */

export interface MavrkSDKConfig {
  /** Ethers signer for transactions */
  signer: any; // ethers.Signer
  /** Chain ID (default: 57073 for Ink L2) */
  chainId?: number;
  /** Custom RPC URL */
  rpcUrl?: string;
  /** Supabase URL (defaults to public instance) */
  supabaseUrl?: string;
  /** Supabase anonymous key */
  supabaseKey?: string;
}

export interface TokenMetadata {
  logoBase64: string;              // Required - Base64 image data
  coverPhotoBase64: string;        // Required - Base64 image data
  category: 'Meme' | 'DeFi' | 'Utility' | 'Gaming & Metaverse' | 'SoFi' | 'Creator Coins' | 'AI & Tech' | 'DAO' | 'Experimental/Art'; // Required
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
}

export interface DeployTokenParams {
  name: string;
  symbol: string;
  poolManagerTier?: 1 | 2 | 3; // Optional - defaults to 1
  metadata: TokenMetadata;       // Required - must include logo and cover
}

export interface DeployTokenResult {
  tokenAddress: string;
  poolAddress?: string;
  nftTokenId?: string;
  txHash: string;
}

export interface Token {
  id: number;
  name: string;
  symbol: string;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  category?: string;
  logo_url?: string;
  cover_photo_url?: string;
  contract_address: string;
  network: string;
  pool_address?: string;
  nft_token_id?: string;
  deployer_address: string;
  pool_manager_tier: number;
  created_at: string;
}

export interface LockTokensParams {
  tokenAddress: string;
  amount: bigint;
  durationDays: number;
}

export interface VestingParams {
  tokenAddress: string;
  beneficiary: string;
  amount: bigint;
  startTime: number;
  cliffDuration: number;
  vestingDuration: number;
}

export interface TVLData {
  totalValueUSD: number;
  positionCount: number;
}

