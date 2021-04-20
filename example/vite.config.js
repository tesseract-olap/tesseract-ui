import path from "path";

const basePath = path.resolve(__dirname, "..");

/** @type {import("vite").UserConfig} */
const config = {
  root: "./src",
  define: {
    'process.env': {}
  },
  resolve: {
    alias: [{
      find: "@datawheel/tesseract-explorer",
      replacement: path.resolve(basePath, "./packages/tesseract-explorer/src/index.js")
    }, {
      find: "@datawheel/tesseract-vizbuilder",
      replacement: path.resolve(basePath, "./packages/view-vizbuilder/src/index.js")
    }]
  },
  server: {
    proxy: {
      "/olap/": {
        changeOrigin: true,
        secure: false,
        target: 'http://localhost:7777',
        rewrite: (path) => path.replace(/^\/olap/, '')
      }
    }
  }
};

export default config
