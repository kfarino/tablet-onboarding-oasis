import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep, UserRole } from '@/types/onboarding';
import WelcomeScreen from './WelcomeScreen';
import AccountInfoScreen from './AccountInfoScreen';
import MedicationsScreen from './MedicationsScreen';
import AllMedicationsScreen from './AllMedicationsScreen';
import SingleMedicationCaptureScreen from './SingleMedicationCaptureScreen';
import ProgressIndicator from './ProgressIndicator';
import Header from '../Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import MedicationVisualization from './MedicationVisualization';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingContainerProps {
  showMedicationSchedule?: boolean;
  setShowMedicationSchedule?: (show: boolean) => void;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ 
  showMedicationSchedule = false,
  setShowMedicationSchedule = () => {}
}) => {
  const { currentStep, prevStep, updateUserProfile, userProfile } = useOnboarding();
  const [showExample, setShowExample] = useState(true); // Changed to default to true
  const [previewRole, setPreviewRole] = useState<UserRole | null>(UserRole.PrimaryUser); // Default to PrimaryUser
  const [showSingleMedicationCapture, setShowSingleMedicationCapture] = useState(false);
  const [showAllMedications, setShowAllMedications] = useState(false);

  // Example medications matching the specified schedule
  const exampleMedications = [
    // Vitamin D - weekends at 6 AM, plus as-needed
    {
      id: uuidv4(),
      name: "Vitamin D",
      strength: "2000 IU",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["saturday", "sunday"],
          times: ["6:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: { maxPerDay: 1 }
    },
    // Lisinopril - everyday at 8 AM
    {
      id: uuidv4(),
      name: "Lisinopril",
      strength: "10mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["8:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    // Metformin - everyday at 8 AM and 6 PM
    {
      id: uuidv4(),
      name: "Metformin",
      strength: "500mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["8:00 AM", "6:00 PM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    // Aspirin - weekdays at 8 AM
    {
      id: uuidv4(),
      name: "Aspirin",
      strength: "81mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          times: ["8:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    // Lipitor - everyday at 9 PM
    {
      id: uuidv4(),
      name: "Lipitor",
      strength: "20mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["9:00 PM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    // Tylenol - scheduled at 6 AM and 6 PM, plus as-needed (CURRENT MEDICATION)
    {
      id: uuidv4(),
      name: "Tylenol",
      strength: "500mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["6:00 AM", "6:00 PM"],
          quantity: 2
        }
      ],
      asNeeded: { maxPerDay: 2 }
    }
  ];

  const toggleExample = () => {
    setShowExample(!showExample);
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
    return currentStep !== OnboardingStep.Welcome;
  };

  const renderStep = () => {
    // Show all medications screen when requested
    if (showAllMedications) {
      const medications = showExample ? exampleMedications : userProfile.medications;
      return (
        <AllMedicationsScreen 
          medications={medications}
          onBack={() => setShowAllMedications(false)}
        />
      );
    }

    // Show single medication capture screen when requested
    if (showSingleMedicationCapture) {
      return (
        <SingleMedicationCaptureScreen
          onComplete={() => setShowSingleMedicationCapture(false)}
          onBack={() => setShowSingleMedicationCapture(false)}
        />
      );
    }

    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeScreen />;
      case OnboardingStep.PersonalInfo:
        return <AccountInfoScreen showExample={showExample} previewRole={previewRole} />;
      case OnboardingStep.Medications:
        return <MedicationsScreen 
                 showExample={showExample} 
                 showMedicationSchedule={showMedicationSchedule}
                 setShowMedicationSchedule={setShowMedicationSchedule}
                 exampleMedications={exampleMedications}
               />;
      default:
        return <WelcomeScreen />;
    }
  };

  if (showMedicationSchedule) {
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
          {currentStep === OnboardingStep.Medications && (
            <Button
              onClick={() => setShowSingleMedicationCapture(true)}
              className="bg-highlight hover:bg-highlight/90 text-white"
            >
              Configure Last Medication
            </Button>
          )}
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
        onTogglePreviewRole={togglePreviewRole}
        previewRole={previewRole}
        showMedicationSchedule={showMedicationSchedule}
        setShowMedicationSchedule={currentStep === OnboardingStep.Medications ? setShowMedicationSchedule : undefined}
        medicationCount={currentStep === OnboardingStep.Medications ? (showExample ? exampleMedications.length : userProfile.medications?.length || 0) : undefined}
        onShowAllMedications={currentStep === OnboardingStep.Medications ? () => setShowAllMedications(true) : undefined}
      />
      <div className="flex-1 flex flex-col overflow-hidden pt-2">
        <div className="flex-1 overflow-hidden px-8 pb-8">
          {needsScrollArea() ? (
            <ScrollArea className="h-full">
              {renderStep()}
            </ScrollArea>
          ) : (
            <div className="h-full flex items-center justify-center">
              {renderStep()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
