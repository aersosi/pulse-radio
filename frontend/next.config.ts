const nextConfig = {
    output: "standalone",
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
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