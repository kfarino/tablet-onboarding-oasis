
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const WelcomeScreen: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div className="relative">
        <button
          onClick={nextStep}
          className="w-60 h-60 rounded-full bg-highlight text-white flex flex-col items-center justify-center shadow-[0_8px_20px_rgba(242,108,58,0.6)] hover:bg-highlight/90 hover:shadow-[0_8px_25px_rgba(242,108,58,0.7)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-highlight/50 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="text-center -mt-2">
            <p className="text-[25px] font-light mb-[-5px]">Tap to</p>
            <p className="text-[40px] font-medium">Start</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
