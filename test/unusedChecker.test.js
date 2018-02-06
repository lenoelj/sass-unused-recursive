const { assert } = require("chai");
const unusedChecker = require("../lib");
const path = require("path");

describe("unusedChecker()", function () {
    function test(sass, expectedUnused) {
        const resolve = _ => sass;
        assert.deepEqual(findUnused(["test.scss"], resolve), expectedUnused);
    }

    it("should find unused variables", function (done) {
        const location = path.resolve("./fixtures/main.scss");
        const paths = [ path.resolve("./fixtures/deep/include") ];

        unusedChecker(location, paths)
            .catch(function ({ unused }) {
                assert.deepEqual(unused, [
                    'not-used',
                    'bar',
                    'btn-color',
                    'color',
                    'orb-t-less-than-pluto'
                ]);
            })
            .then(done);
    });
});