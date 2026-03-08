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
let _tokenResolvers = [];

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
    callback: (token) => {
      // Resolve any pending token requests
      const resolvers = _tokenResolvers;
      _tokenResolvers = [];
      resolvers.forEach((resolve) => resolve(token));
    },
    'error-callback': () => {
      // Reject pending requests
      const resolvers = _tokenResolvers;
      _tokenResolvers = [];
      resolvers.forEach((resolve) => resolve(null));
    },
    'expired-callback': () => {
      // No-op: tokens are always freshly requested before each API call
    },
  });
};

/**
 * Get a fresh Turnstile token. Always resets the widget and requests
 * a new token, since Turnstile tokens are single-use (consumed on
 * server-side verification).
 *
 * @returns {Promise<string|null>} The Turnstile token, or null if unavailable
 */
export const getTurnstileToken = async () => {
  if (typeof window === 'undefined' || !SITE_KEY) return null;

  try {
    await loadScript();
    renderWidget();

    // Always request a fresh token (tokens are single-use)
    return new Promise((resolve) => {
      _tokenResolvers.push(resolve);

      // Timeout after 5s — don't block API calls indefinitely
      setTimeout(() => {
        const idx = _tokenResolvers.indexOf(resolve);
        if (idx !== -1) {
          _tokenResolvers.splice(idx, 1);
          resolve(null);
        }
      }, 5000);

      if (_widgetId !== null && window.turnstile) {
        window.turnstile.reset(_widgetId);
      }
    });
  } catch {
    return null;
  }
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
