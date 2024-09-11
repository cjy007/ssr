import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/next', // url前缀 / => /next/
  env: {
    urlBasePath: 'http://localhost:3000',
  },

  images: {
    domains: ['dummyjson.com'],
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/api',
  //       destination: 'http://localhost:3000',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
