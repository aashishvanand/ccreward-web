"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Paper,
  Typography,
  Stack,
  LinearProgress,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AccountBalanceWallet as WalletIcon } from "@mui/icons-material";
import { getMcpUsage } from "@/core/services/mcpApi";

/**
 * secret: the clientSecret held in memory/localStorage for this session, or null.
 * onSecretProvided: called when the user pastes a secret in manually, so the
 * parent can hold it in state for the rest of the session (and for buy-credits polling).
 */
function UsagePanel({ secret, onSecretProvided, refreshToken }) {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pasteValue, setPasteValue] = useState("");

  const fetchUsage = useCallback(async (key) => {
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMcpUsage(key);
      setUsage(data);
    } catch (err) {
      setError(err.message || "Failed to load balance.");
      setUsage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (secret) {
      fetchUsage(secret);
    }
  }, [secret, refreshToken, fetchUsage]);

  const handlePasteSubmit = () => {
    if (!pasteValue.trim()) return;
    onSecretProvided?.(pasteValue.trim());
  };

  if (!secret) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <WalletIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Credit balance
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          We don&apos;t store your secret unless you asked us to. Paste it here to check
          your balance.
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            fullWidth
            type="password"
            placeholder="Paste your MCP client secret"
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
          />
          <Button variant="contained" onClick={handlePasteSubmit} disabled={!pasteValue.trim()}>
            Check
          </Button>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <WalletIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Credit balance
        </Typography>
      </Stack>

      {loading && !usage ? (
        <CircularProgress size={24} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : usage ? (
        <Stack spacing={1.5}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            {usage.mcpCreditsRemaining}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            credits remaining
          </Typography>
          {usage.credits && (
            <LinearProgress
              variant="determinate"
              value={Math.min(usage.credits.percentUsed ?? 0, 100)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          )}
          {usage.credits && (
            <Typography variant="caption" color="text.secondary">
              {usage.credits.used} of {usage.credits.limit} used
            </Typography>
          )}
          {usage.lastUsedAt && (
            <Typography variant="caption" color="text.secondary">
              Last used: {new Date(usage.lastUsedAt).toLocaleString()}
            </Typography>
          )}
        </Stack>
      ) : null}
    </Paper>
  );
}

export default UsagePanel;
