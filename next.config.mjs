const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ⚠️ allows all HTTPS domains
      },
    ],
  },
};

export default nextConfig;