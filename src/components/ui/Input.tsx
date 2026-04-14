import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full
            px-4 py-2.5
            rounded-lg
            bg-surface/50
            border
            ${error ? "border-red-500/50" : "border-white/10"}
            text-primary
            placeholder-muted
            transition-all duration-200
            focus:outline-none
            focus:bg-surface
            focus:border-white/20
            ${!error && "focus:shadow-glow-blue"}
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <p className="text-muted text-sm">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
