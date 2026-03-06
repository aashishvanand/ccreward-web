import vinext from "vinext";
import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Silence "Error when using sourcemap for reporting an error"
        if (warning.message.includes("Error when using sourcemap for reporting an error")) return;

        // Silence "dynamic import will not move module into another chunk"
        if (warning.message.includes("dynamic import will not move module into another chunk")) return;

        warn(warning);
      }
    }
  }
});
