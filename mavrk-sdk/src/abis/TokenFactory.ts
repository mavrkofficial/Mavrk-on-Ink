/**
 * ABI for MavrkTokenFactory contract
 */

export const TOKEN_FACTORY_ABI = [
  // Core deploy function (updated): choose DEX via NPM address
  "function newMavrkToken(string _name, string _symbol, address npm) external",
  // Views
  "function getWhitelistedNPMs() external view returns (address[])",
  "function isNPMWhitelisted(address npm) external view returns (bool)",
  "function getV3FactoryForNPM(address npm) external view returns (address)",
  "function getNFTCreator(uint256 tokenId) external view returns (address)",
  "function getCreatorNFTs(address creator) external view returns (uint256[])",
  "function getCreatorNFTCount(address creator) external view returns (uint256)",
  "function getTotalTokensDeployed() external view returns (uint256)",
  "function getCreatorTokenCount(address creator) external view returns (uint256)",
  "function getLocker() external view returns (address)",
  // Admin
  "function whitelistNPM(address npm, address v3Factory) external",
  "function removeNPM(address npm) external",
  "function updateNPMV3Factory(address npm, address v3Factory) external",
  "function setPoolManager(address newPoolManager) external",
  "function setLockerAddress(address newLocker) external",
  // Events (updated)
  "event TokenDeployed(address indexed tokenAddress, string name, string symbol, address indexed creator, address indexed npm, uint256 totalDeployed)",
  "event PoolInitialized(address pool, address npm)",
  "event LiquidityMinted(uint256 tokenId, address indexed creator, address indexed npm)",
  "event NFTLocked(uint256 tokenId, address indexed creator)"
] as const;

