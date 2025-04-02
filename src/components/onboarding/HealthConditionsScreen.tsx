
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowLeft, ArrowRight, X, Plus } from 'lucide-react';

const HealthConditionsScreen: React.FC = () => {
  const { userProfile, nextStep, prevStep, addHealthCondition, removeHealthCondition } = useOnboarding();
  const [newCondition, setNewCondition] = useState('');

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      addHealthCondition(newCondition.trim());
      setNewCondition('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCondition();
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="onboarding-title">Health Conditions</h2>
      <p className="onboarding-subtitle">Add any health conditions you have</p>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="healthCondition" className="input-label">Health Condition</Label>
          <div className="flex gap-2">
            <Input
              id="healthCondition"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 flex-1"
              placeholder="e.g., Hypertension, Diabetes"
            />
            <Button 
              onClick={handleAddCondition}
              aria-label="Add health condition"
              className="bg-highlight hover:bg-highlight/90 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-white/50 mt-1">Press Enter to add multiple conditions</p>
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5 min-h-[100px]">
          <h3 className="text-sm font-medium text-white/70 mb-3">Current Health Conditions</h3>
          {userProfile.healthConditions.length === 0 ? (
            <p className="text-white/40 text-sm">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userProfile.healthConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 hover:bg-white/15 text-white"
                >
                  {condition}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHealthCondition(index)}
                    className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                    aria-label={`Remove ${condition}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          onClick={prevStep} 
          variant="outline" 
          className="bg-transparent text-white border-white/30 hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="bg-highlight hover:bg-highlight/90 text-white"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HealthConditionsScreen;
