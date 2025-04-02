
import React from 'react';
import { Button } from "@/components/ui/button";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowRight, Mic } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-highlight flex items-center justify-center mx-auto mb-6">
          <Mic className="text-white h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to MedTracker</h1>
        <p className="text-white/70 mb-8">
          I'm your voice assistant. I'll help set up your profile and medication schedule. 
          Please speak clearly when prompted, and I'll guide you through the process.
        </p>
        <div className="flex flex-col items-center">
          <div className="bg-white/10 rounded-full p-4 mb-4 pulse-animation">
            <Mic className="text-highlight h-8 w-8" />
          </div>
          <p className="text-white/70 mb-6">Say "Begin" or "Start" to continue</p>
          
          <Button 
            onClick={nextStep}
            className="bg-highlight hover:bg-highlight/90 text-white"
          >
            Begin <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
