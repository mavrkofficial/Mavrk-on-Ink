// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MavrkTokenFactory
 * @dev Main factory contract for Mavrk Token Factory
 * Handles token deployment, liquidity provision, and NFT locking
 * visit us at https://mavrk.ink
 */

import "./MavrkTokenStandard.sol";
import "./interfaces/IMavrkInterfaces.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract MavrkTokenFactory is ERC2771Context {
    address public constant POSITION_MANAGER = 0xC0836E5B058BBE22ae2266e1AC488A1A0fD8DCE8;
    address public LOCKER = 0x3039e0Cb2BA67bAf2253E1866f98DAf0Bab2225b;
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    uint24 public constant FEE_TIER = 10000;
    
    // Trusted forwarder for meta-transactions (Gelato)
    address private _trustedForwarder;
    
    // Pool Manager mappings for different ETH tiers
    mapping(uint8 => address) public poolManagers; // 1 = 1ETH, 2 = 2ETH, 3 = 3ETH
    mapping(address => bool) public whitelistedPoolManagers;
    
    // Creator tracking for fee collection
    mapping(uint256 => address) public nftCreators; // NFT tokenId => creator address
    mapping(address => uint256[]) public creatorNFTs; // creator address => array of NFT tokenIds
    
    // Temporary storage for stack optimization
    address private _tempCreator;
    address private _tempToken0;
    address private _tempToken1;
    
    // Events
    event TokenDeployed(address tokenAddress, string name, string symbol, address indexed creator);
    event PoolInitialized(address pool);
    event LiquidityMinted(uint256 tokenId, address indexed creator);
    event NFTLocked(uint256 tokenId, address indexed creator);
    event PoolManagerUpdated(uint8 tier, address oldManager, address newManager);
    event PoolManagerWhitelisted(address poolManager, bool whitelisted);
    event LockerUpdated(address oldLocker, address newLocker);
    event TrustedForwarderSet(address indexed forwarder);
    
    // Modifiers
    modifier onlyOwner() {
        require(_msgSender() == owner, "Only owner can call this function");
        _;
    }
    
    address public owner;
    
    constructor(address _1ETHPoolManager, address trustedForwarder_) ERC2771Context(trustedForwarder_) {
        owner = _msgSender();
        _trustedForwarder = trustedForwarder_;
        
        // Set the 1ETH pool manager (tier 1)
        poolManagers[1] = _1ETHPoolManager;
        whitelistedPoolManagers[_1ETHPoolManager] = true;
        
        emit PoolManagerUpdated(1, address(0), _1ETHPoolManager);
        emit PoolManagerWhitelisted(_1ETHPoolManager, true);
        emit TrustedForwarderSet(trustedForwarder_);
    }
    
    // Function to update pool managers for different ETH tiers
    function setPoolManager(uint8 tier, address poolManager) external onlyOwner {
        require(tier >= 1 && tier <= 3, "Invalid tier (must be 1 = 1ETH, 2 = 2ETH, or 3 = 3ETH)");
        require(poolManager != address(0), "Pool manager cannot be zero address");
        
        address oldManager = poolManagers[tier];
        poolManagers[tier] = poolManager;
        whitelistedPoolManagers[poolManager] = true;
        
        emit PoolManagerUpdated(tier, oldManager, poolManager);
        emit PoolManagerWhitelisted(poolManager, true);
    }
    
    // Function to whitelist/blacklist pool managers
    function setPoolManagerWhitelist(address poolManager, bool whitelisted) external onlyOwner {
        whitelistedPoolManagers[poolManager] = whitelisted;
        emit PoolManagerWhitelisted(poolManager, whitelisted);
    }
    
    // Function to update locker address
    function setLockerAddress(address newLocker) external onlyOwner {
        require(newLocker != address(0), "Locker address cannot be zero address");
        address oldLocker = LOCKER;
        LOCKER = newLocker;
        emit LockerUpdated(oldLocker, newLocker);
    }
    
    // Function to transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
    
    // Trusted forwarder management functions
    function setTrustedForwarder(address forwarder) external onlyOwner {
        _trustedForwarder = forwarder;
        emit TrustedForwarderSet(forwarder);
    }
    
    function isTrustedForwarder(address forwarder) public view override returns (bool) {
        return forwarder == _trustedForwarder;
    }
    
    // Override _msgSender and _msgData to use ERC2771Context
    function _msgSender() internal view override returns (address sender) {
        return ERC2771Context._msgSender();
    }
    
    function _msgData() internal view override returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
    
    // Main function to create new tokens with specified pool manager tier
    function newMavrkToken(
        string memory _name, 
        string memory _symbol, 
        uint8 poolManagerTier
    ) external {
        _newMavrkToken(_name, _symbol, poolManagerTier, _msgSender());
    }
    
    // Internal function to avoid recursive calls
    function _newMavrkToken(
        string memory _name, 
        string memory _symbol, 
        uint8 poolManagerTier,
        address creator
    ) internal {
        require(poolManagerTier >= 1 && poolManagerTier <= 3, "Invalid tier (must be 1 = 1ETH, 2 = 2ETH, or 3 = 3ETH)");
        
        address poolManager = poolManagers[poolManagerTier];
        require(poolManager != address(0), "Pool manager not set for this tier");
        require(whitelistedPoolManagers[poolManager], "Pool manager not whitelisted");
        
        MavrkTokenStandard token = new MavrkTokenStandard(_name, _symbol, address(this), _trustedForwarder);
        address tokenAddress = address(token);
        emit TokenDeployed(tokenAddress, _name, _symbol, creator);

        // Approve the position manager to spend our tokens
        require(token.approve(POSITION_MANAGER, type(uint256).max), "Approval failed for NPM");

        address token0 = tokenAddress < WETH ? tokenAddress : WETH;
        address token1 = tokenAddress < WETH ? WETH : tokenAddress;

        if (!_tryPoolAndMintWithManager(tokenAddress, token0, token1, poolManager, creator)) {
            token0 = token0 == tokenAddress ? WETH : tokenAddress;
            token1 = token1 == tokenAddress ? WETH : tokenAddress;
            require(_tryPoolAndMintWithManager(tokenAddress, token0, token1, poolManager, creator), "Both attempts failed");
        }
    }
    
    // View functions to get pool manager addresses
    function get1ETHPoolManager() external view returns (address) {
        return poolManagers[1];
    }
    
    function get2ETHPoolManager() external view returns (address) {
        return poolManagers[2];
    }
    
    function get3ETHPoolManager() external view returns (address) {
        return poolManagers[3];
    }
    
    function getPoolManager(uint8 tier) external view returns (address) {
        require(tier >= 1 && tier <= 3, "Invalid tier (must be 1 = 1ETH, 2 = 2ETH, or 3 = 3ETH)");
        return poolManagers[tier];
    }
    
    // Creator tracking functions
    function getNFTCreator(uint256 tokenId) external view returns (address) {
        return nftCreators[tokenId];
    }
    
    function getCreatorNFTs(address creator) external view returns (uint256[] memory) {
        return creatorNFTs[creator];
    }
    
    function getCreatorNFTCount(address creator) external view returns (uint256) {
        return creatorNFTs[creator].length;
    }
    
    // Internal function that handles minting but gets parameters from pool manager
    function _tryPoolAndMintWithManager(
        address tokenAddress,
        address token0,
        address token1,
        address poolManager,
        address creator
    ) internal returns (bool success) {
        // Store frequently used variables in storage to reduce stack depth
        _tempCreator = creator;
        _tempToken0 = token0;
        _tempToken1 = token1;

        // Get minting parameters from the pool manager
        (
            uint160 sqrtPriceX96,
            int24 tickLower,
            int24 tickUpper,
            uint256 amount0Desired,
            uint256 amount1Desired,
            uint256 amount0Min,
            uint256 amount1Min
        ) = IMavrkPoolManager(poolManager).getMintingParameters(tokenAddress, token0, token1);

        // Create and initialize pool
        if (!_createAndInitializePool(sqrtPriceX96)) {
            return false;
        }

        // Mint position
        return _mintPosition(tickLower, tickUpper, amount0Desired, amount1Desired, amount0Min, amount1Min);
    }

    // Helper function to create and initialize pool
    function _createAndInitializePool(
        uint160 sqrtPriceX96
    ) internal returns (bool success) {
        INonfungiblePositionManager npm = INonfungiblePositionManager(POSITION_MANAGER);
        try npm.createAndInitializePoolIfNecessary(_tempToken0, _tempToken1, FEE_TIER, sqrtPriceX96) returns (address pool) {
            emit PoolInitialized(pool);
            return true;
        } catch {
            return false;
        }
    }

    // Helper function to mint position
    function _mintPosition(
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 amount0Min,
        uint256 amount1Min
    ) internal returns (bool success) {
        INonfungiblePositionManager npm = INonfungiblePositionManager(POSITION_MANAGER);

        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: _tempToken0,
            token1: _tempToken1,
            fee: FEE_TIER,
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Desired: amount0Desired,
            amount1Desired: amount1Desired,
            amount0Min: amount0Min,
            amount1Min: amount1Min,
            recipient: address(this),
            deadline: block.timestamp + 600
        });

        try npm.mint(params) returns (uint256 tokenId, uint128, uint256, uint256) {
            return _handleSuccessfulMint(tokenId, npm);
        } catch {
            return false;
        }
    }

    // Internal function to handle successful mint and reduce stack depth
    function _handleSuccessfulMint(
        uint256 tokenId,
        INonfungiblePositionManager npm
    ) internal returns (bool) {
        emit LiquidityMinted(tokenId, _tempCreator);
        
        // Track the creator of this NFT
        nftCreators[tokenId] = _tempCreator;
        creatorNFTs[_tempCreator].push(tokenId);
        
        require(npm.ownerOf(tokenId) == address(this), "Factory does not own LP NFT");
        npm.approve(LOCKER, tokenId);
        IMavrkLocker(LOCKER).lockLP(tokenId);
        emit NFTLocked(tokenId, _tempCreator);
        return true;
    }
} 