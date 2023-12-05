const HtmlWebpackPlugin = require('html-webpack-plugin');
const PocPlugin = require("../../1.5/plugin");
const path = require('path');

const mfOptions = {
  name: 'app2',
  filename: 'remoteEntry.js',
  exposes: {
    './ButtonContainer': './src/ButtonContainer',
  },
  remotes: {
    app3: `app3@${getRemoteEntryUrl(3003)}`,
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
    port: 3002,
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

function getRemoteEntryUrl(port) {
  const { CODESANDBOX_SSE, HOSTNAME = '' } = process.env;

  // Check if the example is running on codesandbox
  // https://codesandbox.io/docs/environment
  if (!CODESANDBOX_SSE) {
    return `//localhost:${port}/remoteEntry.js`;
  }

  const parts = HOSTNAME.split('-');
  const codesandboxId = parts[parts.length - 1];

  return `//${codesandboxId}-${port}.sse.codesandbox.io/remoteEntry.js`;
}
