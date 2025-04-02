
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Pill, User, Phone, Heart, BellRing, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { getDayAbbreviation } from '@/utils/dateUtils';
import { ALERT_PREFERENCES, UserRole } from '@/types/onboarding';

interface ReviewScreenProps {
  showExample?: boolean;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ showExample = false }) => {
  const { userProfile } = useOnboarding();

  // Example data for populated view
  const exampleProfile = {
    firstName: "Jane",
    lastName: "Smith",
    role: "caregiver",
    relationship: "child",
    dateOfBirth: "",  // Empty for caregivers
    phoneNumber: "(555) 123-4567",
    alertPreference: null,  // Alert preference only for primary users
    healthConditions: ["Diabetes Type 2", "Hypertension", "Arthritis"],
    medications: [
      {
        id: uuidv4(),
        name: "Lipitor",
        strength: "20mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["8:00 AM", "8:00 PM"],
            quantity: 1
          }
        ],
        asNeeded: { maxPerDay: 1 }
      },
      {
        id: uuidv4(),
        name: "Metformin",
        strength: "500mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["Monday", "Wednesday", "Friday"],
            times: ["12:00 PM"],
            quantity: 2
          }
        ],
        asNeeded: null
      },
      {
        id: uuidv4(),
        name: "Lisinopril",
        strength: "10mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["9:00 AM"],
            quantity: 1
          }
        ],
        asNeeded: { maxPerDay: 2 }
      },
      {
        id: uuidv4(),
        name: "Levothyroxine",
        strength: "75mcg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["7:00 AM"],
            quantity: 1
          }
        ],
        asNeeded: null
      },
      {
        id: uuidv4(),
        name: "Aspirin",
        strength: "81mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["10:00 AM"],
            quantity: 1
          }
        ],
        asNeeded: null
      },
      {
        id: uuidv4(),
        name: "Omeprazole",
        strength: "20mg",
        form: "capsule",
        doses: [
          {
            id: uuidv4(),
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            times: ["7:30 AM"],
            quantity: 1
          }
        ],
        asNeeded: { maxPerDay: 1 }
      },
      {
        id: uuidv4(),
        name: "Albuterol",
        strength: "90mcg",
        form: "inhaler",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["as needed"],
            quantity: 2
          }
        ],
        asNeeded: { maxPerDay: 8 }
      },
      {
        id: uuidv4(),
        name: "Amlodipine",
        strength: "5mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["9:00 PM"],
            quantity: 1
          }
        ],
        asNeeded: null
      },
      {
        id: uuidv4(),
        name: "Furosemide",
        strength: "40mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["Monday", "Wednesday", "Friday"],
            times: ["9:00 AM"],
            quantity: 1
          },
          {
            id: uuidv4(),
            days: ["Tuesday", "Thursday"],
            times: ["10:00 AM"],
            quantity: 2
          }
        ],
        asNeeded: { maxPerDay: 2 }
      },
      {
        id: uuidv4(),
        name: "Januvia",
        strength: "100mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["8:00 AM", "8:00 PM"],
            quantity: 1
          }
        ],
        asNeeded: null
      },
      {
        id: uuidv4(),
        name: "Prednisone",
        strength: "5mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            times: ["10:30 AM"],
            quantity: 1
          }
        ],
        asNeeded: { maxPerDay: 3 }
      },
      {
        id: uuidv4(),
        name: "Warfarin",
        strength: "2.5mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["Monday", "Wednesday", "Friday", "Sunday"],
            times: ["5:00 PM"],
            quantity: 1
          },
          {
            id: uuidv4(),
            days: ["Tuesday", "Thursday", "Saturday"],
            times: ["5:00 PM"],
            quantity: 2
          }
        ],
        asNeeded: null
      },
      {
        id: uuidv4(),
        name: "Hydrochlorothiazide",
        strength: "25mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["10:00 AM"],
            quantity: 1
          }
        ],
        asNeeded: { maxPerDay: 1 }
      },
      {
        id: uuidv4(),
        name: "Insulin Glargine",
        strength: "100 units/mL",
        form: "injection",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["9:00 PM"],
            quantity: 20
          }
        ],
        asNeeded: { maxPerDay: 40 }
      },
      {
        id: uuidv4(),
        name: "Fentanyl",
        strength: "50mcg/hr",
        form: "patch",
        doses: [
          {
            id: uuidv4(),
            days: ["Monday"],
            times: ["8:00 AM"],
            quantity: 1
          }
        ],
        asNeeded: null
      }
    ],
    lovedOne: {
      firstName: "Robert",
      lastName: "Smith",
      dateOfBirth: "06/12/1940",
      phoneNumber: "(555) 678-9012",
      alertPreference: "phone_call"
    }
  };

  // Example for primary user
  const examplePrimaryUser = {
    firstName: "Robert",
    lastName: "Johnson",
    role: "primary_user",
    relationship: "",  // Empty for primary users
    dateOfBirth: "05/12/1945",
    phoneNumber: "(555) 987-6543",
    alertPreference: "app_notification",
    healthConditions: ["Hypertension", "Glaucoma"],
    medications: [
      {
        id: uuidv4(),
        name: "Lisinopril",
        strength: "10mg",
        form: "tablet",
        doses: [
          {
            id: uuidv4(),
            days: ["everyday"],
            times: ["9:00 AM"],
            quantity: 1
          }
        ],
        asNeeded: { maxPerDay: 2 }
      }
    ],
    lovedOne: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      alertPreference: null
    }
  };

  const displayProfile = showExample 
    ? userProfile.role === UserRole.Caregiver ? exampleProfile : examplePrimaryUser
    : userProfile;

  const formatDays = (days: string[]) => {
    if (days.includes('everyday')) return 'Everyday';
    
    return days.map(day => getDayAbbreviation(day)).join(', ');
  };

  const getAlertPreferenceLabel = (value: string | null) => {
    if (!value) return "—";
    const preference = ALERT_PREFERENCES.find(p => p.value === value);
    return preference ? preference.label : "—";
  };

  return (
    <div className="animate-fade-in px-10 py-6 pb-10">
      <div className="space-y-6">
        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-4 flex items-center">
            <User className="h-6 w-6 mr-3 text-highlight" />
            Personal Information
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
              <>
                <div>
                  <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="text-xl font-medium">{displayProfile.dateOfBirth || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Alert Preference</p>
                  <p className="text-xl font-medium">
                    {getAlertPreferenceLabel(displayProfile.alertPreference)}
                  </p>
                </div>
              </>
            )}
            {displayProfile.role === UserRole.Caregiver && (
              <div>
                <p className="text-sm text-white/50 uppercase tracking-wider mb-1">Relationship</p>
                <p className="text-xl font-medium">{displayProfile.relationship || "—"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Show Loved One section for caregivers */}
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

        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-4 flex items-center">
            <Heart className="h-6 w-6 mr-3 text-highlight" />
            Health Conditions
          </h3>
          {displayProfile.healthConditions.length === 0 ? (
            <p className="text-white/40 text-lg">No health conditions added</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {displayProfile.healthConditions.map((condition, index) => (
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

        <div className="p-5 rounded-lg border border-white/10 bg-white/5">
          <h3 className="text-xl font-medium text-white/90 mb-4 flex items-center">
            <Pill className="h-6 w-6 mr-3 text-highlight" />
            Medications
          </h3>
          {displayProfile.medications.length === 0 ? (
            <p className="text-white/40 text-lg">No medications added</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayProfile.medications.map(medication => (
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
                        {dose.quantity} pill{dose.quantity !== 1 ? 's' : ''} per dose
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
