// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MavrkTokenStandard
 * @dev Standard token contract for Mavrk Token Factory
 * Implements basic ERC20 functionality with custom features
 * visit us at https://mavrk.ink
 */

import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract MavrkTokenStandard is ERC2771Context {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, address _deployer, address trustedForwarder_) ERC2771Context(trustedForwarder_) {
        name = _name;
        symbol = _symbol;
        decimals = 18;
        totalSupply = 1_000_000_000 * (10 ** uint256(decimals));
        owner = address(0x000000000000000000000000000000000000dEaD);
        balanceOf[_deployer] = totalSupply;
        emit Transfer(address(0), _deployer, totalSupply);
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        allowance[_msgSender()][spender] = amount;
        emit Approval(_msgSender(), spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[_msgSender()] >= amount, "Insufficient balance");
        balanceOf[_msgSender()] -= amount;
        balanceOf[to] += amount;
        emit Transfer(_msgSender(), to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][_msgSender()] >= amount, "Insufficient allowance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][_msgSender()] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
    
    // Override _msgSender and _msgData to use ERC2771Context
    function _msgSender() internal view override returns (address sender) {
        return ERC2771Context._msgSender();
    }
    
    function _msgData() internal view override returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
} 