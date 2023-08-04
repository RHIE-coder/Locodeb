(async()=>{
    const actionName = process.argv[2];
    const args = process.argv.slice(3);

    await require(`./action/${actionName}`)(args)
})()