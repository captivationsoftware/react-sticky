//var tape = require('tape')
//var Sha1 = require('../')
var fs   = require('fs')
var path = require('path')
var to   = require('bops/typedarray/to')
var from = require('bops/typedarray/from')
var assert = require('assert')
var crypto = require('crypto')

//function pad(n, w) {
//  n = n + ''; return new Array(w - n.length + 1).join('0') + n;
//}
//
var dir = path.join(__dirname, 'vectors')

var vectors =
  fs.readdirSync(dir)
    .sort()
    .filter(function (t) {
      return t.match(/\.dat$/);
    })
    .map(function (t) {
      return from(fs.readFileSync(path.join(dir, t), 'base64'), 'base64')
    });


  var expected = []
  var hashes = {}
   
  ;['sha1', 'sha256', 'md5'].forEach(function (name) {
      hashes[name] =
        fs.readFileSync(path.join(dir, 'byte-hashes.' + name), 'ascii')
        .split(/\r?\n/)
  })

        


  for (var i = 0; i < vectors.length; i++) {
    expected.push({
      input  : to(vectors[i], 'base64'),
      sha1   : hashes.sha1[i],
      sha256 : hashes.sha256[i],
      md4    : hashes.md5[i]
    })
    assert.equal(
      crypto.createHash('sha1').update(new Buffer(vectors[i])).digest('hex'),
      hashes.sha1[i])

    assert.equal(
      crypto.createHash('sha256').update(new Buffer(vectors[i])).digest('hex'),
      hashes.sha256[i])

    assert.equal(
      crypto.createHash('md5').update(new Buffer(vectors[i])).digest('hex'),
      hashes.md5[i])

  }

//console.log(expected)

console.log(JSON.stringify(expected, null, 2))
