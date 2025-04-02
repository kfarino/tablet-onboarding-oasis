import React, { useState, useEffect } from 'react';
import { Wifi, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { OnboardingStep, UserRole } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface HeaderProps {
  currentStep?: OnboardingStep;
  onBack?: () => void;
  toggleExample?: () => void;
  showExample?: boolean;
  onTogglePreviewRole?: () => void;
  previewRole?: UserRole | null;
}

const Header: React.FC<HeaderProps> = ({ 
  currentStep, 
  onBack, 
  toggleExample, 
  showExample,
  onTogglePreviewRole,
  previewRole
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { nextStep } = useOnboarding();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStepTitle = () => {
    if (currentStep === undefined) return "";
    
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return "Welcome";
      case OnboardingStep.PersonalInfo:
        return "Personal Information";
      case OnboardingStep.LovedOneInfo:
        return "Loved One Information";
      case OnboardingStep.HealthConditions:
        return "Health Conditions";
      case OnboardingStep.Medications:
        return "Medications";
      case OnboardingStep.Review:
        return "Review";
      case OnboardingStep.Complete:
        return "Setup Complete";
      default:
        return "";
    }
  };

  const showBackButton = currentStep !== undefined && 
    currentStep !== OnboardingStep.Welcome && 
    currentStep !== OnboardingStep.Complete;
    
  const showNextButton = currentStep !== undefined && 
    currentStep !== OnboardingStep.Complete;
    
  const showPreviewButton = currentStep !== OnboardingStep.Welcome && 
    currentStep !== OnboardingStep.Complete && 
    toggleExample !== undefined;

  // Keep the eye icon button separate
  const getPreviewButtonLabel = () => {
    if (!showExample) return null;
    return null; // Just show the Eye icon with no label
  };

  return (
    <div className="w-full bg-charcoal text-white py-4 px-8 flex flex-col relative">
      <div className="flex justify-between items-center">
        <div className="text-[25px] font-medium">
          {format(currentTime, 'EEE, MMM d')}
        </div>
        <div className="text-[25px] font-medium absolute left-1/2 transform -translate-x-1/2">
          {format(currentTime, 'h:mm a')}
        </div>
        <div>
          <Wifi size={28} />
        </div>
      </div>
      
      <div className="w-full flex items-center justify-center relative mt-8 mb-5">
        {showBackButton && onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="absolute left-0 text-white hover:bg-white/10 hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={28} />
          </Button>
        )}
        
        {showPreviewButton && toggleExample && (
          <Button
            variant="ghost"
            size="icon-circle"
            onClick={toggleExample}
            className={`absolute right-20 ${showExample ? 'bg-white/20' : 'bg-white/10'} text-white hover:bg-white/20 hover:text-white flex items-center justify-center`}
            aria-label="Toggle preview"
          >
            <Eye className="h-7 w-7" />
          </Button>
        )}
        
        {onTogglePreviewRole && showExample && (
          <Button
            variant="ghost"
            size="icon-circle"
            onClick={onTogglePreviewRole}
            className="absolute right-36 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            aria-label="Toggle role"
          >
            <span className="text-sm font-bold">
              {previewRole === UserRole.PrimaryUser ? 'P' : previewRole === UserRole.Caregiver ? 'C' : '?'}
            </span>
          </Button>
        )}
        
        {showNextButton && (
          <Button
            variant="ghost"
            size="icon-circle"
            onClick={nextStep}
            className="absolute right-0 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            aria-label="Continue"
          >
            <ArrowRight className="h-7 w-7" />
          </Button>
        )}
        
        {getStepTitle() && (
          <div className="text-[40px] font-bold">
            {getStepTitle()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
