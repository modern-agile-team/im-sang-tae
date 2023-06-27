const { glob } = require("glob");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: glob.sync("./src/**/*.ts").map((el) => `./${el}`),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [new webpack.ProgressPlugin()],
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
