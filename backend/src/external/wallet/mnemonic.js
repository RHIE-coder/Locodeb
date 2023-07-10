import { ethers } from 'ethers';

export function validateMnemonic(mnemonic) {
    const words = mnemonic.match(/[a-zA-Z]+/g).length;
    validLen = [12, 15, 18, 24];
    if (!validLen.includes(words)) {
        throw RangeError(`The mnemonic [${mnemonic}] is the wrong number of words`);
    }
    return true;
}

export function generateMnemonic() {
    return ethers.Wallet.createRandom().mnemonic.phrase;
}