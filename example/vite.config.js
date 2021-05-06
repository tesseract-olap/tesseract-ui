import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";

const {
  OLAPPROXY_AUTH,
  OLAPPROXY_TARGET = "http://localhost:7777"
} = process.env;

const basePath = path.resolve(__dirname, "..");

const target = new URL(OLAPPROXY_TARGET);
target.pathname = `${target.pathname}/`.replace(/\/{2,}/g, "/");

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
  plugins: [
    reactRefresh()
  ],
  server: {
    proxy: {
      "/olap/": {
        auth: OLAPPROXY_AUTH,
        changeOrigin: true,
        secure: false,
        target: target.origin,
        rewrite: (path) => path.replace(/^\/olap\//, target.pathname)
      }
    }
  }
};

export default config
