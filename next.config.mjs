/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '/L-Observatoire' : '';
const nextConfig = {
  output: 'export',
  // Uniquement pour le build GitHub Pages ; en dev, l'app est à http://localhost:3000/
  ...(basePath && {
    basePath,
    assetPrefix: `${basePath}/`,
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
