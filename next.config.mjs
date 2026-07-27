/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            // 'unsafe-inline' is required because the vinext/Cloudflare runtime
                            // injects inline bootstrap scripts with a framework-generated nonce.
                            // We cannot use 'strict-dynamic' here because:
                            //  1. It disables all host-based allowlists ('self', explicit origins)
                            //  2. The framework nonce causes browsers to ignore 'unsafe-inline'
                            //  3. Static <script src="..."> tags (e.g. /scripts/*.js) get blocked
                            // Once vinext exposes nonce propagation to userland, we can switch to
                            // nonce-based CSP and drop 'unsafe-inline'.
                            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.clarity.ms https://*.firebaseapp.com https://accounts.google.com https://apis.google.com https://challenges.cloudflare.com https://checkout.razorpay.com",
                            "connect-src 'self' https://*.ccreward.app https://*.googleapis.com https://*.firebaseio.com https://www.clarity.ms https://*.google-analytics.com https://*.analytics.google.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseinstallations.googleapis.com https://firebase.googleapis.com https://accounts.google.com https://files.ccreward.app https://react-tweet.vercel.app https://docs.google.com https://challenges.cloudflare.com https://api.razorpay.com https://lumberjack.razorpay.com",
                            "img-src 'self' data: https: https://firebasestorage.googleapis.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com https://checkout.razorpay.com",
                            "font-src 'self' https://fonts.gstatic.com data:",
                            "frame-src 'self' https://www.youtube.com https://accounts.google.com https://*.firebaseapp.com https://challenges.cloudflare.com https://api.razorpay.com https://checkout.razorpay.com",
                            "worker-src 'self' blob:",
                        ].join("; "),
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '0',
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
