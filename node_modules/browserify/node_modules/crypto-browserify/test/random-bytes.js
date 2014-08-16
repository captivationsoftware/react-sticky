var test = require('tape')
var crypto = require('../')

test('randomBytes', function (t) {
    t.plan(5);
    t.equal(crypto.randomBytes(10).length, 10);
    t.ok(crypto.randomBytes(10) instanceof Buffer);
    crypto.randomBytes(10, function(ex, bytes) {
        t.error(ex);
        t.equal(bytes.length, 10);
        t.ok(bytes instanceof Buffer);
        t.end();
  });
});


