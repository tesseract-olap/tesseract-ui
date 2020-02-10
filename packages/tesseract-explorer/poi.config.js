const serverUrl = "https://api.oec.world/tesseract/";
const publicUrl = "https://api.oec.world/newui/";
const title = "OEC DataExplorer BETA";

/** @type {import("poi").Config} */
module.exports = {
  entry: "./dev/index.js",
  output: {
    html: {title},
    minimize: false,
    publicUrl,
    sourceMap: true
  },
  envs: {
    APP_TESSERACT_URL: serverUrl,
    APP_TITLE: title
  },
  configureWebpack: {
    module: {
      rules: [{test: /\.d\.ts$/i, use: "raw-loader"}]
    }
  }
};
