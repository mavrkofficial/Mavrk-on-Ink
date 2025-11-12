/**
 * ABI for MavrkTokenFactory contract
 */

export const TOKEN_FACTORY_ABI = [
  "function newMavrkToken(string memory _name, string memory _symbol, uint8 poolManagerTier) external",
  "function poolManagers(uint8) view returns (address)",
  "function nftCreators(uint256) view returns (address)",
  "function creatorNFTs(address) view returns (uint256[])",
  "event TokenDeployed(address tokenAddress, string name, string symbol, address indexed creator)",
  "event PoolInitialized(address pool)",
  "event LiquidityMinted(uint256 tokenId, address indexed creator)",
  "event NFTLocked(uint256 tokenId, address indexed creator)"
] as const;

