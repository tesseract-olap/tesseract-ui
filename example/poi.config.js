/** @type {import("poi").Config} */
module.exports = {
  reactRefresh: true,
  entry: "./src/index.jsx",
  output: {
    html: {
      title: "tesseract-ui Demo"
    },
    minimize: false,
    publicUrl: ".",
    sourceMap: true
  },
  devServer: {
    proxy: {
      "/olap/": {
        changeOrigin: true,
        secure: false,
        target: 'http://localhost:7777',
        pathRewrite: {
          "^/olap/": ""
        }
      }
    }
  }
};
