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
      ? "shadow-sm hover:shadow-md"
      : "shadow-sm hover:shadow-md"
    : "";

  return (
    <div
      className={`
        relative rounded-lg
        bg-white
        border border-gray-200
        transition-all duration-300
        hover:shadow-md
        ${glowClass}
        ${withGradientBorder ? "overflow-hidden" : ""}
        ${className}
      `}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

Card.displayName = "Card";
