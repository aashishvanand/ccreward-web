"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  createMcpRazorpayOrder,
  createMcpStripeCheckoutSession,
  getMcpCredentialsStatus,
} from "@/core/services/mcpApi";
import { loadRazorpayScript } from "@/core/utils/loadRazorpayScript";
import { useRegion } from "@/core/providers/RegionContext";

const PACKAGES_BY_REGION = {
  IN: [
    { id: "credits_100", label: "100 credits", price: "₹25" },
    { id: "credits_500", label: "500 credits", price: "₹110" },
    { id: "credits_1000", label: "1000 credits", price: "₹200" },
  ],
  SG: [
    { id: "credits_100", label: "100 credits", price: "S$2" },
    { id: "credits_500", label: "500 credits", price: "S$5" },
    { id: "credits_1000", label: "1000 credits", price: "S$7" },
  ],
};

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 45000;

/**
 * currentCredits: status.credits.remaining before checkout, used as the baseline
 * to detect the webhook has landed. onCreditsUpdated: called with the fresh status
 * once credits increase, so the parent can refresh CredentialPanel/UsagePanel.
 */
function BuyCreditsPanel({ currentCredits, onCreditsUpdated }) {
  const { region } = useRegion();
  const packages = PACKAGES_BY_REGION[region] || PACKAGES_BY_REGION.IN;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPkg, setSelectedPkg] = useState(null);
  // idle | ordering | processing | done | timeout | cancelled | error
  const [checkoutState, setCheckoutState] = useState("idle");
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

  // Picks up the redirect back from Stripe-hosted Checkout (?checkout=success|cancelled
  // on this same page — set as success_url/cancel_url on the backend). Credits are
  // granted by the /webhook/stripe call, not this redirect, so we just resume polling.
  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (!checkout) return;

    if (checkout === "success") {
      setCheckoutState("processing");
      startPolling(currentCredits ?? 0);
    } else if (checkout === "cancelled") {
      setCheckoutState("cancelled");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("checkout");
    router.replace(params.size ? `?${params.toString()}` : window.location.pathname);
    // Only run once, on the redirect back from Stripe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuy = async (pkg) => {
    setSelectedPkg(pkg);
    setCheckoutState("ordering");
    setError(null);

    if (region === "SG") {
      try {
        const session = await createMcpStripeCheckoutSession(pkg);
        window.location.href = session.url;
      } catch (err) {
        setError(err.message || "Failed to start checkout.");
        setCheckoutState("error");
      }
      return;
    }

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

      <ButtonGroup variant="outlined" sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
        {packages.map((pkg) => (
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

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, mb: 2 }}>
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
      {checkoutState === "cancelled" && <Alert severity="info">Checkout was cancelled.</Alert>}
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
