"use client";

import { Paper, Typography, Stack, LinearProgress } from "@mui/material";
import { AccountBalanceWallet as WalletIcon } from "@mui/icons-material";

/**
 * status: result of GET /v4/mcp/api-key (Firebase-authenticated), which already
 * includes { credits: { limit, used, remaining } } — no need to re-authenticate with
 * the x-api-key secret just to show a balance the signed-in user already has access to.
 */
function UsagePanel({ status }) {
  if (!status?.exists) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <WalletIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Credit balance
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Generate credentials above to start using your MCP credits.
        </Typography>
      </Paper>
    );
  }

  const { credits } = status;

  return (
    <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <WalletIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Credit balance
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          {credits?.remaining ?? "—"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          credits remaining
        </Typography>
        {credits && (
          <LinearProgress
            variant="determinate"
            value={credits.limit ? Math.min((credits.used / credits.limit) * 100, 100) : 0}
            sx={{ height: 8, borderRadius: 4 }}
          />
        )}
        {credits && (
          <Typography variant="caption" color="text.secondary">
            {credits.used} of {credits.limit} used
          </Typography>
        )}
        {status.lastUsedAt && (
          <Typography variant="caption" color="text.secondary">
            Last used: {new Date(status.lastUsedAt).toLocaleString()}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default UsagePanel;
