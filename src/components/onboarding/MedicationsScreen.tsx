
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

  const renderCalendarView = (medication: Medication) => {
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

    // Create a flattened array of all medication doses
    const allDoses: Array<{
      time: string,
      days: string[],
      quantity: number
    }> = [];
    
    medication.doses.forEach(dose => {
      dose.times.forEach(time => {
        if (time.toLowerCase() !== "as needed") {
          allDoses.push({
            time,
            days: dose.days,
            quantity: dose.quantity
          });
        }
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
                        Every day • {everydayDoses[0].quantity}x
                      </Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-1 p-2">
                      {weekDays.map(day => (
                        <div key={day.dayName} className="p-2 bg-highlight/20 rounded text-center">
                          <div className="h-4 w-4 mx-auto bg-highlight rounded-full flex items-center justify-center">
                            <Pill className="h-2 w-2 text-white" />
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
                        Specific days • {specificDayDoses[0].quantity}x
                      </Badge>
                    </div>
                    <div className="grid grid-cols-7 gap-1 p-2">
                      {weekDays.map(day => {
                        const hasdose = specificDayDoses.some(dose => 
                          dose.days.includes(day.fullDayName)
                        );
                        
                        return (
                          <div key={day.dayName} className={`p-2 rounded text-center ${
                            hasdose ? 'bg-highlight/20' : 'bg-white/5'
                          }`}>
                            {hasdose ? (
                              <div className="h-4 w-4 mx-auto bg-highlight rounded-full flex items-center justify-center">
                                <Pill className="h-2 w-2 text-white" />
                              </div>
                            ) : (
                              <div className="h-4 w-4 mx-auto flex items-center justify-center">
                                <span className="text-white/30 text-xs">–</span>
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
        </div>
        {renderCalendarView(currentMedication)}
      </div>
    </div>
  );
};

export default MedicationsScreen;
