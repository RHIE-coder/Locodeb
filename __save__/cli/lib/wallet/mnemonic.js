const ethers = require('ethers')

module.exports.validateMnemonic = function (mnemonic) {
    const words = mnemonic.match(/[a-zA-Z]+/g).length;
    validLen = [12, 15, 18, 24];
    if (!validLen.includes(words)) {
        throw RangeError(`The mnemonic [${mnemonic}] is the wrong number of words`);
    }
    return true;
}

module.exports.generateMnemonic = function () {
    return ethers.Wallet.createRandom().mnemonic.phrase;
}