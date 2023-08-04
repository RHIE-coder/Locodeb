const ethers = require('ethers');
const optimismSDK = require('@eth-optimism/sdk');
const optimismContractBedrock = require('@eth-optimism/contracts-bedrock');
const signerHandler = require("./common/signerHandler");

module.exports = async(args) => {
    // console.log(optimismSDK.CONTRACT_ADDRESSES['10']);

    const L1GanacheSigner = signerHandler.L1GanacheSigner;

    console.log(optimismSDK);
    console.log("=====================================")
    console.log("=====================================")
    console.log("=====================================")
    // console.log(optimismContractBedrock.predeploys)
    console.log(optimismContractBedrock);

    [
        "L1CrossDomainMessenger",
        "L1ERC721Bridge",
        "L1StandardBridge",
        "L2OutputOracle",
        "OptimismPortal",
        "ResourceMetering",
        "SystemConfig",
    ].forEach(async contractname=>{
        const contractInfo = optimismContractBedrock.getContractFactory(contractname)
        const bytecode = contractInfo.bytecode;

        /* 
            L1CrossDomainMessenger <-- OptimismPortal
        
        */


        process.exit(0)
    })

    console.log()
}