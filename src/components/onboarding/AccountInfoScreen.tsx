import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User, Calendar, Phone, BellRing, Columns, Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_ROLES, UserRole, RELATIONSHIP_OPTIONS, ALERT_PREFERENCES, AlertPreference } from '@/types/onboarding';
import { Button } from '@/components/ui/button';

interface AccountInfoScreenProps {
  showExample?: boolean;
  previewRole?: UserRole | null;
}

type LayoutType = 'dashboard' | 'split';

const AccountInfoScreen: React.FC<AccountInfoScreenProps> = ({ showExample = false, previewRole }) => {
  const { userProfile, updateUserProfile } = useOnboarding();
  const [layout, setLayout] = useState<LayoutType>('split');

  // Example data for populated view
  const exampleProfile = {
    firstName: "Elizabeth Alexandra",
    lastName: "Smith-Worthington",
    role: UserRole.Caregiver,
    relationship: "child",
    phoneNumber: "(555) 123-4567",
  };

  // Example for primary user
  const examplePrimaryUser = {
    firstName: "Christopher Frederick",
    lastName: "Johnson-Williams",
    role: UserRole.PrimaryUser,
    dateOfBirth: "05/12/1945",
    phoneNumber: "(555) 987-6543",
  };

  // Determine which role to display
  const displayRole = previewRole || userProfile.role || UserRole.PrimaryUser;

  const getRelationshipLabel = (relationship: string): string => {
    switch (relationship) {
      case 'spouse': return 'Spouse';
      case 'child': return 'Child';
      case 'parent': return 'Parent';
      case 'sibling': return 'Sibling';
      case 'friend': return 'Friend';
      case 'other': return 'Other';
      default: return 'Relationship';
    }
  };

  const getAlertPreferenceLabel = (preference: string): string => {
    switch (preference) {
      case 'text': return 'Text Message';
      case 'phone_call': return 'Phone Call';
      case 'app_notification': return 'App Notification';
      default: return 'Not set';
    }
  };

  // Layout toggle buttons
  const layoutToggle = (
    <div className="absolute top-2 right-2 flex space-x-2">
      <button 
        onClick={() => setLayout('dashboard')} 
        className={`p-1 rounded-md ${layout === 'dashboard' ? 'bg-gray-700' : ''}`}
      >
        <BellRing size={16} className="text-white" />
      </button>
      <button 
        onClick={() => setLayout('split')} 
        className={`p-1 rounded-md ${layout === 'split' ? 'bg-gray-700' : ''}`}
      >
        <Columns size={16} className="text-white" />
      </button>
    </div>
  );

  // Dashboard Layout
  const dashboardLayout = (
    <div className="flex flex-col space-y-4">
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-center">
        <div className="w-1/2 flex items-center">
          <User className="text-highlight h-10 w-10 mr-3 flex-shrink-0" />
          <div>
            <p className="text-white text-xl font-bold break-words hyphens-auto">
              {showExample || userProfile.firstName || userProfile.lastName
                ? `${showExample ? (displayRole === UserRole.Caregiver ? exampleProfile.firstName : examplePrimaryUser.firstName) : userProfile.firstName || ""} ${showExample ? (displayRole === UserRole.Caregiver ? exampleProfile.lastName : examplePrimaryUser.lastName) : userProfile.lastName || ""}`
                : "Name"}
            </p>
            <p className="text-highlight text-lg font-medium">
              {displayRole === UserRole.Caregiver 
                ? (showExample || userProfile.relationship 
                    ? (showExample ? "Child" : getRelationshipLabel(userProfile.relationship)) 
                    : "Relationship")
                : 'Primary User'}
            </p>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-end space-x-8">
          {displayRole === UserRole.PrimaryUser && (
            <div className="flex flex-col items-end">
              <p className="text-white text-xl font-bold text-right">
                {showExample || userProfile.dateOfBirth
                  ? (showExample ? examplePrimaryUser.dateOfBirth : userProfile.dateOfBirth)
                  : ""}
              </p>
              <p className="text-white/70 text-lg">Date of Birth</p>
            </div>
          )}
          
          <div className="flex flex-col items-end">
            <p className="text-white text-xl font-bold whitespace-nowrap">
              {showExample || userProfile.phoneNumber
                ? (showExample ? (displayRole === UserRole.Caregiver ? exampleProfile.phoneNumber : examplePrimaryUser.phoneNumber) : userProfile.phoneNumber)
                : ""}
            </p>
            <p className="text-white/70 text-lg">Phone</p>
          </div>
        </div>
      </div>

      {displayRole === UserRole.Caregiver && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-center">
          <div className="w-1/2 flex items-center">
            <User className="text-highlight h-10 w-10 mr-3 flex-shrink-0" />
            <div>
              <p className="text-white text-xl font-bold break-words hyphens-auto">
                {showExample || userProfile.lovedOne?.firstName || userProfile.lovedOne?.lastName
                  ? (showExample ? "Margaret Eleanor Thompson" : `${userProfile.lovedOne?.firstName || ""} ${userProfile.lovedOne?.lastName || ""}`)
                  : "Loved One's Name"}
              </p>
              <p className="text-highlight text-lg font-medium">
                {showExample || userProfile.relationship
                  ? (showExample ? "Parent" : getRelationshipLabel(userProfile.relationship))
                  : "Relationship"}
              </p>
            </div>
          </div>
          
          <div className="w-1/2 flex items-center justify-end space-x-8">
            <div className="flex flex-col items-end">
              <p className="text-white text-xl font-bold text-right">
                {showExample || userProfile.lovedOne?.dateOfBirth
                  ? (showExample ? "01/01/1970" : userProfile.lovedOne?.dateOfBirth)
                  : ""}
              </p>
              <p className="text-white/70 text-lg">Date of Birth</p>
            </div>
            
            <div className="flex flex-col items-end">
              <p className="text-white text-xl font-bold whitespace-nowrap">
                {showExample || userProfile.lovedOne?.phoneNumber
                  ? (showExample ? "(555) 987-6543" : userProfile.lovedOne?.phoneNumber)
                  : ""}
              </p>
              <p className="text-white/70 text-lg">
                {showExample || userProfile.lovedOne?.alertPreference
                  ? (showExample ? "Text Message" : getAlertPreferenceLabel(userProfile.lovedOne?.alertPreference))
                  : "Alert Preference"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Split Layout
  const splitLayout = (
    <div className="flex h-full">
      {/* User Profile - Takes full width for Primary User, half width for Caregiver */}
      <div className={`${displayRole === UserRole.PrimaryUser ? 'w-full' : 'w-1/2 pr-2'} flex flex-col`}>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-4">
            <p className="text-white text-3xl font-bold break-words">
              {showExample || userProfile.firstName || userProfile.lastName
                ? `${showExample ? (displayRole === UserRole.Caregiver ? exampleProfile.firstName : examplePrimaryUser.firstName) : userProfile.firstName || ""} ${showExample ? (displayRole === UserRole.Caregiver ? exampleProfile.lastName : examplePrimaryUser.lastName) : userProfile.lastName || ""}`
                : "Name"}
            </p>
            <p className="text-highlight text-xl">
              {displayRole === UserRole.Caregiver 
                ? (showExample || userProfile.relationship 
                    ? (showExample ? "Child" : getRelationshipLabel(userProfile.relationship)) 
                    : "Relationship")
                : 'Primary User'}
            </p>
          </div>
          
          <div className="space-y-3 ml-1">
            <div className="flex items-center">
              <Phone className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
              <p className="text-white text-xl whitespace-nowrap overflow-hidden text-ellipsis">
                {showExample || userProfile.phoneNumber
                  ? (showExample ? (displayRole === UserRole.Caregiver ? exampleProfile.phoneNumber : examplePrimaryUser.phoneNumber) : userProfile.phoneNumber)
                  : "Not provided"}
              </p>
            </div>
            
            {displayRole === UserRole.PrimaryUser && (
              <div className="flex items-center">
                <Calendar className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-white text-xl">
                  {showExample || userProfile.dateOfBirth
                    ? (showExample ? examplePrimaryUser.dateOfBirth : userProfile.dateOfBirth)
                    : "Not provided"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Half - Loved One Profile (only for caregivers) */}
      {displayRole === UserRole.Caregiver && (
        <div className="w-1/2 pl-2 flex flex-col">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-4">
              <p className="text-white text-3xl font-bold break-words">
                {showExample || userProfile.lovedOne?.firstName || userProfile.lovedOne?.lastName
                  ? (showExample ? "Margaret Eleanor Thompson" : `${userProfile.lovedOne?.firstName || ""} ${userProfile.lovedOne?.lastName || ""}`)
                  : "Loved One's Name"}
              </p>
              <p className="text-highlight text-xl">
                {showExample || userProfile.relationship
                  ? (showExample ? "Parent" : getRelationshipLabel(userProfile.relationship))
                  : "Relationship"}
              </p>
            </div>
            
            <div className="space-y-3 ml-1">
              <div className="flex items-center">
                <Phone className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-white text-xl whitespace-nowrap overflow-hidden text-ellipsis">
                  {showExample || userProfile.lovedOne?.phoneNumber
                    ? (showExample ? "(555) 987-6543" : userProfile.lovedOne?.phoneNumber)
                    : "Not provided"}
                </p>
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-white text-xl">
                  {showExample || userProfile.lovedOne?.dateOfBirth
                    ? (showExample ? "01/01/1970" : userProfile.lovedOne?.dateOfBirth)
                    : "Not provided"}
                </p>
              </div>
              
              <div className="flex items-center">
                <BellRing className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-white text-xl">
                  {showExample || userProfile.lovedOne?.alertPreference
                    ? (showExample ? "Text Message" : getAlertPreferenceLabel(userProfile.lovedOne?.alertPreference))
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in flex flex-col h-full px-6 py-2 relative">
      {layoutToggle}
      
      {layout === 'dashboard' && dashboardLayout}
      {layout === 'split' && splitLayout}
    </div>
  );
};

export default AccountInfoScreen;
