let postcss = require("postcss");

class UnusedVarsError extends Error {
    constructor(unused, ...params) {
        super(...params);
        this.unused = unused;
    }
}

module.exports = postcss.plugin("unusedVariables", function () {
    return function (css) {
        let usedVariables = {};
        let unusedVariables = [];

        css.walkRules(rule => {
            rule.nodes.forEach(node => {
                if (node.value && node.value.startsWith("$")) {
                    usedVariables[node.value] = usedVariables[node.value]++ || 1;
                }
            });
        });

        css.walkDecls(decl => {
            if (!decl.prop.startsWith("$")) {
                return;
            }

            if (!usedVariables[decl.prop]) {
                unusedVariables.push(decl.prop);
            }
        });

        if (unusedVariables.length) {
            throw new UnusedVarsError(unusedVariables);
        }
    }
});