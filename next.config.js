/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Limit workers to avoid OOM on Windows during page data collection
  experimental: {
    cpus: 1,
  },
  /**
   * Proxy /api/v1 → backend so the real API host stays server-only (API_BASE_URL).
   * Browser never needs NEXT_PUBLIC_API_BASE_URL.
   */
  async rewrites() {
    const backend = (process.env.API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backend}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
