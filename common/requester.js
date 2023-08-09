const axios = require('axios');

module.exports.JsonRpc = class {

    regist() {

    }

    async dial() {

    }
}

    res = await axios.post(L1_ENDPOINT, ethBlockNumber);
    const blockNumber = await parseHexToNumber(res.data.result);
    const ethChainId = {
        jsonrpc: "2.0",
        method: "eth_chainId",
        params: [],
        id: 1,
    }

    const ethBlockNumber = {
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 2,
    }


    const ethGetBlockByNumber = {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [blockNumber, "finalized"],
        id: 3,
    }