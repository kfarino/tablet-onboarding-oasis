
import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { User, Calendar, Phone, BellRing, Columns, Heart, Plus, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_ROLES, UserRole, RELATIONSHIP_OPTIONS, ALERT_PREFERENCES, AlertPreference } from '@/types/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AccountInfoScreenProps {
  showExample?: boolean;
  previewRole?: UserRole | null;
}

type LayoutType = 'dashboard' | 'split';

const AccountInfoScreen: React.FC<AccountInfoScreenProps> = ({ showExample = false, previewRole }) => {
  const { userProfile, updateUserProfile, addHealthCondition, removeHealthCondition } = useOnboarding();
  const [newCondition, setNewCondition] = useState('');

  // Example data for populated view
  const exampleProfile = {
    firstName: "Elizabeth",
    lastName: "Alexandra",
    role: UserRole.Caregiver,
    relationship: "child",
    gender: "female",
    phoneNumber: "(555) 123-4567",
  };

  // Example for primary user
  const examplePrimaryUser = {
    firstName: "Christopher",
    lastName: "Frederick",
    role: UserRole.PrimaryUser,
    dateOfBirth: "05/12/1945",
    gender: "male",
    phoneNumber: "(555) 987-6543",
  };

  // Example loved one data
  const exampleLovedOne = {
    firstName: "Margaret",
    lastName: "Eleanor Thompson",
    dateOfBirth: "01/01/1970",
    gender: "female",
    phoneNumber: "(555) 987-6543",
  };

  // Example health conditions - primary user conditions
  const examplePrimaryUserConditions = ["Diabetes Type 2", "Hypertension", "Arthritis"];
  // Example health conditions - loved one conditions (for caregiver view)
  const exampleLovedOneConditions = ["High Blood Pressure", "Osteoporosis"];

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

  const getGenderLabel = (gender: string): string => {
    switch (gender) {
      case 'male': return 'Male';
      case 'female': return 'Female';
      case 'non-binary': return 'Non-binary';
      case 'prefer-not-to-say': return 'Prefer not to say';
      default: return 'Gender';
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      addHealthCondition(newCondition.trim());
      setNewCondition('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCondition();
    }
  };

  // Determine which conditions to display based on role and context
  const getPrimaryUserConditions = () => {
    return showExample ? examplePrimaryUserConditions : userProfile.healthConditions;
  };

  const getLovedOneConditions = () => {
    return showExample ? exampleLovedOneConditions : (userProfile.lovedOne?.healthConditions || []);
  };



  // Split Layout
  const splitLayout = (
    <div className="flex flex-col gap-4">
      {/* User Profile - Compact horizontal card */}
      <div className="w-full">
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-4 h-fit">
            <div className="flex items-center justify-between">
            <p className={`text-3xl font-bold break-words ${showExample || userProfile.firstName || userProfile.lastName ? 'text-white' : 'text-white/60 italic'}`}>
              {showExample || userProfile.firstName || userProfile.lastName
                ? `${showExample ? (displayRole === UserRole.Caregiver ? exampleProfile.firstName : examplePrimaryUser.firstName) : userProfile.firstName || ""} ${showExample ? (displayRole === UserRole.Caregiver ? exampleProfile.lastName : examplePrimaryUser.lastName) : userProfile.lastName || ""}`
                : "Name"}
            </p>
            <div className="text-right">
              {displayRole === UserRole.Caregiver && (
                <>
                  <p className="text-highlight text-xl">Caregiver Admin</p>
                </>
              )}
              {displayRole === UserRole.PrimaryUser && (
                <>
                  <p className="text-highlight text-xl">Primary User</p>
                </>
              )}
            </div>
          </div>
          
          {/* Details section */}
          <div className="space-y-3 ml-1 mt-2">
            
            {displayRole === UserRole.Caregiver && (
              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <User className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                  <p className={`text-xl ${showExample || userProfile.gender ? 'text-white' : 'text-white/60 italic'}`}>
                    {showExample || userProfile.gender
                      ? (showExample ? getGenderLabel(exampleProfile.gender) : getGenderLabel(userProfile.gender))
                      : "Gender"}
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                  <p className={`text-xl ${showExample || userProfile.phoneNumber ? 'text-white' : 'text-white/60 italic'}`}>
                    {showExample || userProfile.phoneNumber
                      ? (showExample ? exampleProfile.phoneNumber : userProfile.phoneNumber)
                      : "Phone number"}
                  </p>
                </div>
              </div>
            )}

            {displayRole === UserRole.PrimaryUser && (
              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <Calendar className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                  <p className={`text-xl ${showExample || userProfile.dateOfBirth ? 'text-white' : 'text-white/60 italic'}`}>
                    {showExample || userProfile.dateOfBirth
                      ? (showExample ? examplePrimaryUser.dateOfBirth : userProfile.dateOfBirth)
                      : "Date of birth"}
                  </p>
                </div>
                <div className="flex items-center">
                  <User className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                  <p className={`text-xl ${showExample || userProfile.gender ? 'text-white' : 'text-white/60 italic'}`}>
                    {showExample || userProfile.gender
                      ? (showExample ? getGenderLabel(examplePrimaryUser.gender) : getGenderLabel(userProfile.gender))
                      : "Gender"}
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                  <p className={`text-xl ${showExample || userProfile.phoneNumber ? 'text-white' : 'text-white/60 italic'}`}>
                    {showExample || userProfile.phoneNumber
                      ? (showExample ? examplePrimaryUser.phoneNumber : userProfile.phoneNumber)
                      : "Phone number"}
                  </p>
                </div>
              </div>
            )}

            {/* Health Conditions Section - only for Primary User in split layout */}
            {displayRole === UserRole.PrimaryUser && (
              <div className="flex items-center">
                <Heart className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                   {getPrimaryUserConditions().length === 0 ? (
                     <p className="text-white/60 italic text-xl">Health conditions</p>
                   ) : (
                     <div className="flex flex-wrap gap-2">
                       {getPrimaryUserConditions().map((condition, index) => (
                         <Badge 
                           key={index} 
                           className="bg-white/10 hover:bg-white/20 text-white text-base py-1 px-3 flex items-center gap-2"
                         >
                           {condition}
                           {!showExample && (
                             <X 
                               className="h-3 w-3 cursor-pointer hover:text-red-300" 
                               onClick={() => removeHealthCondition(index)}
                             />
                           )}
                         </Badge>
                       ))}
                       
                       {!showExample && (
                         <div className="flex gap-2 mt-2 w-full">
                           <Input
                             value={newCondition}
                             onChange={(e) => setNewCondition(e.target.value)}
                             onKeyPress={handleKeyPress}
                             placeholder="Add health condition"
                             className="bg-white/10 border-white/20 text-white flex-1"
                           />
                           <Button onClick={handleAddCondition} size="sm" className="bg-highlight hover:bg-highlight/90">
                             <Plus className="h-4 w-4" />
                           </Button>
                         </div>
                       )}
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      
      {/* Loved One Profile - Horizontal card below */}
      {displayRole === UserRole.Caregiver && (
        <div className="w-full">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between">
               <p className={`text-3xl font-bold break-words ${showExample || userProfile.lovedOne?.firstName || userProfile.lovedOne?.lastName ? 'text-white' : 'text-white/60 italic'}`}>
                 {showExample || userProfile.lovedOne?.firstName || userProfile.lovedOne?.lastName
                   ? (showExample ? `${exampleLovedOne.firstName} ${exampleLovedOne.lastName}` : `${userProfile.lovedOne?.firstName || ""} ${userProfile.lovedOne?.lastName || ""}`)
                   : "Loved one's name"}
              </p>
               <p className={`text-xl ${showExample || userProfile.relationship ? 'text-highlight' : 'text-white/60 italic'}`}>
                 {showExample || userProfile.relationship
                   ? (showExample ? "Parent" : getRelationshipLabel(userProfile.relationship))
                   : "Relationship"}
               </p>
            </div>
            <div className="space-y-3 ml-1">
              {/* DOB, Gender, Alert Preference, and Phone on same row */}
              <div className="flex items-center gap-8">
                <div className="flex items-center">
                  <Calendar className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                   <p className={`text-xl ${showExample || userProfile.lovedOne?.dateOfBirth ? 'text-white' : 'text-white/60 italic'}`}>
                     {showExample || userProfile.lovedOne?.dateOfBirth
                       ? (showExample ? exampleLovedOne.dateOfBirth : userProfile.lovedOne?.dateOfBirth)
                       : "Date of birth"}
                   </p>
                </div>
                
                <div className="flex items-center">
                  <User className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                   <p className={`text-xl ${showExample || userProfile.lovedOne?.gender ? 'text-white' : 'text-white/60 italic'}`}>
                     {showExample || userProfile.lovedOne?.gender
                       ? (showExample ? getGenderLabel(exampleLovedOne.gender) : getGenderLabel(userProfile.lovedOne?.gender))
                       : "Gender"}
                   </p>
                </div>
                
                <div className="flex items-center">
                  <BellRing className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                   <p className={`text-xl ${showExample || userProfile.lovedOne?.alertPreference ? 'text-white' : 'text-white/60 italic'}`}>
                     {showExample || userProfile.lovedOne?.alertPreference
                       ? (showExample ? "Text Message" : getAlertPreferenceLabel(userProfile.lovedOne?.alertPreference))
                       : "Alert preference"}
                   </p>
                </div>

                {/* Conditional phone number - only show if alert preference requires it */}
                {((showExample && true) || 
                  (userProfile.lovedOne?.alertPreference === 'text' || userProfile.lovedOne?.alertPreference === 'phone_call')) && (
                  <div className="flex items-center">
                    <Phone className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                     <p className={`text-xl whitespace-nowrap ${showExample || userProfile.lovedOne?.phoneNumber ? 'text-white' : 'text-white/60 italic'}`}>
                       {showExample || userProfile.lovedOne?.phoneNumber
                         ? (showExample ? exampleLovedOne.phoneNumber : userProfile.lovedOne?.phoneNumber)
                         : "Phone number"}
                     </p>
                  </div>
                )}
              </div>

              {/* Health Conditions Section for Loved One */}
              <div className="flex items-center">
                <Heart className="text-highlight h-5 w-5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                   {getLovedOneConditions().length === 0 ? (
                     <p className="text-white/60 italic text-xl">Health conditions</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {getLovedOneConditions().map((condition, index) => (
                        <Badge 
                          key={index} 
                          className="bg-white/10 hover:bg-white/20 text-white text-base py-1 px-3 flex items-center gap-2"
                        >
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-charcoal text-white rounded-lg p-4 relative min-h-[400px]">
      {splitLayout}
    </div>
  );
};

export default AccountInfoScreen;
