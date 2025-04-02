
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';
import { useEffect } from 'react';

const Index = () => {
  // Set up viewport meta tag for tablet display
  useEffect(() => {
    // Add viewport meta tag optimized for 7" tablet (1024x600)
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=1024, height=600, initial-scale=1';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen bg-charcoal">
      <OnboardingProvider>
        <OnboardingContainer />
      </OnboardingProvider>
    </div>
  );
};

export default Index;
