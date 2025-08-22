import React, { useState, Fragment } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { Medication } from '@/types/onboarding';
import { Badge } from '@/components/ui/badge';
import { formatTimeDisplay, parseOriginalTimeForSorting, getTimeColor, getDayAbbreviation } from '@/utils/dateUtils';

interface MedicationsScreenProps {
  showExample?: boolean;
  showMedicationSchedule?: boolean;
  setShowMedicationSchedule?: (show: boolean) => void;
  exampleMedications?: Medication[];
  medicationCount?: number;
  onShowAllMedications?: () => void;
}

interface DoseSchedule {
  time: string;
  dayPattern: string;
  medications: Array<{
    name: string;
    strength: string;
    quantity: number;
  }>;
}

const MedicationsScreen: React.FC<MedicationsScreenProps> = ({ 
  showExample = false,
  showMedicationSchedule = false,
  setShowMedicationSchedule = () => {},
  exampleMedications = [],
  medicationCount = 0,
  onShowAllMedications = () => {}
}) => {
  const { userProfile, addMedication } = useOnboarding();
  
  // Fix: Only show example medications when showExample is true
  const displayMedications = showExample ? exampleMedications : (userProfile.medications || []);
  const [selectedSchedule, setSelectedSchedule] = useState<DoseSchedule | null>(null);
  
  // Current medication being worked on (last one in the list) - only if showing example
  const currentMedication = showExample ? displayMedications[displayMedications.length - 1] : null;

  // Simplified 2-color palette
  const currentMedColor = '#F26C3A';  // Primary highlight for current medication
  const otherMedColor = '#8B4513';    // Darker color for other medications

  // Group medications by time and day pattern to create dose schedules
  const createDoseSchedules = () => {
    const schedules: Record<string, {
      time: string;
      dayPattern: string;
      medications: Array<{
        name: string;
        strength: string;
        quantity: number;
      }>;
      color: string;
      isCurrentMedSchedule?: boolean;
      currentMedQuantity?: number;
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
                color: otherMedColor, // Default to other med color, will be updated if current med is found
                isCurrentMedSchedule: false,
                currentMedQuantity: 0
              };
            }
            
            schedules[scheduleKey].medications.push({
              name: med.name,
              strength: med.strength,
              quantity: dose.quantity
            });
            
            // Check if this schedule contains the current medication and update color
            if (currentMedication && med.id === currentMedication.id) {
              schedules[scheduleKey].isCurrentMedSchedule = true;
              schedules[scheduleKey].currentMedQuantity = dose.quantity;
              schedules[scheduleKey].color = currentMedColor; // Use current med color
            }
          }
        });
      });
    });

    return Object.values(schedules);
  };


  const renderConsolidatedScheduleWithMedicationDetails = () => {
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

    // Sort times using the original time parsing function
    const sortedTimes = Object.keys(timeGroups).sort((a, b) => {
      return parseOriginalTimeForSorting(a) - parseOriginalTimeForSorting(b);
    });

    // Check if we have as-needed medications
    const asNeededMeds = displayMedications.filter(med => med.asNeeded);

    return (
      <div className="rounded-lg overflow-hidden border border-white/10 bg-charcoal">
        {/* Row 1 - Medication Details - Sticky */}
        <div 
          className="sticky top-0 z-20 bg-white/5 backdrop-blur-sm border-2 rounded-lg border-b border-white/10 px-6 py-3"
          style={{ borderColor: currentMedication ? currentMedColor : 'rgba(255, 255, 255, 0.2)' }}
        >
          <div className="flex justify-between items-center">
            <div className="flex">
              {currentMedication ? (
                <span className="text-xl text-white">
                  <span className="font-bold">{currentMedication.name}</span>
                  <span className="text-white/40 mx-2">•</span>
                  <span className="font-bold">{currentMedication.strength}</span>
                  <span className="text-white/40 mx-2">•</span>
                  <span className="font-normal">{currentMedication.form.charAt(0).toUpperCase() + currentMedication.form.slice(1)}</span>
                  {currentMedication.asNeeded && (
                    <>
                      <span className="text-white/40 mx-2">•</span>
                      <span className="font-light text-white/70">As needed {currentMedication.asNeeded.maxPerDay}x/day</span>
                    </>
                  )}
                </span>
              ) : (
                <span className="text-xl font-semibold text-white/60 italic">
                  New Medication
                </span>
              )}
            </div>
            
            {/* View all (X) link - Orange color */}
            <button
              onClick={onShowAllMedications}
              className="text-orange-400 hover:text-orange-300 underline cursor-pointer text-lg transition-colors"
            >
              View all ({medicationCount})
            </button>
          </div>
        </div>

        {/* Row 2 - Schedule Header - Sticky */}
        <div className="sticky top-[73px] z-10 grid bg-charcoal border-b-2 border-white/20" style={{ 
          gridTemplateColumns: '120px repeat(7, 1fr)'
        }}>
          <div className="p-1 h-[28px] text-xl font-bold text-white text-center border-r border-white/10 whitespace-nowrap flex items-center justify-center">
            Time <span className="text-sm">(#/dose)</span>
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-1 h-[28px] text-xl font-bold text-white text-center border-r last:border-r-0 border-white/10 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>

        {/* Time rows */}
        {sortedTimes.map((time, timeIndex) => {
          const timeSchedules = timeGroups[time];
          const hasCurrentMedication = timeSchedules.some(schedule => schedule.isCurrentMedSchedule);
          const totalQuantity = timeSchedules.reduce((sum, schedule) => 
            sum + schedule.medications.reduce((medSum, med) => medSum + med.quantity, 0), 0
          );

          // Check if we should show noon separator before this time
          const shouldShowNoonSeparator = timeIndex === 0 ? false : (() => {
            const currentTimeMinutes = parseOriginalTimeForSorting(time);
            const prevTime = sortedTimes[timeIndex - 1];
            const prevTimeMinutes = parseOriginalTimeForSorting(prevTime);
            
            // Show noon if we're crossing from AM (< 720) to PM (>= 720)
            return prevTimeMinutes < 720 && currentTimeMinutes >= 720;
          })();

          return (
            <React.Fragment key={time}>
              {/* Noon separator */}
              {shouldShowNoonSeparator && (
                <div className="grid" style={{ 
                  gridTemplateColumns: '120px repeat(7, 1fr)',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  <div className="py-0.5 pl-4 flex items-center justify-start border-r border-white/20">
                    <div className="text-sm font-semibold text-white">Noon</div>
                  </div>
                  <div className="col-span-7 py-0.5"></div>
                </div>
              )}
              
              {/* Time row */}
              <div 
                className="grid border-b border-white/10 transition-all duration-300 bg-charcoal relative" 
                style={{ gridTemplateColumns: '120px repeat(7, 1fr)' }}
              >
                {/* Left border indicator for current medication */}
                {hasCurrentMedication && (
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: currentMedColor }}
                  />
                )}
                {/* Time column - left aligned with quantity and time */}
                <div className="p-1 pl-4 h-[28px] flex items-center justify-start border-r border-white/10">
                  <div className="text-xl font-bold flex items-center gap-1">
                    {hasCurrentMedication && currentMedication && (() => {
                      // Find the current medication's quantity for this time
                      const currentMedSchedule = timeSchedules.find(schedule => schedule.isCurrentMedSchedule);
                      if (currentMedSchedule && currentMedSchedule.currentMedQuantity) {
                        const quantity = currentMedSchedule.currentMedQuantity;
                        return (
                          <>
                            <span className={getTimeColor(time)}>{formatTimeDisplay(time)}</span>
                            <span className="text-white text-sm">({quantity}x)</span>
                          </>
                        );
                      }
                      return <span className={getTimeColor(time)}>{formatTimeDisplay(time)}</span>;
                    })() || <span className={getTimeColor(time)}>{formatTimeDisplay(time)}</span>}
                  </div>
                </div>
                
                {/* Day columns */}
                {daysOfWeek.map((_, dayIndex) => {
                  const fullDayName = fullDayNames[dayIndex];
                  const applicableSchedules = timeGroups[time].filter(schedule => {
                    const days = schedule.dayPattern.split(',');
                    return days.includes('everyday') || days.includes(fullDayName);
                  });

                  return (
                    <div key={dayIndex} className="p-1 border-r last:border-r-0 min-h-[28px] flex items-center justify-center border-white/10">
                      <div className="flex gap-1 w-full">
                        {applicableSchedules.map((schedule, scheduleIndex) => (
                          <div 
                            key={scheduleIndex}
                            className="rounded flex-1 h-5 relative cursor-pointer hover:brightness-110 transition-all flex items-center justify-center"
                            style={{ 
                              backgroundColor: schedule.color,
                              opacity: schedule.isCurrentMedSchedule ? 1 : 0.3
                            }}
                            onClick={() => {}}
                          >
                            {/* Clean medication tile - quantity shown in time column for current med */}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </React.Fragment>
          )
        })}

      </div>
    );
  };

  if (!showExample && displayMedications.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col h-full" data-medications-screen>
        {/* Unified medication badge - no data state */}
        <div className="sticky top-0 z-20 bg-charcoal px-6 py-3 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex">
              <div className="bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-lg px-6 py-3">
                <span className="text-xl text-white/60 italic">
                  <span className="font-bold">Medication Name</span>
                  <span className="text-white/40 mx-2">•</span>
                  <span className="font-bold">Strength</span>
                  <span className="text-white/40 mx-2">•</span>
                  <span className="font-normal">Form</span>
                  <span className="text-white/40 mx-2">•</span>
                  <span className="font-light text-white/50">As needed #x/day</span>
                </span>
              </div>
            </div>
            
            {/* View all (X) link - Orange color */}
            <button
              onClick={onShowAllMedications}
              className="text-orange-400 hover:text-orange-300 underline cursor-pointer text-lg transition-colors"
            >
              View all ({medicationCount})
            </button>
          </div>
        </div>

        {/* Scrollable schedule container - matching the data state */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-charcoal">
            {/* Header - Sticky Row 2 */}
            <div className="sticky top-[73px] z-10 grid bg-charcoal border-b-2 border-white/20" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)'
            }}>
              <div className="p-1 text-xl font-bold text-white text-center border-r border-white/10 whitespace-nowrap">
                Time <span className="text-sm">(#/dose)</span>
              </div>
              {['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'].map((day) => (
                <div key={day} className="p-1 text-xl font-bold text-white text-center border-r last:border-r-0 border-white/10">
                  {day}
                </div>
              ))}
            </div>
            
            {/* AM time slot */}
            <div className="grid border-b border-white/10 bg-charcoal" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)'
            }}>
              <div className="p-1 pl-4 h-[28px] flex items-center justify-start border-r border-white/10">
                <div className="text-xl font-bold text-orange-400">AM</div>
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="p-1 border-r last:border-r-0 min-h-[28px] flex items-center justify-center border-white/10">
                  <div className="flex gap-1 w-full">
                    <div className="rounded flex-1 h-5 bg-white/10"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Noon separator */}
            <div className="grid" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }}>
              <div className="py-0.5 pl-4 flex items-center justify-start border-r border-white/20">
                <div className="text-sm font-semibold text-white">Noon</div>
              </div>
              <div className="col-span-7 py-0.5"></div>
            </div>
            
            {/* PM time slot */}
            <div className="grid border-b border-white/10 bg-charcoal" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)'
            }}>
              <div className="p-1 pl-4 h-[28px] flex items-center justify-start border-r border-white/10">
                <div className="text-xl font-bold text-blue-400">PM</div>
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="p-1 border-r last:border-r-0 min-h-[28px] flex items-center justify-center border-white/10">
                  <div className="flex gap-1 w-full">
                    <div className="rounded flex-1 h-5 bg-white/10"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col h-full" data-medications-screen>
      {/* Scrollable schedule container with integrated medication details */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {displayMedications.length > 0 && renderConsolidatedScheduleWithMedicationDetails()}
      </div>
    </div>
  );
};

export default MedicationsScreen;
