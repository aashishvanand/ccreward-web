"use client";

import { Paper, Box, Typography, Stack, Chip } from "@mui/material";
import {
  Terminal as TerminalIcon,
  Bolt as BoltIcon,
  CreditCard as CreditCardIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useAuth } from "@/core/providers/AuthContext";
import SignInButtons from "@/shared/components/auth/SignInButtons";
import CodeBlock from "./CodeBlock";

const EXAMPLE_CONFIG = `{
  "mcpServers": {
    "ccreward": {
      "url": "https://api.ccreward.app/mcp",
      "headers": { "x-api-key": "<your-secret-key>" }
    }
  }
}`;

const FEATURES = [
  { icon: BoltIcon, label: "Calculate rewards for any purchase, mid-conversation" },
  { icon: CreditCardIcon, label: "Compare cards and find the best one for a spend" },
  { icon: SearchIcon, label: "Look up merchant category codes (MCC) on the fly" },
];

function McpMarketing() {
  const { signInWithGoogle, signInWithApple } = useAuth();

  return (
    <Stack spacing={4}>
      <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TerminalIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Use ccreward in your AI workflow
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          ccreward speaks MCP (Model Context Protocol), so you can ask Claude Code, Claude
          Desktop, or any other MCP client to calculate rewards, compare cards, and look up
          merchant category codes — without leaving your terminal or editor.
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {FEATURES.map(({ icon: Icon, label }) => (
            <Stack direction="row" spacing={1.5} alignItems="center" key={label}>
              <Icon fontSize="small" color="action" />
              <Typography variant="body2">{label}</Typography>
            </Stack>
          ))}
        </Stack>
        <Chip label="Sign in to generate your API key" size="small" sx={{ mb: 2 }} />
        <SignInButtons
          onGoogleSignIn={signInWithGoogle}
          onAppleSignIn={signInWithApple}
          direction="row"
          fullWidth={false}
          size="medium"
        />
      </Paper>

      <Paper elevation={0} variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          What it looks like
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Once you have a key, add ccreward as an MCP server with a config like this:
        </Typography>
        <CodeBlock code={EXAMPLE_CONFIG} language="json" />
      </Paper>
    </Stack>
  );
}

export default McpMarketing;
