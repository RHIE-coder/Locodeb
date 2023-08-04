const ethers = require('ethers');
const optimismSDK = require('@eth-optimism/sdk');
const optimismContractBedrock = require('@eth-optimism/contracts-bedrock')
const signerHandler = require('./common/signerHandler')


// 0x2995139b1bac468d58a380fec4406e9de36324e7f186928ef339fe57aa8b9f24
module.exports = async(args) => {
    const L2ChainId = 901
    const L1ContractName = 'L1StandardBridge'

    const contractAddress = optimismSDK.CONTRACT_ADDRESSES[L2ChainId.toString()].l1[L1ContractName];
    console.log(`L1StandardBridge address: ${contractAddress}`);
    const targetTxHash = args[0]
    const l1Signer = signerHandler.parseSigner(`l1_junk`);

    const l1TxInfo = await l1Signer.provider.getTransaction(targetTxHash);
    if(contractAddress !== l1TxInfo.to) {
        new ReferenceError("wrong address")
    }
    console.log(`L1 -> L2 Deposit ETH: ${JSON.stringify(l1TxInfo, null, 4)}`)
    const calldata = l1TxInfo.data
    const abi = optimismContractBedrock.getContractDefinition('L1StandardBridge').abi

    const contract = new ethers.Contract(contractAddress, abi, l1Signer.provider);
    const functionSelector = calldata.slice(0, 10); // Extract the function selector (first 4 bytes)
    const parsedData = contract.interface.decodeFunctionData(functionSelector, calldata);
    console.log(parsedData);
    console.log("value[ETH]: " + ethers.utils.formatUnits(l1TxInfo.value, "ether"))

    const contractInterface = new ethers.utils.Interface(abi);
    const functionName = contractInterface.getFunction(functionSelector).name
    console.log('function selector: ' + functionName)
}