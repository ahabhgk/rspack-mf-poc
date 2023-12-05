const HtmlWebpackPlugin = require('html-webpack-plugin');
const PocPlugin = require("../../1.5/plugin");
const path = require('path');

const mfOptions = {
  name: 'app2',
  library: { type: 'var', name: 'app2' },
  filename: 'remoteEntry.js',
  exposes: {
    './appInjector': './src/appInjector',
  },
};

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    devMiddleware: {
      writeToDisk: true,
    },
    port: 3002,
  },
  devtool: false,
  output: {
    path: "./dist",
    publicPath: 'auto',
  },
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new PocPlugin(mfOptions),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
