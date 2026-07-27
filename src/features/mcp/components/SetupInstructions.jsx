"use client";

import { Box, Typography, Stack, Divider, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import CodeBlock from "./CodeBlock";

const MCP_URL = "https://api.ccreward.app/mcp";
const PROMPT_URL = "https://developer.ccreward.app/agent-setup/prompt.md";

const TOOLS = [
  { name: "ccreward_search_card", purpose: "Search for a card by name/keyword/abbreviation. Always call this first to resolve the exact bank/cardName." },
  { name: "ccreward_get_card_details", purpose: "Full card details — fees, benefits, lounge access, exclusions." },
  { name: "ccreward_get_merchant_mcc", purpose: "Resolve a merchant/category name (or 4-digit MCC) to its MCC. Call before calculating rewards." },
  { name: "ccreward_get_card_questions", purpose: "Get clarifying questions needed for an accurate reward calc. Call before calculate_reward if unsure." },
  { name: "ccreward_calculate_reward", purpose: "Calculate points/cashback/miles for a transaction on one card." },
  { name: "ccreward_get_best_card", purpose: "Compare a portfolio of cards and rank the best one for a transaction." },
  { name: "ccreward_get_transfer_partners", purpose: "Airline/hotel transfer partners and ratios for a card's points." },
  { name: "ccreward_search_bank_tnc", purpose: "Semantic search over official bank T&Cs/fee schedules (forex markup, grace periods, etc.)." },
  { name: "ccreward_submit_feedback", purpose: "Submit a vote/written feedback on a reward result. The only tool with a side effect." },
];

function buildCliCommand(secret) {
  const key = secret || "<your-secret-key>";
  return `claude mcp add --transport http ccreward ${MCP_URL} --header "x-api-key: ${key}"`;
}

function buildProjectJson() {
  return `{
  "mcpServers": {
    "ccreward": {
      "type": "http",
      "url": "${MCP_URL}",
      "headers": { "x-api-key": "\${CCREWARD_MCP_KEY}" }
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
 * A single copy-pasteable blob, mirroring Cloudflare's agent-setup/prompt.md pattern:
 * paste this whole thing into any agent chat and it can register the server, and
 * knows what tools it has (and doesn't have) without a separate round trip.
 */
function buildFullPrompt(secret) {
  const key = secret || "<your-secret-key>";
  return `# ccreward MCP setup

Register ccreward as an MCP server, then use its tools for credit card reward
calculations, card comparisons, and MCC lookups.

## 1. Register the server

Endpoint: ${MCP_URL}
Auth: header "x-api-key: ${key}"
Transport: Streamable HTTP, POST only, stateless.

Claude Code:
claude mcp add --transport http ccreward ${MCP_URL} --header "x-api-key: ${key}"

Other clients (.mcp.json / claude_desktop_config.json):
${buildGenericJson(secret)}

Restart or reconnect after registering.

## 2. Tools available (9 total, all read-only except the last)

${TOOLS.map((t) => `- ${t.name}: ${t.purpose}`).join("\n")}

Recommended flow for "what will I earn on this purchase?":
ccreward_search_card -> ccreward_get_merchant_mcc -> ccreward_get_card_questions -> ccreward_calculate_reward

Recommended flow for "which of my cards should I use here?":
ccreward_search_card (per card) -> ccreward_get_merchant_mcc -> ccreward_get_best_card

## 3. What this server can't do

No access to real bank accounts, cards, or transactions. Cannot apply for
cards, move money, or change account settings — it only reasons over card
metadata, MCC data, and indexed bank T&C documents.

## 4. Limits

429 "Rate limit exceeded" -> back off and retry. 429 "API quota exceeded" ->
key's plan is exhausted, don't retry blindly. 401/403 -> key missing, invalid,
or not scoped for MCP. A tool that fails 5 times in a row on the same key
pauses ~10 minutes for that key (re-run ccreward_search_card to confirm exact
bank/cardName rather than retrying).

Full reference (key-less, re-verifiable): ${PROMPT_URL}
`;
}

/**
 * secret: the plaintext apiKey, when available (reveal dialog / remembered).
 * Falls back to a <your-secret-key> placeholder otherwise.
 */
function SetupInstructions({ secret }) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Copy the full setup prompt
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Paste this whole block into Claude Code, Cursor, Claude Desktop, or any
          other agent chat — it registers the server and tells the agent exactly
          which tools it has (and doesn&apos;t have).
        </Typography>
        <CodeBlock code={buildFullPrompt(secret)} language="markdown" />
      </Box>

      <Divider />

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
          Useful for project-scoped config that&apos;s checked into version control.
          Never commit your actual key — reference it via an environment variable
          instead (set <code>CCREWARD_MCP_KEY</code> in your shell or a{" "}
          <code>.env</code> file that&apos;s gitignored):
        </Typography>
        <CodeBlock code={buildProjectJson()} language="json" />
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

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          What the agent can call
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Nine tools, all read-only except <code>ccreward_submit_feedback</code>.
          The server has no access to real accounts or transactions — it only
          reasons over card metadata, MCC data, and indexed bank documents.
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Tool</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Purpose</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TOOLS.map((t) => (
              <TableRow key={t.name}>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                  {t.name}
                </TableCell>
                <TableCell sx={{ fontSize: "0.85rem" }}>{t.purpose}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Once connected, ask Claude to calculate rewards, compare cards, or look up MCC
        codes for you — right from your coding workflow. Full reference (kept in sync,
        no key required): <code>{PROMPT_URL}</code>
      </Typography>
    </Stack>
  );
}

export default SetupInstructions;
