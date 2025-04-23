import React, { createContext, useContext, useState } from 'react';
import { UserProfile, Medication, Dose, OnboardingStep, UserRole, AlertPreference } from '../types/onboarding';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  userProfile: UserProfile;
  setCurrentStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUserProfile: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void;
  addMedication: () => void;
  updateMedication: (id: string, field: keyof Omit<Medication, 'id' | 'doses'>, value: string) => void;
  removeMedication: (id: string) => void;
  addDose: (medicationId: string) => void;
  updateDose: (medicationId: string, doseId: string, field: keyof Omit<Dose, 'id'>, value: any) => void;
  removeDose: (medicationId: string, doseId: string) => void;
  addHealthCondition: (condition: string) => void;
  removeHealthCondition: (index: number) => void;
  processVoiceInput: (text: string) => void;
  shouldShowLovedOneScreen: () => boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.Welcome);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    role: '',
    relationship: '',
    dateOfBirth: '',
    phoneNumber: '',
    alertPreference: null,
    healthConditions: [],
    medications: [],
    lovedOne: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      alertPreference: null,
      relationship: '',
      healthConditions: [],
      medications: []
    }
  });

  const nextStep = () => {
    if (currentStep < OnboardingStep.Complete) {
      setCurrentStep(prevStep => (prevStep + 1) as OnboardingStep);
    }
  };

  const prevStep = () => {
    if (currentStep > OnboardingStep.Welcome) {
      setCurrentStep(prevStep => (prevStep - 1) as OnboardingStep);
    }
  };

  const shouldShowLovedOneScreen = () => {
    return userProfile.role === UserRole.Caregiver;
  };

  const updateUserProfile = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setUserProfile(prev => ({ ...prev, [key]: value }));
  };

  const addMedication = () => {
    const newMedication: Medication = {
      id: uuidv4(),
      name: '',
      strength: '',
      form: '',
      doses: [{
        id: uuidv4(),
        days: [],
        times: [],
        quantity: 1
      }],
      asNeeded: null
    };
    
    updateUserProfile('medications', [...userProfile.medications, newMedication]);
  };

  const updateMedication = (id: string, field: keyof Omit<Medication, 'id' | 'doses'>, value: string) => {
    const updatedMedications = userProfile.medications.map(med => {
      if (med.id === id) {
        return { ...med, [field]: value };
      }
      return med;
    });
    
    updateUserProfile('medications', updatedMedications);
  };

  const removeMedication = (id: string) => {
    const updatedMedications = userProfile.medications.filter(med => med.id !== id);
    updateUserProfile('medications', updatedMedications);
  };

  const addDose = (medicationId: string) => {
    const newDose: Dose = {
      id: uuidv4(),
      days: [],
      times: [],
      quantity: 1
    };
    
    const updatedMedications = userProfile.medications.map(med => {
      if (med.id === medicationId) {
        return { ...med, doses: [...med.doses, newDose] };
      }
      return med;
    });
    
    updateUserProfile('medications', updatedMedications);
  };

  const updateDose = (medicationId: string, doseId: string, field: keyof Omit<Dose, 'id'>, value: any) => {
    const updatedMedications = userProfile.medications.map(med => {
      if (med.id === medicationId) {
        const updatedDoses = med.doses.map(dose => {
          if (dose.id === doseId) {
            return { ...dose, [field]: value };
          }
          return dose;
        });
        return { ...med, doses: updatedDoses };
      }
      return med;
    });
    
    updateUserProfile('medications', updatedMedications);
  };

  const removeDose = (medicationId: string, doseId: string) => {
    const updatedMedications = userProfile.medications.map(med => {
      if (med.id === medicationId) {
        const updatedDoses = med.doses.filter(dose => dose.id !== doseId);
        return { ...med, doses: updatedDoses };
      }
      return med;
    });
    
    updateUserProfile('medications', updatedMedications);
  };

  const addHealthCondition = (condition: string) => {
    if (condition && !userProfile.healthConditions.includes(condition)) {
      updateUserProfile('healthConditions', [...userProfile.healthConditions, condition]);
    }
  };

  const removeHealthCondition = (index: number) => {
    const updatedConditions = [...userProfile.healthConditions];
    updatedConditions.splice(index, 1);
    updateUserProfile('healthConditions', updatedConditions);
  };

  const processVoiceInput = (text: string) => {
    console.log('Processing voice input:', text);
  };

  const value = {
    currentStep,
    userProfile,
    setCurrentStep,
    nextStep,
    prevStep,
    updateUserProfile,
    addMedication,
    updateMedication,
    removeMedication,
    addDose,
    updateDose,
    removeDose,
    addHealthCondition,
    removeHealthCondition,
    processVoiceInput,
    shouldShowLovedOneScreen
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
