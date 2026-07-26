"use client";

import { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Alert,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Key as KeyIcon, Autorenew as AutorenewIcon } from "@mui/icons-material";
import {
  generateMcpCredentials,
  rotateMcpCredentials,
} from "@/core/services/mcpApi";
import SecretRevealDialog from "./SecretRevealDialog";

/**
 * status: result of GET /v4/mcp/api-key, or null while loading.
 * onRefreshStatus: re-fetches status after generate/rotate so the balance/setup
 * sections elsewhere on the page pick up the change.
 */
function CredentialPanel({ status, onRefreshStatus }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [reveal, setReveal] = useState(null); // { apiKey }
  const [confirmRotate, setConfirmRotate] = useState(false);

  const handleGenerate = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await generateMcpCredentials();
      setReveal(result);
      onRefreshStatus?.();
    } catch (err) {
      setError(err.message || "Failed to generate credentials.");
    } finally {
      setBusy(false);
    }
  };

  const handleRotate = async () => {
    setConfirmRotate(false);
    setBusy(true);
    setError(null);
    try {
      const result = await rotateMcpCredentials();
      setReveal(result);
      onRefreshStatus?.();
    } catch (err) {
      setError(err.message || "Failed to rotate credentials.");
    } finally {
      setBusy(false);
    }
  };

  if (!status) {
    return (
      <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, textAlign: "center" }}>
        <CircularProgress size={28} />
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <KeyIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          API credentials
        </Typography>
        {status.exists && (
          <Chip
            size="small"
            label={status.isActive ? "Active" : "Inactive"}
            color={status.isActive ? "success" : "default"}
          />
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!status.exists ? (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You haven&apos;t generated an MCP key yet. Generate one to connect ccreward to
            Claude Code or another MCP client.
          </Typography>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={busy}
            startIcon={busy ? <CircularProgress size={18} /> : <KeyIcon />}
          >
            Generate credentials
          </Button>
        </>
      ) : (
        <>
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            {status.lastUsedAt && (
              <Typography variant="body2" color="text.secondary">
                Last used: {new Date(status.lastUsedAt).toLocaleString()}
              </Typography>
            )}
            {status.expiresAt && (
              <Typography variant="body2" color="text.secondary">
                Expires: {new Date(status.expiresAt).toLocaleString()}
              </Typography>
            )}
          </Stack>
          <Button
            variant="outlined"
            onClick={() => setConfirmRotate(true)}
            disabled={busy}
            startIcon={busy ? <CircularProgress size={18} /> : <AutorenewIcon />}
          >
            Regenerate key
          </Button>
        </>
      )}

      <Dialog open={confirmRotate} onClose={() => setConfirmRotate(false)}>
        <DialogTitle>Regenerate API key?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This invalidates your current key everywhere it&apos;s pasted — in Claude
            Code, downloaded config files, anywhere. You&apos;ll need to update it in
            every place you&apos;ve used it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRotate(false)}>Cancel</Button>
          <Button onClick={handleRotate} color="warning" variant="contained">
            Regenerate
          </Button>
        </DialogActions>
      </Dialog>

      {reveal && (
        <SecretRevealDialog
          open={Boolean(reveal)}
          onClose={() => setReveal(null)}
          apiKey={reveal.apiKey}
        />
      )}
    </Paper>
  );
}

export default CredentialPanel;
