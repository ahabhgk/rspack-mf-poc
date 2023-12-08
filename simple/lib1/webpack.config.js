const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const PocPlugin = require("../../1.5/plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js"
  },
  context: __dirname,
  devtool: false,
  output: {
    path: path.resolve(__dirname, "./dist"),
    uniqueName: "lib1"
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
    new HtmlWebpackPlugin(),
    new PocPlugin({
      // A unique name
      name: "mfeBBB",
      // List of exposed modules
      exposes: {
        "./Component": "./src/Component",
      },

      // list of shared modules
      shared: [
        // date-fns is shared with the other remote, app doesn't know about that
        {
          "date-fns": {
            import: "date-fns",
            // eager: true,
          },
          react: {
            singleton: true, // must be specified in each config
            // eager: true,
          }
        }
      ]
    })
  ],
  devServer: {
    port: 8081,
    devMiddleware: {
      writeToDisk: true,
    }
  }
}
