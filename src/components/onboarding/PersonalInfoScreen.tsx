
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User, Calendar, Phone, BellRing } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_ROLES, UserRole, RELATIONSHIP_OPTIONS, ALERT_PREFERENCES, AlertPreference } from '@/types/onboarding';

interface PersonalInfoScreenProps {
  showExample?: boolean;
}

const PersonalInfoScreen: React.FC<PersonalInfoScreenProps> = ({ showExample = false }) => {
  const { userProfile, updateUserProfile } = useOnboarding();

  // Example data for populated view
  const exampleProfile = {
    firstName: "Jane",
    lastName: "Smith",
    role: UserRole.Caregiver,
    relationship: "child",
    phoneNumber: "(555) 123-4567",
  };

  const handleRoleChange = (value: string) => {
    updateUserProfile('role', value);
  };

  const handleRelationshipChange = (value: string) => {
    updateUserProfile('relationship', value);
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
              {showExample ? (
                <p className="text-2xl text-white">
                  {exampleProfile.role === UserRole.Caregiver ? 'Caregiver' : 'Primary User'}
                </p>
              ) : (
                <Select 
                  value={userProfile.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger className="w-full bg-transparent border-white/20 text-white text-2xl h-auto p-0">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {(userProfile.role === UserRole.Caregiver || (showExample && exampleProfile.role === UserRole.Caregiver)) && (
            <div className="voice-display-card p-5 h-32">
              <User className="text-highlight h-6 w-6" />
              <div className="flex-1">
                <p className="text-white/70 text-lg mb-1">Relationship to Loved One</p>
                {showExample ? (
                  <p className="text-2xl text-white">
                    {RELATIONSHIP_OPTIONS.find(r => r.value === exampleProfile.relationship)?.label || 'Child'}
                  </p>
                ) : (
                  <Select 
                    value={userProfile.relationship} 
                    onValueChange={handleRelationshipChange}
                  >
                    <SelectTrigger className="w-full bg-transparent border-white/20 text-white text-2xl h-auto p-0">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_OPTIONS.map((relationship) => (
                        <SelectItem key={relationship.value} value={relationship.value}>{relationship.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}

          {/* Phone number is needed for both roles */}
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
