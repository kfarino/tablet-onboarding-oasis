
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const WelcomeScreen: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      <button
        onClick={nextStep}
        className="w-64 h-64 rounded-full bg-highlight text-white flex flex-col items-center justify-center shadow-lg hover:bg-highlight/90 transition-colors focus:outline-none focus:ring-4 focus:ring-highlight/50 relative"
      >
        {/* Enhanced glow effect with multiple layers */}
        <div className="absolute w-[120%] h-[120%] rounded-full bg-highlight/40 blur-xl -z-10 left-[-10%] top-[-10%]"></div>
        <div className="absolute w-[130%] h-[130%] rounded-full bg-highlight/20 blur-2xl -z-10 left-[-15%] top-[-15%]"></div>
        <div className="absolute w-full h-full rounded-full animate-pulse bg-highlight/30 blur-md -z-10"></div>
        
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
