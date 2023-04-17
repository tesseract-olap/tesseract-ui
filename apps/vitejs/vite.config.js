import pluginReact from "@vitejs/plugin-react";

const {
  OLAPPROXY_BASICAUTH,
  OLAPPROXY_JWTAUTH,
  OLAPPROXY_TARGET = "http://localhost:7777"
} = process.env;

const target = new URL(OLAPPROXY_TARGET);
target.pathname = `${target.pathname}/`.replace(/\/{2,}/g, "/");

const headers = {};
if (OLAPPROXY_JWTAUTH) {
  headers["x-tesseract-jwt-token"] = OLAPPROXY_JWTAUTH;
}

/** @type {import("vite").UserConfig} */
const config = {
  root: "./src",
  define: {
    'process.env.BUILD_VERSION': '"x.y.z"',
    'process.env': {}
  },
  plugins: [
    pluginReact()
  ],
  server: {
    proxy: {
      "/olap/": {
        auth: OLAPPROXY_BASICAUTH,
        changeOrigin: true,
        secure: false,
        target: target.origin,
        followRedirects: true,
        headers,
        rewrite: (path) => path.replace(/^\/olap\//, target.pathname)
      }
    }
  }
};

export default config