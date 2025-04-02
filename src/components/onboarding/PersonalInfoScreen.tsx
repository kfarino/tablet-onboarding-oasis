
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const PersonalInfoScreen: React.FC = () => {
  const { userProfile, updateUserProfile, nextStep, prevStep } = useOnboarding();

  const isFormValid = () => {
    return (
      userProfile.firstName.trim() !== '' &&
      userProfile.lastName.trim() !== '' &&
      userProfile.role.trim() !== '' &&
      userProfile.dateOfBirth.trim() !== '' &&
      userProfile.phoneNumber.trim() !== ''
    );
  };

  return (
    <div className="animate-fade-in">
      <h2 className="onboarding-title">Personal Information</h2>
      <p className="onboarding-subtitle">Tell us a bit about yourself</p>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="input-label">First Name</Label>
            <Input
              id="firstName"
              value={userProfile.firstName}
              onChange={(e) => updateUserProfile('firstName', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              placeholder="Enter your first name"
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="input-label">Last Name</Label>
            <Input
              id="lastName"
              value={userProfile.lastName}
              onChange={(e) => updateUserProfile('lastName', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              placeholder="Enter your last name"
              aria-required="true"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="input-label">Role</Label>
          <Input
            id="role"
            value={userProfile.role}
            onChange={(e) => updateUserProfile('role', e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            placeholder="e.g., Patient, Caregiver, Healthcare Provider"
            aria-required="true"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="input-label">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={userProfile.dateOfBirth}
            onChange={(e) => updateUserProfile('dateOfBirth', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
            aria-required="true"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="input-label">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={userProfile.phoneNumber}
            onChange={(e) => updateUserProfile('phoneNumber', e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            placeholder="(123) 456-7890"
            aria-required="true"
          />
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
          disabled={!isFormValid()}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoScreen;
