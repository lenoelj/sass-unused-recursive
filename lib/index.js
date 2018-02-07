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

module.exports = function (filePath, includePaths) {
    return new Promise(function (resolve, reject) {
        let depTree = sassGraph.parseFile(filePath, {
            loadPaths: includePaths,
            follow: true
        });

        let files = resolveTree(depTree.index, filePath);
        files.push(filePath);

        files = uniq(files);

        let { vars } = sassUnused.findUnused(files);

        vars = vars.filter(({ path }) => !includePaths.some(includePath => path.startsWith(includePath)));

        if (vars.length) {
            reject({ unused: vars });
        } else {
            resolve();
        }
    });
};