
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '@/types/onboarding';
import WelcomeScreen from './WelcomeScreen';
import ExamplesScreen from './ExamplesScreen';
import PersonalInfoScreen from './PersonalInfoScreen';
import HealthConditionsScreen from './HealthConditionsScreen';
import MedicationsScreen from './MedicationsScreen';
import ReviewScreen from './ReviewScreen';
import CompleteScreen from './CompleteScreen';
import ProgressIndicator from './ProgressIndicator';
import Header from '../Header';

const OnboardingContainer: React.FC = () => {
  const { currentStep, prevStep } = useOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeScreen />;
      case OnboardingStep.Examples:
        return <ExamplesScreen />;
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
    <div className="w-full h-full flex flex-col">
      <Header currentStep={currentStep} onBack={prevStep} />
      <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="w-full mb-4">
          {currentStep !== OnboardingStep.Welcome && currentStep !== OnboardingStep.Complete && (
            <ProgressIndicator />
          )}
        </div>
        <div className="flex-1">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
