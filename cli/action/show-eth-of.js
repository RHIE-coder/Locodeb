const signerHandler = require("./common/signerHandler");
const addressHandler = require("./common/addressHandler");
const ethers = require('ethers')

module.exports = async function(args) {
    const l1Signer = signerHandler.parseSigner(`l1_junk`);
    const l2Signer = signerHandler.parseSigner(`l2_junk`);
    const who = addressHandler.ADDRESS_LIST[args[0].toUpperCase()] ?? args[0];

    const l1Balance = await l1Signer.provider.getBalance(who);
    const l2Balance = await l2Signer.provider.getBalance(who);
    console.log(`L1 ${who}: ${ethers.utils.formatUnits(l1Balance.toString(),'ether')}`)
    console.log(`L2 ${who}: ${ethers.utils.formatUnits(l2Balance.toString(),'ether')}`)
}