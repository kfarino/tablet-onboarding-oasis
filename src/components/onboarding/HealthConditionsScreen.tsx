
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface HealthConditionsScreenProps {
  showExample?: boolean;
}

const HealthConditionsScreen: React.FC<HealthConditionsScreenProps> = ({ showExample = false }) => {
  const { userProfile } = useOnboarding();

  // Example data for populated view - consistent with ReviewScreen
  const exampleConditions = ["Diabetes Type 2", "Hypertension", "Arthritis"];

  const displayConditions = showExample ? exampleConditions : userProfile.healthConditions;

  return (
    <div className="animate-fade-in px-6 py-4 pb-8">
      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-3 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-highlight" />
            Health Conditions
          </h3>
          {displayConditions.length === 0 ? (
            <p className="text-white/40 text-lg">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 hover:bg-white/20 text-white text-base py-1 px-3"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthConditionsScreen;
