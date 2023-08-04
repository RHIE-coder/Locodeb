import { ethers } from "ethers";

export function createSignerByMnemonic(mnemonic, index) {
    index = index ?? 0;
    const defaultPathForDeriving = `m/44'/60'/0'/0/${index}`;
    return ethers.Wallet.fromMnemonic(mnemonic, defaultPathForDeriving);
}

export function createSignerByPK(privateKey) {
    return new ethers.Wallet(privateKey);
}

/**
 *  config
 *  - signer
 *  - url
 *  - type
 */
export function connectProviderWithSigner(config) {

    let provider;

    switch(config.type) {
        case "jsonrpc":
            provider = new ethers.providers.JsonRpcProvider(config.url) 
    }

    if(provider === undefined) {
        throw new RangeError(`the provider is not set`)
    }

    return config.signer.connect(provider)
}