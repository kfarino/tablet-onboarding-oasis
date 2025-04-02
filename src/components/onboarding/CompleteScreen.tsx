
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { CheckCircle2, Mic } from 'lucide-react';

const CompleteScreen: React.FC = () => {
  const { userProfile } = useOnboarding();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center">
      <CheckCircle2 className="text-highlight h-20 w-20 mb-6" />
      <h2 className="text-3xl font-bold mb-4">Setup Complete!</h2>
      <p className="text-white/70 mb-6 max-w-md">
        Thank you {userProfile.firstName}, your health profile and medication schedule have been successfully created.
      </p>
      <p className="text-white/70 mb-8 max-w-md">
        You can now access your medication schedule and reminders in the main dashboard.
      </p>
      
      <div className="voice-listening-indicator mt-4">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 rounded-full p-4 mb-4 pulse-animation">
            <Mic className="text-highlight h-6 w-6" />
          </div>
          <p className="text-white/70 text-center">
            Say "Go to dashboard" to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteScreen;
