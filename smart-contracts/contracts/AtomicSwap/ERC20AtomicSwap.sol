// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts@4.8.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.3/security/Pausable.sol";
import "@openzeppelin/contracts@4.8.3/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts@4.8.3/token/ERC20/IERC20.sol";
/* https://en.bitcoin.it/wiki/Atomic_swap 
A picks a random number x

A creates TX1: "Pay w BTC to <B's public key> if (x for H(x) known and signed by B) or (signed by A & B)"

A creates TX2: "Pay w BTC from TX1 to <A's public key>, locked 48 hours in the future, signed by A"

A sends TX2 to B

B signs TX2 and returns to A

1) A submits TX1 to the network

B creates TX3: "Pay v alt-coins to <A-public-key> if (x for H(x) known and signed by A) or (signed by A & B)"

B creates TX4: "Pay v alt-coins from TX3 to <B's public key>, locked 24 hours in the future, signed by B"

B sends TX4 to A

A signs TX4 and sends back to B

2) B submits TX3 to the network

3) A spends TX3, revealing x

4) B spends TX1 using x

This is atomic (with timeout).  If the process is halted, it can be reversed no matter when it is stopped.

Before 1: Nothing public has been broadcast, so nothing happens
Between 1 & 2: A can use refund transaction after 48 hours to get his money back
Between 2 & 3: B can get refund after 24 hours.  A has 24 more hours to get his refund
After 3: Transaction is completed by 2
- A must spend his new coin within 24 hours or B can claim the refund and keep his coins
- B must spend his new coin within 48 hours or A can claim the refund and keep his coins

For safety, both should complete the process with lots of time until the deadlines.
*/
contract ERC20AtomicSwap {

    struct Swap {
        address tokenAddress;
        address sender;
        address receiver;
        bytes32 secretHash;
        uint256 amount;
    }

    /**
     * @dev 
     */
    enum Stage {
        PENDING,
        COMPLETED,
        CANCELED
    }

    mapping(bytes32 => Swap) public _swaps;
    mapping(bytes32 => Stage) public _swapStatus;


    error InsufficientAllowance(address tokenAddress, address owner, address spender, uint256 amount,uint256 allowance);

    /**
     * @dev 
     */
    function swap(address tokenAddress_,address initiator_, address receiver_, bytes32 secretHash_, uint256 amount_) public {

        require(amount_ != 0, "the amount cannot be zero");

        uint256 balance = IERC20(tokenAddress_).balanceOf(initiator_);
        require(balance >= amount_, "insufficient balance");

        uint256 allowedAmount = IERC20(tokenAddress_).allowance(initiator_, address(this));
        if(allowedAmount == 0 || allowedAmount < amount_) {
            revert InsufficientAllowance(tokenAddress_, initiator_, address(this), amount_, allowedAmount);
        }
        
        Swap memory initSwap = Swap({
            tokenAddress: tokenAddress_,
            sender: initiator_,
            receiver: receiver_,
            secretHash: secretHash_,
            amount: amount_
        });

        bool isTransferSuccess = IERC20(tokenAddress_).transferFrom(initiator_, address(this), amount_);
        require(isTransferSuccess, "fail to transfer");

        _swaps[secretHash_]=initSwap;
        _swapStatus[secretHash_]=Stage.PENDING;

    }


    function checkSwap(bytes32 secretHash_) public view returns(Swap memory) {
        return _swaps[secretHash_];
    }

    function verifySecret(bytes memory secret_, bytes32 secretHash_) public view returns(bool) {
        return _swaps[secretHash_].secretHash == keccak256(abi.encodePacked(secret_));
    }

    /**
     * @dev Redeem ERC20 token 
     */
    function redeem(bytes memory secret_, bytes32 secretHash_) public {

        require(_swapStatus[secretHash_] != Stage.COMPLETED, "swap is already completed");

        Swap memory pendingSwap = _swaps[secretHash_];

        require(keccak256(abi.encodePacked(secret_)) == pendingSwap.secretHash, "secret is not matched with swap");

        bool isTransferSuccess = IERC20(pendingSwap.tokenAddress).transfer(pendingSwap.receiver, pendingSwap.amount);

        require(isTransferSuccess, "fail to transfer");

        _swapStatus[secretHash_] = Stage.COMPLETED;

    }

    /**
     * @dev Refund ERC20 token
     */
    function refund(bytes32 secretHash_) public {
        require(_swapStatus[secretHash_] == Stage.CANCELED, "swap is already canceled");
        require(_swapStatus[secretHash_] != Stage.COMPLETED, "swap is already completed");

        Swap memory pendingSwap = _swaps[secretHash_];


        bool isTransferSuccess = IERC20(pendingSwap.tokenAddress).transfer(pendingSwap.sender, pendingSwap.amount);

        require(isTransferSuccess, "fail to transfer");

        _swapStatus[secretHash_] = Stage.CANCELED;
    }

    // /**
    //  * @dev Check whether the swap is already redeemed or not
    //  */
    // function redemption(bytes32 secretHash) external returns(bool);

    

}
