const signerHandler = require("./common/signerHandler");

module.exports = function() {
    const signerList = signerHandler.SIGNER_LIST;
    for(const [k, v] of Object.entries(signerList)) {
        console.log(`${k} : ${v.address}`)
    }
}