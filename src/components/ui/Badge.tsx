import React from "react";

type BadgeVariant = "green" | "blue" | "amber" | "red" | "gray" | "secondary";
type BadgeSize = "sm" | "md";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  withPulse?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: "bg-green-primary/15 text-green-light border border-green-brand/30",
  blue: "bg-blue-primary/15 text-blue-light border border-blue-accent/30",
  amber: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  red: "bg-red-600/15 text-red-400 border border-red-600/30",
  gray: "bg-gray-500/15 text-secondary border border-secondary/30",
  secondary: "bg-white/5 text-secondary border border-white/10",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
};

const pulseColors: Record<BadgeVariant, string> = {
  green: "bg-green-brand",
  blue: "bg-blue-accent",
  amber: "bg-amber-500",
  red: "bg-red-600",
  gray: "bg-gray-500",
  secondary: "bg-white",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "green",
  size = "md",
  withPulse = false,
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`
        inline-flex items-center gap-2
        rounded-full
        font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {withPulse && (
        <span
          className={`w-2 h-2 rounded-full animate-pulse-glow ${pulseColors[variant]}`}
        />
      )}
      {children}
    </div>
  );
};

Badge.displayName = "Badge";
