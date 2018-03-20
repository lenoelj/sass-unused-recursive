# SASS unused variables check

[![Build Status](https://travis-ci.org/orbit-tech/sass-unused-recursive.png?branch=master)](https://travis-ci.org/orbit-tech/sass-unused-recursive)

This tool will help you determine variables which are not defined in your sass project.

* It resolves dependencies import statements automatically by using [sass-graph](https://www.npmjs.com/package/sass-graph).
* Is resolves _included paths_ in your project.

## Install

``` sh
npm install @orbit-tech/sass-unused-recursive --save
```

## Usage

``` js
let sassUnused = require('@orbit-tech/sass-unused-recursive');

let result = sassUnused('./path/to/entry/file.scss'); // [ 'unused-variable-one' ]
```


## Options

All options are passed as an object in the first argument

Lets assume following directory structure:

```
├── theme.scss
├── themes                          <-- Theming
|  ├── _one.scss
|  └── _two.scss
├── vendor                          <-- This is included path (3rd party code)
|  └── orbit
|     ├── _components.scss
|     ├── _hello-component.scss
|     └── _settings.scss
├── _components.scss
├── _main.scss                      <-- Here is the entry file
├── _settings.scss
└── _tools.scss
```

### entry

Specify entry scss file

Type: String

``` js
let result = sassUnused({
    entry: './_main.scss'
});
```

### entries

Sometimes you might have a multiple entries for your code. You pass this as a directory to themes

Type: String

``` js
let result = sassUnused({
    entries: './themes'
});
```

### includePaths

When your code have external include paths defined, you can specify those.

Type: Array<String>

``` js
let result = sassUnused({
    includePaths: [ './vendor' ]
});
```

### exclude

This option allow you to trim down the results from unused mixins, functions or vendor. Vendor option will not tell you about unused variables which was **defined** in files from directories which was defined in _includePaths_ option.

Type: Array<'functions', 'mixins', 'vendor'>

``` js
let result = sassUnused({
    exclude: [ 'functions', 'mixins', 'vendor' ]
});
```

## Example

Fully configured example for directory structure defined above will looks as follow:

``` js
let sassUnused = require('@orbit-tech/sass-unused-recursive');

let result = sassUnused({
    entries: './fixtures/themes',
    includePaths: './fixtures/vendor',
    exclude: [ 'vendor' ]
});

console.log('Unused variables are:\n');
console.log(JSON.stringify(result, null, 4));
```

You can run example by executing following command:

``` sh
$ node example/app.js
Unused variables are:

{
    '__common': [                   <-- Those are variables which are not defined in every entry point
        'app-s-variable-not-used',
        'mixin-not-used'
    ],
    '_one.scss': [                  <-- Those are variables not defined in particular entry
        'foo'
    ]
}
```

## Running tests

``` sh
git clone git@github.com:orbit-tech/sass-unused-recursive.git
cd sass-unused-recursive
npm install
npm test
```
