const { assert } = require("chai");
const unusedChecker = require("../lib");
const path = require("path");

describe("unusedChecker()", function () {
    it("should find unused variables", function (done) {
        const location = path.resolve("./fixtures/main.scss");
        const paths = [ path.resolve("./fixtures/deep/include") ];

        unusedChecker(location, paths)
            .catch(function ({ unused }) {
                assert.deepEqual(unused, [
                    'not-used',
                    'bar-not-used',
                    'btn-color-not-used',
                    'mixin-color-not-used',
                    'less-than-pluto-not-used'
                ]);
            })
            .then(done);
    });
});