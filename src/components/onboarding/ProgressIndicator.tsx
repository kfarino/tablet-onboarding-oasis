
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
    <div className="progress-indicator" role="navigation" aria-label="Onboarding progress">
      {steps.map((step) => (
        <div key={step.id} className="progress-dot-container">
          <div 
            className={`progress-dot ${
              step.id < currentStep 
                ? 'progress-dot-completed' 
                : step.id === currentStep 
                  ? 'progress-dot-active' 
                  : 'progress-dot-inactive'
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
