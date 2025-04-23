
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Pill, User, Phone, Heart, AlertCircle, Eye } from 'lucide-react';
import { getDayAbbreviation } from '@/utils/dateUtils';
import { ALERT_PREFERENCES, RELATIONSHIP_OPTIONS, UserRole, Medication } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import MedicationVisualization from './MedicationVisualization';

interface ReviewScreenProps {
  showExample?: boolean;
  showMedicationSchedule?: boolean;
  setShowMedicationSchedule?: (show: boolean) => void;
  exampleMedications?: Medication[];
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ 
  showExample = false,
  showMedicationSchedule = false,
  setShowMedicationSchedule = () => {},
  exampleMedications = []
}) => {
  const { userProfile } = useOnboarding();

  // Example health conditions and medications - same for all roles
  const exampleHealthConditions = ["Diabetes Type 2", "Hypertension", "Arthritis"];
  
  // Example data for populated view - updated for caregiver flow with relationship
  const exampleProfile = {
    firstName: "Jane",
    lastName: "Smith",
    role: UserRole.Caregiver,
    relationship: "child",
    dateOfBirth: "",
    phoneNumber: "(555) 123-4567",
    alertPreference: null,
    healthConditions: exampleHealthConditions,
    medications: exampleMedications,
    lovedOne: {
      firstName: "Robert",
      lastName: "Smith",
      dateOfBirth: "06/12/1940",
      phoneNumber: "(555) 678-9012",
      alertPreference: "phone_call",
      healthConditions: exampleHealthConditions,
      medications: exampleMedications
    }
  };

  // Example for primary user - updated to have same health conditions and medications
  const examplePrimaryUser = {
    firstName: "Robert",
    lastName: "Johnson",
    role: UserRole.PrimaryUser,
    relationship: "",
    dateOfBirth: "05/12/1945",
    phoneNumber: "(555) 987-6543",
    alertPreference: null,
    healthConditions: exampleHealthConditions,
    medications: exampleMedications,
    lovedOne: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      alertPreference: "app_notification"
    }
  };

  const displayProfile = showExample 
    ? userProfile.role === UserRole.Caregiver ? exampleProfile : examplePrimaryUser
    : userProfile;

  // Simplified - always use the primary profile's health conditions and medications
  const displayData = {
    healthConditions: showExample 
      ? exampleHealthConditions 
      : userProfile.healthConditions,
    medications: showExample 
      ? exampleMedications 
      : userProfile.medications
  };

  const formatDays = (days: string[]) => {
    if (days.includes('everyday')) return 'Everyday';
    
    return days.map(day => getDayAbbreviation(day)).join(', ');
  };

  const getAlertPreferenceLabel = (value: string | null) => {
    if (!value) return "—";
    const preference = ALERT_PREFERENCES.find(p => p.value === value);
    return preference ? preference.label : "—";
  };

  const getRelationshipLabel = (value: string | null) => {
    if (!value) return "—";
    const relationship = RELATIONSHIP_OPTIONS.find(r => r.value === value);
    return relationship ? relationship.label : "—";
  };

  const toggleVisualization = () => {
    setShowMedicationSchedule(true);
  };

  if (showMedicationSchedule) {
    return <MedicationVisualization medications={displayData.medications} />;
  }

  return (
    <div className="animate-fade-in px-6 py-4 pb-8">
      <div className="space-y-5">
        {/* Primary User Section */}
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-3 flex items-center">
            <User className="h-5 w-5 mr-2 text-highlight" />
            {displayProfile.role === UserRole.Caregiver ? 'Caregiver Information' : 'Personal Information'}
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-white">
            <div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-lg font-medium">{displayProfile.firstName || "—"} {displayProfile.lastName || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Role</p>
              <p className="text-lg font-medium">{displayProfile.role === UserRole.Caregiver ? 'Caregiver' : 'Primary User'}</p>
            </div>
            <div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Phone Number</p>
              <p className="text-lg font-medium">{displayProfile.phoneNumber || "—"}</p>
            </div>
            {displayProfile.role === UserRole.PrimaryUser && (
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-lg font-medium">{displayProfile.dateOfBirth || "—"}</p>
              </div>
            )}
            {displayProfile.role === UserRole.Caregiver && (
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Relationship to Loved One</p>
                <p className="text-lg font-medium">{getRelationshipLabel(displayProfile.relationship)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Loved One Section for Caregivers */}
        {displayProfile.role === UserRole.Caregiver && (
          <div className="p-4 rounded-lg border border-white/10 bg-white/5">
            <h3 className="text-xl font-medium text-white/90 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-highlight" />
              Loved One Information
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-white">
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-lg font-medium">
                  {displayProfile.lovedOne.firstName || "—"} {displayProfile.lovedOne.lastName || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-lg font-medium">{displayProfile.lovedOne.dateOfBirth || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-lg font-medium">{displayProfile.lovedOne.phoneNumber || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Alert Preference</p>
                <p className="text-lg font-medium">
                  {getAlertPreferenceLabel(displayProfile.lovedOne.alertPreference)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Health Conditions Section */}
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-3 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-highlight" />
            Health Conditions
          </h3>
          {displayData.healthConditions.length === 0 ? (
            <p className="text-white/40 text-base">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {displayData.healthConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 hover:bg-white/20 text-white text-sm py-1 px-3"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Medications Section */}
        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-medium text-white/90 flex items-center">
              <Pill className="h-5 w-5 mr-2 text-highlight" />
              Medications
            </h3>
            {displayData.medications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleVisualization}
                className="text-white bg-white/10 hover:bg-white/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
            )}
          </div>
          {displayData.medications.length === 0 ? (
            <p className="text-white/40 text-base">No medications added</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayData.medications.map(medication => (
                <div key={medication.id} className="p-3 border border-white/20 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4 text-highlight" />
                    <h4 className="font-medium text-white text-base">
                      {medication.name}{medication.strength ? ` ${medication.strength}` : ""}
                    </h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3 ml-6">
                    {medication.form && (
                      <span className="text-sm text-white/80 bg-white/10 px-2 py-1 rounded">
                        {medication.form}
                      </span>
                    )}
                  </div>
                  
                  {medication.doses.map(dose => (
                    <div key={dose.id} className="ml-6 mb-2 border-l border-white/20 pl-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-white/80" />
                        <span className="text-sm text-white">
                          {dose.days.length > 0 
                            ? formatDays(dose.days)
                            : 'No days selected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-white/80" />
                        <span className="text-sm text-white">
                          {dose.times.length > 0 
                            ? dose.times.join(', ')
                            : 'No times selected'}
                        </span>
                      </div>
                      <div className="text-xs text-white/80 mt-1">
                        {dose.quantity} {medication.form || 'pill'}{dose.quantity !== 1 ? 's' : ''} per dose
                      </div>
                    </div>
                  ))}
                  
                  {medication.asNeeded && (
                    <div className="ml-6 mt-2 flex items-center gap-2 bg-white/5 p-2 rounded-md border-l-2 border-yellow-500/50">
                      <AlertCircle className="h-4 w-4 text-yellow-500/90" />
                      <span className="text-white/90 text-sm">
                        As needed: max {medication.asNeeded.maxPerDay} per day
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
