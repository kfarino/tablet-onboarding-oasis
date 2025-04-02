
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
      <div className="flex justify-end items-center mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayMedications.map(medication => (
            <div key={medication.id} className="p-3 border border-white/10 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-4 w-4 text-highlight" />
                <div>
                  <h3 className="text-base font-medium text-white">
                    {medication.name || "New Medication"}
                  </h3>
                  <div className="flex items-center gap-1 text-white/70 text-xs">
                    <span>{medication.strength || "No strength"}</span>
                    {medication.strength && medication.form && <span>•</span>}
                    <span>{medication.form || "No form selected"}</span>
                  </div>
                </div>
              </div>

              {medication.doses.map(dose => (
                <div key={dose.id} className="ml-6 mb-2 border-l-2 border-white/10 pl-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-white/60" />
                    <span className="text-sm text-white/80">
                      {dose.days.length > 0 
                        ? dose.days.map(d => d === 'everyday' ? 'Everyday' : d).join(', ')
                        : 'No days selected'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-white/60" />
                    <span className="text-sm text-white/80">
                      {dose.times.length > 0 
                        ? dose.times.join(', ')
                        : 'No times selected'}
                    </span>
                  </div>
                  <div className="ml-4 text-xs text-white/70">
                    <span>{dose.quantity} pill{dose.quantity !== 1 ? 's' : ''} per dose</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end mb-6">
        <Button
          onClick={nextStep}
          variant="ghost"
          size="icon"
          className="bg-white/10 text-white hover:bg-white/20 hover:text-white rounded-full h-12 w-12"
          aria-label="Continue"
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default MedicationsScreen;
