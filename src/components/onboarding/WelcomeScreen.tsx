
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
        {/* Super enhanced glow effect with multiple larger layers */}
        <div className="absolute w-[200%] h-[200%] rounded-full bg-highlight/30 blur-3xl -z-10 left-[-50%] top-[-50%]"></div>
        <div className="absolute w-[180%] h-[180%] rounded-full bg-highlight/40 blur-2xl -z-10 left-[-40%] top-[-40%]"></div>
        <div className="absolute w-[160%] h-[160%] rounded-full bg-highlight/50 blur-xl -z-10 left-[-30%] top-[-30%]"></div>
        <div className="absolute w-[140%] h-[140%] rounded-full bg-highlight/60 blur-lg -z-10 left-[-20%] top-[-20%]"></div>
        <div className="absolute w-[120%] h-[120%] rounded-full animate-pulse bg-highlight/70 blur-md -z-10 left-[-10%] top-[-10%]"></div>
        
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
