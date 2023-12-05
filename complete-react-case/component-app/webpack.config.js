// const { ModuleFederationPlugin } = require('webpack').container;
const PocPlugin = require("../../1.5/plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const mfOptions = {
  name: 'component_app',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/Button.jsx',
    './Dialog': './src/Dialog.jsx',
    './Logo': './src/Logo.jsx',
    './ToolTip': './src/ToolTip.jsx',
  },
  remotes: {
    'lib-app': 'lib_app@http://localhost:3000/remoteEntry.js',
  },
};

module.exports = {
  entry: './index.js',
  mode: 'development',
  devtool: 'hidden-source-map',
  output: {
    path: "./dist",
    publicPath: 'http://localhost:3001/',
    clean: true,
  },
  context: __dirname,
  devServer: {
    port: 3001,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json', '.css', '.scss', '.jpg', 'jpeg', 'png'],
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        loader: 'url-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
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
