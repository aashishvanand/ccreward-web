import vinext from "vinext";
import rsc from "@vitejs/plugin-rsc";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig, type Plugin } from "vite";

/**
 * Vendor chunk groups for the CLIENT build: MUI, Emotion, framer-motion and
 * the Firebase SDK, one chunk per service so pages only download what they
 * use (auth/analytics/app-check are dynamically imported).
 *
 * This can't be done with root `build.rolldownOptions.output.manualChunks`
 * because vinext configures `output.codeSplitting` for the client
 * environment, and rolldown ignores `manualChunks` whenever `codeSplitting`
 * is also present. Instead this plugin appends the groups to the client
 * environment's existing `codeSplitting` groups (after vinext's own
 * framework/vinext groups, which keep first-match priority).
 */
const CLIENT_VENDOR_CHUNK_GROUPS = [
  // Firebase services. Declared before the @firebase/firebase catch-all so
  // each service claims its own modules first.
  { name: "firebase-app-check", test: /[\\/]node_modules[\\/](?:@firebase|firebase)[\\/]app-check[\\/]/ },
  { name: "firebase-auth", test: /[\\/]node_modules[\\/](?:@firebase|firebase)[\\/]auth[\\/]/ },
  { name: "firebase-analytics", test: /[\\/]node_modules[\\/](?:@firebase|firebase)[\\/]analytics[\\/]/ },
  { name: "firebase-performance", test: /[\\/]node_modules[\\/](?:@firebase|firebase)[\\/]performance[\\/]/ },
  { name: "firebase-app", test: /[\\/]node_modules[\\/](?:@firebase|firebase)[\\/]app[\\/]/ },
  // Remaining @firebase/* infra (component, util, logger, installations…) and
  // the `firebase` meta-package re-export stubs.
  { name: "firebase-common", test: /[\\/]node_modules[\\/](?:@firebase|firebase)[\\/]/ },
  // framer-motion v14 runs on motion-dom / motion-utils
  { name: "framer-motion", test: /[\\/]node_modules[\\/](?:framer-motion|motion-dom|motion-utils)[\\/]/ },
  // Emotion CSS-in-JS runtime
  { name: "emotion-vendor", test: /[\\/]node_modules[\\/]@emotion[\\/]/ },
  // MUI components and icons
  { name: "mui-vendor", test: /[\\/]node_modules[\\/]@mui[\\/]/ },
];

const clientVendorChunks = (): Plugin => ({
  name: "ccreward:client-vendor-chunks",
  apply: "build",
  outputOptions(output) {
    // Only the browser bundle: the rsc/ssr environments keep their existing
    // chunking (root output.manualChunks below).
    if (this.environment?.name !== "client") return;

    // rolldown may present the option under either name depending on
    // normalization stage; vinext sets `codeSplitting`.
    const outputAsRecord = output as Record<string, any>;
    const key = outputAsRecord.codeSplitting ? "codeSplitting" : outputAsRecord.advancedChunks ? "advancedChunks" : "codeSplitting";
    const existing = outputAsRecord[key] ?? {};

    const groups = [...(existing.groups ?? [])];
    groups.push(...CLIENT_VENDOR_CHUNK_GROUPS);

    return { ...output, [key]: { ...existing, groups } } as typeof output;
  },
});

export default defineConfig({
  plugins: [
    vinext({ rsc: false }),
    rsc({
      entries: {
        rsc: "virtual:vinext-rsc-entry",
        ssr: "virtual:vinext-app-ssr-entry",
        client: "virtual:vinext-app-browser-entry",
      },
    }),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
    clientVendorChunks(),
  ],
  build: {
    rolldownOptions: {
      onwarn(warning, warn) {
        if (warning.message.includes("Error when using sourcemap for reporting an error")) return;
        if (warning.message.includes("dynamic import will not move module into another chunk")) return;
        warn(warning);
      },
      output: {
        // Splits the rsc/ssr (server) build. The client environment ignores
        // manualChunks (see clientVendorChunks above), so this effectively
        // only shapes the server bundle.
        manualChunks(id) {
          // Split Firebase SDK into separate lazy-loaded chunks
          if (id.includes("node_modules/firebase/")) {
            if (id.includes("/auth")) return "firebase-auth";
            if (id.includes("/analytics")) return "firebase-analytics";
            if (id.includes("/performance")) return "firebase-performance";
            if (id.includes("/app-check")) return "firebase-app-check";
            if (id.includes("/app")) return "firebase-app";
            return "firebase-common";
          }
          // Split framer-motion into its own chunk (~60KB)
          if (id.includes("node_modules/framer-motion")) {
            return "framer-motion";
          }
          // Split MUI into a vendor chunk for better caching
          if (id.includes("node_modules/@mui/")) {
            return "mui-vendor";
          }
          // Split Emotion CSS-in-JS runtime
          if (id.includes("node_modules/@emotion/")) {
            return "emotion-vendor";
          }
        },
      },
    },
  },
});
