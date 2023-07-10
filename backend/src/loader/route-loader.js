const path = require("path");

module.exports = (app, args) => {
    const criteriaWord = '@'
    const urlDelimiter = '#'

    const route = require("express").Router();
    require("fs")
        .readdirSync(args.path, {withFileTypes:false})
        .map(file => path.basename(file, path.extname(file)))
        .forEach(file=> {
            const url = "/"+file.split(criteriaWord)[0].replaceAll(urlDelimiter,"/");
            const method = file.split(criteriaWord)[1];
            route[method](url, require(`${args.path}/${file}`));
        })
    app.use("/", route);
}