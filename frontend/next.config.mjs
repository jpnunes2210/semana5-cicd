/** @type {import('next').NextConfig} */
const nextConfig = {
  // STATIC_EXPORT=true gera HTML estatico em out/ para o Firebase Hosting (Semana 6).
  // Sem a variavel, continua o standalone usado pelo Dockerfile.prod (Semana 5).
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : 'standalone',
  // O app nao usa next/image; sem isso o standalone carrega o sharp (~40 MB de binarios)
  // e o export estatico exigiria um loader de imagens.
  images: { unoptimized: true },
  outputFileTracingExcludes: {
    '*': ['node_modules/@img/**', 'node_modules/sharp/**'],
  },
};

export default nextConfig;
