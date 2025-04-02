
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User, Calendar, Phone } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface PersonalInfoScreenProps {
  showExample?: boolean;
}

const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({ showExample = false }) => {
  const { userProfile } = useOnboarding();

  // Example data for populated view
  const exampleProfile = {
    firstName: "Jane",
    lastName: "Smith",
    role: "Caregiver",
    dateOfBirth: "03/15/1965",
    phoneNumber: "(555) 123-4567"
  };

  return (
    <div className="animate-fade-in flex flex-col h-full px-10 py-6">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-5 mb-4">
          <div className="voice-display-card p-5 h-32">
            <User className="text-highlight h-6 w-6" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-1">Full Name</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? `${exampleProfile.firstName} ${exampleProfile.lastName}` 
                  : userProfile.firstName || userProfile.lastName 
                    ? `${userProfile.firstName} ${userProfile.lastName}` 
                    : "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-5 h-32">
            <User className="text-highlight h-6 w-6" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-1">Role</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? exampleProfile.role 
                  : userProfile.role || "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-5 h-32">
            <Calendar className="text-highlight h-6 w-6" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-1">Date of Birth</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? exampleProfile.dateOfBirth 
                  : userProfile.dateOfBirth || "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-5 h-32">
            <Phone className="text-highlight h-6 w-6" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-1">Phone Number</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? exampleProfile.phoneNumber 
                  : userProfile.phoneNumber || "Listening..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoScreen;
