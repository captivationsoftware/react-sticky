const path = require("path");
const webpack = require("webpack");

module.exports = {
  devtool: "eval-source-map",
  entry: {
    demos: path.resolve("examples", "index.js")
  },
  output: {
    path: path.join(__dirname, "examples"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "examples"),
    publicPath: "/",
    compress: true,
    port: 9000,
    historyApiFallback: true
  }
};
