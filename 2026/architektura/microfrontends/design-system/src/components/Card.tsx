import React from "react";
import { colors, spacing, borderRadius, shadows } from "../tokens";

/**
 * Card Component - Container dla contentu
 *
 * Prosty wrapper z border, padding i shadow.
 */

export interface CardProps {
  /** Card content */
  children: React.ReactNode;

  /** Optional title */
  title?: string;

  /** Padding variant */
  padding?: "sm" | "md" | "lg";

  /** Show shadow */
  shadow?: boolean;

  /** Optional custom style */
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  padding = "md",
  shadow = true,
  style: customStyle,
}) => {
  const paddingValues = {
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.bgPrimary,
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.lg,
    padding: paddingValues[padding],
    boxShadow: shadow ? shadows.md : "none",
    ...customStyle,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    marginBottom: spacing.md,
    fontSize: "1.25rem",
    fontWeight: 600,
    color: colors.textPrimary,
  };

  return (
    <div style={cardStyle}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
