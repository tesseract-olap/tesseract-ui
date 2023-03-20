/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    buildVersion: "x.y.z",
    TESSERACT_SOURCE: process.env.TESSERACT_SOURCE,
  }
};

module.exports = {
  ...nextConfig,
};
