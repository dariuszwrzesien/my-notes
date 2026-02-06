import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

/**
 * Host Application - Shell dla wszystkich MFE
 *
 * CONSUME:
 * - Design System (komponenty, tokeny)
 * - Products MFE
 * - Profile MFE
 *
 * ODPOWIEDZIALNOŚĆ:
 * - Routing
 * - Nawigacja
 * - Layout
 * - Lazy loading MFE
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      // Importujemy zdalne moduły
      remotes: {
        designSystem: "http://localhost:5001/assets/remoteEntry.js",
        products: "http://localhost:5002/assets/remoteEntry.js",
        profile: "http://localhost:5003/assets/remoteEntry.js",
      },
      // Współdzielone zależności
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^6.21.1",
        },
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
  },
  server: {
    port: 5000,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 5000,
    strictPort: true,
    cors: true,
  },
});
