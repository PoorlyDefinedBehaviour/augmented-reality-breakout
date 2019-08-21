// webpack.config.js
const webpack = require("webpack");

module.exports = {
  entry: "./build/main.js",
  output: {
    filename: "dist/main.js"
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
    //modules: ["node_modules"]
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader"
        }
      }
    ]
  }
};
