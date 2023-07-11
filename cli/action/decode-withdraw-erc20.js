const ethers = require('ethers');
const optimismSDK = require('@eth-optimism/sdk');
const optimismContractBedrock = require('@eth-optimism/contracts-bedrock')
const signerHandler = require('./common/signerHandler')

// withdraw txhash : 0xaa22ee92f93ad4fdcee11df3428b31ba45c951d89ad021b68c8bab346ee9e99f
module.exports = async(args) => {
    const L2ChainId = 901
    const L2ContractName = 'L2StandardBridge'

    const contractAddress = optimismSDK.CONTRACT_ADDRESSES[L2ChainId.toString()].l2[L2ContractName];
    console.log(`L2StandardBridge address: ${contractAddress}`);
    const targetTxHash = args[0]
    const l2Signer = signerHandler.parseSigner(`l2_junk`);

    const l2TxInfo = await l2Signer.provider.getTransaction(targetTxHash);
    if(contractAddress !== l2TxInfo.to) {
        new ReferenceError("wrong address")
    }
    console.log(`L2 -> L1 Withdraw ETH: ${JSON.stringify(l2TxInfo, null, 4)}`)
    const calldata = l2TxInfo.data
    const abi = optimismContractBedrock.getContractDefinition('L2StandardBridge').abi

    const contract = new ethers.Contract(contractAddress, abi, l2Signer.provider);
    const functionSelector = calldata.slice(0, 10); // Extract the function selector (first 4 bytes)
    const parsedData = contract.interface.decodeFunctionData(functionSelector, calldata);
    console.log(parsedData);
    console.log("value[ETH]: " + ethers.utils.formatUnits(l2TxInfo.value, "ether"))

    const contractInterface = new ethers.utils.Interface(abi);
    const functionName = contractInterface.getFunction(functionSelector).name
    console.log('function selector: ' + functionName)
}