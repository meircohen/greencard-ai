import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full
              px-4 py-2.5 pr-10
              rounded-lg
              bg-surface/50
              border
              ${error ? "border-red-500/50" : "border-white/10"}
              text-primary
              transition-all duration-200
              focus:outline-none
              focus:bg-surface
              focus:border-white/20
              appearance-none
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          >
            <option value="" disabled>
              Select an option
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
          />
        </div>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
