
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Medication } from '@/types/onboarding';

interface MedicationsScreenProps {
  showExample?: boolean;
  showMedicationSchedule?: boolean;
  setShowMedicationSchedule?: (show: boolean) => void;
  exampleMedications?: Medication[];
}

const MedicationsScreen: React.FC<MedicationsScreenProps> = ({ 
  showExample = false,
  showMedicationSchedule = false,
  setShowMedicationSchedule = () => {},
  exampleMedications = []
}) => {
  const { userProfile, addMedication } = useOnboarding();
  const displayMedications = showExample ? exampleMedications : userProfile.medications;

  const handleAddMedication = () => {
    addMedication();
  };

  return (
    <div className="animate-fade-in px-6 pb-10">
      {(!showExample && userProfile.medications.length === 0) || 
        (showExample && !displayMedications.length) ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/20 rounded-lg">
          <Pill className="h-16 w-16 text-white/30 mb-4" />
          <p className="text-white/60 text-xl mb-2">No medications added yet</p>
          <p className="text-white/80 text-lg mb-6">Say "Add medication" to begin</p>
          <Button 
            onClick={handleAddMedication}
            className="bg-highlight hover:bg-highlight/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>
      ) : (
        <div className="space-y-1">
          {displayMedications.map((med, index) => (
            <div key={med.id} className="border-b border-white/10 last:border-b-0 py-6 first:pt-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {med.name} {med.strength}
                  </h3>
                  
                  {/* Regular scheduled doses */}
                  {med.doses.length > 0 && med.doses.map(dose => (
                    <div key={dose.id} className="mb-3">
                      <div className="flex items-center gap-3 text-lg mb-1">
                        <span className="text-white">
                          {dose.quantity} {med.form || 'dose'}{dose.quantity !== 1 ? 's' : ''}
                        </span>
                        <span className="text-white/40">•</span>
                        <span className="text-white">
                          {dose.days.includes('everyday')
                            ? 'Every day'
                            : dose.days.map(day => {
                                const lowerDay = day.toLowerCase();
                                if (lowerDay === 'monday') return 'M';
                                if (lowerDay === 'tuesday') return 'Tu';
                                if (lowerDay === 'wednesday') return 'W';
                                if (lowerDay === 'thursday') return 'Th';
                                if (lowerDay === 'friday') return 'F';
                                if (lowerDay === 'saturday') return 'Sa';
                                if (lowerDay === 'sunday') return 'Su';
                                return day.charAt(0);
                              }).join(', ')}
                        </span>
                      </div>
                      <div className="text-highlight font-medium text-lg">
                        {dose.times.join(', ')}
                      </div>
                    </div>
                  ))}
                  
                  {/* As-needed indicator */}
                  {med.asNeeded && (
                    <div className="border-l-2 border-yellow-400/50 pl-3 mt-2">
                      <div className="text-yellow-400 font-medium text-lg">
                        {med.asNeeded.maxPerDay}x more taken as-needed per day
                      </div>
                    </div>
                  )}
                  
                  {/* No schedule indicator */}
                  {med.doses.length === 0 && !med.asNeeded && (
                    <div className="text-white/50 text-lg">
                      Not scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Add medication button at bottom */}
          <div className="pt-6">
            <Button 
              onClick={handleAddMedication}
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10 py-6 text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Medication
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationsScreen;
