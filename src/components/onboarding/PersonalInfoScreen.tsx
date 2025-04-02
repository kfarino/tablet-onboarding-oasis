
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Mic, User, Calendar, Phone } from 'lucide-react';

const PersonalInfoScreen: React.FC = () => {
  const { userProfile } = useOnboarding();

  return (
    <div className="animate-fade-in">
      <h2 className="onboarding-title">Personal Information</h2>
      <p className="onboarding-subtitle">Please speak your information clearly when prompted</p>
      
      <div className="space-y-8">
        <div className="voice-display-card">
          <User className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Full Name</p>
            <p className="text-xl text-white">
              {userProfile.firstName || userProfile.lastName 
                ? `${userProfile.firstName} ${userProfile.lastName}` 
                : "Listening..."}
            </p>
          </div>
        </div>

        <div className="voice-display-card">
          <User className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Role</p>
            <p className="text-xl text-white">{userProfile.role || "Listening..."}</p>
          </div>
        </div>

        <div className="voice-display-card">
          <Calendar className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Date of Birth</p>
            <p className="text-xl text-white">{userProfile.dateOfBirth || "Listening..."}</p>
          </div>
        </div>

        <div className="voice-display-card">
          <Phone className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Phone Number</p>
            <p className="text-xl text-white">{userProfile.phoneNumber || "Listening..."}</p>
          </div>
        </div>
      </div>

      <div className="voice-listening-indicator mt-8">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 rounded-full p-4 mb-4 pulse-animation">
            <Mic className="text-highlight h-6 w-6" />
          </div>
          <p className="text-white/70 text-center">
            {userProfile.firstName && userProfile.lastName && userProfile.role && userProfile.dateOfBirth && userProfile.phoneNumber
              ? "Say \"Next\" to continue"
              : "I'm listening..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoScreen;
