/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'nonce-ccGeeks2026Secure' https://www.googletagmanager.com https://*.googletagmanager.com https://www.clarity.ms https://*.firebaseapp.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://www.clarity.ms https://*.google-analytics.com https://*.analytics.google.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; img-src 'self' data: https: https://firebasestorage.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; frame-src 'self' https://www.youtube.com; worker-src 'self' blob:;",
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    }
                ],
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
