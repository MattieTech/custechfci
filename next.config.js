/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/contacts',
        permanent: true,
      },
      {
        source: '/departments/ict',
        destination: '/departments/information-technology',
        permanent: true,
      },
      {
        source: '/departments/library-and-information-science',
        destination: '/departments/library-info-science',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
