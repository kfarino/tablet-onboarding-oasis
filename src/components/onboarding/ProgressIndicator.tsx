
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '@/types/onboarding';

const ProgressIndicator: React.FC = () => {
  const { currentStep } = useOnboarding();

  const steps = [
    { id: OnboardingStep.Welcome, label: 'Welcome' },
    { id: OnboardingStep.PersonalInfo, label: 'Personal Info' },
    { id: OnboardingStep.HealthConditions, label: 'Health Conditions' },
    { id: OnboardingStep.Medications, label: 'Medications' },
    { id: OnboardingStep.Review, label: 'Review' },
    { id: OnboardingStep.Complete, label: 'Complete' }
  ];

  return (
    <div className="flex justify-center items-center gap-2 mb-1" role="navigation" aria-label="Onboarding progress">
      {steps.map((step) => (
        <div 
          key={step.id}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            currentStep === step.id ? 'bg-highlight' : 'bg-white/20'
          }`}
          title={step.label}
          aria-current={currentStep === step.id ? 'step' : undefined}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
