
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Mic, User, Calendar, Phone, Heart, Pill, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ExamplesScreen: React.FC = () => {
  const { nextStep } = useOnboarding();

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <p className="text-white/70 mb-6">
        Here are some examples of the information you'll provide:
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="voice-display-card">
          <User className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Full Name</p>
            <p className="text-xl text-white">John Smith</p>
          </div>
        </div>

        <div className="voice-display-card">
          <User className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Role</p>
            <p className="text-xl text-white">Patient</p>
          </div>
        </div>

        <div className="voice-display-card">
          <Calendar className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Date of Birth</p>
            <p className="text-xl text-white">June 15, 1975</p>
          </div>
        </div>

        <div className="voice-display-card">
          <Phone className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Phone Number</p>
            <p className="text-xl text-white">(555) 123-4567</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="voice-display-card flex-1">
          <Heart className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Health Conditions</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-white/10 text-white text-sm px-2 py-1 rounded-full">
                Hypertension
              </span>
              <span className="bg-white/10 text-white text-sm px-2 py-1 rounded-full">
                Diabetes
              </span>
            </div>
          </div>
        </div>

        <div className="voice-display-card flex-1">
          <Pill className="text-highlight h-5 w-5" />
          <div className="flex-1">
            <p className="text-white/70 text-sm">Medications</p>
            <p className="text-xl text-white">Lipitor 50mg</p>
            <p className="text-sm text-white/70">Everyday at 8am</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button 
          onClick={nextStep}
          className="bg-highlight hover:bg-highlight/90 text-white w-full rounded-full py-4 flex items-center justify-center"
        >
          Begin Setup <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <div className="voice-listening-indicator mt-6">
          <div className="flex flex-col items-center">
            <div className="bg-white/10 rounded-full p-4 mb-2 pulse-animation">
              <Mic className="text-highlight h-6 w-6" />
            </div>
            <p className="text-white/70 text-center text-sm">
              Say "Begin" to start
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesScreen;
