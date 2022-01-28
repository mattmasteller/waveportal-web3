// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // Address of the user who waved.
        string message; // Message the user sent.
        uint256 timestamp; // Timestamp when the user waved.
    }

    // Array of all waves.
    Wave[] waves;

    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);

        // Store wave data in the array.
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Emit event.
        emit NewWave(msg.sender, block.timestamp, _message);

        // Give prize to every waver. 
        uint256 prizeAmount = 0.0001 ether;
        // Guard against negative balance. 
        require(prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has.");
        // Send prize.
        (bool success, ) = (msg.sender).call{ value: prizeAmount }("");
        require(success, "Failed to withdraw money from the contract.");
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
