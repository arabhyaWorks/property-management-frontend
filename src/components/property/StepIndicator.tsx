import React from "react";
import { cn } from "../../utils/cn";

interface StepIndicatorProps {
  steps: { title: string }[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white",
              currentStep === index ? "bg-blue-600" : "bg-gray-400"
            )}
          >
            {index + 1}
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {step.title}
          </p>
        </div>
      ))}
    </div>
  );
};