/**
 * TypeScript declarations dla Module Federation remotes
 *
 * UWAGA: To jest manual typing - w produkcji użyłbyś
 * @module-federation/typescript lub podobnego narzędzia
 */

declare module "designSystem/Button" {
  import { FC } from "react";

  export interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
  }

  export const Button: FC<ButtonProps>;
  export default Button;
}

declare module "designSystem/Card" {
  import { FC } from "react";

  export interface CardProps {
    children: React.ReactNode;
    title?: string;
    padding?: "sm" | "md" | "lg";
    shadow?: boolean;
    style?: React.CSSProperties;
  }

  export const Card: FC<CardProps>;
  export default Card;
}

declare module "designSystem/tokens" {
  export const colors: {
    primary: string;
    primaryHover: string;
    primaryLight: string;
    secondary: string;
    secondaryHover: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    gray50: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray400: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray800: string;
    gray900: string;
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    bgPrimary: string;
    bgSecondary: string;
    border: string;
    borderHover: string;
  };

  export const spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
  };
}

declare module "products/App" {
  import { FC } from "react";
  const ProductsApp: FC;
  export default ProductsApp;
}

declare module "profile/App" {
  import { FC } from "react";
  const ProfileApp: FC;
  export default ProfileApp;
}
