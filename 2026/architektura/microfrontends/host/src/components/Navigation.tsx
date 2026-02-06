import React, { lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Lazy load Design System Button
 */
const Button = lazy(() =>
  import("designSystem/Button").then((module) => ({ default: module.Button })),
);

// Default fallback tokens
const defaultTokens = {
  colors: {
    bgPrimary: "#ffffff",
    border: "#e0e0e0",
    primary: "#3b82f6",
    textSecondary: "#666666",
  },
  spacing: {
    md: "16px",
    lg: "24px",
  },
};

/**
 * Navigation - wspólna nawigacja dla całej aplikacji
 */
export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tokens, setTokens] = React.useState(defaultTokens);

  React.useEffect(() => {
    // Try to load design system tokens
    import("designSystem/tokens")
      .then((module) => {
        // Module Federation may wrap the module in .default
        const actualModule = module.default || module;
        setTokens({
          colors: actualModule.colors || module.colors,
          spacing: actualModule.spacing || module.spacing,
        });
      })
      .catch((err) => {
        console.warn(
          "Failed to load design system tokens, using defaults:",
          err,
        );
      });
  }, []);

  const navStyle: React.CSSProperties = {
    backgroundColor: tokens.colors.bgPrimary,
    borderBottom: `1px solid ${tokens.colors.border}`,
    padding: tokens.spacing.md,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.md,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: tokens.colors.primary,
    marginRight: tokens.spacing.lg,
  };

  const isActive = (path: string) => location.pathname === path;

  // Simple fallback button for loading state
  const FallbackButton = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        background: "white",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>🏗️ MFE Demo</div>

      <Suspense
        fallback={
          <FallbackButton onClick={() => navigate("/products")}>
            Products
          </FallbackButton>
        }
      >
        <Button
          variant={isActive("/products") ? "primary" : "ghost"}
          size="sm"
          onClick={() => navigate("/products")}
        >
          Products
        </Button>
      </Suspense>

      <Suspense
        fallback={
          <FallbackButton onClick={() => navigate("/profile")}>
            Profile
          </FallbackButton>
        }
      >
        <Button
          variant={isActive("/profile") ? "primary" : "ghost"}
          size="sm"
          onClick={() => navigate("/profile")}
        >
          Profile
        </Button>
      </Suspense>

      <div
        style={{
          marginLeft: "auto",
          fontSize: "0.875rem",
          color: tokens.colors.textSecondary,
        }}
      >
        Host Application (Port 5000)
      </div>
    </nav>
  );
};
