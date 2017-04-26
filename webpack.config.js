const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    basic: path.resolve('examples', 'basic', 'basic.js'),
    bottom: path.resolve('examples', 'bottom', 'bottom.js'),
    relative: path.resolve('examples', 'relative', 'relative.js'),
    // timeline: path.resolve('examples', 'timeline', 'timeline.js')
  },
  output: {
    path: path.join(__dirname, 'examples'),
    filename: '[name]/[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
