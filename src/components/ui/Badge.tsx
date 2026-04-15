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
  green: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  blue: "bg-blue-100 text-blue-800 border border-blue-300",
  amber: "bg-amber-100 text-amber-800 border border-amber-300",
  red: "bg-red-100 text-red-800 border border-red-300",
  gray: "bg-gray-100 text-gray-800 border border-gray-300",
  secondary: "bg-gray-100 text-gray-700 border border-gray-300",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
};

const pulseColors: Record<BadgeVariant, string> = {
  green: "bg-emerald-600",
  blue: "bg-blue-600",
  amber: "bg-amber-600",
  red: "bg-red-600",
  gray: "bg-gray-600",
  secondary: "bg-gray-400",
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
