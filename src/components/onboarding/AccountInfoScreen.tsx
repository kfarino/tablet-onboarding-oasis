
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
      case 'text': return 'Text';
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



  // Horizontal Layout - 25px+ font sizes, minimal vertical space
  const splitLayout = (
    <div className="w-full">
      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
        {displayRole === UserRole.Caregiver ? (
          // Two-column horizontal layout for caregiver
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column - Caregiver Info */}
            <div>
              <div className="flex flex-col gap-1 mb-2">
                <p className={`text-3xl font-bold break-words ${showExample || userProfile.firstName || userProfile.lastName ? 'text-white' : 'text-white/60 italic'}`}>
                  {showExample || userProfile.firstName || userProfile.lastName
                    ? `${showExample ? exampleProfile.firstName : userProfile.firstName || ""} ${showExample ? exampleProfile.lastName : userProfile.lastName || ""}`
                    : "Name"}
                </p>
                <p className="text-highlight text-2xl">Caregiver Admin</p>
              </div>
              
              {/* Compact horizontal details */}
              <div className="space-y-1">
                <div className="flex items-center text-2xl">
                  <User className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                  <span className={showExample || userProfile.gender ? 'text-white' : 'text-white/60 italic'}>
                    {showExample || userProfile.gender
                      ? (showExample ? getGenderLabel(exampleProfile.gender) : getGenderLabel(userProfile.gender))
                      : "Gender"}
                  </span>
                  <span className="text-white/40 mx-2">•</span>
                  <Phone className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                  <span className={showExample || userProfile.phoneNumber ? 'text-white' : 'text-white/60 italic'}>
                    {showExample || userProfile.phoneNumber
                      ? (showExample ? exampleProfile.phoneNumber : userProfile.phoneNumber)
                      : "Phone"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Loved One Info */}
            <div>
              <div className="flex flex-col gap-1 mb-2">
                <p className={`text-3xl font-bold break-words ${showExample || userProfile.lovedOne?.firstName || userProfile.lovedOne?.lastName ? 'text-white' : 'text-white/60 italic'}`}>
                  {showExample || userProfile.lovedOne?.firstName || userProfile.lovedOne?.lastName
                    ? (showExample ? `${exampleLovedOne.firstName} ${exampleLovedOne.lastName}` : `${userProfile.lovedOne?.firstName || ""} ${userProfile.lovedOne?.lastName || ""}`)
                    : "Loved one's name"}
                </p>
                <p className={`text-2xl ${showExample || userProfile.relationship ? 'text-highlight' : 'text-white/60 italic'}`}>
                  {showExample || userProfile.relationship
                    ? (showExample ? "Parent" : getRelationshipLabel(userProfile.relationship))
                    : "Relationship"}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center text-2xl">
                  <Calendar className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                  <span className={showExample || userProfile.lovedOne?.dateOfBirth ? 'text-white' : 'text-white/60 italic'}>
                    {showExample || userProfile.lovedOne?.dateOfBirth
                      ? (showExample ? exampleLovedOne.dateOfBirth : userProfile.lovedOne?.dateOfBirth)
                      : "DOB"}
                  </span>
                  <span className="text-white/40 mx-2">•</span>
                  <User className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                  <span className={showExample || userProfile.lovedOne?.gender ? 'text-white' : 'text-white/60 italic'}>
                    {showExample || userProfile.lovedOne?.gender
                      ? (showExample ? getGenderLabel(exampleLovedOne.gender) : getGenderLabel(userProfile.lovedOne?.gender))
                      : "Gender"}
                  </span>
                </div>
                
                <div className="flex items-center text-2xl">
                  <BellRing className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                  <span className={showExample || userProfile.lovedOne?.alertPreference ? 'text-white' : 'text-white/60 italic'}>
                    {showExample || userProfile.lovedOne?.alertPreference
                      ? (showExample ? "Text" : getAlertPreferenceLabel(userProfile.lovedOne?.alertPreference))
                      : "Alert"}
                  </span>
                  {((showExample && true) || 
                    (userProfile.lovedOne?.alertPreference === 'text' || userProfile.lovedOne?.alertPreference === 'phone_call')) && (
                    <>
                      <span className="text-white/40 mx-2">•</span>
                      <Phone className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                      <span className={showExample || userProfile.lovedOne?.phoneNumber ? 'text-white' : 'text-white/60 italic'}>
                        {showExample || userProfile.lovedOne?.phoneNumber
                          ? (showExample ? exampleLovedOne.phoneNumber : userProfile.lovedOne?.phoneNumber)
                          : "Phone"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Single column for primary user
          <div>
            <div className="flex flex-col gap-1 mb-2">
              <p className={`text-3xl font-bold break-words ${showExample || userProfile.firstName || userProfile.lastName ? 'text-white' : 'text-white/60 italic'}`}>
                {showExample || userProfile.firstName || userProfile.lastName
                  ? `${showExample ? examplePrimaryUser.firstName : userProfile.firstName || ""} ${showExample ? examplePrimaryUser.lastName : userProfile.lastName || ""}`
                  : "Name"}
              </p>
              <p className="text-highlight text-2xl">Primary User</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center text-2xl">
                <Calendar className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                <span className={showExample || userProfile.dateOfBirth ? 'text-white' : 'text-white/60 italic'}>
                  {showExample || userProfile.dateOfBirth
                    ? (showExample ? examplePrimaryUser.dateOfBirth : userProfile.dateOfBirth)
                    : "Date of birth"}
                </span>
                <span className="text-white/40 mx-2">•</span>
                <User className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                <span className={showExample || userProfile.gender ? 'text-white' : 'text-white/60 italic'}>
                  {showExample || userProfile.gender
                    ? (showExample ? getGenderLabel(examplePrimaryUser.gender) : getGenderLabel(userProfile.gender))
                    : "Gender"}
                </span>
              </div>
              
              <div className="flex items-center text-2xl">
                <Phone className="text-highlight h-6 w-6 mr-2 flex-shrink-0" />
                <span className={showExample || userProfile.phoneNumber ? 'text-white' : 'text-white/60 italic'}>
                  {showExample || userProfile.phoneNumber
                    ? (showExample ? examplePrimaryUser.phoneNumber : userProfile.phoneNumber)
                    : "Phone number"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Health Conditions Section */}
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex items-start">
            <Heart className="text-highlight h-6 w-6 mr-3 flex-shrink-0 mt-1" />
            <div className="flex-1">
              {displayRole === UserRole.PrimaryUser && (
                <>
                  {getPrimaryUserConditions().length === 0 ? (
                    <p className="text-white/60 italic text-2xl">Health conditions</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {getPrimaryUserConditions().map((condition, index) => (
                        <Badge 
                          key={index} 
                          className="bg-white/10 hover:bg-white/20 text-white text-xl py-1 px-3 flex items-center gap-2"
                        >
                          {condition}
                          {!showExample && (
                            <X 
                              className="h-5 w-5 cursor-pointer hover:text-red-300" 
                              onClick={() => removeHealthCondition(index)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {!showExample && (
                    <div className="flex gap-2 mt-2 w-full">
                      <Input
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add health condition"
                        className="bg-white/10 border-white/20 text-white flex-1 text-xl h-12"
                      />
                      <Button onClick={handleAddCondition} size="sm" className="bg-highlight hover:bg-highlight/90 h-12 px-4">
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
              
              {displayRole === UserRole.Caregiver && (
                <>
                  {getLovedOneConditions().length === 0 ? (
                    <p className="text-white/60 italic text-2xl">Health conditions</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {getLovedOneConditions().map((condition, index) => (
                        <Badge 
                          key={index} 
                          className="bg-white/10 hover:bg-white/20 text-white text-xl py-1 px-3"
                        >
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-charcoal text-white rounded-lg p-4 relative min-h-[400px]">
      {splitLayout}
    </div>
  );
};

export default AccountInfoScreen;
