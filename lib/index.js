let sassGraph = require("sass-graph");
let sassUnused = require("sass-unused");

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

        let unused = sassUnused.findUnused(files);

        if (unused.length) {
            reject({ unused });
        } else {
            resolve();
        }
    });
};