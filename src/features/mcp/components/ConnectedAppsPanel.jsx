"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Apps as AppsIcon } from "@mui/icons-material";
import { listMcpOAuthGrants, revokeMcpOAuthGrant } from "@/core/services/mcpApi";

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" }) : null;
}

/**
 * OAuth clients the user approved on api.ccreward.app/authorize, with a Disconnect button.
 * Client names are picked by whoever registered the client, so the redirect host is shown too.
 * onChange: called after a disconnect so the status/balance elsewhere can refresh.
 */
function ConnectedAppsPanel({ onChange }) {
  const [grants, setGrants] = useState(null); // null while loading
  const [cursor, setCursor] = useState(null);
  const [unavailable, setUnavailable] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [confirm, setConfirm] = useState(null); // grant to disconnect
  const [revoking, setRevoking] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await listMcpOAuthGrants();
      setUnavailable(Boolean(data.unavailable));
      setGrants(data.grants || []);
      setCursor(data.cursor || null);
    } catch (err) {
      setError(err.message || "Failed to load connected apps.");
      setGrants([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await listMcpOAuthGrants(cursor);
      setGrants((prev) => [...prev, ...(data.grants || [])]);
      setCursor(data.cursor || null);
    } catch (err) {
      setError(err.message || "Failed to load connected apps.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRevoke = async () => {
    const grant = confirm;
    setRevoking(true);
    setError(null);
    try {
      await revokeMcpOAuthGrant(grant.id);
      setGrants((prev) => prev.filter((g) => g.id !== grant.id));
      onChange?.();
    } catch (err) {
      setError(err.message || "Failed to disconnect the app.");
    } finally {
      setRevoking(false);
      setConfirm(null);
    }
  };

  // OAuth isn't configured on this API deploy, so there's nothing to manage
  if (unavailable) return null;

  const appName = (g) => g.clientName || g.redirectHosts?.[0] || "Unnamed app";

  return (
    <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        <AppsIcon color="primary" />
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          Connected apps
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Apps you signed in to with your ccreward account. They share your credits with
        your API key. Disconnecting an app doesn&apos;t change your API key, and
        regenerating the key doesn&apos;t disconnect apps. Deleting your account ends
        both.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {grants === null ? (
        <Stack alignItems="center" sx={{ py: 2 }}>
          <CircularProgress size={24} />
        </Stack>
      ) : grants.length === 0 ? (
        !error && (
          <Typography variant="body2" color="text.secondary">
            No apps connected yet. Follow the Sign in (OAuth) steps below to connect one.
          </Typography>
        )
      ) : (
        <List disablePadding>
          {grants.map((g, i) => {
            const hosts = g.redirectHosts?.length ? g.redirectHosts.join(", ") : null;
            const connected = formatDate(g.createdAt);
            const expires = formatDate(g.expiresAt);
            return (
              <ListItem
                key={g.id}
                divider={i < grants.length - 1}
                disableGutters
                sx={{ gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}
              >
                <ListItemText
                  primary={appName(g)}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                  secondary={[
                    hosts && `Returns to ${hosts}`,
                    connected && `Connected ${connected}`,
                    expires && `Expires ${expires} unless used`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => setConfirm(g)}
                  sx={{ flexShrink: 0 }}
                  aria-label={`Disconnect ${appName(g)}`}
                >
                  Disconnect
                </Button>
              </ListItem>
            );
          })}
        </List>
      )}

      {cursor && (
        <Button onClick={loadMore} disabled={loadingMore} sx={{ mt: 1 }}>
          {loadingMore ? <CircularProgress size={18} /> : "Show more"}
        </Button>
      )}

      <Dialog open={Boolean(confirm)} onClose={() => !revoking && setConfirm(null)}>
        <DialogTitle>Disconnect {confirm ? appName(confirm) : "app"}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            It loses access to ccreward right away and has to sign in again to reconnect.
            Your API key and credits are not affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)} disabled={revoking}>
            Cancel
          </Button>
          <Button
            onClick={handleRevoke}
            color="error"
            variant="contained"
            disabled={revoking}
            startIcon={revoking ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Disconnect
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ConnectedAppsPanel;
