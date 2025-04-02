import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface HealthConditionsScreenProps {
  showExample?: boolean;
}

const HealthConditionsScreen: React.FC<HealthConditionsScreenProps> = ({ showExample = false }) => {
  const { userProfile } = useOnboarding();

  // Example data for populated view
  const exampleConditions = ["Diabetes Type 2", "Hypertension", "Arthritis"];

  const displayConditions = showExample ? exampleConditions : userProfile.healthConditions;

  return (
    <div className="animate-fade-in px-10 py-6 pb-10">
      <div className="space-y-6">
        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-4 flex items-center">
            <Heart className="h-6 w-6 mr-3 text-highlight" />
            Health Conditions
          </h3>
          {displayConditions.length === 0 ? (
            <p className="text-white/40 text-lg">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {displayConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 hover:bg-white/20 text-white text-base py-1.5 px-4"
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
