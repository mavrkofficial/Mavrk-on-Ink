// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MavrkTokenLocker
 * @dev A gas-efficient token time-lock contract that allows users to lock any ERC20 tokens
 * for a specified period. Each user can have multiple token locks per token.
 * 
 * Features:
 * - Lock any ERC20 token for a specified number of days
 * - Multiple token locks per user per token
 * - Automatic lock period calculation
 * - Withdraw tokens ONLY after lock period expires (NO early withdrawal!)
 * - Reentrancy protection
 * - Gas optimized storage patterns
 * 
 * IMPORTANT: Token amounts must be entered with full decimals!
 * For 100 tokens with 18 decimals: enter 100000000000000000000
 * For 100 tokens with 6 decimals: enter 100000000
 * 
 * Locks are FINAL - no early withdrawal option!
 */
contract MavrkTokenLocker is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Struct to store token lock information
    struct TokenLock {
        address tokenAddress;      // ERC20 token address
        uint256 tokenAmount;       // Amount of tokens locked
        uint256 lockStartTime;     // Unix timestamp when lock was created
        uint256 lockEndTime;       // Unix timestamp when lock ends
        uint256 lockDays;          // Original lock period in days
        bool withdrawn;            // Whether tokens have been withdrawn
    }

    // Mapping: user address => lock ID => TokenLock
    mapping(address => mapping(uint256 => TokenLock)) public tokenLocks;
    
    // Mapping: user address => next lock ID
    mapping(address => uint256) public userLockCount;
    
    // Constants
    uint256 private constant SECONDS_PER_DAY = 86400; // 24 * 60 * 60

    // Events
    event TokenLockCreated(
        address indexed user,
        uint256 indexed lockId,
        address indexed tokenAddress,
        uint256 tokenAmount,
        uint256 lockDays,
        uint256 lockEndTime
    );

    event TokensWithdrawn(
        address indexed user,
        uint256 indexed lockId,
        address indexed tokenAddress,
        uint256 tokenAmount
    );

    /**
     * @dev Creates a new token lock for the caller
     * @param _tokenAddress The ERC20 token address to lock
     * @param _tokenAmount The exact amount of tokens to lock (including decimals)
     * @param _lockDays The number of days to lock the tokens
     * 
     * IMPORTANT: Enter the full token amount including decimals!
     * Example: For 100 tokens with 18 decimals, enter: 100000000000000000000
     * 
     * Requirements:
     * - _tokenAddress must be a valid contract address
     * - _tokenAmount must be greater than 0
     * - _lockDays must be greater than 0
     * - User must have approved this contract to spend the tokens
     * - User must have sufficient token balance
     * 
     * Returns: Lock ID in the event
     */
    function newTokenLock(
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _lockDays
    ) external nonReentrant returns (uint256) {
        // Input validation
        require(_tokenAddress != address(0), "Invalid token address");
        require(_tokenAmount > 0, "Amount must be greater than 0");
        require(_lockDays > 0, "Lock days must be greater than 0");
        
        IERC20 token = IERC20(_tokenAddress);
        
        // Check user balance
        require(
            token.balanceOf(msg.sender) >= _tokenAmount,
            "Insufficient token balance"
        );

        // Calculate lock end time
        uint256 lockEndTime = block.timestamp + (_lockDays * SECONDS_PER_DAY);
        
        // Get next lock ID for this user
        uint256 lockId = userLockCount[msg.sender];
        
        // Create token lock
        tokenLocks[msg.sender][lockId] = TokenLock({
            tokenAddress: _tokenAddress,
            tokenAmount: _tokenAmount,
            lockStartTime: block.timestamp,
            lockEndTime: lockEndTime,
            lockDays: _lockDays,
            withdrawn: false
        });
        
        // Increment lock count
        userLockCount[msg.sender]++;
        
        // Transfer tokens from user to contract
        token.safeTransferFrom(msg.sender, address(this), _tokenAmount);
        
        emit TokenLockCreated(
            msg.sender,
            lockId,
            _tokenAddress,
            _tokenAmount,
            _lockDays,
            lockEndTime
        );
        
        return lockId;
    }

    /**
     * @dev Withdraws tokens from a specific token lock after the lock period
     * @param _lockId The ID of the token lock to withdraw from
     * 
     * Requirements:
     * - Lock must exist
     * - Tokens must not have been withdrawn already
     * - Lock period must have ended (NO early withdrawal!)
     */
    function withdrawTokenLock(uint256 _lockId) external nonReentrant {
        TokenLock storage lock = tokenLocks[msg.sender][_lockId];
        
        // Validation
        require(lock.tokenAmount > 0, "Lock does not exist");
        require(!lock.withdrawn, "Tokens already withdrawn");
        require(
            block.timestamp >= lock.lockEndTime,
            "Lock period not ended - no early withdrawal allowed"
        );
        
        // Mark as withdrawn
        lock.withdrawn = true;
        
        // Transfer tokens back to user
        IERC20(lock.tokenAddress).safeTransfer(msg.sender, lock.tokenAmount);
        
        emit TokensWithdrawn(
            msg.sender,
            _lockId,
            lock.tokenAddress,
            lock.tokenAmount
        );
    }

    /**
     * @dev Withdraws all unlocked tokens for a specific token address
     * @param _tokenAddress The token address to withdraw all unlocked locks for
     * 
     * This function iterates through all locks and withdraws any that are unlocked
     * and match the specified token address
     */
    function withdrawAllTokenLocks(address _tokenAddress) external nonReentrant {
        require(_tokenAddress != address(0), "Invalid token address");
        
        uint256 totalLocks = userLockCount[msg.sender];
        require(totalLocks > 0, "No locks found");
        
        uint256 totalWithdrawn = 0;
        
        // Iterate through all locks for this user
        for (uint256 i = 0; i < totalLocks; i++) {
            TokenLock storage lock = tokenLocks[msg.sender][i];
            
            // Check if this lock matches criteria for withdrawal
            if (
                lock.tokenAddress == _tokenAddress &&
                !lock.withdrawn &&
                block.timestamp >= lock.lockEndTime &&
                lock.tokenAmount > 0
            ) {
                // Mark as withdrawn
                lock.withdrawn = true;
                totalWithdrawn += lock.tokenAmount;
                
                emit TokensWithdrawn(
                    msg.sender,
                    i,
                    lock.tokenAddress,
                    lock.tokenAmount
                );
            }
        }
        
        require(totalWithdrawn > 0, "No unlocked tokens to withdraw");
        
        // Transfer all tokens in one transaction (gas efficient)
        IERC20(_tokenAddress).safeTransfer(msg.sender, totalWithdrawn);
    }

    /**
     * @dev Gets the detailed lock information for a specific lock
     * @param _user The user address
     * @param _lockId The lock ID
     * @return tokenAddress The token address
     * @return tokenAmount The amount of tokens locked
     * @return lockDays The total lock period in days
     * @return daysRemaining The number of days remaining (0 if unlocked)
     * @return isUnlocked Whether the lock period has ended
     * @return withdrawn Whether tokens have been withdrawn
     */
    function getLockInfo(address _user, uint256 _lockId)
        external
        view
        returns (
            address tokenAddress,
            uint256 tokenAmount,
            uint256 lockDays,
            uint256 daysRemaining,
            bool isUnlocked,
            bool withdrawn
        )
    {
        TokenLock memory lock = tokenLocks[_user][_lockId];
        require(lock.tokenAmount > 0, "Lock does not exist");
        
        tokenAddress = lock.tokenAddress;
        tokenAmount = lock.tokenAmount;
        lockDays = lock.lockDays;
        withdrawn = lock.withdrawn;
        
        if (block.timestamp >= lock.lockEndTime) {
            daysRemaining = 0;
            isUnlocked = true;
        } else {
            uint256 remainingSeconds = lock.lockEndTime - block.timestamp;
            // Round up to include current day
            daysRemaining = (remainingSeconds + SECONDS_PER_DAY - 1) / SECONDS_PER_DAY;
            isUnlocked = false;
        }
    }

    /**
     * @dev Gets the number of days remaining for a specific token lock
     * @param _user The user address
     * @param _lockId The lock ID
     * @return daysRemaining The number of days remaining (including current day)
     */
    function getDaysRemaining(address _user, uint256 _lockId)
        external
        view
        returns (uint256 daysRemaining)
    {
        TokenLock memory lock = tokenLocks[_user][_lockId];
        require(lock.tokenAmount > 0, "Lock does not exist");
        
        if (block.timestamp >= lock.lockEndTime) {
            return 0;
        }
        
        uint256 remainingSeconds = lock.lockEndTime - block.timestamp;
        // Round up to include current day
        daysRemaining = (remainingSeconds + SECONDS_PER_DAY - 1) / SECONDS_PER_DAY;
    }

    /**
     * @dev Gets the total number of lock days for a specific lock
     * @param _user The user address
     * @param _lockId The lock ID
     * @return lockDays The total lock period in days
     */
    function getLockDays(address _user, uint256 _lockId)
        external
        view
        returns (uint256 lockDays)
    {
        TokenLock memory lock = tokenLocks[_user][_lockId];
        require(lock.tokenAmount > 0, "Lock does not exist");
        return lock.lockDays;
    }

    /**
     * @dev Gets all lock IDs for a specific user
     * @param _user The user address
     * @return lockIds Array of all lock IDs for the user
     */
    function getUserLockIds(address _user)
        external
        view
        returns (uint256[] memory lockIds)
    {
        uint256 totalLocks = userLockCount[_user];
        lockIds = new uint256[](totalLocks);
        
        for (uint256 i = 0; i < totalLocks; i++) {
            lockIds[i] = i;
        }
        
        return lockIds;
    }

    /**
     * @dev Gets the total number of locks for a user
     * @param _user The user address
     * @return count The total number of locks for the user
     */
    function getUserLockCount(address _user) external view returns (uint256 count) {
        return userLockCount[_user];
    }

    /**
     * @dev Gets all active (non-withdrawn) locks for a user and token
     * @param _user The user address
     * @param _tokenAddress The token address
     * @return lockIds Array of active lock IDs
     * @return amounts Array of token amounts
     * @return endTimes Array of lock end times
     */
    function getActiveLocks(address _user, address _tokenAddress)
        external
        view
        returns (
            uint256[] memory lockIds,
            uint256[] memory amounts,
            uint256[] memory endTimes
        )
    {
        uint256 totalLocks = userLockCount[_user];
        uint256 activeCount = 0;
        
        // First pass: count active locks
        for (uint256 i = 0; i < totalLocks; i++) {
            TokenLock memory lock = tokenLocks[_user][i];
            if (lock.tokenAddress == _tokenAddress && !lock.withdrawn && lock.tokenAmount > 0) {
                activeCount++;
            }
        }
        
        // Initialize arrays
        lockIds = new uint256[](activeCount);
        amounts = new uint256[](activeCount);
        endTimes = new uint256[](activeCount);
        
        // Second pass: populate arrays
        uint256 index = 0;
        for (uint256 i = 0; i < totalLocks; i++) {
            TokenLock memory lock = tokenLocks[_user][i];
            if (lock.tokenAddress == _tokenAddress && !lock.withdrawn && lock.tokenAmount > 0) {
                lockIds[index] = i;
                amounts[index] = lock.tokenAmount;
                endTimes[index] = lock.lockEndTime;
                index++;
            }
        }
    }
}
