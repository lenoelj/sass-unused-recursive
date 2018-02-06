# Unused variables check

* Works with scss
* Support _@import_;

``` bash
npm i
node app.js # you should see two validation errors
```

## How to use

``` js
let unusedChecker = require("sass-unused-recursive");

const location = path.resolve("./fixtures/main.scss");
const paths = [];

unusedChecker(location, paths)
    .then(function () {
        console.log("No errors :)");
    })
    .catch(function (e) {
        console.log("Yep, there are errors", e.unused);
    });
```