(function() {
  module.exports = function(size) {
    var bytes = new Buffer(size); //in browserify, this is an extended Uint8Array
    /* This will not work in older browsers.
     * See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
     */
    crypto.getRandomValues(bytes);
    return bytes;
  }
}())
