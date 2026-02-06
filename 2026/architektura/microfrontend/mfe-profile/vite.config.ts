import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

/**
 * Profile MFE - Remote
 *
 * EXPOSE:
 * - ./App - główny komponent profilu użytkownika
 *
 * CONSUME:
 * - Design System (Button, Card, tokens)
 */
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "profile",
      filename: "remoteEntry.js",
      // Eksportujemy aplikację
      exposes: {
        "./App": "./src/App",
      },
      // Importujemy Design System
      remotes: {
        designSystem: "http://localhost:5001/assets/remoteEntry.js",
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
      },
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
  },
  server: {
    port: 5003,
    strictPort: true,
    cors: true,
  },
});
