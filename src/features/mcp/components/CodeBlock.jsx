"use client";

import { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ContentCopy as ContentCopyIcon, Check as CheckIcon } from "@mui/icons-material";

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "grey.100"),
        borderRadius: 1.5,
        p: 2,
        overflowX: "auto",
      }}
    >
      <Tooltip title={copied ? "Copied!" : "Copy"}>
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
