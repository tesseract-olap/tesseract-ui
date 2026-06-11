/// <reference types="vitest/config" />
import pluginReact from "@vitejs/plugin-react";
import pluginLegacy from "@vitejs/plugin-legacy";
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

export default defineConfig(({ command }) => {
  const plugins = [pluginReact({ fastRefresh: false })];

  if (command === "build") {
    plugins.push(pluginLegacy({ targets: ["defaults", "not IE 11"] }));
  }

  return {
    define: {
      "process.env.BUILD_VERSION": JSON.stringify("x.y.z"),
      "process.env.OLAPPROXY_JWTAUTH": JSON.stringify(OLAPPROXY_JWTAUTH ?? "")
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
            return newPath;
          }
        }
      }
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: []
    }
  };
});
