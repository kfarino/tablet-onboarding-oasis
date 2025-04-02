
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '@/types/onboarding';

const ProgressIndicator: React.FC = () => {
  const { currentStep, shouldShowLovedOneScreen } = useOnboarding();

  // Get steps based on user role
  const getSteps = () => {
    const baseSteps = [
      { id: OnboardingStep.Welcome, label: 'Welcome' },
      { id: OnboardingStep.PersonalInfo, label: 'Personal Info' }
    ];
    
    // Only include LovedOneInfo for caregivers
    if (shouldShowLovedOneScreen()) {
      baseSteps.push({ id: OnboardingStep.LovedOneInfo, label: 'Loved One' });
    }
    
    return [
      ...baseSteps,
      { id: OnboardingStep.HealthConditions, label: 'Health Conditions' },
      { id: OnboardingStep.Medications, label: 'Medications' },
      { id: OnboardingStep.Review, label: 'Review' },
      { id: OnboardingStep.Complete, label: 'Complete' }
    ];
  };

  const steps = getSteps();

  return (
    <div className="flex justify-center items-center gap-3 mb-3 px-8" role="navigation" aria-label="Onboarding progress">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center">
          <div 
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              step.id < currentStep 
                ? 'bg-white/40' 
                : step.id === currentStep 
                  ? 'bg-highlight' 
                  : 'bg-white/10'
            }`}
            title={step.label}
            aria-current={currentStep === step.id ? 'step' : undefined}
          />
          <span className={`text-xs mt-1 transition-all duration-300 ${
            currentStep === step.id ? 'text-highlight' : 'text-white/40'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
