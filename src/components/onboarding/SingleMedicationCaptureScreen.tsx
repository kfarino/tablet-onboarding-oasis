
import React, { useState, useMemo } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, Clock, AlertCircle, Plus, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Medication, Dose } from '@/types/onboarding';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MEDICATION_FORMS } from '@/types/onboarding';

interface SingleMedicationCaptureScreenProps {
  medicationIndex?: number;
  onComplete?: () => void;
  onBack?: () => void;
}

const SingleMedicationCaptureScreen: React.FC<SingleMedicationCaptureScreenProps> = ({ 
  medicationIndex = -1,
  onComplete,
  onBack
}) => {
  const { userProfile, updateMedication, addDose, updateDose, removeDose } = useOnboarding();
  
  // Get current medication (last one by default)
  const currentMedIndex = medicationIndex >= 0 ? medicationIndex : userProfile.medications.length - 1;
  const currentMedication = userProfile.medications[currentMedIndex];
  
  const [isAsNeededMode, setIsAsNeededMode] = useState(
    Boolean(currentMedication?.asNeeded && currentMedication.doses.length === 0)
  );
  const [maxPerDay, setMaxPerDay] = useState(currentMedication?.asNeeded?.maxPerDay || 1);

  // Generate time slots from all medications
  const timeSlots = useMemo(() => {
    const times = new Set<string>();
    userProfile.medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => times.add(time));
      });
    });
    return Array.from(times).sort();
  }, [userProfile.medications]);

  // Generate colors for medications
  const medicationColors = useMemo(() => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    return userProfile.medications.reduce((acc, med, index) => {
      acc[med.id] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  }, [userProfile.medications]);

  const handleMedicationUpdate = (field: keyof Omit<Medication, 'id' | 'doses'>, value: string) => {
    if (currentMedication) {
      updateMedication(currentMedication.id, field, value);
    }
  };

  const handleAsNeededToggle = (enabled: boolean) => {
    setIsAsNeededMode(enabled);
    if (currentMedication) {
      if (enabled) {
        // Switch to as-needed mode
        updateMedication(currentMedication.id, 'asNeeded', { maxPerDay });
        // Clear scheduled doses
        currentMedication.doses.forEach(dose => {
          removeDose(currentMedication.id, dose.id);
        });
      } else {
        // Switch to scheduled mode
        updateMedication(currentMedication.id, 'asNeeded', null);
        // Add a default dose if none exist
        if (currentMedication.doses.length === 0) {
          addDose(currentMedication.id);
        }
      }
    }
  };

  const handleMaxPerDayChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    setMaxPerDay(numValue);
    if (currentMedication && isAsNeededMode) {
      updateMedication(currentMedication.id, 'asNeeded', { maxPerDay: numValue });
    }
  };

  const days = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
  const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (!currentMedication) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Pill className="h-16 w-16 text-white/30 mb-4" />
        <p className="text-white/60 text-xl">No medication to configure</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Container - Current Medication */}
      <div className="bg-white/5 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Configure Medication</h2>
          <div className="flex gap-2">
            {onBack && (
              <Button onClick={onBack} variant="ghost" size="sm" className="text-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {onComplete && (
              <Button onClick={onComplete} variant="ghost" size="sm" className="text-white">
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Medication Name</label>
            <Input
              value={currentMedication.name}
              onChange={(e) => handleMedicationUpdate('name', e.target.value)}
              placeholder="Enter medication name"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Strength</label>
            <Input
              value={currentMedication.strength}
              onChange={(e) => handleMedicationUpdate('strength', e.target.value)}
              placeholder="e.g., 10mg"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Form</label>
            <Select 
              value={currentMedication.form} 
              onValueChange={(value) => handleMedicationUpdate('form', value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select form" />
              </SelectTrigger>
              <SelectContent className="bg-charcoal border-white/20">
                {MEDICATION_FORMS.map(form => (
                  <SelectItem key={form.value} value={form.value} className="text-white">
                    {form.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Schedule Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-white/70" />
            <span className="text-white font-medium">
              {isAsNeededMode ? 'As-Needed Medication' : 'Scheduled Doses'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Scheduled</span>
            <Switch
              checked={isAsNeededMode}
              onCheckedChange={handleAsNeededToggle}
            />
            <span className="text-sm text-white/70">As-Needed</span>
          </div>
        </div>
      </div>

      {/* Bottom Container - Calendar or As-Needed Config */}
      <div className="flex-1 bg-white/5 rounded-lg p-4">
        {isAsNeededMode ? (
          /* As-Needed Configuration Panel */
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">As-Needed Medication</h3>
              </div>
              <p className="text-white/70 mb-4">
                Take this medication only when needed for symptoms.
              </p>
              <div className="mb-4">
                <label className="block text-sm text-white/70 mb-2">Maximum doses per day</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={maxPerDay}
                  onChange={(e) => handleMaxPerDayChange(e.target.value)}
                  className="bg-white/10 border-white/20 text-white w-24"
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-200">
                  Maximum {maxPerDay} dose{maxPerDay > 1 ? 's' : ''} per day
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Weekly Calendar View */
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Medication Schedule</h3>
            
            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-8 gap-1 text-sm">
                {/* Header row */}
                <div className="p-2"></div>
                {days.map(day => (
                  <div key={day} className="p-2 text-center text-white/70 font-medium">
                    {day}
                  </div>
                ))}
                
                {/* Time slots */}
                {timeSlots.map(timeSlot => (
                  <React.Fragment key={timeSlot}>
                    <div className="p-2 text-white/70 text-right pr-3">
                      {timeSlot}
                    </div>
                    {fullDays.map((fullDay, dayIndex) => (
                      <div key={`${timeSlot}-${dayIndex}`} className="p-1 min-h-[40px] border border-white/10">
                        {userProfile.medications.map(med => 
                          med.doses
                            .filter(dose => 
                              dose.times.includes(timeSlot) && 
                              (dose.days.includes('everyday') || 
                               dose.days.some(d => d.toLowerCase() === fullDay.toLowerCase()))
                            )
                            .map(dose => (
                              <div
                                key={`${med.id}-${dose.id}`}
                                className={`${medicationColors[med.id]} text-white text-xs px-1 py-0.5 rounded mb-1 opacity-90`}
                                title={`${med.name} ${med.strength} - ${dose.quantity} ${med.form || 'dose'}(s)`}
                              >
                                {dose.quantity}x {med.name.substring(0, 8)}
                              </div>
                            ))
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Clock className="h-12 w-12 text-white/30 mb-3" />
                <p className="text-white/60">No scheduled doses yet</p>
                {!isAsNeededMode && (
                  <Button
                    onClick={() => addDose(currentMedication.id)}
                    className="mt-3 bg-highlight hover:bg-highlight/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Dose
                  </Button>
                )}
              </div>
            )}

            {/* As-Needed Medications Section */}
            {userProfile.medications.some(med => med.asNeeded) && (
              <div className="mt-6 pt-4 border-t border-white/10">
                <h4 className="text-md font-medium text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  As-Needed Medications
                </h4>
                <div className="space-y-2">
                  {userProfile.medications
                    .filter(med => med.asNeeded)
                    .map(med => (
                      <div key={med.id} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white font-medium">
                              {med.name} {med.strength}
                            </span>
                            <span className="text-white/70 ml-2">({med.form})</span>
                          </div>
                          <div className="text-yellow-200 text-sm">
                            Max {med.asNeeded?.maxPerDay}/day
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleMedicationCaptureScreen;
