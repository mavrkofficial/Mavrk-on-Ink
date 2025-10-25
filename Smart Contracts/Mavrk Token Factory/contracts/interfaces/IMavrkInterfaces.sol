// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

/**
 * @title IMavrkInterfaces
 * @dev Interfaces for Mavrk Token Factory
 * Handles interfaces for Mavrk Token Factory
 * visit us at https://mavrk.ink
 */

interface INonfungiblePositionManager {
    struct MintParams {
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        address recipient;
        uint256 deadline;
    }

    function createAndInitializePoolIfNecessary(
        address token0,
        address token1,
        uint24 fee,
        uint160 sqrtPriceX96
    ) external payable returns (address pool);

    function mint(MintParams calldata params)
        external
        payable
        returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);

    function approve(address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

interface IMavrkLocker {
    function lockLP(uint256 tokenId) external;
}

interface IMavrkPoolManager {
    function getMintingParameters(
        address tokenAddress,
        address token0,
        address token1
    ) external pure returns (
        uint160 sqrtPriceX96,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0Desired,
        uint256 amount1Desired,
        uint256 amount0Min,
        uint256 amount1Min
    );
}

interface IMavrkTokenFactory {
    function isTrustedForwarder(address forwarder) external view returns (bool);
    function setTrustedForwarder(address forwarder) external;
} 