import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Calendar as CalendarIcon, Pill, Star } from 'lucide-react';
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

  // More distinct color palette with better contrast
  const scheduleColors = [
    '#FF6B35', // Vibrant Orange
    '#E6C229', // Bright Yellow  
    '#28A745', // Green
    '#FF4757', // Red
    '#5352ED', // Purple
    '#FF9F43', // Light Orange
    '#10AC84', // Teal
    '#FF6348', // Coral
    '#7B68EE', // Medium Slate Blue
    '#20BF6B', // Mint Green
    '#FA8231', // Orange
    '#F0D666'  // Light Yellow
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
      <div className="rounded-lg overflow-hidden border" style={{ 
        borderColor: '#374151', 
        backgroundColor: '#1F2937' 
      }}>
        {/* Header */}
        <div className="grid grid-cols-8 text-xs" style={{ backgroundColor: '#374151' }}>
          <div className="p-2 font-semibold text-white text-center border-r" style={{ borderColor: '#4B5563' }}>
            Time
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 font-semibold text-white text-center border-r last:border-r-0" style={{ borderColor: '#4B5563' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Time rows */}
        {sortedTimes.map((time, timeIndex) => (
          <div key={time} className={`grid grid-cols-8 border-b`} style={{ 
            borderColor: '#4B5563',
            backgroundColor: timeIndex % 2 === 0 ? '#1F2937' : '#111827'
          }}>
            {/* Time column */}
            <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r" style={{ 
              borderColor: '#4B5563',
              color: '#E5E7EB'
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
                <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[50px] flex items-center justify-center" style={{ borderColor: '#4B5563' }}>
                  <div className="flex gap-1 w-full">
                    {applicableSchedules.map((schedule, scheduleIndex) => (
                      <div 
                        key={scheduleIndex}
                        className="rounded flex-1 h-8 relative flex items-center justify-center"
                        style={{ 
                          backgroundColor: schedule.color,
                          opacity: currentMedication && !schedule.isCurrentMedSchedule ? 0.3 : 1
                        }}
                        title={schedule.medications.join(', ')}
                      >
                        {/* Star icon overlay for current medication schedules */}
                        {schedule.isCurrentMedSchedule && (
                          <Star 
                            className="h-4 w-4 animate-pulse" 
                            style={{ 
                              color: '#FFFFFF',
                              fill: '#FFFFFF',
                              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))'
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* As needed section */}
        {displayMedications.some(med => med.asNeeded) && (
          <div className="border-t" style={{ 
            backgroundColor: '#374151', 
            borderColor: '#4B5563' 
          }}>
            <div className="grid grid-cols-8 text-xs">
              <div className="p-2 font-medium text-center border-r" style={{ 
                color: '#E5E7EB',
                borderColor: '#4B5563'
              }}>
                PRN
              </div>
              <div className="col-span-7 p-2 flex flex-wrap items-center gap-1">
                {displayMedications
                  .filter(med => med.asNeeded)
                  .map(med => {
                    const isCurrentMed = currentMedication && med.id === currentMedication.id;
                    return (
                      <div 
                        key={med.id} 
                        className="rounded px-2 py-1 text-xs font-medium flex items-center gap-1" 
                        style={{ 
                          backgroundColor: '#E6C229',
                          color: '#111827',
                          opacity: currentMedication && !isCurrentMed ? 0.3 : 1
                        }}
                      >
                        <span className="truncate">{med.name}</span>
                        <span style={{ color: '#374151' }}>({med.asNeeded?.maxPerDay}/day)</span>
                      </div>
                    );
                  })}
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
          borderColor: 'rgba(242, 108, 58, 0.3)',
          backgroundColor: '#1F2937'
        }}>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="h-12 w-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: '#F26C3A'
              }}>
                <Pill className="h-6 w-6 text-white" />
              </div>
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
        borderColor: 'rgba(242, 108, 58, 0.4)',
        backgroundColor: '#1F2937'
      }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border" style={{ 
            backgroundColor: '#F26C3A',
            borderColor: 'rgba(242, 108, 58, 0.4)'
          }}>
            <Pill className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white min-w-0 flex-1">
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
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {displayMedications.length} total • {displayMedications.filter(m => m.asNeeded).length} PRN • {displayMedications.filter(m => !m.asNeeded).length} scheduled
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Consolidated schedule */}
      {renderConsolidatedSchedule()}
    </div>
  );
};

export default MedicationsScreen;
