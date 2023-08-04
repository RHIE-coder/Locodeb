const ethers = require('ethers');
const signerHandler = require("./common/signerHandler");
const optimismSDK = require('@eth-optimism/sdk');
const erc20abi = require("./common/erc20abi");
const l2erc20abi = require("./common/L2erc20abi");


const L1_CONTRACT_ADDRESS = "0x56c8d298f270E200645F01A3E4fD474C9F169430";
const L2_CONTRACT_ADDRESS = "0x247cA0CCacC1d098178da58Df584020a3B736Cb4";

module.exports = async(args) => {
    const L1SignerName = args[0];
    const L2SignerName = args[1];

    const L1Signer = signerHandler.parseSigner(`l1_${L1SignerName}`)
    const L2Signer = signerHandler.parseSigner(`l2_${L2SignerName}`)
    const l1Contract = new ethers.Contract(L1_CONTRACT_ADDRESS, erc20abi, L1Signer.provider)
    const l2Contract = new ethers.Contract(L2_CONTRACT_ADDRESS, l2erc20abi, L2Signer.provider)

    crossChainMessenger = new optimismSDK.CrossChainMessenger({
        // l1ChainId: 5,    // Goerli value, 1 for mainnet
        // l2ChainId: 420,  // Goerli value, 10 for mainnet
        l1ChainId: 900,    // Goerli value, 1 for mainnet
        l2ChainId: 901,  // Goerli value, 10 for mainnet
        l1SignerOrProvider: L1Signer,
        l2SignerOrProvider: L2Signer,
        l1ERC20: l1Contract, 
        l2ERC20: l2Contract,
    })
    const balance1 = await l1Contract.balanceOf(L1Signer.address)
    console.log(`L1 Balance(${L1Signer.address}):`, balance1.toString());

    const balance2 = await l2Contract.balanceOf(L2Signer.address)
    console.log(`L2 Balance(${L2Signer.address}):`, balance2.toString());

    const start = new Date()

    const response = await crossChainMessenger.withdrawERC20(
        L1_CONTRACT_ADDRESS, L2_CONTRACT_ADDRESS, 100n)
    console.log(`Transaction hash (on L2): ${response.hash}`)
    await response.wait()

    console.log("Waiting for status to be READY_TO_PROVE")
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)
    await crossChainMessenger.waitForMessageStatus(response.hash, 
        optimismSDK.MessageStatus.READY_TO_PROVE)
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)  
    await crossChainMessenger.proveMessage(response.hash)
    

    console.log("In the challenge period, waiting for status READY_FOR_RELAY") 
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)
    await crossChainMessenger.waitForMessageStatus(response.hash, 
                                                    optimismSDK.MessageStatus.READY_FOR_RELAY) 
    console.log("Ready for relay, finalizing message now")
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)  
    await crossChainMessenger.finalizeMessage(response.hash)

    console.log("Waiting for status to change to RELAYED")
    console.log(`Time so far ${(new Date()-start)/1000} seconds`)  
    await crossChainMessenger.waitForMessageStatus(response, 
        optimismSDK.MessageStatus.RELAYED)
    console.log(`withdrawERC20 took ${(new Date()-start)/1000} seconds\n\n\n`)  

    const balance11 = await l1Contract.balanceOf(L1Signer.address)
    console.log(`L1 Balance(${L1Signer.address}):`, balance11.toString());

    const balance22 = await l2Contract.balanceOf(L2Signer.address)
    console.log(`L2 Balance(${L2Signer.address}):`, balance22.toString());
     

}