const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    basic: path.resolve('examples', 'basic', 'basic.js'),
    'basic-footer': path.resolve('examples', 'basic-footer', 'basic-footer.js'),
    relative: path.resolve('examples', 'relative', 'relative.js'),
    stacked: path.resolve('examples', 'stacked', 'stacked.js'),
    'stacked-footer': path.resolve('examples', 'stacked-footer', 'stacked-footer.js')
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
