let sassGraph = require("sass-graph");
let sassUnused = require("sass-unused");
let uniq = require("lodash.uniq");

function resolveTree(tree, filePath, result = []) {
    result = result.slice();

    let context = tree[filePath];
    let imports = context.imports;

    imports.forEach(function (importPath) {
        result = result.concat(resolveTree(tree, importPath));
    });

    return result.concat(imports);
}

module.exports = function (filePath, options) {
    let defaults = {
        includePaths: [],
        exclude: []
    };

    let config = Object.assign({}, defaults, options);
    let { includePaths } = config;

    return new Promise(function (resolve, reject) {
        let depTree = sassGraph.parseFile(filePath, {
            loadPaths: includePaths,
            follow: true
        });

        let files = resolveTree(depTree.index, filePath);
        files.push(filePath);

        files = uniq(files);

        let { vars, mixins, functions } = sassUnused.findUnused(files);

        if (config.exclude.includes("includes")) {
            vars = vars.filter(({ path }) => !includePaths.some(includePath => path.startsWith(includePath)));
        }

        vars = vars.map(variable => variable.name);

        let unused = [...vars];

        if (!config.exclude.includes("mixins")) {
            unused.push(...mixins);
        }

        if (!config.exclude.includes("functions")) {
            unused.push(...functions);
        }

        if (unused.length) {
            reject({ unused: unused });
        } else {
            resolve();
        }
    });
};