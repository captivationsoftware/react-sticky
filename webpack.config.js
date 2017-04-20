const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    basic: path.resolve('examples', 'basic', 'basic.js'),
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
