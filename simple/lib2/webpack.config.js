const path = require("path")
const webpack = require("webpack")

module.exports = {
  mode: "development",
  entry: {},
  context: __dirname,
  devtool: false,
  output: {
    path: "./dist",
    uniqueName: "lib2"
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
      }
    ]
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: "mfeCCC",

      exposes: {
        "./Component": "./src/Component",
        "./Component2": "./src/LazyComponent"
      },

      shared: [
        // All (used) requests within lodash are shared.
        "lodash/",
        "date-fns",
        {
          react: {
            // Do not load our own version.
            // There must be a valid shared module available at runtime.
            // This improves build time as this module doesn't need to be compiled,
            // but it opts-out of possible fallbacks and runtime version upgrade.
            // import: false,
            singleton: true
          }
        }
      ]
    })
  ],
  devServer: {
    port: 8082,
    devMiddleware: {
      writeToDisk: true,
    }
  }
}