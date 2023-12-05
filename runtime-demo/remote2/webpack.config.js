const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const PocPlugin = require("../../1.5/plugin");
const mfOptions = require("./module-federation.config");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  devtool: false,
  context: __dirname,
  output: {
    path: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
						jsc: {
							parser: {
								syntax: "typescript",
                tsx: true,
							},
							externalHelpers: true,
						},
            transform: {
              react: {
                runtime: "automatic",
              }
            }
					}
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new PocPlugin(mfOptions),
  ],
  devServer: {
    port: 8083,
    devMiddleware: {
      writeToDisk: true,
    }
  }
}
