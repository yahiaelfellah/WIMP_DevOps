const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    server: "./index.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
  },
  target:  ["node"],
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
    ]
  },
  module: {
    rules: [
      {
        // Transpiles ES6-8 into ES5
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      { test: /\.node$/, use: "node-loader" },
      //   {
      //     // Loads the javacript into html template provided.
      //     // Entry point is set below in HtmlWebPackPlugin in Plugins
      //     test: /\.html$/,
      //     use: [{loader: "html-loader"}]
      //   }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: "security/tls", to: "security/tls" }],
    }),

    new WebpackBar(),

  ],
};
