const nextConfig = {
    output: "standalone",
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    // logging: {
    //     fetches: {
    //         fullUrl: true,
    //     },
    // },
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