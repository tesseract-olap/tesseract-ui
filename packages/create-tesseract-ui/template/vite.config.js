import legacy from "@vitejs/plugin-legacy";

const inProduction = process.env.NODE_ENV == "production";
const serverUrl = `$TEMPLATE_SERVER`;

/** @type {import("vite").UserConfig} */
const config = {
  base: "",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          blueprintjs: [
            "@blueprintjs/icons", "@blueprintjs/core",
            "@blueprintjs/select", "@blueprintjs/table",
          ],
        }
      }
    }
  },
  clearScreen: false,
  define: {
    'process.env': {
      '__SERVER_URL__': inProduction ? serverUrl : "/olap/",
    },
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  server: {
    proxy: {
      "/olap/": {
        target: serverUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/olap/, '')
      }
    }
  }
};

export default config
