import blockchain from '../blockchain/index.js';
import ethers from 'ethers';
const LOCAL_L1_URL="http://127.0.0.1:8545";
const LOCAL_L2_URL="http://127.0.0.1:9545";
const JUNK_MNEMONIC="test test test test test test test test test test test junk";


(async()=>{

    const L1Signer = blockchain.Wallet.signer.connectProviderWithSigner({
        signer: blockchain.Wallet.signer.createSignerByMnemonic(JUNK_MNEMONIC),
        url: LOCAL_L1_URL,
        type: 'jsonrpc',
    })

    const localSigner = L1Signer;

    // const tx = await localSigner.provider.getTransactionByHash('0xc76c9f06114ab08dd0378d5fe64b7239e34c24ad07c21d8e8cab1197e620577f')
    // console.log(tx);
    // const blockNumber = await localSigner.provider.getBlockNumber();
    // console.log(blockNumber); //173266
    setInterval(async ()=>{
        try{
            const cnt = await localSigner.getTransactionCount();
            await eip1559()
            console.log(cnt)
        } catch(e) {
            console.log(e)
        }
    }, 2000)
})()


async function eip1559(){

    // const L1Signer = blockchain.Wallet.signer.connectProviderWithSigner({
    //     signer: blockchain.Wallet.signer.createSignerByMnemonic(JUNK_MNEMONIC),
    //     url: LOCAL_L1_URL,
    //     type: 'jsonrpc',
    // })
    const L2Signer = blockchain.Wallet.signer.connectProviderWithSigner({
        signer: blockchain.Wallet.signer.createSignerByMnemonic(JUNK_MNEMONIC),
        url: LOCAL_L2_URL,
        type: 'jsonrpc',
    })
    // const localSigner = blockchain.Wallet.signer.connectProviderWithSigner({
    //     signer: blockchain.Wallet.signer.createSignerByMnemonic(GANACHE_MNEMONIC),
    //     url: "http://192.168.100.73:8999",
    //     type: 'jsonrpc',
    // });
    const localSigner = L2Signer;

    // console.log(localSigner.provider)
    // const temp = await localSigner.provider.getBalance('0x0000000000000000000000000000000000000000')
    // console.log(ethers.utils.formatUnits(temp.toString(),'ether'));
    const temp2= await localSigner.getBalance()
    console.log(ethers.utils.formatUnits(BigInt(temp2),'ether'));
    console.log("address :" + localSigner.address)
    // return 
    // const recipientAddress = '0xd5a38dD251Aa8493C03954268FF851290051E634';
    const recipientAddress = '0x0000000000000000000000000000000000000000';
    const amount = ethers.utils.parseUnits('1', 'ether');

    const transferInfo = {
        to: recipientAddress,
        value: amount,
    };

    const nonce = await localSigner.getTransactionCount()
    const estimateGas = await localSigner.estimateGas(transferInfo);
    const expectGasUsing = BigInt(estimateGas)
    const fee = await localSigner.getFeeData()
    const maxFeePerGas = fee.maxFeePerGas ? BigInt(fee.maxFeePerGas) : 0n;
    const maxPriorityFeePerGas = fee.maxPriorityFeePerGas ? BigInt(fee.maxPriorityFeePerGas) : 0n;
    const gasPrice = BigInt(fee.gasPrice);
    console.log(expectGasUsing)
    console.log(fee)
    console.log(maxFeePerGas)
    console.log(maxPriorityFeePerGas)
    console.log(gasPrice)

    const transaction = {
        type: 2,
        chainId: (await localSigner.provider.getNetwork()).chainId,
        ...transferInfo,
        nonce: nonce,
        gasLimit: expectGasUsing,
        // gasPrice: gasPrice
        maxPriorityFeePerGas,
        maxFeePerGas
    };
    const signedTransaction = await localSigner.signTransaction(transaction);
    console.log(signedTransaction)

    const transactionResponse = await localSigner.provider.sendTransaction(signedTransaction);
    console.log(transactionResponse)
    const temp3= await localSigner.getBalance()
    console.log(ethers.utils.formatUnits(BigInt(temp3),'ether'));
    console.log("address :" + localSigner.address)
}


async function back() {
        const localSigner = blockchain.Wallet.signer.connectProviderWithSigner({
        signer: blockchain.Wallet.signer.createSignerByMnemonic(GANACHE_MNEMONIC),
        url: "http://192.168.100.73:8999",
        type: 'jsonrpc',
    });

    // const recipientAddress = '0xd5a38dD251Aa8493C03954268FF851290051E634';
    const recipientAddress = '0x0000000000000000000000000000000000000000';
    const amount = ethers.utils.parseUnits('111', 'ether');

    const transferInfo = {
        to: recipientAddress,
        value: amount,
    };

    const nonce = await localSigner.getTransactionCount()
    const estimateGas = await localSigner.estimateGas(transferInfo);
    const expectGasUsing = BigInt(estimateGas)
    const fee = await localSigner.getFeeData()
    const maxFeePerGas = fee.maxFeePerGas ? BigInt(fee.maxFeePerGas) : 0n;
    const maxPriorityFeePerGas = fee.maxPriorityFeePerGas ? BigInt(fee.maxPriorityFeePerGas) : 0n;
    const gasPrice = BigInt(fee.gasPrice);
    // console.log(ethers.utils.parseUnits((gasPrice * expectGasUsing).toString(), 'gwei'))
    // console.log(ethers.utils.formatUnits((gasPrice * expectGasUsing).toString(), 'ether'))
    // console.log(0x017dfcdece4000.toString())
    // console.log(parseInt("0x017dfcdece4000",16))

    const transaction = {
        ...transferInfo,
        nonce: nonce,
        gasLimit: expectGasUsing,
        gasPrice: gasPrice
    };
    const signedTransaction = await localSigner.signTransaction(transaction);
    console.log(signedTransaction)

    const transactionResponse = await localSigner.provider.sendTransaction(signedTransaction);
    console.log(transactionResponse)
}