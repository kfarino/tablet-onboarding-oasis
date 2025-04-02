
import React, { useState, useEffect } from 'react';
import { Wifi, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { OnboardingStep } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface HeaderProps {
  currentStep?: OnboardingStep;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentStep, onBack }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { nextStep } = useOnboarding();
  const [showExample, setShowExample] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleExample = () => {
    setShowExample(!showExample);
  };

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
    
  const showNextButton = currentStep !== undefined && 
    currentStep !== OnboardingStep.Complete;
    
  const showPreviewButton = currentStep === OnboardingStep.Review;

  return (
    <div className="w-full bg-charcoal text-white py-4 px-8 flex flex-col relative">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-medium">
          {format(currentTime, 'EEE, MMM d')}
        </div>
        <div className="text-3xl font-medium absolute left-1/2 transform -translate-x-1/2">
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
        
        {showPreviewButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExample}
            className="absolute right-20 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-full h-14 w-14"
            aria-label="Toggle preview"
          >
            <Eye className="h-7 w-7" />
          </Button>
        )}
        
        {showNextButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={nextStep}
            className="absolute right-0 bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-full h-14 w-14"
            aria-label="Continue"
          >
            <ArrowRight className="h-7 w-7" />
          </Button>
        )}
        
        {getStepTitle() && (
          <div className="text-[44px] font-bold">
            {getStepTitle()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
