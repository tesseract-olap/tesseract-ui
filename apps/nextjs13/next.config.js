/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@datawheel/vizbuilder', 'd3plus-format'],
  env: {
    BUILD_VERSION: "x.y.z",
    OLAPPROXY_JWTAUTH: process.env.OLAPPROXY_JWTAUTH,
  },
  async rewrites() {
    return [{
      source: "/olap",
      destination: process.env.OLAPPROXY_TARGET
    },{
      source: "/olap/:path*",
      destination: process.env.OLAPPROXY_TARGET + ":path*"
    }]
  }
};

module.exports = {
  ...nextConfig,
};
