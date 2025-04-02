
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { CheckCircle2 } from 'lucide-react';

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
        
        {/* Button removed as the navigation is now handled in the Header component */}
      </div>
    </div>
  );
};

export default CompleteScreen;
