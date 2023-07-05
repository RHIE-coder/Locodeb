import * as OptimismSDK from '@eth-optimism/sdk';


/**
 * constructor
 *   - config
 *     - L1ChainId
 *     - L2ChainId
 *     - L1Signer
 *     - L2Signer
 */
export class OptimismAdaptor {

    constructor(config) {
        this.l1ChainId = config.L1ChainId;
        this.l2ChainId = config.L2ChainId;
        this.l1SignerOrProvider = config.L1Signer;
        this.l2SignerOrProvider = config.L2Signer;
    }

    setCrossChainMessenger() {
        this.crossChainMessenger = new OptimismSDK.CrossChainMessenger({
            l1ChainId : this.l1ChainId,
            l2ChainId : this.l2ChainId,
            l1SignerOrProvider : this.l1SignerOrProvider,
            l2SignerOrProvider : this.l2SignerOrProvider,
        })
    }
}