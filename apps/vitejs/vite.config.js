import pluginReact from "@vitejs/plugin-react";
import pluginLegacy from '@vitejs/plugin-legacy'
import { defineConfig } from "vite";

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

export default defineConfig(({command, mode, ssrBuild}) => {
  const plugins = [pluginReact({fastRefresh: false})];

  if (command == "build") {
    plugins.push(
      pluginLegacy({
        targets: ["defaults", "not IE 11"],
      })
    );
  }

  return {
    root: "./src",
    define: {
      'process.env.BUILD_VERSION': '"x.y.z"',
      'process.env': {}
    },
    plugins,
    server: {
      proxy: {
        "/olap/": {
          auth: OLAPPROXY_BASICAUTH,
          changeOrigin: true,
          secure: false,
          target: target.origin,
          followRedirects: true,
          headers,
          rewrite: (path) => {
            const newPath = path.replace(/^\/olap\//, target.pathname);
            console.log(target.origin, newPath);
            return newPath;
          }
        }
      }
    }
  };
})
