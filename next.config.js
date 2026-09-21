/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Limit workers to avoid OOM on Windows during page data collection
  experimental: {
    cpus: 1,
  },
};

module.exports = nextConfig;
