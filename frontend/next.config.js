/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'supabase.co', 'i.ibb.co', 'ibb.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
    ],
  },
  async rewrites() {
    // Only enable rewrites if API URL is properly configured
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Check if API URL is valid and not undefined/empty
    if (!apiUrl ||
        apiUrl === 'undefined' ||
        apiUrl === 'null' ||
        apiUrl.trim() === '' ||
        apiUrl.includes('your-backend-url')) {
      console.warn('⚠️ NEXT_PUBLIC_API_URL not configured properly, skipping API rewrites');
      console.warn('⚠️ Current value:', apiUrl);
      console.warn('⚠️ Please set NEXT_PUBLIC_API_URL in your deployment environment (e.g. Vercel project settings).');
      console.warn('⚠️ Example: https://your-backend.example.com/api');
      return [];
    }
    
    console.log('✅ API rewrites enabled for:', apiUrl);
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
