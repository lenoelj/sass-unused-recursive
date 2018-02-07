const { assert } = require("chai");
const unusedChecker = require("../lib");
const path = require("path");

describe("unusedChecker()", function () {
    it("should find unused variables", function (done) {
        const entryPoint = path.resolve("./fixtures/main.scss");
        const includePaths = [ path.resolve("./fixtures/deep/include") ];

        unusedChecker(entryPoint, includePaths)
            .catch(function ({ unused }) {
                unused = unused.map(variable => variable.name);

                assert.deepEqual(unused, [
                    // 'not-used', // <-- defined in include paths
                    'bar-not-used',
                    'btn-color-not-used',
                    // 'mixin-color-not-used', // <-- mixin
                    // 'less-than-pluto-not-used' // <-- mixin
                ]);

                done();
            });
    });
});