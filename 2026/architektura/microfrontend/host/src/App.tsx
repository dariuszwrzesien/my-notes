import React from "react";
import { BrowserRouter } from "react-router-dom";
// @ts-ignore - Module Federation
import { colors } from "designSystem/tokens";
import { Navigation } from "./components/Navigation";
import { AppRouter } from "./router";

/**
 * Host Application - Shell
 *
 * ODPOWIEDZIALNOŚĆ:
 * - Layout (nawigacja)
 * - Routing
 * - Lazy loading MFE
 * - Error handling
 */
function App() {
  // Global styles
  const globalStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: colors.bgSecondary,
    minHeight: "100vh",
  };

  React.useEffect(() => {
    // Apply global styles to body
    Object.assign(document.body.style, globalStyle);
  }, []);

  return (
    <BrowserRouter>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Navigation />

        <main style={{ flex: 1 }}>
          <AppRouter />
        </main>

        <footer
          style={{
            textAlign: "center",
            padding: "1rem",
            color: colors.textSecondary,
            fontSize: "0.875rem",
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.bgPrimary,
          }}
        >
          <p style={{ margin: 0 }}>
            💡 Demo Microfrontend Architecture | Host + 2 MFE + Design System
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
