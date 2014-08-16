# envify  [![Build Status](https://secure.travis-ci.org/hughsk/envify.png?branch=master)](http://travis-ci.org/hughsk/envify) [![stable](http://hughsk.github.io/stability-badges/dist/stable.svg)](http://github.com/hughsk/stability-badges) #

Selectively replace Node-style environment variables with plain strings.
Available as a standalone CLI tool and a
[Browserify](http://browserify.org) v2 transform.

Works best in combination with [uglifyify](http://github.com/hughsk/uglifyify).

## Installation ##

If you're using the module with Browserify:

``` bash
npm install envify browserify
```

Or, for the CLI:

``` bash
sudo npm install -g envify
```

## Usage ##

envify will replace your environment variable checks with ordinary strings -
only the variables you use will be included, so you don't have to worry about,
say, `AWS_SECRET_KEY` leaking through either. Take this example script:

``` javascript
if (process.env.NODE_ENV === "development") {
  console.log('development only')
}
```

After running it through envify with `NODE_ENV` set to `production`, you'll
get this:

``` javascript
if ("production" === "development") {
  console.log('development only')
}
```

By running this through a good minifier (e.g.
[UglifyJS2](https://github.com/mishoo/UglifyJS)), the above code would be
stripped out completely.

However, if you bundled the same script with `NODE_ENV` set to `development`:

``` javascript
if ("development" === "development") {
  console.log('development only')
}
```

The `if` statement will evaluate to `true`, so the code won't be removed.

## CLI Usage ##

With browserify:

``` bash
browserify index.js -t envify > bundle.js
```

Or standalone:

``` bash
envify index.js > bundle.js
```

You can also specify additional custom environment variables using
browserify's [subarg](http://github.com/substack/subarg) syntax, which is
available in versions 3.25.0 and above:

``` bash
browserify index.js -t [ envify --NODE_ENV development ] > bundle.js
browserify index.js -t [ envify --NODE_ENV production  ] > bundle.js
```

## Module Usage ##

**require('envify')**

Returns a transform stream that updates based on the Node process'
`process.env` object.

**require('envify/custom')([environment])**

If you want to stay away from your environment variables, you can supply
your own object to use in its place:

``` javascript
var browserify = require('browserify')
  , envify = require('envify/custom')
  , fs = require('fs')

var b = browserify('main.js')
  , output = fs.createWriteStream('bundle.js')

b.transform(envify({
  NODE_ENV: 'development'
}))
b.bundle().pipe(output)
```

## Contributors ##

* [hughsk](http://github.com/hughsk)
* [benjamn](http://github.com/benjamn)
* [zag2art](http://github.com/zag2art)
* [bjoerge](http://github.com/bjoerge)
* [andreypopp](http://github.com/andreypopp)
* [jupl](http://github.com/jupl)
