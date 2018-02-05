let sassGraph = require('sass-graph');
let sassUnused = require("sass-unused2");

function resolveTree(tree, filePath, result = []) {
    result = result.slice();

    let context = tree[filePath];
    let imports = context.imports;

    imports.forEach(function (importPath) {
        result = result.concat(resolveTree(tree, importPath));
    });

    return result.concat(imports);
}

module.exports = function (location, paths) {
    return new Promise(function (resolve, reject) {
        let depTree = sassGraph.parseFile(location, {
            loadPaths: paths,
            follow: true
        });

        let files = resolveTree(depTree.index, location);
        files.push(location);

        let unused = sassUnused.findUnused(files);

        if (unused.length) {
            reject({ unused });
        } else {
            resolve();
        }
    });
};