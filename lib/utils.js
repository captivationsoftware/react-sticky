module.exports = {
  copy: function(dest, source) {
    for (var rule in source) {
      dest[rule] = source[rule];
    };
    return dest;
  }
}
