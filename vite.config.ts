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
    },
  },
});
