
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

const WelcomeScreen: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in overflow-visible py-8">
      <div className="relative p-4">
        <button
          onClick={nextStep}
          className="w-72 h-72 rounded-full bg-highlight text-white flex flex-col items-center justify-center shadow-[0_8px_30px_rgba(242,108,58,0.3)] hover:bg-highlight/90 hover:shadow-[0_8px_35px_rgba(242,108,58,0.4)] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-highlight/50 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="text-center">
            <p className="text-3xl font-light">Tap to</p>
            <p className="text-6xl font-semibold">Connect</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
