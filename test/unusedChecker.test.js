const { assert } = require("chai");
const unusedChecker = require("../lib");
const path = require("path");

const entry = path.resolve("./fixtures/_main.scss");
// const entryPoint = path.resolve("./fixtures/themes/_one.scss");
const includePaths = [ path.resolve("./fixtures/vendor") ];

describe("unusedChecker()", function () {
    it("should ignore mixins, functions, vendors", function () {
        let unused = unusedChecker({
            entry,
            includePaths, exclude: [ "vendors", "mixins", "functions" ]
        });
        assert.deepEqual(unused, [ "app-s-variable-not-used" ]);
    });

    it("should not ignore vendors", function () {
        let unused = unusedChecker({
            entry,
            includePaths, exclude: ["mixins", "functions"]
        });
        assert.deepEqual(unused, [
            'orb-s-vendor-variable-not-used',
            'orb-s-override-vendor-default-variable',
            'app-s-variable-not-used'
        ]);
    });

    it("should not ignore anything", function () {
        let unused = unusedChecker({ entry, includePaths });
        assert.deepEqual(unused, [
            'orb-s-vendor-variable-not-used', // <-- defined in include paths
            'orb-s-override-vendor-default-variable', // <-- defined in include paths
            'app-s-variable-not-used',
            'mixin-not-used'
        ]);
    });

    it("should handle multiple entries", function () {
        let unused = unusedChecker({
            entries: path.resolve("./fixtures/themes/"),
            includePaths,
            exclude: [ "vendors", "mixins", "functions" ]
        });

        assert.deepEqual(unused, {
            "__common": [
                "app-s-variable-not-used"
            ],
            "_one.scss": [
                "foo"
            ]
        });
    });
});