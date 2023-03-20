/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    buildVersion: "x.y.z",
    TESSERACT_SOURCE: process.env.OLAPPROXY_TARGET,
  }
};

module.exports = {
  ...nextConfig,
};
