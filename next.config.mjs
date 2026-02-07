/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Uniquement pour le build GitHub Pages ; en dev, l'app est à http://localhost:3000/
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/L-Observatoire',
    assetPrefix: '/L-Observatoire/',
  }),
};

export default nextConfig;
