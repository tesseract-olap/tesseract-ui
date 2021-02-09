const inProduction = process.env.NODE_ENV == "production";

var serverUrl = `$TEMPLATE_SERVER`;

// Reference to this config available at https://poi.js.org/config.html
/** @type {import("poi").Config} */
module.exports = {
  entry: "./index.js",
  output: {
    html: {},
    minimize: false,
    publicUrl: ".",
    sourceMap: true
  },
  envs: {
    __SERVER_URL__: inProduction ? serverUrl : "/tesseract/",
  },
  devServer: {
    proxy: {
      "/tesseract/": {
        target: serverUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/tesseract/": "/"
        }
      }
    }
  }
};
