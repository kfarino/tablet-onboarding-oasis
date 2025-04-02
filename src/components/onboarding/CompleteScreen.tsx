
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
    <div className="flex flex-col items-center px-10 py-10 h-full animate-fade-in">
      {/* Header with vertical centering */}
      <div className="w-full flex items-center justify-center mb-10">
        <h2 className="text-2xl font-bold">Setup Complete</h2>
      </div>
      
      <div className="flex flex-col items-center justify-center max-w-md text-center">
        <CheckCircle2 className="text-highlight h-20 w-20 mb-6" />
        
        <p className="text-white/70 mb-6">
          Thank you {userProfile.firstName}, your health profile and medication schedule have been successfully created.
        </p>
        
        <p className="text-white/70 mb-10">
          You can now access your medication schedule and reminders in the main dashboard.
        </p>
        
        <div className="voice-listening-indicator mt-8 w-full">
          <div className="flex flex-col items-center">
            <div className="bg-white/10 rounded-full p-4 mb-4 pulse-animation">
              <Mic className="text-highlight h-6 w-6" />
            </div>
            <p className="text-white/70 text-center mb-6">
              Say "Go to dashboard" to continue
            </p>
            
            {/* Styled button to match design system */}
            <Button 
              onClick={goToDashboard}
              className="bg-highlight hover:bg-highlight/90 text-white w-full max-w-xs rounded-full py-6"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteScreen;
