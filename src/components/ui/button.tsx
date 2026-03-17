"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-zinc-900/30",
  secondary:
    "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 focus-visible:ring-zinc-900/10",
  ghost: "text-zinc-700 hover:bg-zinc-100 focus-visible:ring-zinc-900/10",
  danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-600/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  asChild,
  variant = "primary",
  size = "md",
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={type ?? (!asChild ? "button" : undefined)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium outline-none transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-4 focus-visible:ring-offset-0",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

