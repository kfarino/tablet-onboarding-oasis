
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowLeft, ArrowRight, Edit, Calendar, Clock, Pill } from 'lucide-react';

const ReviewScreen: React.FC = () => {
  const { userProfile, nextStep, prevStep, setCurrentStep } = useOnboarding();
  const { OnboardingStep } = require('@/types/onboarding');

  return (
    <div className="animate-fade-in">
      <h2 className="onboarding-title">Review Your Information</h2>
      <p className="onboarding-subtitle">Please review the following information before proceeding</p>

      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-white/70">Personal Information</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(OnboardingStep.PersonalInfo)}
              className="h-8 text-highlight hover:text-highlight hover:bg-white/5"
            >
              <Edit className="h-3 w-3 mr-1" /> Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-white">
            <div>
              <p className="text-xs text-white/50">Full Name</p>
              <p>{userProfile.firstName} {userProfile.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Role</p>
              <p>{userProfile.role}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Date of Birth</p>
              <p>{userProfile.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Phone Number</p>
              <p>{userProfile.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-white/70">Health Conditions</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(OnboardingStep.HealthConditions)}
              className="h-8 text-highlight hover:text-highlight hover:bg-white/5"
            >
              <Edit className="h-3 w-3 mr-1" /> Edit
            </Button>
          </div>
          {userProfile.healthConditions.length === 0 ? (
            <p className="text-white/40 text-sm">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {userProfile.healthConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 text-white"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-white/70">Medications</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep(OnboardingStep.Medications)}
              className="h-8 text-highlight hover:text-highlight hover:bg-white/5"
            >
              <Edit className="h-3 w-3 mr-1" /> Edit
            </Button>
          </div>
          {userProfile.medications.length === 0 ? (
            <p className="text-white/40 text-sm">No medications added</p>
          ) : (
            <div className="space-y-4">
              {userProfile.medications.map(medication => (
                <div key={medication.id} className="p-3 border border-white/10 bg-white/5 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-5 w-5 text-highlight" />
                    <h4 className="font-medium text-white">{medication.name}</h4>
                    <span className="text-sm text-white/60">{medication.strength} • {medication.form}</span>
                  </div>
                  {medication.doses.map(dose => (
                    <div key={dose.id} className="ml-7 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/80">
                          {dose.days.length > 0 
                            ? dose.days.map(d => d === 'everyday' ? 'Everyday' : d).join(', ')
                            : 'No days selected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/80">
                          {dose.times.length > 0 
                            ? dose.times.join(', ')
                            : 'No times selected'}
                        </span>
                      </div>
                      <div className="ml-6">
                        <span className="text-sm text-white/80">{dose.quantity} pill{dose.quantity !== 1 ? 's' : ''} per dose</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          onClick={prevStep} 
          variant="outline" 
          className="bg-transparent text-white border-white/30 hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="bg-highlight hover:bg-highlight/90 text-white"
        >
          Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReviewScreen;
