
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import OnboardingContainer from '@/components/onboarding/OnboardingContainer';
import { useEffect, useState } from 'react';

const Index = () => {
  const [showMedicationSchedule, setShowMedicationSchedule] = useState(false);

  // Set up viewport meta tag for tablet display
  useEffect(() => {
    // Add viewport meta tag optimized for 7" tablet (747x420)
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=747, height=420, initial-scale=1';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="w-[747px] h-[420px] border-2 border-white/30 overflow-hidden relative">
        <OnboardingProvider>
          <OnboardingContainer 
            showMedicationSchedule={showMedicationSchedule}
            setShowMedicationSchedule={setShowMedicationSchedule}
          />
        </OnboardingProvider>
      </div>
    </div>
  );
};

export default Index;
