"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import CodeBlock from "./CodeBlock";
import SetupInstructions from "./SetupInstructions";

function downloadMcpConfig(secret) {
  const config = {
    mcpServers: {
      ccreward: {
        url: "https://api.ccreward.app/mcp",
        headers: { "x-api-key": secret },
      },
    },
  };
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ccreward_mcp.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * One-time reveal of a freshly generated/rotated clientId + clientSecret.
 * The backend never returns the plaintext secret again after this closes.
 */
function SecretRevealDialog({ open, onClose, clientId, clientSecret }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Your MCP credentials</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This secret is shown only once. Copy it or download the config now — you
          won&apos;t be able to view it again (you can always rotate it for a new one).
        </Alert>

        <Stack spacing={2}>
          <div>
            <Typography variant="caption" color="text.secondary">
              Client ID
            </Typography>
            <CodeBlock code={clientId} language="text" />
          </div>
          <div>
            <Typography variant="caption" color="text.secondary">
              Client Secret
            </Typography>
            <CodeBlock code={clientSecret} language="text" />
          </div>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => downloadMcpConfig(clientSecret)}
          >
            Download ccreward_mcp.json
          </Button>

          <Divider />

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Setup instructions
          </Typography>
          <SetupInstructions secret={clientSecret} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          I&apos;ve saved my key
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SecretRevealDialog;
