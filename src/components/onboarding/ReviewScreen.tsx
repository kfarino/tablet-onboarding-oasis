
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Badge } from "@/components/ui/badge";
import { Mic, Calendar, Clock, Pill, User, Phone, Heart, ArrowRight } from 'lucide-react';
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
      <div className="flex justify-between items-center mb-6">
        <p className="onboarding-subtitle">Please review the following information</p>
        <Badge 
          className="cursor-pointer bg-highlight hover:bg-highlight/90" 
          onClick={toggleExample}
        >
          {showExample ? "Show Empty View" : "Show Populated View"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-sm font-medium text-white/70 mb-3 flex items-center">
            <User className="h-4 w-4 mr-2 text-highlight" />
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-white">
            <div>
              <p className="text-xs text-white/50">Full Name</p>
              <p>{displayProfile.firstName || "—"} {displayProfile.lastName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Role</p>
              <p>{displayProfile.role || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Date of Birth</p>
              <p>{displayProfile.dateOfBirth || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Phone Number</p>
              <p>{displayProfile.phoneNumber || "—"}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-sm font-medium text-white/70 mb-3 flex items-center">
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
                  className="bg-white/10 text-white"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-sm font-medium text-white/70 mb-3 flex items-center">
            <Pill className="h-4 w-4 mr-2 text-highlight" />
            Medications
          </h3>
          {displayProfile.medications.length === 0 ? (
            <p className="text-white/40 text-sm">No medications added</p>
          ) : (
            <div className="space-y-4">
              {displayProfile.medications.map(medication => (
                <div key={medication.id} className="p-3 border border-white/10 bg-white/5 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-5 w-5 text-highlight" />
                    <h4 className="font-medium text-white">{medication.name}</h4>
                    <span className="text-sm text-white/60">{medication.strength} • {medication.form}</span>
                  </div>
                  {medication.doses.map(dose => (
                    <div key={dose.id} className="ml-7 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/80">
                          {dose.days.length > 0 
                            ? dose.days.map(d => d === 'everyday' ? 'Everyday' : d).join(', ')
                            : 'No days selected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/80">
                          {dose.times.length > 0 
                            ? dose.times.join(', ')
                            : 'No times selected'}
                        </span>
                      </div>
                      <div className="ml-6">
                        <span className="text-sm text-white/80">{dose.quantity} pill{dose.quantity !== 1 ? 's' : ''} per dose</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pb-6">
        <Button 
          onClick={nextStep}
          className="bg-highlight hover:bg-highlight/90 text-white w-full rounded-full py-4 flex items-center justify-center"
        >
          Complete Setup <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="voice-listening-indicator">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 rounded-full p-4 mb-2 pulse-animation">
            <Mic className="text-highlight h-6 w-6" />
          </div>
          <p className="text-white/70 text-center text-sm">
            Say "Complete" to finish setup or "Go back" to make changes
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
