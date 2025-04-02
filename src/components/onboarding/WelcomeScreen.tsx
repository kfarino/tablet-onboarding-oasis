
import React from 'react';
import { Button } from "@/components/ui/button";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowRight } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-highlight flex items-center justify-center mx-auto mb-6">
          <ArrowRight className="text-white h-8 w-8" />
        </div>
        <p className="text-white/70 mb-8">
          I'm your voice assistant. I'll help set up your profile and medication schedule. 
          Please speak clearly when prompted, and I'll guide you through the process.
        </p>
        <div className="flex flex-col items-center">
          <p className="text-white/70 mb-6">Say "Begin" or "Start" to continue</p>
          
          <Button 
            onClick={nextStep}
            className="bg-highlight hover:bg-highlight/90 text-white py-4 px-8 rounded-full"
          >
            Begin <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
