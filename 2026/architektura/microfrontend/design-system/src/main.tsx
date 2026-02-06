import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { colors, spacing } from "./tokens";

/**
 * Design System - Standalone Preview
 *
 * Ta strona służy tylko do podglądu komponentów w izolacji.
 * W produkcji Design System nie miałby własnego UI.
 */

function App() {
  return (
    <div
      style={{
        padding: spacing.xl,
        backgroundColor: colors.bgSecondary,
        minHeight: "100vh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: spacing.xl }}>
        Design System - Component Preview
      </h1>

      <Card title="Buttons" style={{ marginBottom: spacing.lg }}>
        <div style={{ display: "flex", gap: spacing.md, flexWrap: "wrap" }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Card>

      <Card title="Button Sizes" style={{ marginBottom: spacing.lg }}>
        <div
          style={{
            display: "flex",
            gap: spacing.md,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Card>

      <Card title="Cards">
        <p style={{ margin: 0, color: colors.textSecondary }}>
          This is a card component with default padding and shadow.
        </p>
      </Card>

      <div
        style={{
          marginTop: spacing.xl,
          padding: spacing.md,
          backgroundColor: colors.bgPrimary,
          borderRadius: "8px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: colors.textSecondary,
          }}
        >
          💡 Te komponenty są eksportowane przez Module Federation i mogą być
          używane w Host i MFE.
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
