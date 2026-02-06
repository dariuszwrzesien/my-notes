/**
 * TypeScript declarations dla Design System remotes
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
  export const colors: any;
  export const spacing: any;
}
