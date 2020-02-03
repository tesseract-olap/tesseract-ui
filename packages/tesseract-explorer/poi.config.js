/** @type {import("poi").Config} */
module.exports = {
  configureWebpack: {
    module: {
      rules: [{test: /\.d\.ts$/i, use: "raw-loader"}]
    }
  }
};
