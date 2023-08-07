const {
  ADMIN,
  SEQUENCER,
  PROPOSER,
  BATCHER,
  L1_URL,
  L2_URL,
} = require('./info.json')

const axios = require('axios');

async function parseHexToNumber(hexString) {
  return parseInt(hexString, 16)
}

async function main() {

  const ethChainId = {
    jsonrpc:"2.0",
    method:"eth_chainId",
    params:[],
    id:1,
  }

  const res = await axios.post(L1_URL, ethChainId)
  const chainId = await parseHexToNumber(res.data.result)

}

main();

// const source = {
//   "numDeployConfirmations": 1,

//   "finalSystemOwner": `${ADMIN}`,
//   "portalGuardian": `${ADMIN}`,
//   "controller": `${ADMIN}`,

//   "l1StartingBlockTag": `${BLOCKHASH}`,

//   "l1ChainID": 5777,
//   "l2ChainID": 42069,
//   "l2BlockTime": 2,

//   "maxSequencerDrift": 600,
//   "sequencerWindowSize": 3600,
//   "channelTimeout": 300,

//   "p2pSequencerAddress": `${SEQUENCER}`,
//   "batchInboxAddress": "0xff00000000000000000000000000000000042069",
//   "batchSenderAddress": `${BATCHER}`,

//   "l2OutputOracleSubmissionInterval": 120,
//   "l2OutputOracleStartingBlockNumber": 0,
//   "l2OutputOracleStartingTimestamp": `${TIMESTAMP}`,

//   "l2OutputOracleProposer": `${PROPOSER}`,
//   "l2OutputOracleChallenger": `${ADMIN}`,

//   "finalizationPeriodSeconds": 12,

//   "proxyAdminOwner": `${ADMIN}`,
//   "baseFeeVaultRecipient": `${ADMIN}`,
//   "l1FeeVaultRecipient": `${ADMIN}`,
//   "sequencerFeeVaultRecipient": `${ADMIN}`,

//   "baseFeeVaultMinimumWithdrawalAmount": "0x8ac7230489e80000",
//   "l1FeeVaultMinimumWithdrawalAmount": "0x8ac7230489e80000",
//   "sequencerFeeVaultMinimumWithdrawalAmount": "0x8ac7230489e80000",
//   "baseFeeVaultWithdrawalNetwork": 0,
//   "l1FeeVaultWithdrawalNetwork": 0,
//   "sequencerFeeVaultWithdrawalNetwork": 0,

//   "gasPriceOracleOverhead": 2100,
//   "gasPriceOracleScalar": 1000000,

//   "enableGovernance": true,
//   "governanceTokenSymbol": "OP",
//   "governanceTokenName": "Optimism",
//   "governanceTokenOwner": `${ADMIN}`,

//   "l2GenesisBlockGasLimit": "0x1c9c380",
//   "l2GenesisBlockBaseFeePerGas": "0x3b9aca00",
//   "l2GenesisRegolithTimeOffset": "0x0",

//   "eip1559Denominator": 50,
//   "eip1559Elasticity": 10
// }

// console.log(JSON.stringify(source, null, 4))