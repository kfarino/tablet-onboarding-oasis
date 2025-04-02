
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="m8 2 2 2-2 2 2 2-2 2 2 2"></path>
            <path d="M2 8h8"></path>
            <path d="M6 16h14"></path>
            <path d="M18.37 19.59 20 18l2 2-1.59 1.63a2 2 0 0 1-2.82 0L18 22c-.39-.39-.38-1.02 0-1.41z"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to MedTracker</h1>
        <p className="text-white/70 mb-8">
          Let's set up your profile and medication schedule to help you stay on track with your health journey.
        </p>
        <Button 
          onClick={nextStep}
          className="w-full bg-highlight hover:bg-highlight/90 text-white"
        >
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
