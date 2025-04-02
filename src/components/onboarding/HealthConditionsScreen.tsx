
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Heart, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const HealthConditionsScreen: React.FC = () => {
  const { userProfile } = useOnboarding();
  const [showExample, setShowExample] = useState(false);

  // Example data for populated view
  const exampleConditions = ["Diabetes Type 2", "Hypertension", "Arthritis", "High Cholesterol"];

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  return (
    <div className="animate-fade-in flex flex-col h-full px-10 py-6">
      <div className="flex justify-end items-center mb-6">
        <Badge 
          className="cursor-pointer bg-highlight hover:bg-highlight/90 text-base py-1.5 px-4" 
          onClick={toggleExample}
        >
          {showExample ? "Show Empty View" : "Show Populated View"}
        </Badge>
      </div>

      <div className="voice-display-card p-5 h-40 mb-5">
        <Heart className="text-highlight h-7 w-7" />
        <div className="flex-1">
          <p className="text-white/70 text-xl mb-2">Your Health Conditions</p>
          
          {(!showExample && userProfile.healthConditions.length === 0) || 
           (showExample && exampleConditions.length === 0) ? (
            <div className="flex items-center mt-3">
              <Info className="h-5 w-5 text-white/40 mr-3" />
              <p className="text-white/40 text-lg">None added yet</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 mt-4 max-h-24 overflow-y-auto">
              {showExample ? 
                exampleConditions.map((condition, index) => (
                  <Badge 
                    key={index} 
                    className="bg-white/10 text-white text-lg px-5 py-2 font-medium"
                  >
                    {condition}
                  </Badge>
                )) :
                userProfile.healthConditions.map((condition, index) => (
                  <Badge 
                    key={index} 
                    className="bg-white/10 text-white text-lg px-5 py-2 font-medium"
                  >
                    {condition}
                  </Badge>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthConditionsScreen;
