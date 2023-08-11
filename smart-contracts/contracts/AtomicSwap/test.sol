// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    struct Box {
        uint256 num;
        string message;
        address sender;
    }

    function intHash(uint i) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(i));
    }

    function intAbi(uint i) public pure returns(bytes memory) {
        return abi.encodePacked(i);
    }

    function strHash(string memory s) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(s));
    }

    function strAbi(string memory s) public pure returns(bytes memory) {
        return abi.encodePacked(s);
    }

    function hexHash(bytes memory b) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(b));
    }

    function hexHash2(bytes memory b) public pure returns(bytes32) {
        return keccak256(abi.encode(b));
    }

    function hexAbi(bytes memory b) public pure returns(bytes memory) {
        return abi.encodePacked(b);
    }


    function checkHash(Box memory box) public pure returns(bytes32) {
        return keccak256(abi.encode(box));
    }
    function checkABI(Box memory box) public pure returns(bytes memory) {
        return abi.encode(box);
    }
    function checkABIPacked(Box memory box) public pure returns(bytes memory) {
        return abi.encodePacked(box.num, box.message, box.sender);
    }



}