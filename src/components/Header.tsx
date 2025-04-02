
import React, { useState, useEffect } from 'react';
import { Wifi, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { OnboardingStep } from '@/types/onboarding';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentStep?: OnboardingStep;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentStep, onBack }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <div className="w-full bg-charcoal text-white py-3 px-6 flex flex-col relative">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-medium">
          {format(currentTime, 'EEE, MMM d')}
        </div>
        <div className="text-2xl font-medium absolute left-1/2 transform -translate-x-1/2">
          {format(currentTime, 'h:mm a')}
        </div>
        <div>
          <Wifi size={24} />
        </div>
      </div>
      
      <div className="w-full flex items-center justify-center relative mt-6 mb-4">
        {showBackButton && onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="absolute left-0 text-white hover:bg-white/10 hover:text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </Button>
        )}
        {getStepTitle() && (
          <div className="text-3xl font-bold">
            {getStepTitle()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
