const ethers = require('ethers');
const signerHandler = require("./common/signerHandler");
const addressHandler = require("./common/addressHandler");

module.exports = async(args) => {
    const chainLayer = args[0];
    const signerName = args[1];

    const signer = signerHandler.parseSigner(`${chainLayer}_${signerName}`)

    const toAddress = addressHandler.ADDRESS_LIST[args[2].toUpperCase()] ?? args[2];
    const amount = ethers.utils.parseUnits(args[3], 'ether');

    const transferInfo = {
        to: toAddress,
        value: amount,
    };

    const nonce = await signer.getTransactionCount()
    const estimateGas = await signer.estimateGas(transferInfo);
    const expectGasUsing = BigInt(estimateGas)
    const fee = await signer.getFeeData()
    const maxFeePerGas = fee.maxFeePerGas ? BigInt(fee.maxFeePerGas) : 0n;
    const maxPriorityFeePerGas = fee.maxPriorityFeePerGas ? BigInt(fee.maxPriorityFeePerGas) : 0n;
    const transaction = {
        type: 2,
        chainId: (await signer.provider.getNetwork()).chainId,
        ...transferInfo,
        nonce: nonce,
        gasLimit: expectGasUsing,
        maxPriorityFeePerGas,
        maxFeePerGas
    };
    const signedTransaction = await signer.signTransaction(transaction);
    console.log("signed tx: " + signedTransaction)

    const transactionResponse = await signer.provider.sendTransaction(signedTransaction);
    console.log("hash: " + transactionResponse.hash)
}