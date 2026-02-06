import React from "react";
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  transitions,
} from "../tokens";

/**
 * Button Component - Core UI element
 *
 * Używany przez Host i wszystkie MFE.
 * Breaking changes tutaj = breaking changes wszędzie!
 */

export interface ButtonProps {
  /** Button text */
  children: React.ReactNode;

  /** Visual variant */
  variant?: "primary" | "secondary" | "outline" | "ghost";

  /** Size variant */
  size?: "sm" | "md" | "lg";

  /** Disabled state */
  disabled?: boolean;

  /** Full width */
  fullWidth?: boolean;

  /** Click handler */
  onClick?: () => void;

  /** HTML type attribute */
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
}) => {
  // Style variants
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      color: "#ffffff",
      border: "none",
      hover: {
        backgroundColor: colors.primaryHover,
      },
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: "#ffffff",
      border: "none",
      hover: {
        backgroundColor: colors.secondaryHover,
      },
    },
    outline: {
      backgroundColor: "transparent",
      color: colors.primary,
      border: `2px solid ${colors.primary}`,
      hover: {
        backgroundColor: colors.primaryLight,
      },
    },
    ghost: {
      backgroundColor: "transparent",
      color: colors.textPrimary,
      border: "none",
      hover: {
        backgroundColor: colors.gray100,
      },
    },
  };

  // Size variants
  const sizeStyles = {
    sm: {
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: typography.fontSize.sm,
    },
    md: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.base,
    },
    lg: {
      padding: `${spacing.md} ${spacing.lg}`,
      fontSize: typography.fontSize.lg,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const baseStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.md,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: transitions.base,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
    boxShadow:
      variant !== "ghost" && variant !== "outline" ? shadows.sm : "none",
    ...currentVariant,
    ...currentSize,
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const style: React.CSSProperties = {
    ...baseStyle,
    ...(isHovered && !disabled ? currentVariant.hover : {}),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

// Named export dla TypeScript
export default Button;
