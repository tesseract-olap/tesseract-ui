import legacy from "@vitejs/plugin-legacy";

const inProduction = process.env.NODE_ENV == "production";
const serverUrl = `$TEMPLATE_SERVERURL`;

/** @type {import("vite").UserConfig} */
const config = {
  base: "",
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {}
      }
    }
  },
  clearScreen: false,
  define: {
    'process.env': {
      '__SERVER_URL__': inProduction ? serverUrl : "/olap/",
      '__SERVER_LOCALES__': `$TEMPLATE_SERVERLOCALES`,
    },
  },
  plugins: [
    legacy({
      targets: ['>0.5%', 'not dead', 'not ie <= 11', 'not op_mini all'],
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
