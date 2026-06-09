// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ✅ bỏ qua toàn bộ TS error khi build
  },
  // Cho phép connect WebSocket ra backend
  async rewrites() {
    return [];
  },
};

export default nextConfig;
