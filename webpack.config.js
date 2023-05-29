const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: ["./examples/app.ts", "./examples/app2.ts", "./src/stateManager/index.ts"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    // <-- 추가한 부분
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new webpack.ProgressPlugin(), new CleanWebpackPlugin()],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
    client: {
      webSocketURL: {
        hostname: "localhost",
        pathname: "/ws",
        port: 8080,
      },
    },
    allowedHosts: "all",
  },
};
