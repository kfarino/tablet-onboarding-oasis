
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CompleteScreen: React.FC = () => {
  const { userProfile } = useOnboarding();

  // In a real application, we would have a redirect function here
  const goToDashboard = () => {
    // This would navigate to the dashboard in a real app
    console.log('Navigating to dashboard...');
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex flex-col items-center px-6 py-6 h-full animate-fade-in">
      <div className="flex flex-col items-center justify-center max-w-md text-center">
        <CheckCircle2 className="text-highlight h-16 w-16 mb-6" />
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Your health profile is ready!
        </h2>
        
        <p className="text-white/80 text-xl mb-4">
          Thank you {userProfile.firstName}, your health profile and medication schedule have been successfully created.
        </p>
        
        <p className="text-white/70 text-lg mb-6">
          You can now access your medication schedule and reminders in the main dashboard.
        </p>
        
        <Button 
          className="flex items-center gap-2 bg-highlight hover:bg-highlight/90 text-white px-6 py-3 rounded-full text-xl"
          onClick={goToDashboard}
        >
          Go to Dashboard <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CompleteScreen;
