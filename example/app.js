let sassUnused = require('../lib');

let result = sassUnused({
    entries: "./fixtures/themes",
    includePaths: "./fixtures/vendor",
    exclude: [ "vendor" ]
});

console.log('Unused variables are:\n');
console.log(JSON.stringify(result, null, 4));