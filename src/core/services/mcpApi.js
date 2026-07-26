import { api } from './api';

// Handle API errors the same way api.js does, plus MCP-specific error codes.
const handleMcpError = (error) => {
    const body = error.response?.data;
    const code = body?.code || body?.error;

    if (error.response?.status === 409 && code === 'MCP_CREDENTIALS_EXISTS') {
        const err = new Error('MCP credentials already exist for this account.');
        err.code = 'MCP_CREDENTIALS_EXISTS';
        throw err;
    }

    if (error.response?.status === 404) {
        const err = new Error('No MCP credentials found. Generate credentials first.');
        err.code = 'MCP_CREDENTIALS_NOT_FOUND';
        throw err;
    }

    if (error.response?.status === 401) {
        const err = new Error('This key is invalid or was rotated.');
        err.code = 'MCP_INVALID_KEY';
        throw err;
    }

    if (!error.response && error.request) {
        throw new Error('Network error. Please check your internet connection.');
    }

    console.error('MCP API Error:', body || error.message);
    throw error;
};

/**
 * Generate an MCP API key (one-time). Returns the plaintext apiKey —
 * it is never retrievable again after this call.
 * POST /v4/mcp/api-key
 */
export const generateMcpCredentials = async () => {
    try {
        const response = await api.post('/v4/mcp/api-key');
        return response.data;
    } catch (error) {
        return handleMcpError(error);
    }
};

/**
 * Get MCP key status (existence, activity, expiry, credits) for the settings page.
 * GET /v4/mcp/api-key
 */
export const getMcpCredentialsStatus = async () => {
    try {
        const response = await api.get('/v4/mcp/api-key');
        return response.data;
    } catch (error) {
        return handleMcpError(error);
    }
};

/**
 * Reissue the API key. The old key is invalidated everywhere.
 * POST /v4/mcp/api-key/rotate
 */
export const rotateMcpCredentials = async () => {
    try {
        const response = await api.post('/v4/mcp/api-key/rotate');
        return response.data;
    } catch (error) {
        return handleMcpError(error);
    }
};

/**
 * Create a Razorpay order to buy MCP credits.
 * POST /v4/payments/razorpay/order
 */
export const createMcpRazorpayOrder = async (pkg) => {
    try {
        const response = await api.post('/v4/payments/razorpay/order', { package: pkg });
        return response.data;
    } catch (error) {
        return handleMcpError(error);
    }
};
