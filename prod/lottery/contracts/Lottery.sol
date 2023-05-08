//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Lottery is Ownable {
    using SafeMath for uint256;

    uint256 public ticketPrice;
    address[] public participants;
    bytes32 private requestId;
    mapping(bytes32 => uint256) public randomNumber;

    event RequestedRandomNumber(bytes32 requestId);
    event LotteryResult(uint256 randomNumber, address winner);

    constructor(uint256 _ticketPrice) {
        ticketPrice = _ticketPrice;
    }

    function enter() public payable {
        require(msg.value == ticketPrice, "Incorrect ticket price");
        participants.push(msg.sender);
    }

    function getParticipants() public view returns (address[] memory) {
        return participants;
    }

    function requestRandomNumber() public onlyOwner {
        requestId = keccak256(abi.encodePacked(block.timestamp, msg.sender, block.number, address(this)));
        uint256 _randomNumber = uint256(requestId) % 1000000; // use requestId as a source of randomness
        setRandomNumber(requestId, _randomNumber);
        emit RequestedRandomNumber(requestId);
    }

    function setRandomNumber(bytes32 _requestId, uint256 _randomNumber) public onlyOwner {
        randomNumber[_requestId] = _randomNumber;
        pickWinner(_requestId);
    }

    function pickWinner(bytes32 _requestId) private {
        require(participants.length > 0, "No participants in the lottery");
        uint256 index = randomNumber[_requestId] % participants.length;
        address winner = participants[index];

        payable(winner).transfer(address(this).balance);

        emit LotteryResult(randomNumber[_requestId], winner);
        resetLottery();
    }


    function resetLottery() private {
        participants = new address[](0);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}
