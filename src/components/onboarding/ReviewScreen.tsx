
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Pill, User, Phone, Heart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ReviewScreen: React.FC = () => {
  const { userProfile } = useOnboarding();
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

      <div className="space-y-5">
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-base font-medium text-white/90 mb-3 flex items-center">
            <User className="h-5 w-5 mr-2 text-highlight" />
            Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-white">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-base font-medium">{displayProfile.firstName || "—"} {displayProfile.lastName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Role</p>
              <p className="text-base font-medium">{displayProfile.role || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Date of Birth</p>
              <p className="text-base font-medium">{displayProfile.dateOfBirth || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Phone Number</p>
              <p className="text-base font-medium">{displayProfile.phoneNumber || "—"}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-base font-medium text-white/90 mb-3 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-highlight" />
            Health Conditions
          </h3>
          {displayProfile.healthConditions.length === 0 ? (
            <p className="text-white/40 text-base">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayProfile.healthConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-3"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-base font-medium text-white/90 mb-3 flex items-center">
            <Pill className="h-5 w-5 mr-2 text-highlight" />
            Medications
          </h3>
          {displayProfile.medications.length === 0 ? (
            <p className="text-white/40 text-base">No medications added</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayProfile.medications.map(medication => (
                <div key={medication.id} className="p-3 border border-white/20 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4 text-highlight" />
                    <h4 className="font-medium text-white text-base">
                      {medication.name}{medication.strength ? ` ${medication.strength}` : ""}
                    </h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3 ml-6">
                    {medication.form && (
                      <span className="text-sm text-white/80 bg-white/10 px-2 py-0.5 rounded">
                        {medication.form}
                      </span>
                    )}
                  </div>
                  
                  {medication.doses.map(dose => (
                    <div key={dose.id} className="ml-6 mb-2 border-l border-white/20 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-white/80" />
                        <span className="text-sm text-white">
                          {dose.days.length > 0 
                            ? dose.days.map(d => d === 'everyday' ? 'Everyday' : d).join(', ')
                            : 'No days selected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-white/80" />
                        <span className="text-sm text-white">
                          {dose.times.length > 0 
                            ? dose.times.join(', ')
                            : 'No times selected'}
                        </span>
                      </div>
                      <div className="text-xs text-white/80 mt-1">
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
    </div>
  );
};

export default ReviewScreen;
