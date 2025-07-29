import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, AlertCircle, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MEDICATION_FORMS, DAYS_OPTIONS } from '@/types/onboarding';

interface SingleMedicationCaptureScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const SingleMedicationCaptureScreen: React.FC<SingleMedicationCaptureScreenProps> = ({ onComplete, onBack }) => {
  const { userProfile, addMedication, updateMedication, updateDose } = useOnboarding();
  const [isAsNeededMode, setIsAsNeededMode] = useState(false);
  const [maxPerDay, setMaxPerDay] = useState(1);

  // Get the last medication (assuming we're configuring the most recently added one)
  const currentMedication = userProfile.medications[userProfile.medications.length - 1];

  if (!currentMedication) {
    // If no medication exists, create one
    React.useEffect(() => {
      addMedication();
    }, []);
    return null;
  }

  const handleMedicationUpdate = (field: string, value: string) => {
    updateMedication(currentMedication.id, field as any, value);
  };

  const handleAsNeededToggle = () => {
    const newMode = !isAsNeededMode;
    setIsAsNeededMode(newMode);
    
    if (newMode) {
      // Switch to as-needed mode
      updateMedication(currentMedication.id, 'asNeeded', { maxPerDay });
    } else {
      // Switch to scheduled mode
      updateMedication(currentMedication.id, 'asNeeded', null);
    }
  };

  const handleMaxPerDayChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    setMaxPerDay(numValue);
    if (isAsNeededMode) {
      updateMedication(currentMedication.id, 'asNeeded', { maxPerDay: numValue });
    }
  };

  const addTimeSlot = () => {
    if (currentMedication.doses.length > 0) {
      const currentDose = currentMedication.doses[0];
      const newTimes = [...currentDose.times, '9:00 AM'];
      updateDose(currentMedication.id, currentDose.id, 'times', newTimes);
    }
  };

  return (
    <div className="h-full flex flex-col bg-charcoal text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={onBack} variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentMedication.name || 'Name'} • {currentMedication.strength || 'Strength'} • {currentMedication.form || 'Form'}
          </h2>
        </div>
        <Button onClick={onComplete} className="bg-highlight hover:bg-highlight/90">
          Done
        </Button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Medication Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="medName">Medication Name</Label>
              <Input
                id="medName"
                value={currentMedication.name}
                onChange={(e) => handleMedicationUpdate('name', e.target.value)}
                placeholder="Enter medication name"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="strength">Strength</Label>
              <Input
                id="strength"
                value={currentMedication.strength}
                onChange={(e) => handleMedicationUpdate('strength', e.target.value)}
                placeholder="e.g., 500mg"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="form">Form</Label>
            <Select value={currentMedication.form} onValueChange={(value) => handleMedicationUpdate('form', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select form" />
              </SelectTrigger>
              <SelectContent>
                {MEDICATION_FORMS.map((form) => (
                  <SelectItem key={form.value} value={form.value}>
                    {form.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center">
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => !isAsNeededMode || handleAsNeededToggle()}
              className={`px-4 py-2 rounded-md transition-colors ${
                !isAsNeededMode ? 'bg-highlight text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Scheduled Doses
            </button>
            <button
              onClick={() => isAsNeededMode || handleAsNeededToggle()}
              className={`px-4 py-2 rounded-md transition-colors ${
                isAsNeededMode ? 'bg-amber-500 text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <AlertCircle className="h-4 w-4 inline mr-2" />
              As-Needed
            </button>
          </div>
        </div>

        {/* Configuration Section */}
        {isAsNeededMode ? (
          // As-Needed Configuration
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="h-5 w-5" />
              <h3 className="text-lg font-medium">As-Needed Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxPerDay">Maximum doses per day</Label>
                <Input
                  id="maxPerDay"
                  type="number"
                  value={maxPerDay}
                  onChange={(e) => handleMaxPerDayChange(e.target.value)}
                  min="1"
                  max="24"
                  className="bg-white/10 border-white/20 text-white w-32"
                />
              </div>
              
              <div className="text-white/70">
                <p className="text-sm">Take only when symptoms occur</p>
                <p className="text-xs mt-1">This medication will not appear on your regular schedule</p>
              </div>
            </div>
          </div>
        ) : (
          // Scheduled Configuration
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-highlight" />
              <h3 className="text-lg font-medium">Schedule Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Times per day</Label>
                <div className="flex items-center gap-2 mt-2">
                  {currentMedication.doses.length > 0 && currentMedication.doses[0].times.map((time, index) => (
                    <Badge key={index} variant="secondary" className="bg-highlight/20 text-white">
                      {time}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => {
                        const newTimes = currentMedication.doses[0].times.filter((_, i) => i !== index);
                        updateDose(currentMedication.id, currentMedication.doses[0].id, 'times', newTimes);
                      }} />
                    </Badge>
                  ))}
                  <Button onClick={addTimeSlot} size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Time
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleMedicationCaptureScreen;
