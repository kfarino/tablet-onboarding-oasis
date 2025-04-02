
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const WelcomeScreen: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in overflow-hidden">
      <button
        onClick={nextStep}
        className="w-64 h-64 rounded-full bg-highlight text-white flex flex-col items-center justify-center shadow-lg hover:bg-highlight/90 transition-colors focus:outline-none focus:ring-4 focus:ring-highlight/50"
      >
        {/* Button text */}
        <div className="text-center">
          <p className="text-2xl font-light">Tap to</p>
          <p className="text-5xl font-semibold">Connect</p>
        </div>
      </button>
    </div>
  );
};

export default WelcomeScreen;
