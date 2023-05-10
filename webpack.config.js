const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/app.ts",
  output: {
    filename: "app.js",
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
};
