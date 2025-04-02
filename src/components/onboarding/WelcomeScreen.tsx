
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const WelcomeScreen: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in overflow-hidden px-8">
      <div className="text-center mb-8">
        <h1 className="text-[40px] font-bold mb-4">Welcome</h1>
        <p className="text-white/70 text-xl">
          Let's set up your medication schedule and reminders
        </p>
      </div>
      
      <Button 
        onClick={nextStep}
        className="bg-highlight hover:bg-highlight/90 text-white w-full max-w-xs rounded-full py-6 flex items-center justify-center"
      >
        <span className="text-xl font-medium">Get Started</span>
        <ArrowRight className="ml-2 h-6 w-6" />
      </Button>
    </div>
  );
};

export default WelcomeScreen;
