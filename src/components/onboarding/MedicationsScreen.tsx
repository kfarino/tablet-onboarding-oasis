import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, Eye, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MedicationVisualization from './MedicationVisualization';
import { Medication } from '@/types/onboarding';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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
  const { userProfile } = useOnboarding();
  const displayMedications = showExample ? exampleMedications : userProfile.medications;

  return (
    <div className="animate-fade-in px-6 pb-10">
      {(!showExample && userProfile.medications.length === 0) || 
        (showExample && !displayMedications.length) ? (
        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/20 rounded-lg">
          <Pill className="h-16 w-16 text-white/30 mb-4" />
          <p className="text-white/60 text-xl mb-2">No medications added yet</p>
          <p className="text-white/80 text-lg">Say "Add medication" to begin</p>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden">
          <Table className="w-full">
            <TableBody>
              {displayMedications.map(med => (
                <TableRow key={med.id} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="text-white py-4 w-[45%]">
                    <div className="text-2xl font-bold">
                      {med.name} {med.strength}
                    </div>
                  </TableCell>
                  <TableCell className="w-[55%]">
                    {med.doses.length > 0 ? (
                      med.doses.map(dose => (
                        <div key={dose.id} className="mb-3 last:mb-0">
                          <div className="flex flex-col text-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {dose.quantity} {med.form || 'dose'}
                                {dose.quantity !== 1 && (med.form ? 's' : 's')}
                              </span>
                              <span className="text-white/70">•</span>
                              <span className="text-white">
                                {dose.days.includes('everyday')
                                  ? 'Every day'
                                  : dose.days.map(day => {
                                      // 1-2 letter abbreviations
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
                            <div className="text-highlight font-medium mt-1">
                              {dose.times.join(', ')}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-white/50 text-lg">Not scheduled</div>
                    )}
                    
                    {med.asNeeded && (
                      <div className="mt-2 pl-1 border-l-2 border-yellow-400/50">
                        <div className="text-yellow-400 text-lg font-medium">
                          {med.asNeeded.maxPerDay}x more taken as-needed per day
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MedicationsScreen;
