// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { L2StandardERC20 } from "@eth-optimism/contracts/standards/L2StandardERC20.sol";

contract L2GLDToken is L2StandardERC20{
    constructor() L2StandardERC20(
        0x4200000000000000000000000000000000000010, 
        0x56c8d298f270E200645F01A3E4fD474C9F169430, 
        "Gold","GLD") {}
}