module.exports = function (arguments) {

    const literal = [
        "ADMIN",
        "SEQUENCER",
        "PROPOSER",
        "BATCHER",
        "L1_CHAIN_ID",
        "L2_CHAIN_ID",
        "BLOCKHASH",
        "TIMESTAMP",
    ];

    for(let i = 0; i < literal.length; i++) {
        console.log(literal[i] + " ---> " +arguments[literal[i]])
        if(!arguments[literal[i]]) {
            throw new ReferenceError(`${literal[i]} is not exists`)
        }
    }

    const ADMIN = arguments.ADMIN
    const SEQUENCER = arguments.SEQUENCER
    const PROPOSER = arguments.PROPOSER
    const BATCHER = arguments.BATCHER
    const L1_CHAIN_ID = arguments.L1_CHAIN_ID
    const L2_CHAIN_ID = arguments.L2_CHAIN_ID
    const BLOCKHASH = arguments.BLOCKHASH
    const TIMESTAMP = arguments.TIMESTAMP

    const template = {
        "numDeployConfirmations": 1, // <undefined>
        "controller": `${ADMIN}`,    // <undefined>

        "finalSystemOwner": `${ADMIN}`, // 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A
        "portalGuardian": `${ADMIN}`, // 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A
        "l1StartingBlockTag": `${BLOCKHASH}`, // 0x438335a20d98863a4c0c97999eb2481921ccd28553eac6f913af7c12aec04108

        "l1ChainID": L1_CHAIN_ID, // 1
        "l2ChainID": L2_CHAIN_ID, // 10
        "l2BlockTime": 2, // 2

        "maxSequencerDrift": 600, // 600
        "sequencerWindowSize": 3600, // 3600
        "channelTimeout": 300, // 300

        "p2pSequencerAddress": `${SEQUENCER}`, // 0xAAAA45d9549EDA09E70937013520214382Ffc4A2
        "batchInboxAddress": "0xff00000000000000000000000000000000042069", // 0xff00000000000000000000000000000000000010
        "batchSenderAddress": `${BATCHER}`, // 0x6887246668a3b87F54DeB3b94Ba47a6f63F32985

        "l2OutputOracleSubmissionInterval": 120, // 1800
        "l2OutputOracleStartingTimestamp": `${TIMESTAMP}`, // 1686068903
        "l2OutputOracleStartingBlockNumber": 0, // 105235063

        "l2OutputOracleProposer": `${PROPOSER}`, // 0x473300df21D047806A082244b417f96b32f13A33
        "l2OutputOracleChallenger": `${ADMIN}`, // 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A

        "finalizationPeriodSeconds": 12, // 604800

        "proxyAdminOwner": `${ADMIN}`, // 0x7871d1187A97cbbE40710aC119AA3d412944e4Fe
        "baseFeeVaultRecipient": `${ADMIN}`, // 0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa
        "l1FeeVaultRecipient": `${ADMIN}`, // 0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa
        "sequencerFeeVaultRecipient": `${ADMIN}`, // 0xa3d596EAfaB6B13Ab18D40FaE1A962700C84ADEa

        "baseFeeVaultMinimumWithdrawalAmount": "0x8ac7230489e80000", // 0x8ac7230489e80000
        "l1FeeVaultMinimumWithdrawalAmount": "0x8ac7230489e80000", // 0x8ac7230489e80000
        "sequencerFeeVaultMinimumWithdrawalAmount": "0x8ac7230489e80000", // 0x8ac7230489e80000
        "baseFeeVaultWithdrawalNetwork": 0, // 0
        "l1FeeVaultWithdrawalNetwork": 0, // 0
        "sequencerFeeVaultWithdrawalNetwork": 0, // 0

        "gasPriceOracleOverhead": 2100, // 188
        "gasPriceOracleScalar": 1000000, // 684000

        "enableGovernance": true, // true
        "governanceTokenName": "Optimism", // Optimism
        "governanceTokenSymbol": "OP", // OP
        "governanceTokenOwner": `${ADMIN}`, // 0x5C4e7Ba1E219E47948e6e3F55019A647bA501005


        "l2GenesisBlockGasLimit": "0x1c9c380", // 0x1c9c380
        "l2GenesisBlockBaseFeePerGas": "0x3b9aca00", // 0x3b9aca00
        "l2GenesisRegolithTimeOffset": "0x0", // 0x0

        "eip1559Denominator": 50, // 50
        "eip1559Elasticity": 10,  // 6
    }


    return template;
}