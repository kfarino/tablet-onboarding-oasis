
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User, Calendar, Phone, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PersonalInfoScreen: React.FC = () => {
  const { userProfile, nextStep } = useOnboarding();
  const [showExample, setShowExample] = useState(false);

  // Example data for populated view
  const exampleProfile = {
    firstName: "Jane",
    lastName: "Smith",
    role: "Caregiver",
    dateOfBirth: "03/15/1965",
    phoneNumber: "(555) 123-4567"
  };

  const toggleExample = () => {
    setShowExample(!showExample);
  };

  return (
    <div className="animate-fade-in flex flex-col h-full px-8">
      <div className="flex justify-end items-center mb-4">
        <Badge 
          className="cursor-pointer bg-highlight hover:bg-highlight/90" 
          onClick={toggleExample}
        >
          {showExample ? "Show Empty View" : "Show Populated View"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="voice-display-card p-3 h-24">
          <User className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Full Name</p>
            <p className="text-xl text-white">
              {showExample 
                ? `${exampleProfile.firstName} ${exampleProfile.lastName}` 
                : userProfile.firstName || userProfile.lastName 
                  ? `${userProfile.firstName} ${userProfile.lastName}` 
                  : "Listening..."}
            </p>
          </div>
        </div>

        <div className="voice-display-card p-3 h-24">
          <User className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Role</p>
            <p className="text-xl text-white">
              {showExample 
                ? exampleProfile.role 
                : userProfile.role || "Listening..."}
            </p>
          </div>
        </div>

        <div className="voice-display-card p-3 h-24">
          <Calendar className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Date of Birth</p>
            <p className="text-xl text-white">
              {showExample 
                ? exampleProfile.dateOfBirth 
                : userProfile.dateOfBirth || "Listening..."}
            </p>
          </div>
        </div>

        <div className="voice-display-card p-3 h-24">
          <Phone className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Phone Number</p>
            <p className="text-xl text-white">
              {showExample 
                ? exampleProfile.phoneNumber 
                : userProfile.phoneNumber || "Listening..."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button 
          onClick={nextStep}
          className="bg-highlight hover:bg-highlight/90 text-white py-2 px-8 rounded-full w-full max-w-xs mx-auto"
        >
          Continue <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoScreen;
