// src/pages/_app.js - Next.js App Integration with Performance Monitoring
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initializeAnalytics, trackPageView } from '../core/services/analytics';
import { initializeCrashlytics } from '../core/services/crashlytics';
import { usePagePerformance } from '../core/hooks/usePerformance';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    
    // Initialize Firebase services
    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                // Initialize analytics and performance monitoring
                await initializeAnalytics();
                
                // Initialize crashlytics
                await initializeCrashlytics();
                
                // Track initial page view
                trackPageView(router.pathname);
                
            } catch (error) {
                console.error('Failed to initialize Firebase services:', error);
            }
        };
        
        initializeFirebase();
    }, []);
    
    // Track page navigation
    useEffect(() => {
        const handleRouteChange = (url) => {
            trackPageView(url);
        };
        
        router.events.on('routeChangeComplete', handleRouteChange);
        
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);
    
    // Use page performance tracking
    usePagePerformance(router.pathname);
    
    return <Component {...pageProps} />;
}

export default MyApp;