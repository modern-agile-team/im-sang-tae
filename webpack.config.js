const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    globalObject: "this",
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
