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
  const { userProfile, addMedication } = useOnboarding();
  const displayMedications = showExample ? exampleMedications : userProfile.medications;
  
  // Current medication being worked on (last one in the list)
  const currentMedication = displayMedications[displayMedications.length - 1];

  // Create a color palette for dose schedules with orange-based theme
  const scheduleColors = [
    'bg-orange-500',
    'bg-amber-500', 
    'bg-red-500',
    'bg-yellow-500',
    'bg-orange-600',
    'bg-amber-600',
    'bg-red-600',
    'bg-yellow-600',
    'bg-orange-400',
    'bg-amber-400'
  ];

  // Group medications by time and day pattern to create dose schedules
  const createDoseSchedules = () => {
    const schedules: Record<string, {
      time: string;
      dayPattern: string;
      medications: string[];
      color: string;
      isCurrentMedSchedule?: boolean;
    }> = {};

    let colorIndex = 0;

    displayMedications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() !== "as needed") {
            const dayPattern = dose.days.sort().join(',');
            const scheduleKey = `${time}-${dayPattern}`;
            
            if (!schedules[scheduleKey]) {
              schedules[scheduleKey] = {
                time,
                dayPattern,
                medications: [],
                color: scheduleColors[colorIndex % scheduleColors.length],
                isCurrentMedSchedule: false
              };
              colorIndex++;
            }
            
            schedules[scheduleKey].medications.push(med.name);
            
            // Check if this schedule contains the current medication
            if (currentMedication && med.id === currentMedication.id) {
              schedules[scheduleKey].isCurrentMedSchedule = true;
            }
          }
        });
      });
    });

    return Object.values(schedules);
  };

  const getColorForDayPattern = (days: string[]): string => {
    const daySet = new Set(days);
    
    if (daySet.has('everyday')) return 'bg-green-500';
    if (daySet.size === 2 && daySet.has('sunday') && daySet.has('saturday')) return 'bg-red-500';
    if (daySet.size === 5 && ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].every(day => daySet.has(day))) return 'bg-blue-600';
    if (daySet.size === 2 && daySet.has('saturday') && daySet.has('sunday')) return 'bg-orange-500';
    
    return 'bg-gray-500';
  };

  const renderConsolidatedSchedule = () => {
    const daysOfWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    const fullDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const doseSchedules = createDoseSchedules();

    // Group schedules by time
    const timeGroups: Record<string, typeof doseSchedules> = {};
    doseSchedules.forEach(schedule => {
      if (!timeGroups[schedule.time]) {
        timeGroups[schedule.time] = [];
      }
      timeGroups[schedule.time].push(schedule);
    });

    // Sort times
    const sortedTimes = Object.keys(timeGroups).sort((a, b) => {
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
      <div className="bg-white/5 rounded-md overflow-hidden border border-white/10">
        {/* Header */}
        <div className="grid grid-cols-8 bg-blue-600 text-xs">
          <div className="p-2 font-semibold text-white text-center border-r border-blue-500">
            Time
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 font-semibold text-white text-center border-r border-blue-500 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Time rows */}
        {sortedTimes.map((time, timeIndex) => (
          <div key={time} className={`grid grid-cols-8 border-b border-white/10 ${timeIndex % 2 === 0 ? 'bg-white/2' : 'bg-white/5'}`}>
            {/* Time column - single line */}
            <div className="p-2 text-white border-r border-white/10 text-center min-h-[50px] flex items-center justify-center">
              <div className="text-sm font-semibold">{time}</div>
            </div>
            
            {/* Day columns */}
            {daysOfWeek.map((_, dayIndex) => {
              const fullDayName = fullDayNames[dayIndex];
              const applicableSchedules = timeGroups[time].filter(schedule => {
                const days = schedule.dayPattern.split(',');
                return days.includes('everyday') || days.includes(fullDayName);
              });

              return (
                <div key={dayIndex} className="p-2 border-r border-white/10 last:border-r-0 min-h-[50px] flex items-center justify-center">
                  {applicableSchedules.map((schedule, scheduleIndex) => (
                    <div 
                      key={scheduleIndex}
                      className={`${schedule.color} rounded w-full h-8 relative ${
                        schedule.isCurrentMedSchedule ? 'ring-2 ring-highlight ring-offset-1 ring-offset-charcoal' : ''
                      }`}
                      title={schedule.medications.join(', ')}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}

        {/* As needed section */}
        {displayMedications.some(med => med.asNeeded) && (
          <div className="bg-yellow-500/20 border-t border-yellow-500/30">
            <div className="grid grid-cols-8 text-xs">
              <div className="p-2 font-medium text-yellow-400 border-r border-yellow-500/30 text-center">
                PRN
              </div>
              <div className="col-span-7 p-2 flex flex-wrap items-center gap-1">
                {displayMedications
                  .filter(med => med.asNeeded)
                  .map(med => (
                    <div key={med.id} className="bg-yellow-500 rounded px-2 py-1 text-white text-xs font-medium flex items-center gap-1">
                      <Pill className="h-3 w-3" />
                      <span className="truncate">{med.name}</span>
                      <span className="text-yellow-200">({med.asNeeded?.maxPerDay}/day)</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!displayMedications || displayMedications.length === 0) {
    return (
      <div className="animate-fade-in px-6 pb-10 space-y-6">
        {/* Current medication container */}
        <Card className="bg-gradient-to-r from-highlight/10 to-orange-500/10 border-highlight/30 p-4">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Pill className="h-12 w-12 text-highlight mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">No medications added yet</h3>
              <p className="text-white/60">Add your first medication to get started with your schedule.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-2 pb-2 space-y-4">
      {/* Current medication container - compact version */}
      <Card className="bg-gradient-to-r from-highlight/15 to-orange-500/15 border-highlight/40 p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-highlight/20 border border-highlight/40">
            <Pill className="h-5 w-5 text-highlight" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-white">
              <h3 className="text-lg font-semibold truncate">
                {currentMedication?.name || 'New Medication'}
              </h3>
              {currentMedication && (
                <>
                  <span className="text-white/60">•</span>
                  <span className="text-sm text-white/80">{currentMedication.strength}</span>
                  <span className="text-white/60">•</span>
                  <span className="text-sm text-white/80 capitalize">{currentMedication.form}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant="outline" className="bg-highlight/20 border-highlight/40 text-highlight text-xs whitespace-nowrap">
            Working on this
          </Badge>
        </div>
      </Card>

      {/* Schedule header */}
      <div className="flex items-center gap-2 px-1">
        <CalendarIcon className="h-4 w-4 text-highlight" />
        <h3 className="text-lg font-bold text-white">
          Medications Schedule
        </h3>
        <Badge variant="outline" className="bg-highlight/10 border-highlight/30 text-highlight text-xs">
          {displayMedications.length} medications
        </Badge>
      </div>

      {/* Consolidated schedule */}
      {renderConsolidatedSchedule()}

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-white/60 px-1">
        <span>{displayMedications.length} medications total</span>
        <span>
          {displayMedications.filter(m => m.asNeeded).length} as-needed, {' '}
          {displayMedications.filter(m => !m.asNeeded).length} scheduled
        </span>
      </div>
    </div>
  );
};

export default MedicationsScreen;
