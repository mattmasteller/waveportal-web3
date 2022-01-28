// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // Address of the user who waved.
        string message; // Message the user sent.
        uint256 timestamp; // Timestamp when the user waved.
    }

    // Array of all waves.
    Wave[] waves;

    // Cooldown mapping
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");

        // Set initial seed.
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        // Guard against spammers. Require 15 mins between waves. 
        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "Wait 15 mins");
        // Update current timestamp.
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        // Store wave data in the array.
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Generage a new seed for the next user that sends a wave.
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);

        // Give a 50% chance that the user wins the prize.
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            // Give prize to waver. 
            uint256 prizeAmount = 0.0001 ether;

            // Guard against negative balance. 
            require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");

            // Send prize.
            (bool success, ) = (msg.sender).call{ value: prizeAmount }("");
            require(success, "Failed to withdraw money from the contract.");
        }

        // Emit event.
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
