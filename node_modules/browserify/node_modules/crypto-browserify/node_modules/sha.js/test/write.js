var tape = require('tape')
var write = require('../util').write
var hexpp = require('../hexpp')
var u = require('../util')

function toBuffer (string) {
  var a = new Uint8Array(string.length)
  for(var i = 0; i < string.length; i++)
    a[i] = string.charCodeAt(i)
  return a
}

var zero = '0'.charCodeAt(0)
var A    = 'a'.charCodeAt(0)

var HELLOTHERE = new Uint8Array([
    104, 101, 108, 108,
    111, 32, 116, 104,
    101, 114, 101, 46
  ])

var FOOBARBAZ = new Uint8Array([
    102, 111, 111,
    98, 97, 114,
    98, 97, 112
  ])

var FOO = toBuffer('foo')
var BAR = toBuffer('bar')
var BAZ = toBuffer('baz')

var FOO64 = FOO.toString('base64')
var BAR64 = BAR.toString('base64')
var BAZ64 = BAZ.toString('base64')

var FOOx = FOO.toString('hex')
var BARx = BAR.toString('hex')
var BAZx = BAZ.toString('hex')

tape('hello there, ascii', function (t) {
  var expected = HELLOTHERE
  var actual = new Uint8Array(12)

  write(actual, 'hello there.', 'ascii', 0, 0, 12)

  console.log(hexpp(actual.buffer))
  console.log(hexpp(expected.buffer))

//  t.deepEqual(expected.buffer, actual.buffer)
  equal(t, actual.buffer, expected.buffer)
  t.end()
})

tape('foobarbaz, ascii', function (t) {
  var actual = new Uint8Array(9)
  var expected = FOOBARBAZ
  write(actual, 'foo', 'ascii', 0, 0, 3)
  write(actual, 'bar', 'ascii', 3, 0, 3)
  write(actual, 'baz', 'ascii', 6, 0, 3)
  console.log(hexpp(actual.buffer))
  equal(t, actual.buffer, expected.buffer)
  t.end()
})

console.log(FOO64, BAR64, BAZ64)

function equal(t, a,b) {
  t.equal(a.length, b.length)
  for(var i = 0; i < a.length; i++)
    t.equal(a[i], b[i])
}

tape('foobarbaz, ascii', function (t) {
  var actual = new Uint8Array(9)
  var expected = FOOBARBAZ
  write(actual, FOO, null, 0, 0, 3)
  write(actual, BAR, null, 3, 0, 3)
  write(actual, BAZ, null, 6, 0, 3)
  equal(t, actual.buffer, expected.buffer)
  t.end()
})

tape('foobarbaz, hex', function (t) {
  var actual = new Uint8Array(9)
  var expected = FOOBARBAZ
  write(actual, FOOx, 'hex', 0, 0, 3)
  write(actual, BARx, 'hex', 3, 0, 3)
  write(actual, BAZx, 'hex', 6, 0, 3)
  equal(t, actual.buffer, expected.buffer)
  t.end()
})


