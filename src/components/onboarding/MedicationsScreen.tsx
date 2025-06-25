import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const { userProfile } = useOnboarding();
  const displayMedications = showExample ? exampleMedications : userProfile.medications;

  // Show the first medication for now
  const currentMedication = displayMedications[0];

  const renderCompactCalendarView = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayMapping = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 
      'thursday': 4, 'friday': 5, 'saturday': 6
    };

    // Get all unique times that have doses
    const allTimes = new Set<string>();
    
    displayMedications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() !== "as needed") {
            allTimes.add(time);
          }
        });
      });
    });

    // Sort times
    const sortedTimes = Array.from(allTimes).sort((a, b) => {
      const parseTime = (timeStr: string) => {
        const [time, meridiem] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
      };
      return parseTime(a) - parseTime(b);
    });

    // Colors for different medications
    const medColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

    return (
      <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
        {/* Header with days of week */}
        <div className="grid grid-cols-8 bg-blue-600">
          <div className="p-3 font-semibold text-white text-center border-r border-blue-500">
            Time
          </div>
          {daysOfWeek.map(day => (
            <div key={day} className="p-3 font-semibold text-white text-center border-r border-blue-500 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Only render rows for times that actually have doses */}
        {sortedTimes.map((time, timeIndex) => (
          <div key={time} className={`grid grid-cols-8 border-b border-white/10 ${timeIndex % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
            {/* Time column */}
            <div className="p-3 font-medium text-white border-r border-white/10 text-center">
              <div className="font-semibold">{time.split(' ')[0]}</div>
              <div className="text-xs text-white/70">{time.split(' ')[1]}</div>
            </div>
            
            {/* Day columns */}
            {daysOfWeek.map((_, dayIndex) => {
              const dayName = Object.keys(dayMapping).find(key => dayMapping[key as keyof typeof dayMapping] === dayIndex);
              
              // Find medications that have doses for this time and day
              const medsForTimeAndDay: Array<{ medIndex: number, quantity: number }> = [];
              
              displayMedications.forEach((med, medIndex) => {
                med.doses.forEach(dose => {
                  if (dose.times.includes(time) && 
                      (dose.days.includes('everyday') || dose.days.includes(dayName || ''))) {
                    medsForTimeAndDay.push({ medIndex, quantity: dose.quantity });
                  }
                });
              });

              return (
                <div key={dayIndex} className="p-2 border-r border-white/10 last:border-r-0 min-h-16 flex items-center justify-center gap-1">
                  {medsForTimeAndDay.map(({ medIndex, quantity }, index) => (
                    <div 
                      key={index}
                      className={`${medColors[medIndex % medColors.length]} rounded-lg px-2 py-1 text-white text-sm font-medium flex items-center gap-1`}
                    >
                      <Pill className="h-3 w-3" />
                      <span>{quantity}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}

        {/* As needed section if applicable */}
        {displayMedications.some(med => med.asNeeded) && (
          <div className="bg-yellow-500/20 border-t border-yellow-500/30">
            <div className="grid grid-cols-8">
              <div className="p-3 font-medium text-yellow-400 border-r border-yellow-500/30 text-center">
                <div className="font-semibold">As</div>
                <div className="text-xs">Needed</div>
              </div>
              <div className="col-span-7 p-2 flex items-center justify-center gap-1">
                {displayMedications.filter(med => med.asNeeded).map((med, index) => (
                  <div key={med.id} className={`${medColors[index % medColors.length]} rounded-lg px-2 py-1 text-white text-sm font-medium flex items-center gap-1`}>
                    <Pill className="h-3 w-3" />
                    <span>{med.asNeeded?.maxPerDay}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!currentMedication) {
    return (
      <div className="animate-fade-in px-6 pb-10">
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/20 rounded-lg">
          <Pill className="h-16 w-16 text-white/30 mb-4" />
          <p className="text-white/60 text-xl mb-2">No medications added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-6 pb-10 space-y-6">
      {/* Medication Details */}
      <Card className="border-white/10 bg-white/5 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-highlight/20 flex items-center justify-center flex-shrink-0">
              <Pill className="h-6 w-6 text-highlight" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">
                {currentMedication.name} {currentMedication.strength}
              </h3>
              
              {currentMedication.form && (
                <Badge variant="outline" className="bg-white/10 text-white/70 mb-3">
                  {currentMedication.form}
                </Badge>
              )}

              {/* Dose summary */}
              <div className="space-y-2">
                {currentMedication.doses.map(dose => (
                  <div key={dose.id} className="text-white/80">
                    <span className="font-medium">
                      {dose.quantity} {currentMedication.form || 'dose'}{dose.quantity !== 1 ? 's' : ''}
                    </span>
                    <span className="text-white/60 mx-2">•</span>
                    <span>
                      {dose.days.includes('everyday')
                        ? 'Every day'
                        : dose.days.join(', ')}
                    </span>
                    <span className="text-white/60 mx-2">•</span>
                    <span className="text-highlight font-medium">
                      {dose.times.join(', ')}
                    </span>
                  </div>
                ))}
                
                {currentMedication.asNeeded && (
                  <div className="text-yellow-400 font-medium">
                    + Up to {currentMedication.asNeeded.maxPerDay}x as-needed per day
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Compact Calendar View */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-white" />
          <h4 className="text-lg font-semibold text-white">Weekly Schedule</h4>
          {displayMedications.length > 1 && (
            <Badge variant="outline" className="bg-white/10 text-white/70 text-xs">
              All {displayMedications.length} medications
            </Badge>
          )}
        </div>
        {renderCompactCalendarView()}
      </div>
    </div>
  );
};

export default MedicationsScreen;
