const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const PocPlugin = require("../../1.5/plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: false,
  context: __dirname,
  output: {
    path: "./dist",
    uniqueName: "app"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      },
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, "../../1.5"),
        use: {
          loader: "builtin:swc-loader",
          options: {
						jsc: {
							parser: {
								syntax: "typescript",
							},
							externalHelpers: true,
						}
					}
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new PocPlugin({
      // List of remotes with URLs
      remotes: {
        "mfe-b": "mfeBBB@http://localhost:8081/mfeBBB.js",
        "mfe-c": "mfeCCC@http://localhost:8082/mfeCCC.js"
      },
    
      // list of shared modules with optional options
      shared: {
        // specifying a module request as shared module
        // will provide all used modules matching this name (version from package.json)
        // and consume shared modules in the version specified in dependencies from package.json
        // (or in dev/peer/optionalDependencies)
        // So it use the highest available version of this package matching the version requirement
        // from package.json, while providing it's own version to others.
        react: {
          singleton: true, // make sure only a single react module is used
          // eager: true,
        }
      },

      runtimePlugins: ['./runtimePlugin.js']
    }),
  ],
  devServer: {
    port: 8080,
    devMiddleware: {
      writeToDisk: true,
    }
  }
}