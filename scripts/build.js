const path = require('path');
const { $cli } = require('../../../common/cliutils')
const fsAync = require('fs/promises');

async function localAction() {

    require('dotenv').config({path:path.join(__dirname, "local", ".envrc")})

    const adminPrivateKey = process.env.ADMIN;
    const sequencerPrivateKey = process.env.SEQUENCER;
    const proposerPrivateKey = process.env.PROPOSER;
    const batcherPrivateKey = process.env.BATCHER;

    const binDir = path.join(__dirname, "..", "bin")
    const opRootName = 'op';
    const bedrockPath = path.join(binDir, opRootName, "packages", "contracts-bedrock")
    try {
        await fsAync.access(binDir)
        console.log(`"bin" directory is already exists`);
    } catch {
        await $cli`mkdir bin ${path.join(__dirname, "..")}`;
    }

    let isOpDirExist;

    try {
        await fsAync.access(path.join(binDir, opRootName))
        isOpDirExist = true;
    } catch (e) {
        isOpDirExist = false;
    }

    if (isOpDirExist) {
        console.log(`"bin/op" already exists`);
    } else {
        await $cli`git clone https://github.com/ethereum-optimism/optimism op ${binDir}`;
        await $cli`pnpm install ${path.join(binDir, opRootName)}`;
        await $cli`make op-node op-batcher op-proposer ${path.join(binDir, opRootName)}`;
        await $cli`pnpm build ${path.join(binDir, opRootName)}`;
    }


    let isOpGethDirExist;

    try {
        await fsAync.access(path.join(binDir, "op-geth"))
        isOpGethDirExist = true;
    } catch (e) {
        isOpGethDirExist = false;
    }

    if (isOpGethDirExist) {
        console.log(`"bin/op-geth" already exists`);
    } else {
        await $cli`git clone https://github.com/ethereum-optimism/op-geth.git ${binDir}`;
        await $cli`make geth ${path.join(binDir, "op-geth")}`;

    }

    const localInfo = require("./local/info.json")

    const {
        ADMIN,
        SEQUENCER,
        PROPOSER,
        BATCHER,
        L1_BASE_URL,
        L1_PORT,
        L2_BASE_URL,
        L2_PORT,
        L2_CHAIN_ID,
    } = localInfo;

    let res = null;
    const L1_ENDPOINT = `${L1_BASE_URL}:${L1_PORT}`

    const ethChainId = {
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
    }

    res = await axios.post(L1_ENDPOINT, ethChainId);
    const L1_CHAIN_ID = await parseHexToNumber(res.data.result);

    const ethBlockNumber = {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 2,
    }

    res = await axios.post(L1_ENDPOINT, ethBlockNumber);
    const blockNumber = await parseHexToNumber(res.data.result);

    const ethGetBlockByNumber = {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [blockNumber, "finalized"],
        id: 3,
    }
    res = await axios.post(L1_ENDPOINT, ethGetBlockByNumber);
    const block = res.data.result;
    const BLOCKHASH = block.hash;
    const TIMESTAMP = await parseHexToNumber(block.timestamp);

    const localConfig = require("./local/config-template")({
        ADMIN,
        SEQUENCER,
        PROPOSER,
        BATCHER,
        L1_CHAIN_ID,
        L2_CHAIN_ID,
        BLOCKHASH,
        TIMESTAMP,
    })



    await $cli`mkdir deployments/getting-started ${bedrockPath}`;
    const deploy1 = `forge script scripts/Deploy.s.sol:Deploy --private-key ${adminPrivateKey} --broadcast --rpc-url ${L1_ENDPOINT}`;
    await $cli`${deploy1} ${bedrockPath}`
    const deploy2 = `forge script scripts/Deploy.s.sol:Deploy --sig 'sync()' --private-key ${adminPrivateKey} --broadcast --rpc-url ${L1_ENDPOINT}`;
    await $cli`${deploy2} ${bedrockPath}`
    // await fsAync.writeFile("dd.json", JSON.stringify(source, null, 4))

}


async function main() {
    const op = process.argv[2];

    switch (op) {
        case 'local':
            await localAction();
            break;
        default:
            throw new RangeError(`${op} is not valid action`)
    }
}

main()
