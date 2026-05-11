/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@urai/analytics-core'],
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
