
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep, UserRole } from '@/types/onboarding';
import WelcomeScreen from './WelcomeScreen';
import AccountInfoScreen from './AccountInfoScreen';
import MedicationsScreen from './MedicationsScreen';
import SingleMedicationCaptureScreen from './SingleMedicationCaptureScreen';
import ReviewScreen from './ReviewScreen';
import CompleteScreen from './CompleteScreen';
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
  const [showExample, setShowExample] = useState(false);
  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);
  const [showSingleMedicationCapture, setShowSingleMedicationCapture] = useState(false);

  // Simplified example medications - 9 total with cleaner patterns
  const exampleMedications = [
    // Everyday morning medications
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
    // Albuterol - current medication being worked on
    {
      id: uuidv4(),
      name: "Albuterol",
      strength: "90mcg",
      form: "inhaler",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["8:00 AM", "6:00 PM"],
          quantity: 2
        }
      ],
      asNeeded: null
    },
    // Everyday evening medication
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
    // Weekend medications
    {
      id: uuidv4(),
      name: "Vitamin D",
      strength: "2000 IU",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["saturday", "sunday"],
          times: ["8:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    {
      id: uuidv4(),
      name: "Fish Oil",
      strength: "1000mg",
      form: "capsule",
      doses: [
        {
          id: uuidv4(),
          days: ["saturday", "sunday"],
          times: ["12:00 PM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    // Weekday medication
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
    // Both scheduled and as-needed medication
    {
      id: uuidv4(),
      name: "Tylenol",
      strength: "500mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["saturday", "sunday"],
          times: ["8:00 AM"],
          quantity: 1
        },
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["6:00 PM"],
          quantity: 1
        }
      ],
      asNeeded: { maxPerDay: 6 }
    }
  ];

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
      case OnboardingStep.Review:
        return <ReviewScreen 
                 showExample={showExample} 
                 showMedicationSchedule={showMedicationSchedule}
                 setShowMedicationSchedule={setShowMedicationSchedule}
                 exampleMedications={exampleMedications}
               />;
      case OnboardingStep.Complete:
        return <CompleteScreen />;
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
        onTogglePreviewRole={showExample ? togglePreviewRole : undefined}
        previewRole={previewRole}
        showMedicationSchedule={showMedicationSchedule}
        setShowMedicationSchedule={currentStep === OnboardingStep.Medications ? setShowMedicationSchedule : undefined}
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
