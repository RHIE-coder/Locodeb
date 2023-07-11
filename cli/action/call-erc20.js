const erc20abi = require("./common/erc20abi")
const l2erc20abi = require("./common/L2erc20abi")
const ethers = require('ethers')
const signerHandler = require("./common/signerHandler");
const addressHandler = require("./common/addressHandler");

const L1_CONTRACT_ADDRESS = "0x56c8d298f270E200645F01A3E4fD474C9F169430";
const L2_CONTRACT_ADDRESS = "0x247cA0CCacC1d098178da58Df584020a3B736Cb4";
module.exports = async(args)=>{
    const who = addressHandler.ADDRESS_LIST[args[0].toUpperCase()] ?? args[0];
    const l1Signer = signerHandler.parseSigner(`l1_junk`);
    const l2Signer = signerHandler.parseSigner(`l2_junk`);
    

    const l1Contract = new ethers.Contract(L1_CONTRACT_ADDRESS, erc20abi, l1Signer.provider)

    const decimals1 = await l1Contract.decimals();
    console.log('L1 Decimals:', decimals1);

    const name1 = await l1Contract.name();
    console.log('L1 Name:', name1);

    const symbol1 = await l1Contract.symbol();
    console.log('L1 Symbol:', symbol1);

    const balance1 = await l1Contract.balanceOf(who)
    console.log('L1 Balance:', balance1.toString());
    console.log('===================')
    const l2Contract = new ethers.Contract(L2_CONTRACT_ADDRESS, l2erc20abi, l2Signer.provider)

    const decimals2 = await l2Contract.decimals();
    console.log('L2 Decimals:', decimals2);

    const name2 = await l2Contract.name();
    console.log('L2 Name:', name2);

    const symbol2 = await l2Contract.symbol();
    console.log('L2 Symbol:', symbol2);

    const balance2 = await l2Contract.balanceOf(who)
    console.log('L2 Balance:', balance2.toString());
}