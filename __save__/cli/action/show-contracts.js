const optimismSDK = require('@eth-optimism/sdk');
const optimismContractBedrock = require('@eth-optimism/contracts-bedrock')
const optimismContract = require('@eth-optimism/contracts')


module.exports = async(args) => {
    const chainId = args[0]
    if (chainId === undefined){
        console.log(optimismSDK.CONTRACT_ADDRESSES)
    } else {
        const contractAddresses = optimismSDK.CONTRACT_ADDRESSES[chainId];
        console.log(contractAddresses)
    }
    console.log("----")
    console.log(optimismContractBedrock.predeploys)
    // console.log(optimismSDK.DEFAULT_L2_CONTRACT_ADDRESSES)
    console.log('====')
    console.log(optimismContract.predeploys)
}