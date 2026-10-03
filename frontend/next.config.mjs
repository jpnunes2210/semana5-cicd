/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // O app nao usa next/image; sem isso o standalone carrega o sharp (~40 MB de binarios)
  images: { unoptimized: true },
  outputFileTracingExcludes: {
    '*': ['node_modules/@img/**', 'node_modules/sharp/**'],
  },
};

export default nextConfig;
