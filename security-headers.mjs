/**
 * Single source of truth for security headers.
 *
 * - next.config.mjs imports `securityHeaders` for pages rendered by the Worker.
 * - scripts/generate-headers.js writes the same headers into the generated block
 *   of public/_headers, which Cloudflare applies to static assets (turnstile.html,
 *   /scripts/*, images). Run `npm run generate:headers` after editing this file.
 */

const CSP_DIRECTIVES = {
    'default-src': ["'self'"],
    // 'unsafe-inline' is required because the vinext/Cloudflare runtime injects
    // inline bootstrap scripts with a framework-generated nonce, and
    // public/turnstile.html has an inline script. We cannot use 'strict-dynamic':
    //  1. It disables all host-based allowlists ('self', explicit origins)
    //  2. The framework nonce causes browsers to ignore 'unsafe-inline'
    //  3. Static <script src="..."> tags (e.g. /scripts/*.js) get blocked
    // Once vinext exposes nonce propagation to userland, switch to a nonce-based CSP.
    'script-src': [
        "'self'",
        "'unsafe-inline'",
        'https://www.googletagmanager.com',
        'https://*.googletagmanager.com',
        'https://*.clarity.ms',
        'https://*.firebaseapp.com',
        'https://accounts.google.com',
        'https://apis.google.com',
        'https://challenges.cloudflare.com',
        'https://checkout.razorpay.com',
    ],
    'connect-src': [
        "'self'",
        'https://*.ccreward.app',
        'https://*.googleapis.com',
        'https://*.firebaseio.com',
        'wss://*.firebaseio.com',
        'https://*.clarity.ms',
        'https://c.bing.com',
        'https://*.google-analytics.com',
        'https://*.analytics.google.com',
        'https://*.googletagmanager.com',
        'https://accounts.google.com',
        'https://react-tweet.vercel.app',
        'https://docs.google.com',
        'https://challenges.cloudflare.com',
        'https://api.razorpay.com',
        'https://lumberjack.razorpay.com',
    ],
    'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://imagedelivery.net',
        'https://files.ccreward.app',
        'https://firebasestorage.googleapis.com',
        'https://lh3.googleusercontent.com',
        'https://pbs.twimg.com',
        'https://img.youtube.com',
        'https://*.clarity.ms',
        'https://c.bing.com',
        'https://*.google-analytics.com',
        'https://*.googletagmanager.com',
        'https://*.razorpay.com',
    ],
    'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
        'https://accounts.google.com',
        'https://checkout.razorpay.com',
    ],
    'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
    'frame-src': [
        "'self'",
        'https://www.youtube.com',
        'https://www.youtube-nocookie.com',
        'https://accounts.google.com',
        'https://*.firebaseapp.com',
        'https://challenges.cloudflare.com',
        'https://api.razorpay.com',
        'https://checkout.razorpay.com',
    ],
    'worker-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
};

export const contentSecurityPolicy = Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

export const securityHeaders = [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    // Keeps Google/Apple sign-in popups working while cutting window.opener for other origins.
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
    { key: 'X-XSS-Protection', value: '0' },
];
