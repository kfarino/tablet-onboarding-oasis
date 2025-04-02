
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { CheckCircle2, Mic, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CompleteScreen: React.FC = () => {
  const { userProfile } = useOnboarding();

  // In a real application, we would have a redirect function here
  const goToDashboard = () => {
    // This would navigate to the dashboard in a real app
    console.log('Navigating to dashboard...');
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex flex-col items-center px-8 py-8 h-full animate-fade-in">
      <div className="flex flex-col items-center justify-center max-w-md text-center">
        <CheckCircle2 className="text-highlight h-16 w-16 mb-6" />
        
        <p className="text-white/70 mb-4">
          Thank you {userProfile.firstName}, your health profile and medication schedule have been successfully created.
        </p>
        
        <p className="text-white/70 mb-8">
          You can now access your medication schedule and reminders in the main dashboard.
        </p>
        
        <Button 
          onClick={goToDashboard}
          className="bg-highlight hover:bg-highlight/90 text-white w-full rounded-full py-4 flex items-center justify-center mb-8"
        >
          Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="voice-listening-indicator">
          <div className="flex flex-col items-center">
            <div className="bg-white/10 rounded-full p-4 mb-2 pulse-animation">
              <Mic className="text-highlight h-6 w-6" />
            </div>
            <p className="text-white/70 text-center text-sm">
              Say "Go to dashboard" to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteScreen;
