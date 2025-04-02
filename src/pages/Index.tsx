
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
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="w-[1024px] h-[600px] border-2 border-white/30 overflow-hidden relative">
        <OnboardingProvider>
          <OnboardingContainer />
        </OnboardingProvider>
      </div>
    </div>
  );
};

export default Index;
