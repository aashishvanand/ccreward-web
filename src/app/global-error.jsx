"use client";

import { useEffect } from "react";

// global-error.jsx catches errors thrown by the root layout itself.
// It cannot use layout children (Header, Footer, Providers) since the layout crashed.
// Must render its own <html> and <body>.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "1.5rem",
          boxSizing: "border-box",
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: "1rem" }}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem" }}>
          Something went wrong
        </h1>

        <p style={{ color: "#94a3b8", maxWidth: "480px", marginBottom: "2rem", lineHeight: 1.6 }}>
          A critical error occurred. Please try refreshing the page. If the problem persists, contact{" "}
          <a href="mailto:support@ccreward.app" style={{ color: "#60a5fa" }}>
            support@ccreward.app
          </a>
          .
        </p>

        <button
          onClick={reset}
          style={{
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
