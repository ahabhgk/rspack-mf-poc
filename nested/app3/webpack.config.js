const HtmlWebpackPlugin = require('html-webpack-plugin');
const PocPlugin = require("../../1.5/plugin");
const path = require('path');

const mfOptions = {
  name: 'app3',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/Button',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
};

module.exports = {
  entry: './src/index',
  mode: 'development',
  context: __dirname,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3003,
  },
  output: {
    path: "./dist",
    publicPath: 'auto',
  },
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
