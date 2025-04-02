
import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';
import { format } from 'date-fns';
import { OnboardingStep } from '@/types/onboarding';

interface HeaderProps {
  currentStep?: OnboardingStep;
}

const Header: React.FC<HeaderProps> = ({ currentStep }) => {
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
      
      {getStepTitle() && (
        <div className="w-full text-center text-3xl font-bold mt-6 mb-4">
          {getStepTitle()}
        </div>
      )}
    </div>
  );
};

export default Header;
