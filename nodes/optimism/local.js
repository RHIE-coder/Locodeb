const {
    OptimismError
} = require('../../errors')

require('dotenv').config({
    path: require('path').join(__dirname, '.env.local'),
});

function envCheckAndParse() {

    const CHECK_LIST = [
        {
            L1_RPC_URL:[
                'L1_RPC',
                'ETH_RPC_URL',
            ],
        },
        'L1_RPC_KIND',
        'L2_RPC_URL',
        'L2_CHAIN_ID',
        'ADMIN',
        {
            ADMIN_KEY:'PRIVATE_KEY'
        },
        'SEQUENCER',
        {
            SEQUENCER_KEY:'SEQ_KEY'
        },
        'BATCHER',
        'BATCHER_KEY',
        'PROPOSER',
        'PROPOSER_KEY',
        'DEPLOYMENT_CONTEXT',
    ];


    const PRASE_AND_CHECK_TARGET = CHECK_LIST;

    key=>{
        if(!process.env[key]) {
            throw new OptimismError(`${key} is not set in the .env.local file`)
        }
    })

     

}


module.exports = (_action) => {

}