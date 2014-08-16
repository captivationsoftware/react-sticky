"use strict";

var docblock        = require('jstransform/src/docblock');
var transform       = require('jstransform').transform;
var reactTransform  = require('react-tools').transform;
var visitors        = require('react-tools/vendor/fbtransform/visitors');
var through         = require('through');

var isJSXExtensionRe = /^.+\.jsx$/;

function parsePragma(data) {
  return docblock.parseAsObject(docblock.extract(data));
}

function process(file, isJSXFile, transformer) {
  transformer = transformer || reactTransform;

  var data = '';
  function write(chunk) {
    return data += chunk;
  }

  function compile() {
    // jshint -W040
    var isJSXPragma = parsePragma(data).jsx !== undefined;

    if (isJSXFile || isJSXPragma) {
      if (!isJSXPragma) {
        data = '/** @jsx React.DOM */' + data;
      }
      try {
        var transformed = transformer(data);
        this.queue(transformed);
      } catch (error) {
        error.name = 'ReactifyError';
        error.message = file + ': ' + error.message;
        error.fileName = file;

        this.emit('error', error);
      }
    } else {
      this.queue(data);
    }
    return this.queue(null);
    // jshint +W040
  }

  return through(write, compile);
}

function getExtensionsMatcher(extensions) {
  return new RegExp('\\.(' + extensions.join('|') + ')$');
}

module.exports = function(file, options) {
  options = options || {};

  var isJSXFile;

  if (options.everything) {

    isJSXFile = true;
  } else {

    var extensions = ['jsx']
      .concat(options.extension)
      .concat(options.x)
      .filter(Boolean)
      .map(function(ext) { return ext[0] === '.' ? ext.slice(1) : ext });

    isJSXFile = getExtensionsMatcher(extensions).exec(file);
  }

  var transformVisitors = [].concat(
    options.harmony || options.es6 ?
      visitors.getAllVisitors() :
      visitors.transformVisitors.react);

  if (options.visitors) {
    [].concat(options.visitors).forEach(function(id) {
      transformVisitors = require(id).visitorList.concat(transformVisitors);
    });
  }

  function transformer(source) {
    return transform(transformVisitors, source).code;
  }

  return process(file, isJSXFile, transformer);
};
module.exports.process = process;
module.exports.isJSXExtensionRe = isJSXExtensionRe;
