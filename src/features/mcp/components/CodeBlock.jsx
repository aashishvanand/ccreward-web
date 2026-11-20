"use client";

import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ContentCopy as ContentCopyIcon, Check as CheckIcon } from "@mui/icons-material";

// The visually hidden live region carries the copy result to screen readers;
// tooltip text alone is not reliably announced.
const STATUS_RESET_MS = 2000;

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  const handleCopy = async () => {
    clearTimer();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setFailed(false);
    } catch (error) {
      // Clipboard is blocked (permission denied, insecure context, Firefox
      // config): say so instead of failing silently.
      console.error("Failed to copy:", error);
      setFailed(true);
      setCopied(false);
    }
    timer.current = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, STATUS_RESET_MS);
  };

  const statusText = failed ? "Couldn't copy" : copied ? "Copied" : "";

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: (theme) => ({
          bgcolor: "grey.100",
          ...theme.applyStyles("dark", { bgcolor: "grey.900" }),
        }),
        borderRadius: 1.5,
        p: 2,
        overflowX: "auto",
      }}
    >
      <Tooltip title={failed ? "Couldn't copy" : copied ? "Copied!" : "Copy"}>
        <IconButton
          size="small"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
          sx={{ position: "absolute", top: 6, right: 6 }}
        >
          {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Box
        component="span"
        aria-live="polite"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        {statusText}
      </Box>
      <Box
        component="pre"
        data-language={language}
        sx={{
          m: 0,
          pr: 4,
          fontFamily: "monospace",
          fontSize: "0.85rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {code}
      </Box>
    </Box>
  );
}

export default CodeBlock;
