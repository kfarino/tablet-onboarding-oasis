
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
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
      
      <button
        onClick={nextStep}
        className="w-64 h-64 rounded-full bg-highlight text-white flex flex-col items-center justify-center shadow-lg hover:bg-highlight/90 transition-colors focus:outline-none focus:ring-2 focus:ring-highlight/50"
      >
        <div className="text-center">
          <p className="text-2xl font-light">Tap to</p>
          <p className="text-5xl font-semibold">Connect</p>
        </div>
      </button>
    </div>
  );
};

export default WelcomeScreen;
