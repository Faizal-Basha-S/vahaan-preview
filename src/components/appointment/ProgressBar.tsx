
import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Generate steps array based on totalSteps
  const steps = Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`);
  
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  index < currentStep
                    ? "bg-primary text-white"
                    : index === currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700"
                }`}
              >
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="mt-2 text-xs text-center">{step}</span>
            </div>
            
            {/* Connector line (not for the last item) */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                }`} 
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
