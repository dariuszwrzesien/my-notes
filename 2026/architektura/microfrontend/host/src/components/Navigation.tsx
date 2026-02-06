import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// @ts-ignore - Module Federation
import { Button } from "designSystem/Button";
// @ts-ignore
import { colors, spacing } from "designSystem/tokens";

/**
 * Navigation - wspólna nawigacja dla całej aplikacji
 */
export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navStyle: React.CSSProperties = {
    backgroundColor: colors.bgPrimary,
    borderBottom: `1px solid ${colors.border}`,
    padding: spacing.md,
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: colors.primary,
    marginRight: spacing.lg,
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>🏗️ MFE Demo</div>

      <Button
        variant={isActive("/products") ? "primary" : "ghost"}
        size="sm"
        onClick={() => navigate("/products")}
      >
        Products
      </Button>

      <Button
        variant={isActive("/profile") ? "primary" : "ghost"}
        size="sm"
        onClick={() => navigate("/profile")}
      >
        Profile
      </Button>

      <div
        style={{
          marginLeft: "auto",
          fontSize: "0.875rem",
          color: colors.textSecondary,
        }}
      >
        Host Application (Port 5000)
      </div>
    </nav>
  );
};
