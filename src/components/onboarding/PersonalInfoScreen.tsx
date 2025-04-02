
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Mic, User, Calendar, Phone, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PersonalInfoScreen: React.FC = () => {
  const { userProfile, nextStep } = useOnboarding();

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <p className="text-white/70 mb-4">Please speak your information clearly when prompted</p>
      
      <div className="grid grid-cols-2 gap-4">
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

      <div className="voice-listening-indicator mt-auto">
        <div className="flex flex-col items-center">
          <div className="bg-white/10 rounded-full p-4 mb-4 pulse-animation">
            <Mic className="text-highlight h-6 w-6" />
          </div>
          <p className="text-white/70 text-center mb-4">
            {userProfile.firstName && userProfile.lastName && userProfile.role && userProfile.dateOfBirth && userProfile.phoneNumber
              ? "Say \"Next\" to continue"
              : "I'm listening..."}
          </p>
          
          <Button 
            onClick={nextStep}
            className="bg-highlight hover:bg-highlight/90 text-white py-3 px-8 rounded-full"
          >
            Continue <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoScreen;
