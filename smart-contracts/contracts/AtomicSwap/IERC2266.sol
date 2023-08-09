// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


// Atomic Swap-based American Call Option functionalities.
interface IERC2266 {
    /* This mapping stores the metadata of the swap contracts, including the parties and tokens involved. Each contract uses different secretHash, and is distinguished by secretHash. */
    // mapping(bytes32 => Swap) public swap;
    
    /* This mapping stores the detail of the asset initiators want to sell, including the amount, the timelock and the state. It is associated with the swap contract with the same secretHash. */
    // mapping(bytes32 => InitiatorAsset) public initiatorAsset;

    /* This mapping stores the details of the asset participants want to sell, including the amount, the timelock and the state. It is associated with the swap contract with the same secretHash. */
    // mapping(bytes32 => ParticipantAsset) public participantAsset;

    /* This mapping stores the details of the premium initiators attach in the swap contract, including the amount, the timelock and the state. It is associated with the swap contract with the same secretHash. */
    // mapping(bytes32 => Premium) public premium;

    event SetUp(bytes32 secretHash, address initiator, address participant, address tokenA, address tokenB, uint256 initiatorAssetAmount, uint256 participantAssetAmount, uint256 premiumAmount);
    event Initiated(uint256 initiateTimestamp, bytes32 secretHash, address initiator, address participant, address initiatorAssetToken, uint256 initiatorAssetAmount, uint256 initiatorAssetRefundTimestamp);
    event Participated(uint256 participateTimestamp, bytes32 secretHash, address initiator, address participant, address participantAssetToken, uint256 participantAssetAmount, uint256 participantAssetRefundTimestamp);
    event PremiumFilled(uint256 fillPremiumTimestamp, bytes32 secretHash, address initiator, address participant, address premiumToken, uint256 premiumAmount, uint256 premiumRefundTimestamp);
    event InitiatorAssetRedeemed(uint256 redeemTimestamp, bytes32 secretHash, bytes32 secret, address redeemer, address assetToken, uint256 amount);
    event ParticipantAssetRedeemed(uint256 redeemTimestamp, bytes32 secretHash, bytes32 secret, address redeemer, address assetToken, uint256 amount);
    event InitiatorAssetRefunded(uint256 refundTimestamp, bytes32 secretHash, address refunder, address assetToken, uint256 amount);
    event ParticipantAssetRefunded(uint256 refundTimestamp, bytes32 secretHash, address refunder, address assetToken, uint256 amount);
    event PremiumRedeemed(uint256 redeemTimestamp,bytes32 secretHash,address redeemer,address token,uint256 amount);
    event PremiumRefunded(uint256 refundTimestamp, bytes32 secretHash, address refunder, address token, uint256 amount);


    function setup(
        bytes32 secretHash, 
        address payable initiator, 
        address tokenA, 
        address tokenB, 
        uint256 initiatorAssetAmount, 
        address payable participant, 
        uint256 participantAssetAmount, 
        uint256 premiumAmount
    ) external payable;
    function initiate(bytes32 secretHash, uint256 assetRefundTime) external payable;
    function fillPremium(bytes32 secretHash, uint256 premiumRefundTime) external payable;
    function participate(bytes32 secretHash, uint256 assetRefundTime) external payable;
    function redeemAsset(bytes32 secret, bytes32 secretHash) external;
    function refundAsset(bytes32 secretHash) external;
    function redeemPremium(bytes32 secretHash) external;
    function refundPremium(bytes32 secretHash) external;
}