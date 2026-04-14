import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withGradientBorder?: boolean;
  withGlow?: boolean;
  glowColor?: "green" | "blue";
}

export const Card: React.FC<CardProps> = ({
  children,
  withGradientBorder = false,
  withGlow = false,
  glowColor = "green",
  className = "",
  ...props
}) => {
  const glowClass = withGlow
    ? glowColor === "green"
      ? "shadow-glow-green hover:shadow-glow-green-lg"
      : "shadow-glow-blue hover:shadow-glow-blue-lg"
    : "";

  return (
    <div
      className={`
        relative rounded-xl
        bg-surface/40
        backdrop-blur-md
        border border-white/10
        transition-all duration-300
        hover:bg-surface/60
        hover:border-white/20
        ${glowClass}
        ${withGradientBorder ? "overflow-hidden" : ""}
        ${className}
      `}
      {...props}
    >
      {withGradientBorder && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-brand/20 via-transparent to-blue-accent/20 rounded-xl pointer-events-none"
          style={{ zIndex: 0 }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

Card.displayName = "Card";
