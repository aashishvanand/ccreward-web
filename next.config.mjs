import { securityHeaders } from './security-headers.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
    images: {
        loader: 'custom',
        loaderFile: './imageLoader.js',
        minimumCacheTTL: 31536000,
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === "production" ? {
            exclude: ["error"],
        } : false,
    },
    trailingSlash: false,
    serverExternalPackages: ['sharp'],
    bundlePagesRouterDependencies: true,
    typescript: {
        // You can enable this if you want to use next.config.ts
        // ignoreBuildErrors: false,
    }
};

export default nextConfig;
