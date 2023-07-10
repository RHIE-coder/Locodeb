const ethers = require('ethers');
const signerHandler = require("./common/signerHandler");
const optimismSDK = require('@eth-optimism/sdk');

module.exports = async(args) => {
    const L1SignerName = args[0];
    const L2SignerName = args[1];

    const L1Signer = signerHandler.parseSigner(`l1_${L1SignerName}`)
    const L2Signer = signerHandler.parseSigner(`l2_${L2SignerName}`)

    crossChainMessenger = new optimismSDK.CrossChainMessenger({
        // l1ChainId: 5,    // Goerli value, 1 for mainnet
        // l2ChainId: 420,  // Goerli value, 10 for mainnet
        l1ChainId: 900,    // Goerli value, 1 for mainnet
        l2ChainId: 901,  // Goerli value, 10 for mainnet
        l1SignerOrProvider: L1Signer,
        l2SignerOrProvider: L2Signer,
    })
    const amount = ethers.utils.parseUnits(args[2], 'ether');
    const start = new Date()
    const response = await crossChainMessenger.withdrawETH(amount)
    console.log(`Transaction hash (on L2): ${response.hash}`)
    await response.wait()

    console.log("Waiting for status to be READY_TO_PROVE")
    console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
    await crossChainMessenger.waitForMessageStatus(response.hash,
        optimismSDK.MessageStatus.READY_TO_PROVE)
    console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
    await crossChainMessenger.proveMessage(response.hash)


    console.log("In the challenge period, waiting for status READY_FOR_RELAY")
    console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
    await crossChainMessenger.waitForMessageStatus(response.hash,
        optimismSDK.MessageStatus.READY_FOR_RELAY)
    console.log("Ready for relay, finalizing message now")
    console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
    await crossChainMessenger.finalizeMessage(response.hash)

    console.log("Waiting for status to change to RELAYED")
    console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
    await crossChainMessenger.waitForMessageStatus(response,
        optimismSDK.MessageStatus.RELAYED)

    console.log(`withdrawETH took ${(new Date() - start) / 1000} seconds\n\n\n`)
}