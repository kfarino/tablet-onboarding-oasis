import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '@/types/onboarding';

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  const { shouldShowLovedOneScreen } = useOnboarding();

  // Get steps based on user role
  const steps = [
    OnboardingStep.Welcome,
    OnboardingStep.PersonalInfo,
    OnboardingStep.Medications,
    OnboardingStep.Review,
    OnboardingStep.Complete
  ];

  return (
    <div className="flex justify-center items-center gap-2 mb-2 px-4" role="navigation" aria-label="Onboarding progress">
      {steps.map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div 
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              step < currentStep 
                ? 'bg-white/40' 
                : step === currentStep 
                  ? 'bg-highlight' 
                  : 'bg-white/10'
            }`}
            title={OnboardingStep[step]}
            aria-current={currentStep === step ? 'step' : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
