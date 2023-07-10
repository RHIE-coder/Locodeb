const path = require('path');
require('dotenv').config({
    path:path.join(__dirname,"..", "..",".env"),
});
const Wallet = require('../../lib/wallet');
const JUNK_MNEMONIC = process.env['JUNK_MNEMONIC'];
const USER_MNEMONIC = process.env['USER_MNEMONIC'];
const config = require('../../config');
const L1_URL = config.Network.LOCAL_L1_BLOCKCHAIN_URL;
const L2_URL = config.Network.LOCAL_L2_BLOCKCHAIN_URL;


const SIGNER_LIST = {
    L1JunkSigner: Wallet.Signer.connectProviderWithSigner({
        signer: Wallet.Signer.createSignerByMnemonic(JUNK_MNEMONIC),
        url: L1_URL,
        type: 'jsonrpc',
    }),
    L2JunkSigner: Wallet.Signer.connectProviderWithSigner({
        signer: Wallet.Signer.createSignerByMnemonic(JUNK_MNEMONIC),
        url: L2_URL,
        type: 'jsonrpc',
    }),
    L1UserSigner: Wallet.Signer.connectProviderWithSigner({
        signer: Wallet.Signer.createSignerByMnemonic(USER_MNEMONIC),
        url: L1_URL,
        type: 'jsonrpc',
    }),
    L2UserSigner: Wallet.Signer.connectProviderWithSigner({
        signer: Wallet.Signer.createSignerByMnemonic(USER_MNEMONIC),
        url: L2_URL,
        type: 'jsonrpc',
    }),
}

function parseSigner(who) {
    if (who) {
        who = who.toLowerCase();
    }
    switch(who) {
        case "l1_junk":
            return SIGNER_LIST.L1JunkSigner;
        case "l2_junk":
            return SIGNER_LIST.L2JunkSigner;
        case "l1_user":
            return SIGNER_LIST.L1UserSigner;
        case "l2_user":
            return SIGNER_LIST.L2UserSigner;
    }

    return null;
}

module.exports = {
    SIGNER_LIST,
    parseSigner,
}