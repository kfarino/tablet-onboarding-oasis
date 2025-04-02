
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '@/types/onboarding';
import WelcomeScreen from './WelcomeScreen';
import PersonalInfoScreen from './PersonalInfoScreen';
import HealthConditionsScreen from './HealthConditionsScreen';
import MedicationsScreen from './MedicationsScreen';
import ReviewScreen from './ReviewScreen';
import CompleteScreen from './CompleteScreen';
import ProgressIndicator from './ProgressIndicator';

const OnboardingContainer: React.FC = () => {
  const { currentStep } = useOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeScreen />;
      case OnboardingStep.PersonalInfo:
        return <PersonalInfoScreen />;
      case OnboardingStep.HealthConditions:
        return <HealthConditionsScreen />;
      case OnboardingStep.Medications:
        return <MedicationsScreen />;
      case OnboardingStep.Review:
        return <ReviewScreen />;
      case OnboardingStep.Complete:
        return <CompleteScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="w-full mb-4">
        {currentStep !== OnboardingStep.Welcome && currentStep !== OnboardingStep.Complete && (
          <ProgressIndicator />
        )}
      </div>
      <div className="onboarding-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingContainer;
