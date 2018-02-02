let postcss = require("postcss");
let syntax = require("postcss-scss");
let path = require("path");
let fs = require("fs");
let sassyImport = require("postcss-sassy-import");

let unusedVariablesPlugin = require("./unusedVariables");

module.exports = function (location, paths) {
    let loadPaths = [
        origin => path.dirname(origin),
        ...paths.map(p => () => p)
    ];

    let css = fs.readFileSync(path.resolve(location), "utf8");


    return postcss()
        .use(sassyImport({
            loadPaths
        }))
        .process(css, {
            syntax: syntax,
            from: location,
        })
        .then(({ css }) => {
            return postcss([ unusedVariablesPlugin() ])
                .process(css, { syntax: syntax })
        });
};