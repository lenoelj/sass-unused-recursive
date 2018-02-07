const { assert } = require("chai");
const unusedChecker = require("../lib");
const path = require("path");

const entryPoint = path.resolve("./fixtures/_main.scss");
const includePaths = [ path.resolve("./fixtures/vendor") ];

describe("unusedChecker()", function () {
    it("should ignore mixins, functions, includes", function (done) {
        unusedChecker(entryPoint, {
            includePaths,
            exclude: [
                "includes",
                "mixins",
                "functions"
            ]
        }).catch(function ({ unused }) {
            assert.deepEqual(unused, [
                'bar-not-used',
                'btn-color-not-used'
            ]);

            done();
        });
    });

    it("should log variables from exclude", function (done) {
        unusedChecker(entryPoint, {
            includePaths,
            exclude: [
                "mixins",
                "functions"
            ]
        }).catch(function ({ unused }) {
            assert.deepEqual(unused, [
                'not-used', // <-- defined in include paths
                'bar-not-used',
                'btn-color-not-used'
            ]);

            done();
        });
    });

    it("should log variables from exclude", function (done) {
        unusedChecker(entryPoint, {
            includePaths,
        }).catch(function ({ unused }) {
            assert.deepEqual(unused, [
                'not-used', // <-- defined in include paths
                'bar-not-used',
                'btn-color-not-used',
                'mixin-color-not-used', // <-- mixin
                'less-than-pluto-not-used' // <-- mixin
            ]);

            done();
        });
    });
});