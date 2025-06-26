
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

  // Create a color palette using the brand colors from the image
  const scheduleColors = [
    '#F26C3A', // Tangerine 1
    '#FF8A5C', // Tangerine 2  
    '#FFB088', // Tangerine 3
    '#E6C229', // Citron 1
    '#F0D666', // Citron 2
    '#F5E699', // Citron 3
    '#FF6B35', // Orange 1
    '#FF8A5C', // Orange 2
    '#28A745', // Green 1
    '#5CB85C'  // Green 2
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
      <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#6B7280', backgroundColor: '#F9FAFB' }}>
        {/* Header */}
        <div className="grid grid-cols-8 text-xs" style={{ backgroundColor: '#F26C3A' }}>
          <div className="p-2 font-semibold text-white text-center border-r" style={{ borderColor: '#E55A2B' }}>
            Time
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 font-semibold text-white text-center border-r last:border-r-0" style={{ borderColor: '#E55A2B' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Time rows */}
        {sortedTimes.map((time, timeIndex) => (
          <div key={time} className={`grid grid-cols-8 border-b`} style={{ 
            borderColor: '#E5E7EB',
            backgroundColor: timeIndex % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
          }}>
            {/* Time column */}
            <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r" style={{ 
              borderColor: '#E5E7EB',
              color: '#374151'
            }}>
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
                <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[50px] flex items-center justify-center" style={{ borderColor: '#E5E7EB' }}>
                  {applicableSchedules.map((schedule, scheduleIndex) => (
                    <div 
                      key={scheduleIndex}
                      className={`rounded w-full h-8 relative ${
                        schedule.isCurrentMedSchedule ? 'ring-2 ring-offset-1' : ''
                      }`}
                      style={{ 
                        backgroundColor: schedule.color,
                        ringColor: schedule.isCurrentMedSchedule ? '#F26C3A' : undefined,
                        ringOffsetColor: schedule.isCurrentMedSchedule ? '#FFFFFF' : undefined
                      }}
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
          <div className="border-t" style={{ 
            backgroundColor: '#FEF3C7', 
            borderColor: '#F59E0B' 
          }}>
            <div className="grid grid-cols-8 text-xs">
              <div className="p-2 font-medium text-center border-r" style={{ 
                color: '#92400E',
                borderColor: '#F59E0B'
              }}>
                PRN
              </div>
              <div className="col-span-7 p-2 flex flex-wrap items-center gap-1">
                {displayMedications
                  .filter(med => med.asNeeded)
                  .map(med => (
                    <div key={med.id} className="rounded px-2 py-1 text-xs font-medium flex items-center gap-1" style={{ 
                      backgroundColor: '#E6C229',
                      color: '#FFFFFF'
                    }}>
                      <Pill className="h-3 w-3" />
                      <span className="truncate">{med.name}</span>
                      <span style={{ color: '#FEF3C7' }}>({med.asNeeded?.maxPerDay}/day)</span>
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
        <Card className="border p-4" style={{ 
          background: 'linear-gradient(to right, rgba(242, 108, 58, 0.1), rgba(255, 138, 92, 0.1))',
          borderColor: 'rgba(242, 108, 58, 0.3)'
        }}>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Pill className="h-12 w-12 mx-auto mb-3" style={{ color: '#F26C3A' }} />
              <h3 className="text-lg font-semibold text-white mb-2">No medications added yet</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Add your first medication to get started with your schedule.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-2 pb-2 space-y-4">
      {/* Current medication container - compact version */}
      <Card className="border p-3" style={{ 
        background: 'linear-gradient(to right, rgba(242, 108, 58, 0.15), rgba(255, 138, 92, 0.15))',
        borderColor: 'rgba(242, 108, 58, 0.4)'
      }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border" style={{ 
            backgroundColor: 'rgba(242, 108, 58, 0.2)',
            borderColor: 'rgba(242, 108, 58, 0.4)'
          }}>
            <Pill className="h-5 w-5" style={{ color: '#F26C3A' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-white">
              <h3 className="text-lg font-semibold truncate">
                {currentMedication?.name || 'New Medication'}
              </h3>
              {currentMedication && (
                <>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>•</span>
                  <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{currentMedication.strength}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>•</span>
                  <span className="text-sm capitalize" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{currentMedication.form}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant="outline" className="text-xs whitespace-nowrap border" style={{ 
            backgroundColor: 'rgba(242, 108, 58, 0.2)',
            borderColor: 'rgba(242, 108, 58, 0.4)',
            color: '#F26C3A'
          }}>
            Working on this
          </Badge>
        </div>
      </Card>

      {/* Schedule header */}
      <div className="flex items-center gap-2 px-1">
        <CalendarIcon className="h-4 w-4" style={{ color: '#F26C3A' }} />
        <h3 className="text-lg font-bold text-white">
          Medications Schedule
        </h3>
        <Badge variant="outline" className="text-xs border" style={{ 
          backgroundColor: 'rgba(242, 108, 58, 0.1)',
          borderColor: 'rgba(242, 108, 58, 0.3)',
          color: '#F26C3A'
        }}>
          {displayMedications.length} medications
        </Badge>
      </div>

      {/* Consolidated schedule */}
      {renderConsolidatedSchedule()}

      {/* Summary */}
      <div className="flex items-center justify-between text-xs px-1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
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
