import blockchain from '../blockchain/index.js';
import ethers from 'ethers';
import optimismSDK from '@eth-optimism/sdk';
// import optimismContract from '@eth-optimism/contracts';
// import optimismContract from '@eth-optimism/contracts';

const LOCAL_L1_URL = "http://127.0.0.1:8545";
const LOCAL_L2_URL = "http://127.0.0.1:9545";
const JUNK_MNEMONIC  = "test test test test test test test test test test test junk";
const JUNK2_MNEMONIC = "slim female tumble swing acquire course return attitude build citizen wise seminar";
    //0xa7558AE65e40edDcaeC34bc1DED7C25297EA7CF2
const SOURCE_MNEMONIC = JUNK2_MNEMONIC

export const L1Signer = blockchain.Wallet.signer.connectProviderWithSigner({
    signer: blockchain.Wallet.signer.createSignerByMnemonic(SOURCE_MNEMONIC),
    url: LOCAL_L1_URL,
    type: 'jsonrpc',
})

export const L2Signer = blockchain.Wallet.signer.connectProviderWithSigner({
    signer: blockchain.Wallet.signer.createSignerByMnemonic(SOURCE_MNEMONIC),
    url: LOCAL_L2_URL,
    type: 'jsonrpc',
})


export const localSigner = blockchain.Wallet.signer.connectProviderWithSigner({
    signer: blockchain.Wallet.signer.createSignerByMnemonic(SOURCE_MNEMONIC),
    url: "http://192.168.100.73:8999",
    type: 'jsonrpc',
})

export function from(signerName) {

    let signer;

    if (signerName === "l1") {
        signer = L1Signer;
    } else if (signerName === "l2") {
        signer = L2Signer;
    } else if (signerName === "local") {
        signer = localSigner;
    } else if (signerName === "skip") {
    } else {
        throw new Error("the signer should be l1, l2, local")
    }

    return async function (actionName) {
        const cb = actions[actionName];
        await cb(signer);
    }
}

export const actions = {
    async aba() {
        // const targetAddress ="0x6900000000000000000000000000000000000003";
        const targetAddress ="0x0000000000000000000000000000000000000000";
        const L1Res = await L1Signer.provider.getBalance(targetAddress);
        const L2Res = await L2Signer.provider.getBalance(targetAddress);
        console.log("address: " + targetAddress)
        const ethFormat = (response) => ethers.utils.formatUnits(response.toString(), 'ether');
        console.log("L1: " + ethFormat(L1Res) + " ETH")
        console.log("L2: " + ethFormat(L2Res) + " ETH")
    },
    async ab() {
        const L1Res = await L1Signer.getBalance();
        const L2Res = await L2Signer.getBalance();
        console.log("address: " + L1Signer.address)
        const ethFormat = (response) => ethers.utils.formatUnits(response.toString(), 'ether');
        console.log("L1: " + ethFormat(L1Res) + " ETH")
        console.log("L2: " + ethFormat(L2Res) + " ETH")
    },
    async getBalance(signer) {
        const response = await signer.getBalance();
        const ethStrForm = ethers.utils.formatUnits(response.toString(), 'ether');
        console.log(ethStrForm);
    },
    async getBalanceBy(signer) {
        // const address = '0x0000000000000000000000000000000000000000'
        // const address = '0x6900000000000000000000000000000000000003'
        // const address = '0x0000000000000000000000000000000000000000'
        const response = await signer.provider.getBalance(address);
        const ethStrForm = ethers.utils.formatUnits(response.toString(), 'ether');
        console.log(ethStrForm);
    },

    async sendETH(signer) {

        // const recipientAddress = '0x0000000000000000000000000000000000000000';
        // const recipientAddress = '0x6900000000000000000000000000000000000003'
        const recipientAddress = '0xa7558AE65e40edDcaeC34bc1DED7C25297EA7CF2'
        const eth = 11


        const amount = ethers.utils.parseUnits(eth.toString(), 'ether');

        const transferInfo = {
            to: recipientAddress,
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

    },

    async txInfo(signer) {

        const targetTxHash = '0x90f701dccf7b439be429a4a6beb48a648a681ae576ce7a7771581afc4b46988a'
        const txRec = await signer.provider.getTransaction(targetTxHash);
        const txCnt = await signer.getTransactionCount();
        const output = {
            transaction_info: txRec,
            transaction_count: txCnt,
        }

        console.log(JSON.stringify(output, null, 4))
    },
    async info() {
                // Global variable because we need them almost everywhere
        let crossChainMessenger
        let addr    // Our address
        const gwei = BigInt(1e9)
        const eth = gwei * gwei   // 10^18  
        const reportBalances = async () => {
            const l1Balance = (await crossChainMessenger.l1Signer.getBalance()).toString().slice(0, -9)
            const l2Balance = (await crossChainMessenger.l2Signer.getBalance()).toString().slice(0, -9)

            console.log(`On L1:${l1Balance} Gwei    On L2:${l2Balance} Gwei`)
        }    // reportBalances

        const setup = async () => {
            addr = L1Signer.address
            crossChainMessenger = new optimismSDK.CrossChainMessenger({
                // l1ChainId: 5,    // Goerli value, 1 for mainnet
                // l2ChainId: 420,  // Goerli value, 10 for mainnet
                l1ChainId: 900,    // Goerli value, 1 for mainnet
                l2ChainId: 901,  // Goerli value, 10 for mainnet
                l1SignerOrProvider: L1Signer,
                l2SignerOrProvider: L2Signer,
            })
        }    // setup

        await setup();
        console.log(JSON.stringify(crossChainMessenger.contracts.l1, null, 4))
    },
    async depositeth() {
        // Global variable because we need them almost everywhere
        let crossChainMessenger
        let addr    // Our address
        const gwei = BigInt(1e9)
        const eth = gwei * gwei   // 10^18  
        const reportBalances = async () => {
            const l1Balance = (await crossChainMessenger.l1Signer.getBalance()).toString().slice(0, -9)
            const l2Balance = (await crossChainMessenger.l2Signer.getBalance()).toString().slice(0, -9)

            console.log(`On L1:${l1Balance} Gwei    On L2:${l2Balance} Gwei`)
        }    // reportBalances

        const setup = async () => {
            addr = L1Signer.address
            crossChainMessenger = new optimismSDK.CrossChainMessenger({
                // l1ChainId: 5,    // Goerli value, 1 for mainnet
                // l2ChainId: 420,  // Goerli value, 10 for mainnet
                l1ChainId: 900,    // Goerli value, 1 for mainnet
                l2ChainId: 901,  // Goerli value, 10 for mainnet
                l1SignerOrProvider: L1Signer,
                l2SignerOrProvider: L2Signer,
            })
        }    // setup
        const depositETH = async () => {

            console.log("Deposit ETH")
            await reportBalances()
            const start = new Date()
            const response = await crossChainMessenger.depositETH(1n * eth)
            console.log(`Transaction hash (on L1): ${response.hash}`)
            await response.wait()
            console.log("Waiting for status to change to RELAYED")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.waitForMessageStatus(response.hash,
                optimismSDK.MessageStatus.RELAYED)
            console.log(`depositETH took ${(new Date() - start) / 1000} seconds\n\n`)
        }     // depositETH()

        await setup()
        await depositETH()
    },
    async withdraweth() {
                // Global variable because we need them almost everywhere
        let crossChainMessenger
        let addr    // Our address
        const gwei = BigInt(1e9)
        const eth = gwei * gwei   // 10^18  
        const reportBalances = async () => {
            const l1Balance = (await crossChainMessenger.l1Signer.getBalance()).toString().slice(0, -9)
            const l2Balance = (await crossChainMessenger.l2Signer.getBalance()).toString().slice(0, -9)

            console.log(`On L1:${l1Balance} Gwei    On L2:${l2Balance} Gwei`)
        }    // reportBalances

        const setup = async () => {
            addr = L1Signer.address
            crossChainMessenger = new optimismSDK.CrossChainMessenger({
                // l1ChainId: 5,    // Goerli value, 1 for mainnet
                // l2ChainId: 420,  // Goerli value, 10 for mainnet
                l1ChainId: 900,    // Goerli value, 1 for mainnet
                l2ChainId: 901,  // Goerli value, 10 for mainnet
                l1SignerOrProvider: L1Signer,
                l2SignerOrProvider: L2Signer,
            })
        }    // setup
        const withdrawETH = async () => {

            console.log("Withdraw ETH")
            const start = new Date()
            await reportBalances()

            const response = await crossChainMessenger.withdrawETH(1n *eth)
            console.log(`Transaction hash (on L2): ${response.hash}`)
            console.log(`\tFor more information: https://goerli-optimism.etherscan.io/tx/${response.hash}`)
            await response.wait()

            console.log("Waiting for status to be READY_TO_PROVE")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.waitForMessageStatus(response.hash,
                optimismSDK.MessageStatus.READY_TO_PROVE)
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.proveMessage(response.hash)


            console.log("In the challenge period, waiting for status READY_FOR_RELAY")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.waitForMessageStatus(response.hash,
                optimismSDK.MessageStatus.READY_FOR_RELAY)
            console.log("Ready for relay, finalizing message now")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.finalizeMessage(response.hash)

            console.log("Waiting for status to change to RELAYED")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.waitForMessageStatus(response,
                optimismSDK.MessageStatus.RELAYED)

            await reportBalances()
            console.log(`withdrawETH took ${(new Date() - start) / 1000} seconds\n\n\n`)
        }     // withdrawETH()

                await setup()
        await withdrawETH()
    },
    async crossDomBridgeETH() {
        // const words = process.env.MNEMONIC.match(/[a-zA-Z]+/g).length
        // validLength = [12, 15, 18, 24]
        // if (!validLength.includes(words)) {
        //     console.log(`The mnemonic (${process.env.MNEMONIC}) is the wrong number of words`)
        //     process.exit(-1)
        // }

        // const l1Url = `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_ALCHEMY_KEY}`
        // const l2Url = `https://opt-goerli.g.alchemy.com/v2/${process.env.OP_GOERLI_ALCHEMY_KEY}`

        const l1Url = `http://127.0.0.1:8545`
        const l2Url = `http://127.0.0.1:9545`

        // Global variable because we need them almost everywhere
        let crossChainMessenger
        let addr    // Our address


        const setup = async () => {
            addr = L1Signer.address
            crossChainMessenger = new optimismSDK.CrossChainMessenger({
                // l1ChainId: 5,    // Goerli value, 1 for mainnet
                // l2ChainId: 420,  // Goerli value, 10 for mainnet
                l1ChainId: 900,    // Goerli value, 1 for mainnet
                l2ChainId: 901,  // Goerli value, 10 for mainnet
                l1SignerOrProvider: L1Signer,
                l2SignerOrProvider: L2Signer,
            })
        }    // setup



        const gwei = BigInt(1e9)
        const eth = gwei * gwei   // 10^18
        const centieth = eth / 100n


        const reportBalances = async () => {
            const l1Balance = (await crossChainMessenger.l1Signer.getBalance()).toString().slice(0, -9)
            const l2Balance = (await crossChainMessenger.l2Signer.getBalance()).toString().slice(0, -9)

            console.log(`On L1:${l1Balance} Gwei    On L2:${l2Balance} Gwei`)
        }    // reportBalances


        const depositETH = async () => {

            console.log("Deposit ETH")
            await reportBalances()
            const start = new Date()

            const response = await crossChainMessenger.depositETH(1000n * gwei)
            console.log(`Transaction hash (on L1): ${response.hash}`)
            await response.wait()
            console.log("Waiting for status to change to RELAYED")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.waitForMessageStatus(response.hash,
                optimismSDK.MessageStatus.RELAYED)

            await reportBalances()
            console.log(`depositETH took ${(new Date() - start) / 1000} seconds\n\n`)
        }     // depositETH()





        const withdrawETH = async () => {

            console.log("Withdraw ETH")
            const start = new Date()
            await reportBalances()

            const response = await crossChainMessenger.withdrawETH(centieth)
            console.log(`Transaction hash (on L2): ${response.hash}`)
            console.log(`\tFor more information: https://goerli-optimism.etherscan.io/tx/${response.hash}`)
            await response.wait()

            console.log("Waiting for status to be READY_TO_PROVE")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.waitForMessageStatus(response.hash,
                optimismSDK.MessageStatus.READY_TO_PROVE)
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.proveMessage(response.hash)


            console.log("In the challenge period, waiting for status READY_FOR_RELAY")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.waitForMessageStatus(response.hash,
                optimismSDK.MessageStatus.READY_FOR_RELAY)
            console.log("Ready for relay, finalizing message now")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.finalizeMessage(response.hash)

            console.log("Waiting for status to change to RELAYED")
            console.log(`Time so far ${(new Date() - start) / 1000} seconds`)
            await crossChainMessenger.waitForMessageStatus(response,
                optimismSDK.MessageStatus.RELAYED)

            await reportBalances()
            console.log(`withdrawETH took ${(new Date() - start) / 1000} seconds\n\n\n`)
        }     // withdrawETH()


        await setup()
        await depositETH()
        await withdrawETH()

    },

    async opCtrInfo() {
        console.log(optimismSDK)
    },
}