
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { ArrowLeft, ArrowRight, Plus, Trash2, X, Clock, Calendar, PlusCircle } from 'lucide-react';
import { MEDICATION_FORMS, DAYS_OPTIONS } from '@/types/onboarding';

const MedicationsScreen: React.FC = () => {
  const { 
    userProfile, 
    nextStep, 
    prevStep, 
    addMedication,
    updateMedication,
    removeMedication,
    addDose,
    updateDose,
    removeDose
  } = useOnboarding();

  const [newTime, setNewTime] = useState<{ medicationId: string, doseId: string, time: string }>({
    medicationId: '',
    doseId: '',
    time: ''
  });

  const handleAddTime = () => {
    if (newTime.time && newTime.medicationId && newTime.doseId) {
      const medication = userProfile.medications.find(med => med.id === newTime.medicationId);
      const dose = medication?.doses.find(dose => dose.id === newTime.doseId);
      
      if (dose && !dose.times.includes(newTime.time)) {
        const updatedTimes = [...dose.times, newTime.time].sort();
        updateDose(newTime.medicationId, newTime.doseId, 'times', updatedTimes);
      }
      
      setNewTime({ ...newTime, time: '' });
    }
  };

  const handleRemoveTime = (medicationId: string, doseId: string, time: string) => {
    const medication = userProfile.medications.find(med => med.id === medicationId);
    const dose = medication?.doses.find(dose => dose.id === doseId);
    
    if (dose) {
      const updatedTimes = dose.times.filter(t => t !== time);
      updateDose(medicationId, doseId, 'times', updatedTimes);
    }
  };

  const handleDayToggle = (medicationId: string, doseId: string, day: string) => {
    const medication = userProfile.medications.find(med => med.id === medicationId);
    const dose = medication?.doses.find(dose => dose.id === doseId);
    
    if (dose) {
      let updatedDays;
      if (dose.days.includes(day)) {
        updatedDays = dose.days.filter(d => d !== day);
      } else {
        updatedDays = [...dose.days, day];
      }
      updateDose(medicationId, doseId, 'days', updatedDays);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="onboarding-title">Medications</h2>
      <p className="onboarding-subtitle">Set up your medication schedule</p>

      {userProfile.medications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/20 rounded-lg">
          <p className="text-white/50 mb-4">No medications added yet</p>
          <Button 
            onClick={addMedication}
            className="bg-highlight hover:bg-highlight/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Medication
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {userProfile.medications.map(medication => (
            <div key={medication.id} className="medication-card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white">{medication.name || 'New Medication'}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMedication(medication.id)}
                  className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/5"
                  aria-label="Remove medication"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor={`med-name-${medication.id}`} className="input-label">Name</Label>
                  <Input
                    id={`med-name-${medication.id}`}
                    value={medication.name}
                    onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    placeholder="e.g., Lipitor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`med-strength-${medication.id}`} className="input-label">Strength</Label>
                  <Input
                    id={`med-strength-${medication.id}`}
                    value={medication.strength}
                    onChange={(e) => updateMedication(medication.id, 'strength', e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    placeholder="e.g., 50mg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`med-form-${medication.id}`} className="input-label">Form</Label>
                  <Select
                    value={medication.form}
                    onValueChange={(value) => updateMedication(medication.id, 'form', value)}
                  >
                    <SelectTrigger 
                      id={`med-form-${medication.id}`}
                      className="bg-white/5 border-white/10 text-white"
                    >
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDICATION_FORMS.map(form => (
                        <SelectItem key={form.value} value={form.value}>
                          {form.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <h4 className="text-sm font-medium text-white/70 flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2" /> Dosing Schedule
              </h4>

              {medication.doses.map(dose => (
                <div key={dose.id} className="medication-dose">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-medium text-white/80">Dose</h5>
                    {medication.doses.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDose(medication.id, dose.id)}
                        className="h-6 w-6 text-white/60 hover:text-white hover:bg-white/5"
                        aria-label="Remove dose"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-white/60 mb-1 block">Days Taken</Label>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OPTIONS.map(day => (
                          <Button
                            key={day.value}
                            variant="outline"
                            size="sm"
                            className={`py-1 px-2 h-auto text-xs ${
                              dose.days.includes(day.value)
                                ? 'bg-highlight text-white border-highlight'
                                : 'bg-transparent border-white/30 text-white/60'
                            }`}
                            onClick={() => handleDayToggle(medication.id, dose.id, day.value)}
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-white/60 mb-1 block">Times Taken</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {dose.times.map(time => (
                          <Badge 
                            key={time} 
                            className="bg-white/10 text-white flex items-center gap-1"
                          >
                            <Clock className="h-3 w-3" /> {time}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveTime(medication.id, dose.id, time)}
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              aria-label={`Remove ${time}`}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="time"
                          value={newTime.medicationId === medication.id && newTime.doseId === dose.id ? newTime.time : ''}
                          onChange={(e) => setNewTime({ 
                            medicationId: medication.id, 
                            doseId: dose.id, 
                            time: e.target.value 
                          })}
                          className="bg-white/5 border-white/10 text-white max-w-[150px]"
                        />
                        <Button 
                          onClick={handleAddTime}
                          disabled={!(newTime.medicationId === medication.id && newTime.doseId === dose.id && newTime.time)}
                          className="bg-highlight hover:bg-highlight/90 text-white h-10"
                          aria-label="Add time"
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`dose-quantity-${dose.id}`} className="text-xs text-white/60 mb-1 block">
                        Quantity (Pills per dose)
                      </Label>
                      <Input
                        id={`dose-quantity-${dose.id}`}
                        type="number"
                        min="1"
                        value={dose.quantity}
                        onChange={(e) => updateDose(medication.id, dose.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="bg-white/5 border-white/10 text-white max-w-[100px]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button 
                onClick={() => addDose(medication.id)}
                variant="outline"
                className="mt-3 bg-transparent border-white/30 text-white hover:bg-white/5"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Another Dose
              </Button>
            </div>
          ))}

          <Button 
            onClick={addMedication}
            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Medication
          </Button>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button 
          onClick={prevStep} 
          variant="outline" 
          className="bg-transparent text-white border-white/30 hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={nextStep} 
          className="bg-highlight hover:bg-highlight/90 text-white"
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MedicationsScreen;
