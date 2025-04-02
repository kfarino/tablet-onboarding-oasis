
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, Clock, Calendar, Info, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

const MedicationsScreen: React.FC = () => {
  const { userProfile, nextStep } = useOnboarding();
  const [showExample, setShowExample] = useState(false);

  // Example data for populated view
  const exampleMedications = [
    {
      id: uuidv4(),
      name: "Lipitor",
      strength: "20mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["8:00 AM", "8:00 PM"],
          quantity: 1
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Metformin",
      strength: "500mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Wednesday", "Friday"],
          times: ["12:00 PM"],
          quantity: 2
        }
      ]
    }
  ];

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  const displayMedications = showExample ? exampleMedications : userProfile.medications;

  return (
    <div className="animate-fade-in px-8">
      <div className="flex justify-end items-center mb-6">
        <Badge 
          className="cursor-pointer bg-highlight hover:bg-highlight/90" 
          onClick={toggleExample}
        >
          {showExample ? "Show Empty View" : "Show Populated View"}
        </Badge>
      </div>

      {(!showExample && userProfile.medications.length === 0) || 
       (showExample && !exampleMedications.length) ? (
        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/20 rounded-lg">
          <Pill className="h-12 w-12 text-white/30 mb-4" />
          <p className="text-white/50 mb-1">No medications added yet</p>
          <p className="text-white/70">Say "Add medication" to begin</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayMedications.map(medication => (
            <div key={medication.id} className="medication-card">
              <div className="flex items-start gap-3 mb-4">
                <Pill className="h-5 w-5 text-highlight mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {medication.name || "New Medication"}
                  </h3>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <span>{medication.strength || "No strength"}</span>
                    {medication.strength && medication.form && <span>•</span>}
                    <span>{medication.form || "No form selected"}</span>
                  </div>
                </div>
              </div>

              {medication.doses.map(dose => (
                <div key={dose.id} className="ml-8 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">
                      {dose.days.length > 0 
                        ? dose.days.map(d => d === 'everyday' ? 'Everyday' : d).join(', ')
                        : 'No days selected'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-white/60" />
                    <span className="text-white/80">
                      {dose.times.length > 0 
                        ? dose.times.join(', ')
                        : 'No times selected'}
                    </span>
                  </div>
                  <div className="ml-6">
                    <span className="text-white/80">{dose.quantity} pill{dose.quantity !== 1 ? 's' : ''} per dose</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="voice-instruction mt-8 p-4 rounded-lg border border-white/10 bg-white/5">
        <p className="text-white mb-2 font-medium">You can say:</p>
        <ul className="text-white/70 space-y-2">
          <li>"Add Lipitor 50mg tablet"</li>
          <li>"Take it everyday at 8am and 9pm"</li>
          <li>"2 pills per dose"</li>
          <li>"Add another dose on Monday and Wednesday at 11am"</li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Button 
          onClick={nextStep}
          className="bg-highlight hover:bg-highlight/90 text-white px-8 py-2 rounded-full"
        >
          Continue <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MedicationsScreen;
