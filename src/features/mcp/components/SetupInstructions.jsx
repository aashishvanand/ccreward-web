"use client";

import { Box, Typography, Stack, Divider } from "@mui/material";
import CodeBlock from "./CodeBlock";

const MCP_URL = "https://api.ccreward.app/mcp";

function buildCliCommand(secret) {
  const key = secret || "<your-secret-key>";
  return `claude mcp add --transport http ccreward ${MCP_URL} --header "x-api-key: ${key}"`;
}

function buildProjectJson(secret) {
  const key = secret || "<your-secret-key>";
  return `{
  "mcpServers": {
    "ccreward": {
      "type": "http",
      "url": "${MCP_URL}",
      "headers": { "x-api-key": "${key}" }
    }
  }
}`;
}

function buildGenericJson(secret) {
  const key = secret || "<your-secret-key>";
  return `{
  "mcpServers": {
    "ccreward": {
      "url": "${MCP_URL}",
      "headers": { "x-api-key": "${key}" }
    }
  }
}`;
}

/**
 * secret: the plaintext clientSecret, when available (reveal dialog / remembered).
 * Falls back to a <your-secret-key> placeholder otherwise.
 */
function SetupInstructions({ secret }) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          1. Claude Code (CLI)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Run this in your terminal to register ccreward as an MCP server:
        </Typography>
        <CodeBlock code={buildCliCommand(secret)} language="bash" />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          2. Or add it to <code>.mcp.json</code> directly
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Useful for project-scoped config that's checked into version control:
        </Typography>
        <CodeBlock code={buildProjectJson(secret)} language="json" />
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          3. Other MCP clients (Claude Desktop, etc.)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Most MCP clients accept a config in this shape — this is also what the
          downloaded <code>ccreward_mcp.json</code> file contains:
        </Typography>
        <CodeBlock code={buildGenericJson(secret)} language="json" />
      </Box>

      <Typography variant="body2" color="text.secondary">
        Once connected, ask Claude to calculate rewards, compare cards, or look up MCC
        codes for you — right from your coding workflow.
      </Typography>
    </Stack>
  );
}

export default SetupInstructions;
