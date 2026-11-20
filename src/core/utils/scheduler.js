// Main-thread scheduling helpers.
//
// Yield control back to the browser so it can handle input and paint before
// running non-urgent work. Uses scheduler.yield() where available
// (Chrome/Edge 129+, Firefox 142+) and falls back to setTimeout elsewhere.
export function yieldToMain() {
    if (typeof globalThis.scheduler?.yield === 'function') {
        return globalThis.scheduler.yield();
    }
    return new Promise((resolve) => setTimeout(resolve, 0));
}

// Run non-urgent work (analytics, telemetry) after the current task so it
// never adds to an interaction's processing time. While the page is hidden
// the work runs immediately: the page may be about to unload, and a deferred
// task could be lost.
export function runAfterYield(fn) {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        fn();
        return;
    }
    yieldToMain().then(fn);
}

// Run setup work when the browser is idle, so it never competes with the
// initial render. requestIdleCallback has a timeout so the work still runs
// on busy pages. Returns a cancel function for cleanup on unmount.
export function whenIdle(callback) {
    if (typeof window === 'undefined') {
        callback();
        return () => { };
    }
    if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(callback, { timeout: 4000 });
        return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(callback, 1500);
    return () => clearTimeout(id);
}
