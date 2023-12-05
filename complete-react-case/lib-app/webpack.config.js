// const { ModuleFederationPlugin } = require('webpack').container;
const PocPlugin = require("../../1.5/plugin");
const path = require('path');

const mfOptions = {
  name: 'lib_app',
  filename: 'remoteEntry.js',
  exposes: {
    './react': 'react',
    './react-dom': 'react-dom',
  },
};

module.exports = {
  entry: './index.js',
  mode: 'development',
  devtool: 'hidden-source-map',
  output: {
    path: "./dist",
    publicPath: 'http://localhost:3000/',
    clean: true,
  },
  context: __dirname,
  devServer: {
    port: 3000
  },
  module: {},
  plugins: [
    new PocPlugin(mfOptions),
  ],
};
