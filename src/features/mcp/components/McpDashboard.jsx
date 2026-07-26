"use client";

import { useCallback, useEffect, useState } from "react";
import { Stack, Alert, Paper, Typography } from "@mui/material";
import { getMcpCredentialsStatus } from "@/core/services/mcpApi";
import CredentialPanel from "./CredentialPanel";
import UsagePanel from "./UsagePanel";
import BuyCreditsPanel from "./BuyCreditsPanel";
import SetupInstructions from "./SetupInstructions";

function McpDashboard() {
  const [status, setStatus] = useState(null);
  const [statusError, setStatusError] = useState(null);

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
  }, [refreshStatus]);

  return (
    <Stack spacing={4}>
      {statusError && <Alert severity="error">{statusError}</Alert>}

      <CredentialPanel status={status} onRefreshStatus={refreshStatus} />

      <UsagePanel status={status} />

      <BuyCreditsPanel
        currentCredits={status?.credits?.remaining}
        onCreditsUpdated={refreshStatus}
      />

      {status?.exists && (
        <Paper elevation={0} variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Setup instructions
          </Typography>
          <SetupInstructions />
        </Paper>
      )}
    </Stack>
  );
}

export default McpDashboard;
