import vinext from "vinext";
import rsc from "@vitejs/plugin-rsc";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

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
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.message.includes("Error when using sourcemap for reporting an error")) return;
        if (warning.message.includes("dynamic import will not move module into another chunk")) return;
        warn(warning);
      },
      output: {
        manualChunks(id) {
          // Split Firebase SDK into separate lazy-loaded chunks
          if (id.includes("node_modules/firebase/")) {
            if (id.includes("/auth")) return "firebase-auth";
            if (id.includes("/analytics")) return "firebase-analytics";
            if (id.includes("/performance")) return "firebase-performance";
            if (id.includes("/firestore")) return "firebase-firestore";
            if (id.includes("/app-check")) return "firebase-app-check";
            if (id.includes("/app")) return "firebase-app";
            return "firebase-common";
          }
        },
      },
    },
  },
});
