import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingStep, UserRole } from '@/types/onboarding';
import WelcomeScreen from './WelcomeScreen';
import AccountInfoScreen from './AccountInfoScreen';
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

  // Example data for populated view - expanded to 15 medications with various scenarios
  const exampleMedications = [
    {
      id: uuidv4(),
      name: "Levothyroxine",
      strength: "75mcg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["7:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    {
      id: uuidv4(),
      name: "Aspirin",
      strength: "81mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["10:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    {
      id: uuidv4(),
      name: "Omeprazole",
      strength: "20mg",
      form: "capsule",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          times: ["7:30 AM"],
          quantity: 1
        }
      ],
      asNeeded: { maxPerDay: 1 }
    },
    {
      id: uuidv4(),
      name: "Lipitor",
      strength: "20mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["8:00 AM", "8:00 PM"],
          quantity: 1
        },
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["9:00 AM"],
          quantity: 2
        }
      ],
      asNeeded: { maxPerDay: 2 }
    },
    {
      id: uuidv4(),
      name: "Metformin",
      strength: "500mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Wednesday", "Friday"],
          times: ["12:00 PM"],
          quantity: 2
        }
      ],
      asNeeded: null
    },
    {
      id: uuidv4(),
      name: "Lisinopril",
      strength: "10mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["9:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: { maxPerDay: 1 }
    },
    {
      id: uuidv4(),
      name: "Albuterol",
      strength: "90mcg",
      form: "inhaler",
      doses: [],
      asNeeded: { maxPerDay: 8 }
    },
    {
      id: uuidv4(),
      name: "Amlodipine",
      strength: "5mg",
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
    {
      id: uuidv4(),
      name: "Furosemide",
      strength: "40mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Wednesday", "Friday"],
          times: ["9:00 AM"],
          quantity: 1
        },
        {
          id: uuidv4(),
          days: ["Tuesday", "Thursday"],
          times: ["10:00 AM"],
          quantity: 2
        }
      ],
      asNeeded: { maxPerDay: 2 }
    },
    {
      id: uuidv4(),
      name: "Januvia",
      strength: "100mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["8:00 AM", "8:00 PM"],
          quantity: 1
        }
      ],
      asNeeded: null
    },
    {
      id: uuidv4(),
      name: "Prednisone",
      strength: "5mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          times: ["10:30 AM"],
          quantity: 1
        }
      ],
      asNeeded: { maxPerDay: 3 }
    },
    {
      id: uuidv4(),
      name: "Warfarin",
      strength: "2.5mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Wednesday", "Friday", "Sunday"],
          times: ["5:00 PM"],
          quantity: 1
        },
        {
          id: uuidv4(),
          days: ["Tuesday", "Thursday", "Saturday"],
          times: ["5:00 PM"],
          quantity: 2
        }
      ],
      asNeeded: null
    },
    {
      id: uuidv4(),
      name: "Hydrochlorothiazide",
      strength: "25mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["10:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: { maxPerDay: 1 }
    },
    {
      id: uuidv4(),
      name: "Insulin Glargine",
      strength: "100 units/mL",
      form: "injection",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["9:00 PM"],
          quantity: 20
        }
      ],
      asNeeded: { maxPerDay: 40 }
    },
    {
      id: uuidv4(),
      name: "Fentanyl",
      strength: "50mcg/hr",
      form: "patch",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday"],
          times: ["8:00 AM"],
          quantity: 1
        }
      ],
      asNeeded: null
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
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeScreen />;
      case OnboardingStep.PersonalInfo:
        return <AccountInfoScreen showExample={showExample} previewRole={previewRole} />;
      case OnboardingStep.HealthConditions:
        return <HealthConditionsScreen showExample={showExample} />;
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
