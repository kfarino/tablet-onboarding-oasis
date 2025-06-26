
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { CheckCircle2 } from 'lucide-react';

const CompleteScreen: React.FC = () => {
  const { prevStep } = useOnboarding();

  return (
    <div className="flex flex-col items-center px-6 py-6 h-full animate-fade-in">
      <div className="flex flex-col items-center justify-center max-w-md text-center">
        <CheckCircle2 className="text-highlight h-16 w-16 mb-6" />
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Get ready to load your meds!
        </h2>
      </div>
    </div>
  );
};

export default CompleteScreen;
