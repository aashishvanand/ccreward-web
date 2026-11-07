/**
 * Cloudflare Turnstile integration for bot protection.
 * Runs in invisible mode — no user interaction required.
 *
 * Usage:
 *   import { getTurnstileToken } from './turnstile';
 *   const token = await getTurnstileToken();
 *   // Send token as X-Turnstile-Token header with API requests
 *
 * Server-side verification:
 *   POST https://challenges.cloudflare.com/turnstile/v0/siteverify
 *   { secret: TURNSTILE_SECRET_KEY, response: token }
 *
 * Note: Turnstile tokens are single-use. Each server-side verification
 * consumes the token, so a fresh token is required for every API call.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

let _widgetId = null;
let _scriptLoaded = false;
let _scriptLoadPromise = null;
// Resolver for the single in-flight token request (requests are serialized)
let _pendingResolve = null;
// Token produced when nobody was waiting (e.g. the first render). Used once.
let _spareToken = null;
// Tail of the request queue: each getTurnstileToken() waits for the previous one
let _queue = Promise.resolve();

// Turnstile tokens are valid for 300s; leave headroom for the request itself
const SPARE_TOKEN_MAX_AGE_MS = 240 * 1000;
const TOKEN_TIMEOUT_MS = 5000;

const deliverToken = (token) => {
  if (_pendingResolve) {
    const resolve = _pendingResolve;
    _pendingResolve = null;
    resolve(token);
  } else if (token) {
    _spareToken = { token, at: Date.now() };
  }
};

/**
 * Load the Turnstile script if not already loaded.
 * Returns a promise that resolves when the script is ready.
 */
const loadScript = () => {
  if (_scriptLoaded) return Promise.resolve();
  if (_scriptLoadPromise) return _scriptLoadPromise;

  _scriptLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // Check if already loaded (e.g., by another instance)
    if (window.turnstile) {
      _scriptLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
    script.async = true;
    script.defer = true;

    window.onTurnstileLoad = () => {
      _scriptLoaded = true;
      delete window.onTurnstileLoad;
      resolve();
    };

    script.onerror = () => {
      _scriptLoadPromise = null;
      reject(new Error('Failed to load Turnstile script'));
    };

    document.head.appendChild(script);
  });

  return _scriptLoadPromise;
};

/**
 * Render the invisible Turnstile widget.
 * Creates a hidden container and renders the widget into it.
 */
const renderWidget = () => {
  if (_widgetId !== null || typeof window === 'undefined' || !window.turnstile) return;

  // Create a hidden container for the invisible widget
  let container = document.getElementById('turnstile-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'turnstile-container';
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  _widgetId = window.turnstile.render(container, {
    sitekey: SITE_KEY,
    size: 'invisible',
    callback: (token) => deliverToken(token),
    'error-callback': () => deliverToken(null),
    'expired-callback': () => {
      _spareToken = null;
    },
  });
};

/**
 * Request one fresh token from the widget. Callers must hold the queue.
 */
const requestToken = () => {
  if (_spareToken) {
    const { token, at } = _spareToken;
    _spareToken = null;
    if (Date.now() - at < SPARE_TOKEN_MAX_AGE_MS) return Promise.resolve(token);
  }

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      if (_pendingResolve === finish) _pendingResolve = null;
      resolve(null); // Don't block API calls indefinitely
    }, TOKEN_TIMEOUT_MS);
    const finish = (token) => {
      clearTimeout(timeoutId);
      resolve(token);
    };
    _pendingResolve = finish;

    if (_widgetId !== null && window.turnstile) {
      window.turnstile.reset(_widgetId);
    }
  });
};

/**
 * Get a fresh Turnstile token. Tokens are single-use (consumed on server-side
 * verification), so concurrent callers are queued and each gets its own token.
 *
 * @returns {Promise<string|null>} The Turnstile token, or null if unavailable
 */
export const getTurnstileToken = async () => {
  if (typeof window === 'undefined' || !SITE_KEY) return null;

  try {
    await loadScript();
    renderWidget();
  } catch {
    return null;
  }

  const result = _queue.then(requestToken, requestToken);
  _queue = result.catch(() => null);
  return result;
};

/**
 * Initialize Turnstile early (e.g., on app mount).
 * Pre-loads the script and renders the widget so the first
 * getTurnstileToken() call resolves faster.
 */
export const initTurnstile = async () => {
  if (typeof window === 'undefined' || !SITE_KEY) return;

  try {
    await loadScript();
    renderWidget();
  } catch {
    // Non-critical — tokens will be requested on demand
  }
};
