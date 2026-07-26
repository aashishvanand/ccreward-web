const STORAGE_KEY = 'mcp-secret';

/**
 * Opt-in local persistence for the MCP clientSecret, since the backend only
 * ever returns it once. Only written when the user explicitly checks
 * "remember this key on this device" — never by default.
 */
export const saveMcpSecret = (clientId, secret) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ clientId, secret }));
};

export const getStoredMcpSecret = () => {
    if (typeof localStorage === 'undefined') return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const clearStoredMcpSecret = () => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
};
