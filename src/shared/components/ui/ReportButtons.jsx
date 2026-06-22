"use client";

import { Button } from "@mui/material";

export function ReportMissingButton({ onOpen }) {
  return (
    <Button
      variant="text"
      color="primary"
      onClick={onOpen}
      sx={{ mt: 2 }}
      slots={{ root: "button" }}
    >
      Bank or Card / MCC Missing?
    </Button>
  );
}

export function ReportIncorrectButton({ onOpen }) {
  return (
    <Button
      variant="text"
      color="primary"
      onClick={onOpen}
      sx={{ mt: 2 }}
      slots={{ root: "button" }}
    >
      Report Incorrect Reward
    </Button>
  );
}
