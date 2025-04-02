
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User, Calendar, Phone, BellRing } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_ROLES, UserRole, RELATIONSHIP_OPTIONS, ALERT_PREFERENCES, AlertPreference } from '@/types/onboarding';

interface PersonalInfoScreenProps {
  showExample?: boolean;
  previewRole?: UserRole;
}

const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({ showExample = false, previewRole }) => {
  const { userProfile, updateUserProfile } = useOnboarding();

  // Example data for populated view
  const exampleProfile = {
    firstName: "Jane",
    lastName: "Smith",
    role: UserRole.Caregiver,
    relationship: "child",
    phoneNumber: "(555) 123-4567",
  };

  // Example for primary user
  const examplePrimaryUser = {
    firstName: "Robert",
    lastName: "Johnson",
    role: UserRole.PrimaryUser,
    dateOfBirth: "05/12/1945",
    phoneNumber: "(555) 987-6543",
  };

  // Determine which role to display
  const displayRole = previewRole || userProfile.role || UserRole.PrimaryUser;

  const getRelationshipLabel = (value: string | null) => {
    if (!value) return "";
    const relationship = RELATIONSHIP_OPTIONS.find(r => r.value === value);
    return relationship ? relationship.label : "";
  };

  return (
    <div className="animate-fade-in flex flex-col h-full px-6 py-2">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="voice-display-card p-3 h-24">
            <User className="text-highlight h-5 w-5" />
            <div className="flex-1">
              <p className="text-white/70 text-base mb-0.5">Full Name</p>
              <p className="text-xl text-white">
                {showExample 
                  ? displayRole === UserRole.Caregiver
                    ? `${exampleProfile.firstName} ${exampleProfile.lastName}`
                    : `${examplePrimaryUser.firstName} ${examplePrimaryUser.lastName}`
                  : userProfile.firstName || userProfile.lastName 
                    ? `${userProfile.firstName} ${userProfile.lastName}` 
                    : "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-3 h-24">
            <User className="text-highlight h-5 w-5" />
            <div className="flex-1">
              <p className="text-white/70 text-base mb-0.5">Role</p>
              <p className="text-xl text-white">
                {showExample 
                  ? (displayRole === UserRole.Caregiver ? 'Caregiver' : 'Primary User')
                  : userProfile.role 
                    ? (userProfile.role === UserRole.Caregiver ? 'Caregiver' : 'Primary User')
                    : "Listening..."}
              </p>
            </div>
          </div>

          {/* Date of Birth for Primary Users only */}
          {(displayRole === UserRole.PrimaryUser) && (
            <div className="voice-display-card p-3 h-24">
              <Calendar className="text-highlight h-5 w-5" />
              <div className="flex-1">
                <p className="text-white/70 text-base mb-0.5">Date of Birth</p>
                <p className="text-xl text-white">
                  {showExample 
                    ? examplePrimaryUser.dateOfBirth 
                    : userProfile.dateOfBirth || "Listening..."}
                </p>
              </div>
            </div>
          )}

          {/* Relationship shown as voice captured for Caregivers */}
          {(displayRole === UserRole.Caregiver) && (
            <div className="voice-display-card p-3 h-24">
              <User className="text-highlight h-5 w-5" />
              <div className="flex-1">
                <p className="text-white/70 text-base mb-0.5">Relationship to Loved One</p>
                <p className="text-xl text-white">
                  {showExample 
                    ? RELATIONSHIP_OPTIONS.find(r => r.value === exampleProfile.relationship)?.label || 'Child'
                    : userProfile.relationship
                      ? getRelationshipLabel(userProfile.relationship)
                      : "Listening..."}
                </p>
              </div>
            </div>
          )}

          {/* Phone number is needed for both roles */}
          <div className="voice-display-card p-3 h-24">
            <Phone className="text-highlight h-5 w-5" />
            <div className="flex-1">
              <p className="text-white/70 text-base mb-0.5">Phone Number</p>
              <p className="text-xl text-white">
                {showExample 
                  ? displayRole === UserRole.Caregiver
                    ? exampleProfile.phoneNumber 
                    : examplePrimaryUser.phoneNumber
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
