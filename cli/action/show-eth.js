const signerHandler = require("./common/signerHandler");
const ethers = require('ethers')

module.exports = function() {
    const signerList = signerHandler.SIGNER_LIST;
    const signers = Object.entries(signerList);
    signers.forEach(async ([k, v]) => {
        const balance = await v.getBalance();
        console.log(k, ethers.utils.formatUnits(balance.toString(),"ether"))
    })
}