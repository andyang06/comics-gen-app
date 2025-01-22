/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['replicate.delivery'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This will allow images from any HTTPS source
      },
    ],
  },
}

module.exports = nextConfig
