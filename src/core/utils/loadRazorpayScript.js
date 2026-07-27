let loadPromise = null;

/**
 * Injects the Razorpay Checkout.js script once and resolves when window.Razorpay is ready.
 */
export const loadRazorpayScript = () => {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Razorpay can only be loaded in the browser.'));
    }
    if (window.Razorpay) {
        return Promise.resolve(window.Razorpay);
    }
    if (loadPromise) {
        return loadPromise;
    }

    loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            if (window.Razorpay) {
                resolve(window.Razorpay);
            } else {
                loadPromise = null;
                reject(new Error('Razorpay script loaded but window.Razorpay is unavailable.'));
            }
        };
        script.onerror = () => {
            loadPromise = null;
            reject(new Error('Failed to load Razorpay checkout script.'));
        };
        document.body.appendChild(script);
    });

    return loadPromise;
};
