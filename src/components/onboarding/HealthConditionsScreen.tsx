
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Heart, Info, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HealthConditionsScreen: React.FC = () => {
  const { userProfile, nextStep } = useOnboarding();
  const [showExample, setShowExample] = useState(false);

  // Example data for populated view
  const exampleConditions = ["Diabetes Type 2", "Hypertension", "Arthritis", "High Cholesterol"];

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  return (
    <div className="animate-fade-in flex flex-col h-full px-8">
      <div className="flex justify-end items-center mb-3">
        <Badge 
          className="cursor-pointer bg-highlight hover:bg-highlight/90" 
          onClick={toggleExample}
        >
          {showExample ? "Show Empty View" : "Show Populated View"}
        </Badge>
      </div>

      <div className="voice-display-card p-3 h-32 mb-3">
        <Heart className="text-highlight h-5 w-5" />
        <div className="flex-1">
          <p className="text-white/70 text-sm">Your Health Conditions</p>
          
          {(!showExample && userProfile.healthConditions.length === 0) || 
           (showExample && exampleConditions.length === 0) ? (
            <div className="flex items-center mt-2">
              <Info className="h-4 w-4 text-white/40 mr-2" />
              <p className="text-white/40">None added yet</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 mt-3 max-h-20 overflow-y-auto">
              {showExample ? 
                exampleConditions.map((condition, index) => (
                  <Badge 
                    key={index} 
                    className="bg-white/10 text-white text-base px-4 py-1.5 font-medium"
                  >
                    {condition}
                  </Badge>
                )) :
                userProfile.healthConditions.map((condition, index) => (
                  <Badge 
                    key={index} 
                    className="bg-white/10 text-white text-base px-4 py-1.5 font-medium"
                  >
                    {condition}
                  </Badge>
                ))
              }
            </div>
          )}
        </div>
      </div>

      <div className="voice-instruction p-3 rounded-lg border border-white/10 bg-white/5 mb-3">
        <p className="text-white mb-2 font-medium">You can say:</p>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-white/70">"I have diabetes"</p>
          <p className="text-white/70">"Add hypertension"</p>
          <p className="text-white/70">"No health conditions"</p>
          <p className="text-white/70">"Remove [condition name]"</p>
        </div>
      </div>

      <div className="mt-auto">
        <Button 
          onClick={nextStep}
          className="bg-highlight hover:bg-highlight/90 text-white py-2 px-8 rounded-full w-full max-w-xs mx-auto block"
        >
          Continue <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default HealthConditionsScreen;
