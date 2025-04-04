import { CACHE_TIMES } from "@/lib/constants";

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
        minimumCacheTTL: CACHE_TIMES.ONE_DAY,
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