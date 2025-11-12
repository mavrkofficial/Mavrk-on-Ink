/**
 * ABI for MavrkTokenLocker contract
 */

export const TOKEN_LOCKER_ABI = [
  "function lock(address _token, uint256 _amount, uint256 _duration) external",
  "function unlock(address _token, uint256 _lockIndex) external",
  "function getUserLocks(address _user, address _token) external view returns (tuple(uint256 amount, uint256 lockTime, uint256 unlockTime, bool withdrawn)[])",
  "function getTokenLocks(address _token) external view returns (tuple(address user, uint256 amount, uint256 lockTime, uint256 unlockTime, bool withdrawn)[])",
  "event TokensLocked(address indexed user, address indexed token, uint256 amount, uint256 unlockTime)",
  "event TokensUnlocked(address indexed user, address indexed token, uint256 amount)"
] as const;

