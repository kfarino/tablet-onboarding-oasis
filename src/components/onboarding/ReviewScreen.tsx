
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Pill, User, Phone, Heart, AlertCircle, Eye } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getDayAbbreviation } from '@/utils/dateUtils';
import { ALERT_PREFERENCES, RELATIONSHIP_OPTIONS, UserRole, Medication } from '@/types/onboarding';
import { Button } from '@/components/ui/button';

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

  // Example data for populated view - updated for caregiver flow with relationship
  const exampleProfile = {
    firstName: "Jane",
    lastName: "Smith",
    role: UserRole.Caregiver,
    relationship: "child", // Added relationship for caregiver
    dateOfBirth: "", // Empty for caregivers
    phoneNumber: "(555) 123-4567",
    alertPreference: null, // No alert preference for caregivers
    healthConditions: [], // Caregivers don't have health conditions
    medications: [], // Caregivers don't have medications
    lovedOne: {
      firstName: "Robert",
      lastName: "Smith",
      dateOfBirth: "06/12/1940",
      phoneNumber: "(555) 678-9012",
      alertPreference: "phone_call",
      healthConditions: ["Diabetes Type 2", "Hypertension", "Arthritis"],
      medications: exampleMedications.slice(0, 2) // Use just the first two example medications
    }
  };

  // Example for primary user - updated to remove alert preference
  const examplePrimaryUser = {
    firstName: "Robert",
    lastName: "Johnson",
    role: UserRole.PrimaryUser,
    relationship: "", // Empty for primary users
    dateOfBirth: "05/12/1945",
    phoneNumber: "(555) 987-6543",
    alertPreference: null, // Removed alert preference for primary user
    healthConditions: ["Hypertension", "Glaucoma"],
    medications: exampleMedications, // Use all example medications for primary user
    lovedOne: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      alertPreference: "app_notification" // Added alert preference for loved one
    }
  };

  const displayProfile = showExample 
    ? userProfile.role === UserRole.Caregiver ? exampleProfile : examplePrimaryUser
    : userProfile;

  const getDisplayData = () => {
    if (displayProfile.role === UserRole.Caregiver) {
      return {
        healthConditions: showExample 
          ? exampleProfile.lovedOne.healthConditions 
          : userProfile.lovedOne.healthConditions || [],
        medications: showExample 
          ? exampleProfile.lovedOne.medications 
          : userProfile.lovedOne.medications || []
      };
    }
    return {
      healthConditions: displayProfile.healthConditions,
      medications: displayProfile.medications
    };
  };

  const displayData = getDisplayData();

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

  return (
    <div className="animate-fade-in px-10 py-6 pb-10">
      <div className="space-y-6">
        {/* Primary User Section */}
        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-4 flex items-center">
            <User className="h-6 w-6 mr-3 text-highlight" />
            {displayProfile.role === UserRole.Caregiver ? 'Caregiver Information' : 'Personal Information'}
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-white">
            <div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Full Name</p>
              <p className="text-xl font-medium">{displayProfile.firstName || "—"} {displayProfile.lastName || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Role</p>
              <p className="text-xl font-medium">{displayProfile.role === UserRole.Caregiver ? 'Caregiver' : 'Primary User'}</p>
            </div>
            <div>
              <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Phone Number</p>
              <p className="text-xl font-medium">{displayProfile.phoneNumber || "—"}</p>
            </div>
            {displayProfile.role === UserRole.PrimaryUser && (
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-xl font-medium">{displayProfile.dateOfBirth || "—"}</p>
              </div>
            )}
            {displayProfile.role === UserRole.Caregiver && (
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Relationship to Loved One</p>
                <p className="text-xl font-medium">{getRelationshipLabel(displayProfile.relationship)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Loved One Section for Caregivers */}
        {displayProfile.role === UserRole.Caregiver && (
          <div className="p-5 rounded-lg border border-white/10 bg-white/5">
            <h3 className="text-xl font-medium text-white/90 mb-4 flex items-center">
              <User className="h-6 w-6 mr-3 text-highlight" />
              Loved One Information
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-white">
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-xl font-medium">
                  {displayProfile.lovedOne.firstName || "—"} {displayProfile.lovedOne.lastName || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Date of Birth</p>
                <p className="text-xl font-medium">{displayProfile.lovedOne.dateOfBirth || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-xl font-medium">{displayProfile.lovedOne.phoneNumber || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Alert Preference</p>
                <p className="text-xl font-medium">
                  {getAlertPreferenceLabel(displayProfile.lovedOne.alertPreference)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Health Conditions Section */}
        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-4 flex items-center">
            <Heart className="h-6 w-6 mr-3 text-highlight" />
            Health Conditions
            {displayProfile.role === UserRole.Caregiver && <span className="ml-2 text-white/50">(Loved One)</span>}
          </h3>
          {displayData.healthConditions.length === 0 ? (
            <p className="text-white/40 text-lg">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {displayData.healthConditions.map((condition, index) => (
                <Badge 
                  key={index} 
                  className="bg-white/10 hover:bg-white/20 text-white text-base py-1.5 px-4"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Medications Section */}
        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium text-white/90 flex items-center">
              <Pill className="h-6 w-6 mr-3 text-highlight" />
              Medications
              {displayProfile.role === UserRole.Caregiver && <span className="ml-2 text-white/50">(Loved One)</span>}
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
            <p className="text-white/40 text-lg">No medications added</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayData.medications.map(medication => (
                <div key={medication.id} className="p-4 border border-white/20 bg-white/5 rounded-md hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Pill className="h-5 w-5 text-highlight" />
                    <h4 className="font-medium text-white text-lg">
                      {medication.name}{medication.strength ? ` ${medication.strength}` : ""}
                    </h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4 ml-8">
                    {medication.form && (
                      <span className="text-base text-white/80 bg-white/10 px-3 py-1 rounded">
                        {medication.form}
                      </span>
                    )}
                  </div>
                  
                  {medication.doses.map(dose => (
                    <div key={dose.id} className="ml-8 mb-3 border-l border-white/20 pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-white/80" />
                        <span className="text-base text-white">
                          {dose.days.length > 0 
                            ? formatDays(dose.days)
                            : 'No days selected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-white/80" />
                        <span className="text-base text-white">
                          {dose.times.length > 0 
                            ? dose.times.join(', ')
                            : 'No times selected'}
                        </span>
                      </div>
                      <div className="text-sm text-white/80 mt-2">
                        {dose.quantity} {medication.form || 'pill'}{dose.quantity !== 1 ? 's' : ''} per dose
                      </div>
                    </div>
                  ))}
                  
                  {medication.asNeeded && (
                    <div className="ml-8 mt-3 flex items-center gap-2 bg-white/5 p-2 rounded-md border-l-2 border-yellow-500/50">
                      <AlertCircle className="h-5 w-5 text-yellow-500/90" />
                      <span className="text-white/90">
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
