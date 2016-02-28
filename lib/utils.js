module.exports = {
  copy: function(dest, source) {
    for (var rule in source) {
      dest[rule] = source[rule];
    };
    return dest;
  },
  isDescendantOf: function(x, y) {
    var isAncestor = false;

    return isAncestor;
  }
}
