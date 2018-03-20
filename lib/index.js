let sassGraph = require("sass-graph");
let sassUnused = require("@orbit-tech/sass-unused");
let uniq = require("lodash.uniq");
let flatten = require("lodash.flatten");
let path = require("path");
let fs = require("fs");
let intersection = require("lodash.intersection");

const defaults = {
    includePaths: [],
    exclude: []
};

function resolveTree(tree, filePath, result = []) {
    result = result.slice();

    let context = tree[filePath];
    let imports = context.imports;

    imports.forEach(function (importPath) {
        result = result.concat(resolveTree(tree, importPath));
    });

    return uniq(result.concat(imports));
}

function findUnused(filePath, config) {
    let { includePaths } = config;

    let depTree = sassGraph.parseFile(filePath, {
        loadPaths: includePaths,
        follow: true
    });

    let files = resolveTree(depTree.index, filePath);
    files.push(filePath);

    let { vars, mixins, functions } = sassUnused.findUnused(files);

    if (config.exclude.includes("vendors")) {
        // @TODO: Smarter paths compare - might not be absolute
        // p.relative('/c/ddd/ddd/dd.js', '/c/ddd').split('\\').every(p => p == '..')
        vars = vars.filter(({ path }) => !includePaths.some(includePath => path.startsWith(includePath)));
    }

    let unused = [...vars];

    if (!config.exclude.includes("mixins")) {
        unused.push(...mixins);
    }

    if (!config.exclude.includes("functions")) {
        unused.push(...functions);
    }

    return unused.map(variable => variable.name);
}

function intersectCommons(unused) {
    let entriesKeys = Object.keys(unused);
    let unusedByEntries = [];

    entriesKeys.forEach(function (entryKey) {
        unusedByEntries.push(unused[entryKey]);
    });

    let result = {};

    let common = intersection(...unusedByEntries);
    if (common.length) {
        result.__common = common;
    }

    entriesKeys.forEach(function (entryKey, index) {
        entryKey = unused[entryKey].filter(el => !common.includes(el));

        if (entryKey.length) {
            result[entriesKeys[index]] = entryKey;
        }
    });

    return result;
}

module.exports = function (options) {
    let config = Object.assign({}, defaults, options);

    if (typeof options.entry === "string") {
        return findUnused(options.entry, config);
    }

    const validOptions = ["vendors", "mixins", "functions"];
    let invalidExcludes = options.exclude.filter(option => !validOptions.includes(option));

    if (invalidExcludes.length) {
        throw new Error(`\nInvalid 'exclude' value(s): ${invalidExcludes}\nValid options are: ${validOptions.join(', ')}\n`);
    }

    let { entries } = config;
    let entriesDir = entries;
    entries = fs.readdirSync(entries);

    let result = {};
    entries.forEach(function (entry) {
        result[entry] = findUnused(path.resolve(`${entriesDir}/${entry}`), config);
    });

    result = intersectCommons(result);

    return result;
};