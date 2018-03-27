# Sass unused variables check

[![Build Status](https://travis-ci.org/orbit-tech/sass-unused-recursive.png?branch=master)](https://travis-ci.org/orbit-tech/sass-unused-recursive)

This tool will help you determine variables which are not defined in your Sass (Syntactically awesome stylesheets) project.

* It resolves the dependencies in _import statements_ then validates those same import statements using [sass-graph](https://www.npmjs.com/package/sass-graph).
* It resolves and validates _included paths_ in your project.

## Install

Add `sass-unused-recursive` into your project as a developer dependency.

``` sh
npm install @orbit-tech/sass-unused-recursive --save-dev
```

## Usage

Create a file which imports `sass-unused-recursive` library and then you can validate your project by passing the location of the entry file:

``` js
let sassUnused = require('@orbit-tech/sass-unused-recursive');

let result = sassUnused('./path/to/entry/file.scss'); // [ 'unused-variable-one' ]
```


## Options

All options are passed as an object in the first argument. Let's assume following directory structure:

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

Specify the path of the scss entry file:

Type: String

``` js
let result = sassUnused({
    entry: './_main.scss'
});
```

### entries

Sometimes you might have multiple entries for your code. If this is the case, you can validate them all by defining a path to the themes directory:

Type: String

``` js
let result = sassUnused({
    entries: './themes'
});
```

### includePaths

When your code contains external include paths to other directories, you can also configure those:

Type: Array<String>

``` js
let result = sassUnused({
    includePaths: [ './vendor' ]
});
```

### exclude

Use this option to filter the results from unused _mixins_, _functions_ or _vendor_ definitions:

Type: Array<'functions', 'mixins', 'vendor'>

``` js
let result = sassUnused({
    exclude: [ 'functions', 'mixins', 'vendor' ]
});
```

## Example

A fully configured example for the files in the [fixtures directory](./fixtures) structure is defined [above](#options) (see also [example/app.js](./example/app.js)):

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

You can run this example by executing the following command:

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

## Running the tests

You can run the tests by executing the following commands:

``` sh
git clone git@github.com:orbit-tech/sass-unused-recursive.git
cd sass-unused-recursive
npm install
npm test
```
## Contributing to the project

Thanks for reading this far. If you have any improvements to suggest for this project, please raise an issue/pull request.
