
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, Clock, Calendar, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';
import { getDayAbbreviation } from '@/utils/dateUtils';

const MedicationsScreen: React.FC = () => {
  const { userProfile } = useOnboarding();
  const [showExample, setShowExample] = useState(true); // Set to true by default to show examples

  // Example data for populated view - expanded to 15 medications with various scenarios
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
    },
    {
      id: uuidv4(),
      name: "Lisinopril",
      strength: "10mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["9:00 AM"],
          quantity: 1
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Levothyroxine",
      strength: "75mcg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["7:00 AM"],
          quantity: 1
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Aspirin",
      strength: "81mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["10:00 AM"],
          quantity: 1
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Omeprazole",
      strength: "20mg",
      form: "capsule",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          times: ["7:30 AM"],
          quantity: 1
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Albuterol",
      strength: "90mcg",
      form: "inhaler",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["as needed"],
          quantity: 2
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Amlodipine",
      strength: "5mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["9:00 PM"],
          quantity: 1
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Furosemide",
      strength: "40mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Wednesday", "Friday"],
          times: ["9:00 AM"],
          quantity: 1
        },
        {
          id: uuidv4(),
          days: ["Tuesday", "Thursday"],
          times: ["10:00 AM"],
          quantity: 2
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Januvia",
      strength: "100mg",
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
      name: "Prednisone",
      strength: "5mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          times: ["10:30 AM"],
          quantity: 1
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Warfarin",
      strength: "2.5mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday", "Wednesday", "Friday", "Sunday"],
          times: ["5:00 PM"],
          quantity: 1
        },
        {
          id: uuidv4(),
          days: ["Tuesday", "Thursday", "Saturday"],
          times: ["5:00 PM"],
          quantity: 2
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Hydrochlorothiazide",
      strength: "25mg",
      form: "tablet",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["10:00 AM"],
          quantity: 1
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Insulin Glargine",
      strength: "100 units/mL",
      form: "injection",
      doses: [
        {
          id: uuidv4(),
          days: ["everyday"],
          times: ["9:00 PM"],
          quantity: 20
        }
      ]
    },
    {
      id: uuidv4(),
      name: "Fentanyl",
      strength: "50mcg/hr",
      form: "patch",
      doses: [
        {
          id: uuidv4(),
          days: ["Monday"],
          times: ["8:00 AM"],
          quantity: 1
        }
      ]
    }
  ];

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  const displayMedications = showExample ? exampleMedications : userProfile.medications;

  const formatDays = (days: string[]) => {
    if (days.includes('everyday')) return 'Everyday';
    
    return days.map(day => getDayAbbreviation(day)).join(', ');
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayMedications.map(medication => (
            <div key={medication.id} className="p-4 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Pill className="h-5 w-5 text-highlight" />
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {medication.name || "New Medication"}{medication.strength ? ` ${medication.strength}` : ""}
                  </h3>
                  <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                    {medication.form && <span className="bg-white/10 px-2 py-0.5 rounded">{medication.form}</span>}
                  </div>
                </div>
              </div>

              {medication.doses.map(dose => (
                <div key={dose.id} className="ml-6 mt-3 border-l-2 border-white/20 pl-4 py-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-white/80" />
                    <span className="text-base text-white">
                      {dose.days.length > 0 
                        ? formatDays(dose.days)
                        : 'No days selected'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-white/80" />
                    <span className="text-base text-white">
                      {dose.times.length > 0 
                        ? dose.times.join(', ')
                        : 'No times selected'}
                    </span>
                  </div>
                  <div className="ml-6 text-sm text-white/80">
                    <span>{dose.quantity} pill{dose.quantity !== 1 ? 's' : ''} per dose</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationsScreen;
