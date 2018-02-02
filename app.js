let path = require("path");
let unusedChecker = require("./lib");

const location = path.resolve("./fixtures/main.scss");
const paths = [
    path.resolve("./fixtures/deep/include")
];

unusedChecker(location, paths)
    .then(function () {
        console.log("No errors :)");
    })
    .catch(function (e) {
        console.log("Yep, there are errors", e.unused);
    });