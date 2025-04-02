import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep, UserRole } from '@/types/onboarding';
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
import MedicationVisualization from './MedicationVisualization';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface OnboardingContainerProps {
  showMedicationSchedule?: boolean;
  setShowMedicationSchedule?: (show: boolean) => void;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ 
  showMedicationSchedule = false,
  setShowMedicationSchedule = () => {}
}) => {
  const { currentStep, prevStep, updateUserProfile, userProfile } = useOnboarding();
  const [showExample, setShowExample] = useState(false);
  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);

  const toggleExample = () => {
    if (showExample) {
      setShowExample(false);
      setPreviewRole(null);
    } else {
      setShowExample(true);
      setPreviewRole(UserRole.PrimaryUser);
    }
  };

  const togglePreviewRole = () => {
    if (!previewRole || previewRole === UserRole.Caregiver) {
      setPreviewRole(UserRole.PrimaryUser);
    } else {
      setPreviewRole(UserRole.Caregiver);
    }
    
    updateUserProfile('role', previewRole === UserRole.PrimaryUser ? UserRole.Caregiver : UserRole.PrimaryUser);
  };

  const needsScrollArea = () => {
    return currentStep !== OnboardingStep.Welcome && currentStep !== OnboardingStep.Complete;
  };

  const renderStep = () => {
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeScreen />;
      case OnboardingStep.PersonalInfo:
        return <PersonalInfoScreen showExample={showExample} previewRole={previewRole} />;
      case OnboardingStep.LovedOneInfo:
        return <LovedOneInfoScreen showExample={showExample} />;
      case OnboardingStep.HealthConditions:
        return <HealthConditionsScreen showExample={showExample} />;
      case OnboardingStep.Medications:
        return <MedicationsScreen 
                 showExample={showExample} 
                 showMedicationSchedule={showMedicationSchedule}
                 setShowMedicationSchedule={setShowMedicationSchedule}
               />;
      case OnboardingStep.Review:
        return <ReviewScreen 
                 showExample={showExample} 
                 showMedicationSchedule={showMedicationSchedule}
                 setShowMedicationSchedule={setShowMedicationSchedule}
               />;
      case OnboardingStep.Complete:
        return <CompleteScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  if (showMedicationSchedule) {
    const exampleMedications = [
      // This would typically be your example medications data
      // For now, we'll use what's available in the userProfile
    ];
    
    const medications = showExample ? exampleMedications : userProfile.medications;
    
    return (
      <div className="w-full h-full flex flex-col bg-charcoal">
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowMedicationSchedule(false)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-semibold text-white">Medication Schedule</h2>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          <MedicationVisualization medications={medications} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <Header 
        currentStep={currentStep} 
        onBack={prevStep} 
        toggleExample={toggleExample}
        showExample={showExample}
        onTogglePreviewRole={showExample ? togglePreviewRole : undefined}
        previewRole={previewRole}
      />
      <div className="flex-1 overflow-hidden">
        <div className="w-full mb-3">
          {currentStep !== OnboardingStep.Welcome && currentStep !== OnboardingStep.Complete && (
            <ProgressIndicator />
          )}
        </div>
        <div className="h-[calc(100%-40px)] overflow-hidden">
          {needsScrollArea() ? (
            <ScrollArea className="h-full">
              {renderStep()}
            </ScrollArea>
          ) : (
            renderStep()
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
