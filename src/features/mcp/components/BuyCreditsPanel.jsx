"use client";

import { useRef, useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  Button,
  ButtonGroup,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import { createMcpRazorpayOrder, getMcpUsage } from "@/core/services/mcpApi";
import { loadRazorpayScript } from "@/core/utils/loadRazorpayScript";

const PACKAGES = [
  { id: "credits_100", label: "100 credits" },
  { id: "credits_500", label: "500 credits" },
  { id: "credits_1000", label: "1000 credits" },
];

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 45000;

/**
 * secret: the MCP clientSecret held for this session — required to poll /v4/usage
 * after checkout so we can confirm the webhook actually credited the account.
 */
function BuyCreditsPanel({ secret, currentCredits, onCreditsUpdated }) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ordering | processing | done | timeout | error
  const [error, setError] = useState(null);
  const pollTimer = useRef(null);
  const pollDeadline = useRef(null);

  const stopPolling = () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  };

  const startPolling = (baselineCredits) => {
    pollDeadline.current = Date.now() + POLL_TIMEOUT_MS;
    pollTimer.current = setInterval(async () => {
      try {
        const usage = await getMcpUsage(secret);
        if (usage.mcpCreditsRemaining > baselineCredits) {
          stopPolling();
          setStatus("done");
          onCreditsUpdated?.(usage);
          return;
        }
      } catch {
        // Keep polling — transient errors shouldn't abort the wait.
      }
      if (Date.now() >= pollDeadline.current) {
        stopPolling();
        setStatus("timeout");
      }
    }, POLL_INTERVAL_MS);
  };

  const handleBuy = async (pkg) => {
    if (!secret) {
      setError("We need your MCP secret to confirm the purchase. Paste it in the balance card above first.");
      return;
    }
    setSelectedPkg(pkg);
    setStatus("ordering");
    setError(null);
    try {
      const order = await createMcpRazorpayOrder(pkg);
      const Razorpay = await loadRazorpayScript();

      const rzp = new Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "ccreward",
        description: `${order.credits} MCP credits`,
        handler: () => {
          setStatus("processing");
          startPolling(currentCredits ?? 0);
        },
        modal: {
          ondismiss: () => {
            setStatus((prev) => (prev === "ordering" ? "idle" : prev));
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to start checkout.");
      setStatus("error");
    }
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <ShoppingCartIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Buy more credits
        </Typography>
      </Stack>

      <ButtonGroup variant="outlined" sx={{ mb: 2, flexWrap: "wrap" }}>
        {PACKAGES.map((pkg) => (
          <Button
            key={pkg.id}
            onClick={() => handleBuy(pkg.id)}
            disabled={status === "ordering" || status === "processing"}
          >
            {pkg.label}
          </Button>
        ))}
      </ButtonGroup>

      {status === "ordering" && (
        <Alert severity="info" icon={<CircularProgress size={18} />}>
          Opening checkout for {selectedPkg}...
        </Alert>
      )}
      {status === "processing" && (
        <Alert severity="info" icon={<CircularProgress size={18} />}>
          Processing — crediting your account. This usually takes a few seconds.
        </Alert>
      )}
      {status === "done" && <Alert severity="success">Credits added to your account.</Alert>}
      {status === "timeout" && (
        <Alert severity="warning">
          Payment received — if your balance doesn&apos;t update within a few minutes,
          please contact support.
        </Alert>
      )}
      {status === "error" && error && <Alert severity="error">{error}</Alert>}
    </Paper>
  );
}

export default BuyCreditsPanel;
