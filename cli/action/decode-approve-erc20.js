const ethers = require('ethers');
const optimismSDK = require('@eth-optimism/sdk');
const optimismContractBedrock = require('@eth-optimism/contracts-bedrock')
const signerHandler = require('./common/signerHandler')
const erc20abi = require("./common/erc20abi");
const l2erc20abi = require("./common/L2erc20abi");

const L1_CONTRACT_ADDRESS = "0x56c8d298f270E200645F01A3E4fD474C9F169430";
const L2_CONTRACT_ADDRESS = "0x247cA0CCacC1d098178da58Df584020a3B736Cb4";
// allowance txhash : 0x530dfbd96dfb8fe1f204d3cad387acc2e77aa7d03430a69f3988e7865e4a32b2
// deposit txhash : 0xb6a0c3b19df43363f743147b8a2ae5d8112215c04b9d7b87c0900307f5abf21f
module.exports = async(args) => {
    // const L2ChainId = 901
    // const L1ContractName = 'L1StandardBridge'
    // const contractAddress = optimismSDK.CONTRACT_ADDRESSES[L2ChainId.toString()].l1[L1ContractName];
    // console.log(`L1StandardBridge address: ${contractAddress}`);
    const targetTxHash = args[0]
    const l1Signer = signerHandler.parseSigner(`l1_junk`);

    const l1TxInfo = await l1Signer.provider.getTransaction(targetTxHash);
    console.log(`L1 -> L2 Deposit ERC20: ${JSON.stringify(l1TxInfo, null, 4)}`)
    const calldata = l1TxInfo.data
    const functionSelectorHex = calldata.slice(0, 10); // Extract the function selector (first 4 bytes)

    // Create an instance of the Interface class
    const abiInterface = new ethers.utils.Interface(erc20abi);

    // Decode the function signature and get the function fragment
    const functionFragment = abiInterface.getFunction(functionSelectorHex);

    // Get the function name from the fragment
    const functionName = functionFragment.name;

    // Print the function name
    console.log('Function Name:', functionName);

    const contract = new ethers.Contract(L1_CONTRACT_ADDRESS, erc20abi, l1Signer.provider);
    const parsedData = contract.interface.decodeFunctionData(functionSelectorHex, calldata);
    console.log(parsedData);
    console.log("value[ETH]: " + ethers.utils.formatUnits(l1TxInfo.value, "ether"))

}