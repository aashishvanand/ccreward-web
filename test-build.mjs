import { build } from 'vite';
import vinext from 'vinext';
import rsc from '@vitejs/plugin-rsc';

async function run() {
  try {
    await build({
      plugins: [
        vinext(),
        rsc({
          entries: {
            rsc: "virtual:vinext-rsc-entry",
            ssr: "virtual:vinext-app-ssr-entry",
            client: "virtual:vinext-app-browser-entry",
          },
        }),
      ]
    });
  } catch (e) {
    console.error(e);
  }
}
run();
