"use client";

import { useEffect } from "react";
import { Box, Container, Typography, Button, Stack, Paper, Alert } from "@mui/material";
import { Refresh as RefreshIcon, BugReport as BugReportIcon } from "@mui/icons-material";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { recordFatalError, logBreadcrumb } from "../core/services/crashlytics";

export default function Error({ error, reset }) {
  useEffect(() => {
    const errorId = `error_${Date.now()}_${crypto.randomUUID().replace(/-/g, "").slice(0, 9)}`;

    recordFatalError("route_segment_error", {
      error_id: errorId,
      error_message: error.message,
      error_stack: error.stack,
      error_digest: error.digest,
      page_url: typeof window !== "undefined" ? window.location.href : "unknown",
      timestamp: new Date().toISOString(),
    });

    logBreadcrumb("Next.js error boundary triggered", "error", {
      error_id: errorId,
      error_message: error.message,
      error_digest: error.digest,
    });
  }, [error]);

  const handleReportBug = () => {
    const errorDetails = {
      errorMessage: error.message,
      errorDigest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      url: typeof window !== "undefined" ? window.location.href : "unknown",
    };

    const emailBody = `
Error Report for ccreward

Timestamp: ${errorDetails.timestamp}
URL: ${errorDetails.url}
Error: ${errorDetails.errorMessage}
Digest: ${errorDetails.errorDigest || "N/A"}
User Agent: ${errorDetails.userAgent}

Please describe what you were doing when this error occurred:
[Your description here]
    `.trim();

    const emailSubject = `ccreward Error Report - ${errorDetails.timestamp}`;
    const emailUrl = `mailto:support@ccreward.app?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    if (typeof window !== "undefined") {
      window.open(emailUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            animation: "errorFadeIn 0.5s ease-out",
            "@keyframes errorFadeIn": {
              from: { opacity: 0, transform: "scale(0.9)" },
              to: { opacity: 1, transform: "scale(1)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%", borderRadius: 2 }}>
            <BugReportIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />

            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "error.main" }}>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
              We've encountered an unexpected error. Our team has been notified and is working on a fix.
            </Typography>

            {process.env.NODE_ENV === "development" && error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  <strong>Error:</strong> {error.message}
                </Typography>
                {error.digest && (
                  <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                    Digest: {error.digest}
                  </Typography>
                )}
              </Alert>
            )}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
              <Button variant="contained" startIcon={<RefreshIcon />} onClick={reset} sx={{ flex: 1 }}>
                Try Again
              </Button>

              <Button variant="outlined" onClick={() => (window.location.href = "/")} sx={{ flex: 1 }}>
                Go Home
              </Button>

              <Button variant="outlined" startIcon={<BugReportIcon />} onClick={handleReportBug} sx={{ flex: 1 }}>
                Report Bug
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
