import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vinext()],
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
