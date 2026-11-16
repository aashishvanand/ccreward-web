"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CodeBlock from "./CodeBlock";

const MCP_URL = "https://api.ccreward.app/mcp";
const PROMPT_URL = "https://developer.ccreward.app/agent-setup/prompt.md";

// Kept in sync with ccreward-api docs/mcp-guide.md §3
const TOOLS = [
  { name: "ccreward_search_card", purpose: "Search for a card by name/keyword/abbreviation. Always call this first to resolve the exact bank/cardName." },
  { name: "ccreward_get_card_details", purpose: "Full card details — fees, benefits, lounge access, exclusions." },
  { name: "ccreward_get_merchant_mcc", purpose: "Resolve a merchant/category name (or 4-digit MCC) to its MCC. Call before calculating rewards." },
  { name: "ccreward_get_card_questions", purpose: "Get clarifying questions needed for an accurate reward calc. Call before calculate_reward if unsure." },
  { name: "ccreward_calculate_reward", purpose: "Calculate points/cashback/miles for a transaction on one card." },
  { name: "ccreward_calculate_rewards_bulk", purpose: "Calculate rewards for up to 1,000 transactions on one card (e.g. a parsed statement). 25 credits per call." },
  { name: "ccreward_get_best_card", purpose: "Compare a portfolio of cards and rank the best one for a transaction. Omit cards to use your saved cards." },
  { name: "ccreward_get_transfer_partners", purpose: "Airline/hotel transfer partners and ratios for a card's points, including routes via another program." },
  { name: "ccreward_find_transfer_routes", purpose: "Work backwards from a target program (e.g. 100k KrisFlyer miles): which cards and points balances can reach it, the points needed and how long it takes." },
  { name: "ccreward_search_bank_tnc", purpose: "Semantic search over official bank T&Cs/fee schedules (forex markup, grace periods, etc.)." },
  { name: "ccreward_submit_feedback", purpose: "Submit a vote/written feedback on a reward result.", sideEffect: true },
  { name: "ccreward_get_my_cards", purpose: "List the cards saved to your ccreward.app account." },
  { name: "ccreward_add_card", purpose: "Add a card to your saved cards (updates it if it's already there).", sideEffect: true },
  { name: "ccreward_update_card", purpose: "Update details (network, last 4 digits, billing date, limit, ...) on a saved card.", sideEffect: true },
  { name: "ccreward_delete_card", purpose: "Remove a card from your saved cards.", sideEffect: true },
];

const SIDE_EFFECT_TOOLS = TOOLS.filter((t) => t.sideEffect).map((t) => t.name);

// ── API key snippets ──

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

// ── OAuth snippets: just the URL; the client registers itself and opens the sign-in page ──

const OAUTH_CLI_COMMAND = `claude mcp add --transport http ccreward ${MCP_URL}`;

const OAUTH_CURSOR_JSON = `{
  "mcpServers": {
    "ccreward": {
      "url": "${MCP_URL}"
    }
  }
}`;

const OAUTH_VSCODE_JSON = `{
  "servers": {
    "ccreward": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`;

function buildToolsSection() {
  return `## 2. Tools available (${TOOLS.length} total)

${TOOLS.map((t) => `- ${t.name}: ${t.purpose}`).join("\n")}

Tools with a side effect: ${SIDE_EFFECT_TOOLS.join(", ")}. Everything else is read-only.

Recommended flow for "what will I earn on this purchase?":
ccreward_search_card -> ccreward_get_merchant_mcc -> ccreward_get_card_questions -> ccreward_calculate_reward

Recommended flow for "which of my cards should I use here?":
ccreward_search_card (per card) -> ccreward_get_merchant_mcc -> ccreward_get_best_card

## 3. What this server can't do

No access to real bank accounts, cards, or transactions. Cannot apply for
cards, move money, or change account settings — it only reasons over card
metadata, MCC data, indexed bank T&C documents, and the cards saved to the
user's ccreward.app account.`;
}

/**
 * A single copy-pasteable blob, mirroring Cloudflare's agent-setup/prompt.md pattern:
 * paste this whole thing into any agent chat and it can register the server, and
 * knows what tools it has (and doesn't have) without a separate round trip.
 */
function buildFullPrompt(method, secret) {
  const key = secret || "<your-secret-key>";

  const register =
    method === "oauth"
      ? `Endpoint: ${MCP_URL}
Auth: OAuth 2.1 (discovered automatically from the server's 401 response;
dynamic client registration, PKCE S256). No API key or header needed.
Transport: Streamable HTTP, POST only, stateless.

Claude Code:
${OAUTH_CLI_COMMAND}
Then run /mcp, pick ccreward and choose Authenticate.

Other clients (.mcp.json and similar):
${OAUTH_CURSOR_JSON}

The client opens https://api.ccreward.app/authorize in the browser: sign in
with Google or an email code, then approve. Restart or reconnect afterwards.`
      : `Endpoint: ${MCP_URL}
Auth: header "x-api-key: ${key}"
Transport: Streamable HTTP, POST only, stateless.

Claude Code:
${buildCliCommand(secret)}

Other clients (.mcp.json / claude_desktop_config.json):
${buildGenericJson(secret)}

Restart or reconnect after registering.`;

  const authErrors =
    method === "oauth"
      ? `401 with error="invalid_token" -> the access token expired or was
revoked; refresh it or sign in again.`
      : `401/403 -> key missing, invalid, or not scoped for MCP.`;

  return `# ccreward MCP setup

Register ccreward as an MCP server, then use its tools for credit card reward
calculations, card comparisons, and MCC lookups.

## 1. Register the server

${register}

${buildToolsSection()}

## 4. Limits

Each account gets free tool calls every day (reset at 00:00 UTC), then uses
its credits. 429 "Rate limit exceeded" -> back off and retry. 429 "API quota
exceeded" -> out of credits, don't retry blindly. ${authErrors} A tool that
fails 5 times in a row pauses ~10 minutes (re-run ccreward_search_card to
confirm exact bank/cardName rather than retrying).

Full reference (key-less, re-verifiable): ${PROMPT_URL}
`;
}

function Step({ title, children }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Hint({ children, mb = 1 }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ mb }}>
      {children}
    </Typography>
  );
}

function OAuthSteps() {
  return (
    <>
      <Step title="1. Claude Code (CLI)">
        <Hint>Register the server, then sign in from inside Claude Code:</Hint>
        <CodeBlock code={OAUTH_CLI_COMMAND} language="bash" />
        <Hint mb={0}>
          Run <code>/mcp</code>, pick <strong>ccreward</strong> and choose{" "}
          <strong>Authenticate</strong>. Your browser opens the ccreward sign-in page.
        </Hint>
      </Step>

      <Divider />

      <Step title="2. Claude Desktop and claude.ai">
        <Hint mb={0}>
          Settings → Connectors → <strong>Add custom connector</strong>, enter{" "}
          <code>{MCP_URL}</code> and click Connect. Leave the OAuth client ID and secret
          empty.
        </Hint>
      </Step>

      <Divider />

      <Step title="3. Cursor">
        <Hint>
          Add this to <code>~/.cursor/mcp.json</code> (or the project&apos;s{" "}
          <code>.cursor/mcp.json</code>), then click <strong>Connect</strong> next to
          ccreward in Settings → MCP:
        </Hint>
        <CodeBlock code={OAUTH_CURSOR_JSON} language="json" />
      </Step>

      <Divider />

      <Step title="4. VS Code">
        <Hint>
          Add this to <code>.vscode/mcp.json</code>. VS Code asks you to sign in the first
          time it starts the server:
        </Hint>
        <CodeBlock code={OAUTH_VSCODE_JSON} language="json" />
      </Step>

      <Divider />

      <Hint mb={0}>
        Clients that run on your computer finish signing in through a{" "}
        <code>localhost</code> address. The approval page shows where you&apos;re being sent
        back to, so only approve clients you started yourself. You can disconnect any app
        under <strong>Connected apps</strong> on this page.
      </Hint>
    </>
  );
}

function ApiKeySteps({ secret }) {
  return (
    <>
      <Step title="1. Claude Code (CLI)">
        <Hint>Run this in your terminal to register ccreward as an MCP server:</Hint>
        <CodeBlock code={buildCliCommand(secret)} language="bash" />
      </Step>

      <Divider />

      <Step
        title={
          <>
            2. Or add it to <code>.mcp.json</code> directly
          </>
        }
      >
        <Hint>
          Useful for project-scoped config that&apos;s checked into version control.
          Never commit your actual key — reference it via an environment variable
          instead (set <code>CCREWARD_MCP_KEY</code> in your shell or a{" "}
          <code>.env</code> file that&apos;s gitignored):
        </Hint>
        <CodeBlock code={buildProjectJson()} language="json" />
      </Step>

      <Divider />

      <Step title="3. Other MCP clients and scripts">
        <Hint>
          Most MCP clients accept a config in this shape — this is also what the
          downloaded <code>ccreward_mcp.json</code> file contains:
        </Hint>
        <CodeBlock code={buildGenericJson(secret)} language="json" />
      </Step>
    </>
  );
}

/**
 * secret: the plaintext apiKey, when available (reveal dialog). Falls back to a
 * <your-secret-key> placeholder otherwise. Passing a secret opens on the API key tab.
 */
function SetupInstructions({ secret }) {
  const [method, setMethod] = useState(secret ? "apikey" : "oauth");

  return (
    <Stack spacing={3}>
      <Box>
        <ToggleButtonGroup
          value={method}
          exclusive
          size="small"
          color="primary"
          onChange={(_, value) => value && setMethod(value)}
          aria-label="How to connect"
        >
          <ToggleButton value="oauth">Sign in (OAuth)</ToggleButton>
          <ToggleButton value="apikey">API key</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {method === "oauth"
            ? "Recommended. Your client signs in with your ccreward account in the browser — no key to copy or store."
            : "For clients without OAuth support, and for scripts or CI. Generate a key in API credentials above."}
        </Typography>
      </Box>

      <Step title="Copy the full setup prompt">
        <Hint>
          Paste this whole block into Claude Code, Cursor, Claude Desktop, or any
          other agent chat — it registers the server and tells the agent exactly
          which tools it has (and doesn&apos;t have).
        </Hint>
        <CodeBlock code={buildFullPrompt(method, secret)} language="markdown" />
      </Step>

      <Divider />

      {method === "oauth" ? <OAuthSteps /> : <ApiKeySteps secret={secret} />}

      <Divider />

      <Step title="What the agent can call">
        <Hint mb={1.5}>
          {TOOLS.length} tools. Only{" "}
          {SIDE_EFFECT_TOOLS.map((name, i) => (
            <span key={name}>
              {i > 0 && (i === SIDE_EFFECT_TOOLS.length - 1 ? " and " : ", ")}
              <code>{name}</code>
            </span>
          ))}{" "}
          change anything (your feedback and your saved cards). The server has no
          access to real accounts or transactions.
        </Hint>
        <Box sx={{ overflowX: "auto" }}>
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
      </Step>

      <Typography variant="body2" color="text.secondary">
        Once connected, ask Claude to calculate rewards, compare cards, or look up MCC
        codes for you — right from your coding workflow. Full reference (kept in sync,
        no key required): <code>{PROMPT_URL}</code>
      </Typography>
    </Stack>
  );
}

export default SetupInstructions;
