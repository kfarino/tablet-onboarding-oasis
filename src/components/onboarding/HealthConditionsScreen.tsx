
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Mic, Heart, Info, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HealthConditionsScreen: React.FC = () => {
  const { userProfile, nextStep } = useOnboarding();

  return (
    <div className="animate-fade-in">
      <p className="onboarding-subtitle mb-6">Please speak any health conditions you have</p>

      <div className="voice-display-card">
        <Heart className="text-highlight h-5 w-5" />
        <div className="flex-1">
          <p className="text-white/70 text-sm">Your Health Conditions</p>
          
          {userProfile.healthConditions.length === 0 ? (
            <div className="flex items-center mt-2">
              <Info className="h-4 w-4 text-white/40 mr-2" />
              <p className="text-white/40">None added yet</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-2">
              {userProfile.healthConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 text-white"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="voice-instruction mt-8 p-4 rounded-lg border border-white/10 bg-white/5">
        <p className="text-white mb-2 font-medium">You can say:</p>
        <ul className="text-white/70 space-y-2">
          <li>"I have diabetes"</li>
          <li>"Add hypertension"</li>
          <li>"No health conditions"</li>
          <li>"Remove [condition name]"</li>
        </ul>
      </div>

      <div className="voice-listening-indicator mt-8">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 rounded-full p-4 mb-4 pulse-animation">
            <Mic className="text-highlight h-6 w-6" />
          </div>
          <p className="text-white/70 text-center mb-6">
            Say "Next" when you're finished adding conditions
          </p>
          
          <Button 
            onClick={nextStep}
            className="bg-highlight hover:bg-highlight/90 text-white"
          >
            Continue <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthConditionsScreen;
