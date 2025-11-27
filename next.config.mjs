/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Fix turbopack root directory warning
  turbopack: {
    root: process.cwd(),
  },
  // Fix CSS loading in Electron
  assetPrefix: './',
  trailingSlash: true,
}

export default nextConfig
