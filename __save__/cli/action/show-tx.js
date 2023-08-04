const signerHandler = require("./common/signerHandler");

module.exports = async(args) => {

    const targetTxHash = args[0]
    const l1Signer = signerHandler.parseSigner(`l1_junk`);
    const l2Signer = signerHandler.parseSigner(`l2_junk`);

    const l1TxInfo = await l1Signer.provider.getTransaction(targetTxHash);
    const l2TxInfo = await l2Signer.provider.getTransaction(targetTxHash);
    console.log(`L1: ${JSON.stringify(l1TxInfo, null, 4)}`)
    console.log(`L2: ${JSON.stringify(l2TxInfo, null, 4)}`)
}