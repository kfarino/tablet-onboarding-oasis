
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Pill, User, Phone, Heart, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';

const ReviewScreen: React.FC = () => {
  const { userProfile, nextStep } = useOnboarding();
  const [showExample, setShowExample] = useState(false);

  // Example data for populated view
  const exampleProfile = {
    firstName: "Jane",
    lastName: "Smith",
    role: "Caregiver",
    dateOfBirth: "03/15/1965",
    phoneNumber: "(555) 123-4567",
    healthConditions: ["Diabetes Type 2", "Hypertension", "Arthritis"],
    medications: [
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
    ]
  };

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  const displayProfile = showExample ? exampleProfile : userProfile;

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

      <div className="space-y-3">
        <div className="p-3 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-sm font-medium text-white/70 mb-2 flex items-center">
            <User className="h-4 w-4 mr-2 text-highlight" />
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-white">
            <div>
              <p className="text-xs text-white/50">Full Name</p>
              <p className="text-sm">{displayProfile.firstName || "—"} {displayProfile.lastName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Role</p>
              <p className="text-sm">{displayProfile.role || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Date of Birth</p>
              <p className="text-sm">{displayProfile.dateOfBirth || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Phone Number</p>
              <p className="text-sm">{displayProfile.phoneNumber || "—"}</p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-sm font-medium text-white/70 mb-2 flex items-center">
            <Heart className="h-4 w-4 mr-2 text-highlight" />
            Health Conditions
          </h3>
          {displayProfile.healthConditions.length === 0 ? (
            <p className="text-white/40 text-sm">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayProfile.healthConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 text-white text-xs"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-sm font-medium text-white/70 mb-2 flex items-center">
            <Pill className="h-4 w-4 mr-2 text-highlight" />
            Medications
          </h3>
          {displayProfile.medications.length === 0 ? (
            <p className="text-white/40 text-sm">No medications added</p>
          ) : (
            <div className="space-y-2">
              {displayProfile.medications.map(medication => (
                <div key={medication.id} className="p-2 border border-white/10 bg-white/5 rounded-md">
                  <div className="flex items-center gap-1 mb-1">
                    <Pill className="h-3 w-3 text-highlight" />
                    <h4 className="font-medium text-white text-sm">{medication.name}</h4>
                    <span className="text-xs text-white/60">{medication.strength} • {medication.form}</span>
                  </div>
                  {medication.doses.map(dose => (
                    <div key={dose.id} className="ml-5 mb-1 border-l border-white/10 pl-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-white/60" />
                        <span className="text-xs text-white/80">
                          {dose.days.length > 0 
                            ? dose.days.map(d => d === 'everyday' ? 'Everyday' : d).join(', ')
                            : 'No days selected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-white/60" />
                        <span className="text-xs text-white/80">
                          {dose.times.length > 0 
                            ? dose.times.join(', ')
                            : 'No times selected'}
                        </span>
                      </div>
                      <div className="ml-3 text-xs text-white/70">
                        {dose.quantity} pill{dose.quantity !== 1 ? 's' : ''} per dose
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pb-6">
        <Button 
          onClick={nextStep}
          className="bg-highlight hover:bg-highlight/90 text-white w-full rounded-full py-3 flex items-center justify-center"
        >
          Complete Setup <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewScreen;
