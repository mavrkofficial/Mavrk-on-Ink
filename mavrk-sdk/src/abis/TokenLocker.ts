/**
 * ABI for MavrkTokenLocker contract
 */

export const TOKEN_LOCKER_ABI = [
  "function newTokenLock(address _tokenAddress, uint256 _tokenAmount, uint256 _lockDays) external returns (uint256)",
  "function withdrawTokenLock(uint256 _lockId) external",
  "function withdrawAllTokenLocks(address _tokenAddress) external",
  "function getLockInfo(address _user, uint256 _lockId) external view returns (address tokenAddress, uint256 tokenAmount, uint256 lockDays, uint256 daysRemaining, bool isUnlocked, bool withdrawn)",
  "function getDaysRemaining(address _user, uint256 _lockId) external view returns (uint256)",
  "function getUserLockIds(address _user) external view returns (uint256[])",
  "function getUserLockCount(address _user) external view returns (uint256)",
  "function getActiveLocks(address _user, address _tokenAddress) external view returns (uint256[] lockIds, uint256[] amounts, uint256[] endTimes)",
  "event TokenLockCreated(address indexed user, uint256 indexed lockId, address indexed tokenAddress, uint256 tokenAmount, uint256 lockDays, uint256 lockEndTime)",
  "event TokensWithdrawn(address indexed user, uint256 indexed lockId, address indexed tokenAddress, uint256 tokenAmount)"
] as const;

