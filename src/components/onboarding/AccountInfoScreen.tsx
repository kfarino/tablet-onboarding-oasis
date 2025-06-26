import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CaretSortIcon, CheckIcon, PlusCircle, User2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { UserRole, AlertPreference } from '@/types/onboarding';

interface AccountInfoScreenProps {
  showExample?: boolean;
  previewRole?: UserRole | null;
}

const relationships = [
  {
    value: 'spouse',
    label: 'Spouse',
  },
  {
    value: 'child',
    label: 'Child',
  },
  {
    value: 'parent',
    label: 'Parent',
  },
  {
    value: 'sibling',
    label: 'Sibling',
  },
  {
    value: 'friend',
    label: 'Friend',
  },
  {
    value: 'other',
    label: 'Other',
  },
];

const AccountInfoScreen: React.FC<AccountInfoScreenProps> = ({ showExample = false, previewRole = null }) => {
  const { userProfile, updateUserProfile, addHealthCondition, removeHealthCondition } = useOnboarding();
  const [date, setDate] = useState<Date | undefined>(userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth) : undefined);
  const [newCondition, setNewCondition] = useState('');
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(userProfile.alertPreference || null);

  useEffect(() => {
    if (date) {
      updateUserProfile('dateOfBirth', date.toISOString());
    }
  }, [date, updateUserProfile]);

  useEffect(() => {
    updateUserProfile('alertPreference', alert);
  }, [alert, updateUserProfile]);

  const handleAddCondition = () => {
    if (newCondition.trim() !== '') {
      addHealthCondition(newCondition.trim());
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    removeHealthCondition(index);
  };

  return (
    <div className="animate-fade-in px-6 pb-10 space-y-6">
      {/* Account Information */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Account Information</h2>
        <p className="text-muted-foreground">
          {showExample
            ? `This is how ${previewRole === UserRole.Caregiver ? 'a loved one' : 'you'} will appear to others.`
            : 'Tell us a little bit about yourself.'}
        </p>
      </div>

      {/* First Name */}
      <div className="space-y-1">
        <Label htmlFor="firstName" className="text-white">
          First Name
        </Label>
        <Input
          id="firstName"
          placeholder="Enter your first name"
          value={userProfile.firstName}
          onChange={(e) => updateUserProfile('firstName', e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder-white/50"
        />
      </div>

      {/* Last Name */}
      <div className="space-y-1">
        <Label htmlFor="lastName" className="text-white">
          Last Name
        </Label>
        <Input
          id="lastName"
          placeholder="Enter your last name"
          value={userProfile.lastName}
          onChange={(e) => updateUserProfile('lastName', e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder-white/50"
        />
      </div>

      {/* Role Selection */}
      <div className="space-y-1">
        <Label htmlFor="role" className="text-white">
          I am a...
        </Label>
        <Select
          defaultValue={userProfile.role}
          onValueChange={(value) => updateUserProfile('role', value as UserRole)}
        >
          <SelectTrigger className="bg-white/5 border-white/20 text-white placeholder-white/50">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.PrimaryUser}>Patient</SelectItem>
            <SelectItem value={UserRole.Caregiver}>Caregiver</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Relationship (Only show if Caregiver is selected) */}
      {userProfile.role === UserRole.Caregiver && (
        <div className="space-y-1">
          <Label htmlFor="relationship" className="text-white">
            Relationship to Patient
          </Label>
          <Select
            defaultValue={userProfile.relationship}
            onValueChange={(value) => updateUserProfile('relationship', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white placeholder-white/50">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationships.map((relationship) => (
                <SelectItem key={relationship.value} value={relationship.value}>
                  {relationship.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Date of Birth */}
      <div className="space-y-1">
        <Label htmlFor="dateOfBirth" className="text-white">
          Date of Birth
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white placeholder-white/50',
                !date && 'text-muted-foreground'
              )}
            >
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 mt-4" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Phone Number */}
      <div className="space-y-1">
        <Label htmlFor="phoneNumber" className="text-white">
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter your phone number"
          value={userProfile.phoneNumber}
          onChange={(e) => updateUserProfile('phoneNumber', e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder-white/50"
        />
      </div>

      {/* Alert Preference */}
      <div className="space-y-1">
        <Label htmlFor="alertPreference" className="text-white">
          Preferred Alert Method
        </Label>
        <Command>
          <CommandTrigger className="flex h-11 w-full items-center justify-between rounded-md border border-white/20 bg-white/5 px-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
            {alert ? (
              <div className="flex items-center gap-1">
                {alert === AlertPreference.SMS ? 'SMS' : 'Voice'}
              </div>
            ) : (
              'Select alert preference'
            )}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </CommandTrigger>
          <CommandList>
            <CommandInput placeholder="Type a few letters to filter..." />
            <CommandEmpty>No preference found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="SMS"
                onSelect={() => {
                  setAlert(AlertPreference.SMS);
                }}
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    alert === AlertPreference.SMS ? 'opacity-100' : 'opacity-0'
                  )}
                />
                SMS
              </CommandItem>
              <CommandItem
                value="Voice"
                onSelect={() => {
                  setAlert(AlertPreference.Voice);
                }}
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    alert === AlertPreference.Voice ? 'opacity-100' : 'opacity-0'
                  )}
                />
                Voice
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      {/* Health Conditions */}
      <div className="space-y-1">
        <Label className="text-white">Health Conditions</Label>
        <ScrollArea className="rounded-md border border-white/20 h-32 p-2 bg-white/5">
          <div className="grid grid-cols-1 gap-2">
            {userProfile.healthConditions.map((condition, index) => (
              <Badge key={index} variant="secondary" className="gap-x-2 text-white items-center">
                {condition}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10 text-white -mr-2"
                  onClick={() => handleRemoveCondition(index)}
                >
                  <PlusCircle className="h-4 w-4 rotate-45" />
                </Button>
              </Badge>
            ))}
          </div>
        </ScrollArea>
        
        {showExample && (
          <div className="flex gap-2 mt-2">
            <Input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Enter health condition"
              className="flex-1 bg-white/5 border-white/20 text-white placeholder-white/50"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCondition();
                }
              }}
            />
            <Button
              onClick={handleAddCondition}
              disabled={!newCondition.trim()}
              size="sm"
              className="bg-highlight hover:bg-highlight/90 text-white"
            >
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInfoScreen;
