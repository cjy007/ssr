import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // 打包模式
  // reactStrictMode: true,
	// images: {
  //    unoptimized: true,
  // },
	// env: {
  //   API_PREFIX: process.env.API,
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: "http://domain:8000/:path*",
  //     },
  //   ];
  // }, // 本地调试时使用
};

export default nextConfig;
