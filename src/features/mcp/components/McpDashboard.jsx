"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { Stack, Alert, Paper, Typography, CircularProgress, Box } from "@mui/material";
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

      <Suspense
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        }
      >
        <BuyCreditsPanel
          currentCredits={status?.credits?.remaining}
          onCreditsUpdated={refreshStatus}
        />
      </Suspense>

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
