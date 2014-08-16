var assert      = require('assert');
var browserify  = require('browserify');
var coffeeify   = require('coffeeify');
var reactify    = require('../index');

describe('reactify', function() {

  function bundle(entry, cb) {
    return browserify(entry, {basedir: __dirname})
      .transform(coffeeify)
      .transform(reactify)
      .bundle(cb);
  };

  function assertContains(bundle, code) {
    assert(bundle.indexOf(code) > -1, "bundle does not contain: " + code);
  }

  it('works for *.js with pragma', function(done) {
    bundle('./fixtures/main.js', function(err, result) {
      assert(!err);
      assert(result);
      assertContains(result, 'React.DOM.h1(null, "Hello, world!")');
      done();
    });
  });

  it('works for *.jsx', function(done) {
    bundle('./fixtures/main.jsx', function(err, result) {
      assert(!err);
      assert(result);
      assertContains(result, 'React.DOM.h1(null, "Hello, world!")');
      done();
    });
  });

  it('works for plain *.js', function(done) {
    bundle('./fixtures/simple.js', function(err, result) {
      assert(!err);
      assert(result);
      assertContains(result, 'React.DOM.h1(null, "Hello, world!")');
      done();
    });
  });

  it('works for *.coffee', function(done) {
    bundle('./fixtures/coffee.coffee', function(err, result) {
      assert(!err);
      assert(result);
      assertContains(result, 'React.DOM.span({class: "caret"})');
      done();
    });
  });

  it('returns error on invalid JSX', function(done) {
    bundle('./fixtures/invalid.js', function(err, result) {
      assert(err);
      assertContains(String(err), 'Parse Error: Line 6: Unexpected token');
      assert(!result);
      done();
    });
  });

  describe('transforming files with extensions others than .js/.jsx', function() {

    it('activates via extension option', function(done) {
      browserify('./fixtures/main.jsnox', {basedir: __dirname})
        .transform({extension: 'jsnox'}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'React.DOM.h1(null, "Hello, world!")');
          done();
        });
    });

    it('activates via x option', function(done) {
      browserify('./fixtures/main.jsnox', {basedir: __dirname})
        .transform({x: 'jsnox'}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'React.DOM.h1(null, "Hello, world!")');
          done();
        });
    });

    it('activates via everything option', function(done) {
      browserify('./fixtures/main.jsnox', {basedir: __dirname})
        .transform({everything: true}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'React.DOM.h1(null, "Hello, world!")');
          done();
        });
    });

  });

  describe('transforming with es6 visitors', function() {

    it('activates via es6 option', function(done) {
      browserify('./fixtures/main.es6.jsx', {basedir: __dirname})
        .transform({es6: true}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'var func = function(x)  {return React.DOM.div(null, x)');
          done();
        });
    });

    it('activates via harmony option', function(done) {
      browserify('./fixtures/main.es6.jsx', {basedir: __dirname})
        .transform({harmony: true}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'var func = function(x)  {return React.DOM.div(null, x)');
          done();
        });
    });

  });

  describe('transforming with custom visitors', function() {

    it('activates via es6 option', function(done) {
      browserify('./fixtures/main.es6-custom.jsx', {basedir: __dirname})
        .transform({visitors: 'es6-module-jstransform/visitors'}, reactify)
        .bundle(function(err, result) {
          assert(!err);
          assert(result);
          assertContains(result, 'var qs = require(\'querystring\');');
          assertContains(result, 'return React.DOM.div(null);');
          done();
        });
    });
  });

});
