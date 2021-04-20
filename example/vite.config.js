/** @type {import("vite").Config} */
export default {
  root: "./src",
  define: {
    'process.env': {}
  },
  server: {
    proxy: {
      "/olap/": {
        changeOrigin: true,
        secure: false,
        // target: 'http://localhost:7777',
        // target: "https://dev.ciren.datawheel.us",
        target: "https://api-staging.oec.world",
        // target: "https://dev.oec.world",
        // target: "https://opal-api.datausa.io",
        rewrite: (path) => path.replace(/^\/olap/, '/tesseract')
      }
    }
  }
};
