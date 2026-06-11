import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 诊断:StrictMode 双挂载与 Sandpack 客户端生命周期存在竞态,
  // 会导致预览 iframe 与打包客户端脱钩(白屏)。先关闭验证。
  reactStrictMode: false,
};

export default nextConfig;
