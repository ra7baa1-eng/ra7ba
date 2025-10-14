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
    // Disable external rewrites entirely when using local Mock API
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === '1';
    if (useMock) {
      console.log('✅ Using local Mock API routes. External API rewrites are disabled.');
      return [];
    }

    // Only enable rewrites if API URL is properly configured
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Check if API URL is valid and not undefined/empty
    if (!apiUrl || 
        apiUrl === 'undefined' || 
        apiUrl === 'null' ||
        apiUrl.trim() === '' ||
        apiUrl === 'https://your-backend-url.onrender.com/api' ||
        apiUrl.includes('your-backend-url')) {
      console.warn('⚠️ NEXT_PUBLIC_API_URL not configured properly, skipping API rewrites');
      console.warn('⚠️ Current value:', apiUrl);
      console.warn('⚠️ Please set NEXT_PUBLIC_API_URL in Render Environment Variables');
      console.warn('⚠️ Example: https://your-backend.onrender.com/api');
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
