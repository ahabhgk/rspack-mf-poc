const HtmlWebpackPlugin = require('html-webpack-plugin');
const PocPlugin = require("../../1.5/plugin");
const path = require('path');

const mfOptions = {
  name: 'app2',
  library: { type: 'var', name: 'app2' },
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/components/Button',
    './ModernComponent': './src/components/ModernReactComponent',
    './newReact': require.resolve('react'),
    './newReactDOM': require.resolve('react-dom'),
  },
  shared: [
    'react-dom',
    {
      react: {
        import: 'react', // the "react" package will be used a provided and fallback module
        shareKey: 'newReact', // under this name the shared module will be placed in the share scope
        shareScope: 'default', // share scope with this name will be used
        singleton: true, // only a single version of the shared module is allowed
      },
      // reactNew: {
      //   import: "react", // the "react" package will be used a provided and fallback module
      //   shareKey: "reactNew", // under this name the shared module will be placed in the share scope
      //   shareScope: "modern", // share scope with this name will be used
      //   singleton: true, // only a single version of the shared module is allowed
      // },
    },
  ],
}

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
  output: {
    path: "./dist",
    publicPath: 'auto',
  },
  context: __dirname,
  devtool: false,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
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
