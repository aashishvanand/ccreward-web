"use client";

import { useCallback, useEffect, useState } from "react";
import { Stack, Alert, Paper, Typography } from "@mui/material";
import { getMcpCredentialsStatus } from "@/core/services/mcpApi";
import { getStoredMcpSecret } from "@/core/utils/mcpSecretStorage";
import CredentialPanel from "./CredentialPanel";
import UsagePanel from "./UsagePanel";
import BuyCreditsPanel from "./BuyCreditsPanel";
import SetupInstructions from "./SetupInstructions";

function McpDashboard() {
  const [status, setStatus] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [secret, setSecret] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const refreshStatus = useCallback(async () => {
    try {
      const data = await getMcpCredentialsStatus();
      setStatus(data);
    } catch (err) {
      setStatusError(err.message || "Failed to load MCP status.");
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const stored = getStoredMcpSecret();
    if (stored?.secret) {
      setSecret(stored.secret);
    }
  }, [refreshStatus]);

  const handleSecretIssued = ({ clientSecret }) => {
    setSecret(clientSecret);
    setRefreshToken((n) => n + 1);
  };

  const handleSecretProvided = (value) => {
    setSecret(value);
  };

  return (
    <Stack spacing={4}>
      {statusError && <Alert severity="error">{statusError}</Alert>}

      <CredentialPanel
        status={status}
        onRefreshStatus={refreshStatus}
        onSecretIssued={handleSecretIssued}
      />

      <UsagePanel
        secret={secret}
        onSecretProvided={handleSecretProvided}
        refreshToken={refreshToken}
      />

      <BuyCreditsPanel
        secret={secret}
        currentCredits={status?.credits?.remaining}
        onCreditsUpdated={() => setRefreshToken((n) => n + 1)}
      />

      {status?.exists && (
        <Paper elevation={0} variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Setup instructions
          </Typography>
          <SetupInstructions secret={secret} />
        </Paper>
      )}
    </Stack>
  );
}

export default McpDashboard;
