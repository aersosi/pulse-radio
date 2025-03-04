const nextConfig = {
    images: {
        minimumCacheTTL: 86400,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'station-images-prod.radio-assets.com',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;