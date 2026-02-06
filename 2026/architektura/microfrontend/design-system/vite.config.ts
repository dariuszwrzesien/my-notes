import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

/**
 * Konfiguracja Design System jako Remote w Module Federation
 *
 * EXPOSE:
 * - Komponenty UI (Button, Card)
 * - Design tokens (colors, spacing, typography)
 * - Theme Provider
 *
 * UWAGA: Port 5001 musi być wolny!
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "designSystem",
      filename: "remoteEntry.js",
      // Eksportujemy moduły dostępne dla innych aplikacji
      exposes: {
        "./Button": "./src/components/Button",
        "./Card": "./src/components/Card",
        "./tokens": "./src/tokens/index",
        "./ThemeProvider": "./src/theme/ThemeProvider",
      },
      // Współdzielone zależności - ważne dla wydajności
      shared: {
        react: {
          singleton: true, // Tylko jedna instancja React!
          requiredVersion: "^18.2.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false, // Dla czytelności w demo
    cssCodeSplit: false,
  },
  server: {
    port: 5001,
    strictPort: true,
    cors: true, // CORS musi być włączony dla Module Federation
  },
});
