
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep } from '@/types/onboarding';
import WelcomeScreen from './WelcomeScreen';
import PersonalInfoScreen from './PersonalInfoScreen';
import LovedOneInfoScreen from './LovedOneInfoScreen';
import HealthConditionsScreen from './HealthConditionsScreen';
import MedicationsScreen from './MedicationsScreen';
import ReviewScreen from './ReviewScreen';
import CompleteScreen from './CompleteScreen';
import ProgressIndicator from './ProgressIndicator';
import Header from '../Header';
import { ScrollArea } from '@/components/ui/scroll-area';

const OnboardingContainer: React.FC = () => {
  const { currentStep, prevStep } = useOnboarding();
  const [showExample, setShowExample] = useState(false);

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeScreen />;
      case OnboardingStep.PersonalInfo:
        return <PersonalInfoScreen showExample={showExample} />;
      case OnboardingStep.LovedOneInfo:
        return <LovedOneInfoScreen showExample={showExample} />;
      case OnboardingStep.HealthConditions:
        return <HealthConditionsScreen showExample={showExample} />;
      case OnboardingStep.Medications:
        return <MedicationsScreen showExample={showExample} />;
      case OnboardingStep.Review:
        return <ReviewScreen showExample={showExample} />;
      case OnboardingStep.Complete:
        return <CompleteScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <Header 
        currentStep={currentStep} 
        onBack={prevStep} 
        toggleExample={toggleExample}
        showExample={showExample}
      />
      <div className="flex-1 overflow-hidden">
        <div className="w-full mb-3">
          {currentStep !== OnboardingStep.Welcome && currentStep !== OnboardingStep.Complete && (
            <ProgressIndicator />
          )}
        </div>
        <div className="h-[calc(100%-40px)] overflow-hidden">
          <ScrollArea className="h-full">
            {renderStep()}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
