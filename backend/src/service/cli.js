import * as mod from "./mod.js";

(async()=>{
    const signerName = process.argv[2];
    const actionName = process.argv[3];
    await mod.from(signerName)(actionName)
})()