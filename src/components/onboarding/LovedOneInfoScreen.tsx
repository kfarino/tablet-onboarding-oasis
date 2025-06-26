
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User, Calendar, BellRing, Phone, Stethoscope } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALERT_PREFERENCES, AlertPreference } from '@/types/onboarding';
import { Badge } from "@/components/ui/badge";

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
    alertPreference: AlertPreference.PhoneCall,
    healthConditions: ["Diabetes", "High Blood Pressure", "Arthritis"]
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

  const displayHealthConditions = showExample 
    ? exampleLovedOne.healthConditions 
    : userProfile.lovedOne.healthConditions || [];

  return (
    <div className="animate-fade-in flex flex-col h-full px-6 py-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="voice-display-card p-4 h-28">
            <User className="text-highlight h-5 w-5" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-0.5">Full Name</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? `${exampleLovedOne.firstName} ${exampleLovedOne.lastName}` 
                  : userProfile.lovedOne.firstName || userProfile.lovedOne.lastName 
                    ? `${userProfile.lovedOne.firstName} ${userProfile.lovedOne.lastName}` 
                    : "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-4 h-28">
            <Calendar className="text-highlight h-5 w-5" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-0.5">Date of Birth</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? exampleLovedOne.dateOfBirth 
                  : userProfile.lovedOne.dateOfBirth || "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-4 h-28">
            <Phone className="text-highlight h-5 w-5" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-0.5">Phone Number</p>
              <p className="text-2xl text-white">
                {showExample 
                  ? exampleLovedOne.phoneNumber 
                  : userProfile.lovedOne.phoneNumber || "Listening..."}
              </p>
            </div>
          </div>

          <div className="voice-display-card p-4 h-28">
            <BellRing className="text-highlight h-5 w-5" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-0.5">Alert Preference</p>
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

          <div className="voice-display-card p-4 h-28 col-span-2">
            <Stethoscope className="text-highlight h-5 w-5" />
            <div className="flex-1">
              <p className="text-white/70 text-lg mb-2">Health Conditions</p>
              {displayHealthConditions.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {displayHealthConditions.slice(0, 4).map((condition, index) => (
                    <Badge key={index} variant="secondary" className="bg-highlight/20 text-white text-sm">
                      {condition}
                    </Badge>
                  ))}
                  {displayHealthConditions.length > 4 && (
                    <Badge variant="secondary" className="bg-white/20 text-white text-sm">
                      +{displayHealthConditions.length - 4} more
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-2xl text-white">Listening...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LovedOneInfoScreen;
