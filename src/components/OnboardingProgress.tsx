"use client";

import React from "react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isComplete = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <React.Fragment key={index}>
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    isCurrent
                      ? "bg-green-500 text-white scale-110 shadow-lg shadow-green-500/50"
                      : isComplete
                        ? "bg-green-600 text-white"
                        : "bg-surface-2 text-slate-400 border border-white/[0.06]"
                  }`}
                >
                  {isComplete ? "✓" : stepNumber}
                </div>

                {/* Connecting Line */}
                {stepNumber < totalSteps && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                      isComplete ? "bg-green-600" : "bg-surface-2 border-t border-white/[0.06]"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Labels */}
        <div className="grid grid-cols-5 gap-2">
          {stepLabels.map((label, index) => (
            <div
              key={index}
              className={`text-center text-xs font-medium transition-colors ${
                index + 1 <= currentStep ? "text-green-400" : "text-slate-500"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-surface-2 rounded-full h-1 overflow-hidden border border-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
