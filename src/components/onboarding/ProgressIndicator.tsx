
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '@/types/onboarding';

const ProgressIndicator: React.FC = () => {
  const { currentStep, shouldShowLovedOneScreen } = useOnboarding();

  // Get steps based on user role
  const getSteps = () => {
    const steps = [
      { id: OnboardingStep.Welcome, label: 'Welcome' },
      { id: OnboardingStep.PersonalInfo, label: 'Personal Info' },
      { id: OnboardingStep.HealthConditions, label: 'Health Conditions' },
      { id: OnboardingStep.Medications, label: 'Medications' },
      { id: OnboardingStep.Review, label: 'Review' },
      { id: OnboardingStep.Complete, label: 'Complete' }
    ];
    
    return steps;
  };

  const steps = getSteps();

  return (
    <div className="flex justify-center items-center gap-2 mb-2 px-4" role="navigation" aria-label="Onboarding progress">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center">
          <div 
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              step.id < currentStep 
                ? 'bg-white/40' 
                : step.id === currentStep 
                  ? 'bg-highlight' 
                  : 'bg-white/10'
            }`}
            title={step.label}
            aria-current={currentStep === step.id ? 'step' : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
