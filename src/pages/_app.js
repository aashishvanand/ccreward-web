// src/pages/_app.js - FIXED: Add RegionProvider for Pages Router
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { initializeAnalytics, trackPageView } from '@/core/services/analytics';
import { initializeErrorTracking } from '@/core/services/errorTracking';
// ADD: Import providers for Pages Router
import { ThemeRegistry } from '@/core/providers/ThemeRegistry';
import { RegionProvider } from '@/core/providers/RegionContext';
import { AuthProvider } from '@/core/providers/AuthContext';
import { AnalyticsProvider } from '@/core/providers/AnalyticsProvider';
import AmbientBackground from '@/shared/components/layout/AmbientBackground';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

    // Initialize Firebase services (client-side only)
    useEffect(() => {
        // Only run on client-side
        if (typeof window === 'undefined') return;

        const initializeServices = async () => {
            try {
                console.log('🚀 Initializing services for Cloudflare Pages...');

                // Initialize error tracking first
                const errorTrackingSuccess = initializeErrorTracking();
                console.log(`${errorTrackingSuccess ? '✅' : '⚠️'} Error tracking initialized`);

                // Initialize analytics and performance monitoring
                const analyticsSuccess = await initializeAnalytics();

                if (analyticsSuccess) {
                    setAnalyticsInitialized(true);
                    console.log('✅ All services initialized successfully');

                    // Track initial page view
                    trackPageView(router.pathname, {
                        initial_load: true,
                        deployment_platform: 'cloudflare_pages',
                        build_type: 'static_export'
                    });
                } else {
                    console.warn('⚠️ Analytics initialization failed');
                }

            } catch (error) {
                console.error('❌ Failed to initialize services:', error);
            }
        };

        // Delay initialization to ensure DOM is ready
        const timer = setTimeout(initializeServices, 100);

        return () => clearTimeout(timer);
    }, [router.pathname]);

    // Track page navigation (client-side only)
    useEffect(() => {
        // Only run if analytics is initialized and we're on client-side
        if (!analyticsInitialized || typeof window === 'undefined') return;

        const handleRouteChangeStart = (url) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`🔄 Route changing to: ${url}`);
            }
        };

        const handleRouteChangeComplete = (url) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`✅ Route changed to: ${url}`);
            }
            trackPageView(url, {
                navigation_type: 'spa_navigation',
                previous_page: router.pathname
            });
        };

        const handleRouteChangeError = (err, url) => {
            console.error(`❌ Route change error to ${url}:`, err);
        };

        // Add Next.js router event listeners
        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        router.events.on('routeChangeError', handleRouteChangeError);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            router.events.off('routeChangeError', handleRouteChangeError);
        };
    }, [router, analyticsInitialized]);

    // Development logging
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            console.log('🔧 [DEV] Development Info:');
            console.log(`   Current route: ${router.pathname}`);
            console.log(`   Analytics ready: ${analyticsInitialized}`);
            console.log(`   Platform: Cloudflare Pages`);
            console.log(`   Build: Static Export`);
            console.log(`   User Agent: ${navigator.userAgent}`);
        }
    }, [router.pathname, analyticsInitialized]);

    // FIXED: Wrap with providers for Pages Router
    return (
        <ThemeRegistry>
            <AmbientBackground />
            <RegionProvider>
                <AuthProvider>
                    <AnalyticsProvider>
                        <Component {...pageProps} />
                    </AnalyticsProvider>
                </AuthProvider>
            </RegionProvider>
        </ThemeRegistry>
    );
}

export default MyApp;