/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async rewrites() {
    // Only enable rewrites if API URL is properly configured
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl || apiUrl === 'undefined') {
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
