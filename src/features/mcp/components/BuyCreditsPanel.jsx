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
import { createMcpRazorpayOrder, getMcpCredentialsStatus } from "@/core/services/mcpApi";
import { loadRazorpayScript } from "@/core/utils/loadRazorpayScript";

const PACKAGES = [
  { id: "credits_100", label: "100 credits", price: "₹25" },
  { id: "credits_500", label: "500 credits", price: "₹110" },
  { id: "credits_1000", label: "1000 credits", price: "₹200" },
];

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 45000;

/**
 * currentCredits: status.credits.remaining before checkout, used as the baseline
 * to detect the webhook has landed. onCreditsUpdated: called with the fresh status
 * once credits increase, so the parent can refresh CredentialPanel/UsagePanel.
 */
function BuyCreditsPanel({ currentCredits, onCreditsUpdated }) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [checkoutState, setCheckoutState] = useState("idle"); // idle | ordering | processing | done | timeout | error
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
        const latest = await getMcpCredentialsStatus();
        if ((latest.credits?.remaining ?? 0) > baselineCredits) {
          stopPolling();
          setCheckoutState("done");
          onCreditsUpdated?.(latest);
          return;
        }
      } catch {
        // Keep polling — transient errors shouldn't abort the wait.
      }
      if (Date.now() >= pollDeadline.current) {
        stopPolling();
        setCheckoutState("timeout");
      }
    }, POLL_INTERVAL_MS);
  };

  const handleBuy = async (pkg) => {
    setSelectedPkg(pkg);
    setCheckoutState("ordering");
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
          setCheckoutState("processing");
          startPolling(currentCredits);
        },
        modal: {
          ondismiss: () => {
            setCheckoutState((prev) => (prev === "ordering" ? "idle" : prev));
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to start checkout.");
      setCheckoutState("error");
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
            disabled={
              currentCredits === undefined ||
              checkoutState === "ordering" ||
              checkoutState === "processing"
            }
          >
            {pkg.label} ({pkg.price})
          </Button>
        ))}
      </ButtonGroup>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        Purchased credits are valid for 1 year from the date of purchase.
      </Typography>

      {checkoutState === "ordering" && (
        <Alert severity="info" icon={<CircularProgress size={18} />}>
          Opening checkout for {selectedPkg}...
        </Alert>
      )}
      {checkoutState === "processing" && (
        <Alert severity="info" icon={<CircularProgress size={18} />}>
          Processing — crediting your account. This usually takes a few seconds.
        </Alert>
      )}
      {checkoutState === "done" && <Alert severity="success">Credits added to your account.</Alert>}
      {checkoutState === "timeout" && (
        <Alert severity="warning">
          Payment received — if your balance doesn&apos;t update within a few minutes,
          please contact support.
        </Alert>
      )}
      {checkoutState === "error" && error && <Alert severity="error">{error}</Alert>}
    </Paper>
  );
}

export default BuyCreditsPanel;
