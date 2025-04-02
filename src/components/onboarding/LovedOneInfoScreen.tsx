
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User, Calendar, BellRing, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALERT_PREFERENCES, AlertPreference } from '@/types/onboarding';

interface LovedOneInfoScreenProps {
  showExample?: boolean;
}

const LovedOneInfoScreen: React.FC<LovedOneInfoScreenProps> = ({ showExample = false }) => {
  const { userProfile, updateUserProfile } = useOnboarding();

  // Example data for populated view - corrected for caregiver flow
  const exampleLovedOne = {
    firstName: "Robert",
    lastName: "Smith",
    dateOfBirth: "06/12/1940",
    phoneNumber: "(555) 678-9012",
    alertPreference: AlertPreference.PhoneCall
  };

  const handleAlertPreferenceChange = (value: string) => {
    const updatedLovedOne = {
      ...userProfile.lovedOne,
      alertPreference: value as AlertPreference
    };
    updateUserProfile('lovedOne', updatedLovedOne);
  };

  const updateLovedOneField = (field: keyof typeof userProfile.lovedOne, value: string) => {
    const updatedLovedOne = {
      ...userProfile.lovedOne,
      [field]: value
    };
    updateUserProfile('lovedOne', updatedLovedOne);
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
                  ? `${exampleLovedOne.firstName} ${exampleLovedOne.lastName}` 
                  : userProfile.lovedOne.firstName || userProfile.lovedOne.lastName 
                    ? `${userProfile.lovedOne.firstName} ${userProfile.lovedOne.lastName}` 
                    : "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-5 h-32">
            <Calendar className="text-highlight h-6 w-6" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-1">Date of Birth</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? exampleLovedOne.dateOfBirth 
                  : userProfile.lovedOne.dateOfBirth || "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-5 h-32">
            <Phone className="text-highlight h-6 w-6" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-1">Phone Number</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? exampleLovedOne.phoneNumber 
                  : userProfile.lovedOne.phoneNumber || "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-5 h-32">
            <BellRing className="text-highlight h-6 w-6" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-1">Alert Preference</p>
              {showExample ? (
                <p className="text-2xl text-white">
                  {ALERT_PREFERENCES.find(a => a.value === exampleLovedOne.alertPreference)?.label || 'Phone Call'}
                </p>
              ) : (
                <Select 
                  value={userProfile.lovedOne.alertPreference || ''} 
                  onValueChange={handleAlertPreferenceChange}
                >
                  <SelectTrigger className="w-full bg-transparent border-white/20 text-white text-2xl h-auto p-0">
                    <SelectValue placeholder="Select alert preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALERT_PREFERENCES.map((pref) => (
                      <SelectItem key={pref.value} value={pref.value}>{pref.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LovedOneInfoScreen;
