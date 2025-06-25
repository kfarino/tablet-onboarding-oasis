
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
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

  const renderCalendarView = () => {
    const [currentDate] = React.useState(new Date());
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      return {
        date: day,
        dayName: format(day, 'EEE'),
        dayNumber: format(day, 'd'),
        fullDayName: format(day, 'EEEE').toLowerCase(),
      };
    });

    // Create a flattened array of all medication doses from ALL medications
    const allDoses: Array<{
      medId: string,
      medName: string,
      time: string,
      days: string[],
      quantity: number,
      color: string
    }> = [];
    
    // Define colors for different medications
    const medicationColors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    
    displayMedications.forEach((med, medIndex) => {
      const color = medicationColors[medIndex % medicationColors.length];
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() !== "as needed") {
            allDoses.push({
              medId: med.id,
              medName: med.name,
              time,
              days: dose.days,
              quantity: dose.quantity,
              color
            });
          }
        });
      });
    });

    // Group doses by time
    const dosesByTime: Record<string, typeof allDoses> = {};
    allDoses.forEach(dose => {
      if (!dosesByTime[dose.time]) {
        dosesByTime[dose.time] = [];
      }
      dosesByTime[dose.time].push(dose);
    });

    const sortedTimes = Object.keys(dosesByTime).sort((a, b) => {
      const parseTime = (timeStr: string) => {
        const [time, meridiem] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
      };
      
      return parseTime(a) - parseTime(b);
    });

    return (
      <div className="space-y-3">
        {/* Week header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day) => (
            <div key={day.dayName} className="flex flex-col items-center">
              <div className="text-white/60 text-xs font-medium mb-1">{day.dayName}</div>
              <div className="bg-white/15 rounded-full h-6 w-6 flex items-center justify-center text-white text-sm font-medium">
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="space-y-2">
          {sortedTimes.map(time => {
            const everydayDoses = dosesByTime[time].filter(dose => 
              dose.days.includes('everyday')
            );
            const specificDayDoses = dosesByTime[time].filter(dose => 
              !dose.days.includes('everyday') && dose.days.length > 0
            );

            return (
              <div key={time} className="space-y-1">
                {/* Everyday doses */}
                {everydayDoses.length > 0 && (
                  <Card className="overflow-hidden border-white/10 bg-white/5">
                    <div className="bg-white/10 p-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-highlight" />
                      <span className="text-sm font-medium text-white">{time}</span>
                      <Badge variant="outline" className="ml-auto bg-white/5 text-white/70 text-xs">
                        Every day
                      </Badge>
                    </div>
                    <div className="p-2 space-y-1">
                      {everydayDoses.map(dose => (
                        <div key={`${dose.medId}-${time}`} className="flex items-center bg-white/5 p-2 rounded text-xs">
                          <div className={`h-6 w-6 rounded-full ${dose.color}/20 flex items-center justify-center mr-2`}>
                            <Pill className={`h-3 w-3 ${dose.color.replace('bg-', 'text-')}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-white truncate">{dose.medName}</span>
                          </div>
                          <div className="ml-2 px-2 py-1 bg-white/10 rounded text-xs font-medium text-white">
                            {dose.quantity}x
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Specific day doses */}
                {specificDayDoses.length > 0 && (
                  <Card className="overflow-hidden border-white/10 bg-white/5">
                    <div className="bg-white/10 p-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-highlight" />
                      <span className="text-sm font-medium text-white">{time}</span>
                      <Badge variant="outline" className="ml-auto bg-white/5 text-white/70 text-xs">
                        Specific days
                      </Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-1 p-2">
                      {weekDays.map(day => {
                        const dosesForDay = specificDayDoses.filter(dose => 
                          dose.days.includes(day.fullDayName)
                        );
                        
                        return (
                          <div key={day.dayName} className="p-1 min-h-12 border border-white/5 rounded">
                            {dosesForDay.length > 0 ? (
                              <div className="space-y-1">
                                {dosesForDay.map(dose => (
                                  <div key={`${dose.medId}-${day.dayName}`} className="bg-white/10 p-1 rounded text-center">
                                    <div className={`h-3 w-3 mx-auto ${dose.color} rounded-full flex items-center justify-center mb-1`}>
                                      <Pill className="h-1.5 w-1.5 text-white" />
                                    </div>
                                    <div className="text-xs font-medium text-white truncate" title={dose.medName}>
                                      {dose.medName.length > 6 ? dose.medName.substring(0, 6) + '...' : dose.medName}
                                    </div>
                                    <div className="text-xs text-white/70">{dose.quantity}x</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-white/30 text-xs">-</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
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

      {/* Calendar View */}
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
        {renderCalendarView()}
      </div>
    </div>
  );
};

export default MedicationsScreen;
