const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const rspack = require("/Users/bytedance/GitHub/rspack/packages/rspack");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devtool: false,
  context: __dirname,
  output: {
    path: path.resolve(__dirname, "./dist"),
    uniqueName: "app"
  },
  target: ["web", "es5"],
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
    new rspack.container.ModuleFederationPlugin({
      // List of remotes with URLs
      remotes: {
        'mfe-b': {
          external: 'mfeBBB@http://localhost:8081/mfeBBB.js',
        },
        'mfe-c': 'mfeCCC@http://localhost:8082/mfeCCC.js',
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