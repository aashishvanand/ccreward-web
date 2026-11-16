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
