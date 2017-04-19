const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaders = [
  {
    "test": /\.js$/,
    "exclude": /node_modules/,
    "loader": "babel-loader",
    "query": {
      "presets": [
        "babel-preset-es2015",
        "babel-preset-react",
        "babel-preset-stage-0"
      ],
      "plugins": [
        "babel-plugin-transform-class-properties"
      ]
    }
  }
];

module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve('examples', 'basic', 'basic.js'),
  output: {
    path: path.resolve('examples', 'basic'),
    filename: 'basic.min.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('examples', 'basic', 'index.tpl.html'),
      filename: 'index.html',
      inject: false
    })
  ],
  module: {
    loaders: loaders
  }
};
