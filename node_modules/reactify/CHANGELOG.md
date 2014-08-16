# CHANGELOG

## 0.11.0

  * add support for `--visitors` to allow additional jstransform visitors to be
    used for transformation.

## 0.10.0

  * add support for `--es6/--harmony` option to compile a limited set of es6
    into es5. Supported features are arrow functions, rest params, templates,
    object short notation and classes.

  * add support for `--everything` to apply transform to every module

## 0.9.1

  * fix mathcing filename for extension

## 0.9.0

  * bump jstransform to 0.9.0

## 0.8.0

  * bump react-tools version to 0.9.0

  * deprecate reactify/undoubted transform

  * -x/--extension command line option to process files with specified extension

## 0.7.0

  * bump jstransform version

## 0.6.1

  * fix transform function override

## 0.6.0

  * allow transform function to be passed as an argument

  * export isJSXExtension regexp

## 0.5.1

  * add "browserify-transform" keyword to package metadata

## 0.5.0

  * move react-tools from peer deps to deps, update to 0.8.0

## 0.4.0

  * update to react-tools 0.5.0
  * mention filename if transform error occurred
  * fix bug with callstack explosion

## 0.3.1

  * rewrite in javascript

## 0.3.0

  * reactify/no-doubt transform which doesn't not require pragma even for .js
    files

## 0.2.2

  * check for the presence of @jsx pragma

## 0.2.1

  * update to react-tools 0.4.1

## 0.2.0

  * update to react-tools 0.4.0

## 0.1.4

  * fix test for @jsx pragma

## 0.1.3

  * preserve line numbers during transform

## 0.1.2

  * emit error event on error

## 0.1.1

  * update to react-tools 0.3.1
  * specs

## 0.1.0

  * initial release
