import React from "react";
import { BrowserRouter } from "react-router-dom";
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
  console.log("[App] Rendering...");
  const [colors, setColors] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const isLoadedRef = React.useRef(false);

  React.useEffect(() => {
    console.log("[App] Starting Design System load...");

    // Timeout dla ładowania design system (max 10 sekund)
    const timeoutId = setTimeout(() => {
      if (!isLoadedRef.current) {
        console.warn(
          "Design system loading timeout (10s) - using fallback colors",
        );
        setError("Design system loading timeout");
        setColors({
          bgPrimary: "#ffffff",
          bgSecondary: "#f5f5f5",
          textPrimary: "#000000",
          textSecondary: "#666666",
          border: "#e0e0e0",
        });
      }
    }, 10000);

    // Dynamically import design system tokens
    import("designSystem/tokens")
      .then((module) => {
        console.log("[App] Design System loaded successfully:", module);
        console.log("[App] module.colors:", module.colors);
        console.log("[App] Available keys:", Object.keys(module));

        // Module Federation wraps the module in .default
        const actualModule = module.default || module;
        console.log("[App] Actual module:", actualModule);
        console.log("[App] actualModule.colors:", actualModule.colors);

        isLoadedRef.current = true;
        clearTimeout(timeoutId);
        setColors(actualModule.colors || module.colors);
      })
      .catch((err) => {
        console.error("[App] Failed to load design system:", err);
        isLoadedRef.current = true;
        clearTimeout(timeoutId);
        setError("Failed to load design system");
        // Fallback colors
        setColors({
          bgPrimary: "#ffffff",
          bgSecondary: "#f5f5f5",
          textPrimary: "#000000",
          textSecondary: "#666666",
          border: "#e0e0e0",
        });
      });

    return () => clearTimeout(timeoutId);
  }, []);

  React.useEffect(() => {
    if (!colors) return;

    // Global styles
    const globalStyle: React.CSSProperties = {
      margin: 0,
      padding: 0,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: colors.bgSecondary,
      minHeight: "100vh",
    };

    // Apply global styles to body
    Object.assign(document.body.style, globalStyle);
  }, [colors]);

  // Show loading state while fetching design system
  if (!colors) {
    console.log("[App] Showing loading state...");
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        Loading...
      </div>
    );
  }

  console.log("[App] Rendering main content with colors:", colors);

  return (
    <BrowserRouter>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fff3cd",
              color: "#856404",
              borderBottom: "1px solid #ffc107",
            }}
          >
            ⚠️ {error} - Using fallback styles
          </div>
        )}

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
