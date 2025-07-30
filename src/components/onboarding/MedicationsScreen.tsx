import React, { useState, Fragment } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Medication } from '@/types/onboarding';
import { Badge } from '@/components/ui/badge';
import { formatTimeDisplay, parseOriginalTimeForSorting, getTimeColor, getDayAbbreviation } from '@/utils/dateUtils';

interface MedicationsScreenProps {
  showExample?: boolean;
  showMedicationSchedule?: boolean;
  setShowMedicationSchedule?: (show: boolean) => void;
  exampleMedications?: Medication[];
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
  exampleMedications = []
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

  const handleDoseClick = (schedule: any) => {
    setSelectedSchedule({
      time: schedule.time,
      dayPattern: schedule.dayPattern,
      medications: schedule.medications
    });
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

    // Sort times using the original time parsing function
    const sortedTimes = Object.keys(timeGroups).sort((a, b) => {
      return parseOriginalTimeForSorting(a) - parseOriginalTimeForSorting(b);
    });

    // Check if we have as-needed medications
    const asNeededMeds = displayMedications.filter(med => med.asNeeded);

    return (
      <div className="rounded-lg overflow-hidden border border-white/10 bg-charcoal">
        {/* Header */}
        <div className="grid text-xs bg-charcoal" style={{ 
          gridTemplateColumns: '120px repeat(7, 1fr)'
        }}>
          <div className="p-1 text-xl font-bold text-white text-center border-r border-white/10">
            Time (#/dose)
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-1 text-xl font-bold text-white text-center border-r last:border-r-0 border-white/10">
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
                className={`grid border-b border-white/10 transition-colors ${
                  hasCurrentMedication ? 'bg-white/5' : 'bg-charcoal'
                }`} 
                style={{ gridTemplateColumns: '120px repeat(7, 1fr)' }}
              >
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
                            <span className="text-white">({quantity}x)</span>
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
                             onClick={() => handleDoseClick(schedule)}
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

  // Check if we should show empty state - when not showing example AND no real medications
  if (!showExample && displayMedications.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col h-full" data-medications-screen>
        {/* Sticky medication header - matching the data state */}
        <div className="sticky top-0 z-10 bg-charcoal px-2 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white/40 leading-tight italic">
              <span className="flex items-center gap-3">
                <span>Name</span>
                <span>Strength</span>
                <span className="text-white/30">Form</span>
              </span>
            </h2>
            <div className="text-lg text-white/30 italic">
              As-needed: frequency per day
            </div>
          </div>
        </div>

        {/* Scrollable schedule container - matching the data state */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="rounded-lg overflow-hidden border border-white/10 bg-charcoal">
            {/* Header */}
            <div className="grid text-xs bg-charcoal" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)'
            }}>
              <div className="p-1 text-xl font-bold text-white text-center border-r border-white/10">
                Time (#/dose)
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
    <>
      <div className="animate-fade-in flex flex-col h-full" data-medications-screen>
        {/* Sticky medication header */}
        <div className="sticky top-0 z-10 bg-charcoal px-2 py-4 border-b border-white/10">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-white leading-tight whitespace-nowrap">
              {currentMedication ? (
                <span className="flex items-center gap-3">
                  <span>{currentMedication.name}</span>
                  <span>{currentMedication.strength}</span>
                  <span>{currentMedication.form.charAt(0).toUpperCase() + currentMedication.form.slice(1)}</span>
                </span>
              ) : (
                'New Medication'
              )}
            </h2>
          </div>
        </div>

        {/* Scrollable schedule container */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {displayMedications.length > 0 && renderConsolidatedSchedule()}
        </div>
      </div>

      {/* Dose Details Dialog */}
      <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xl">
                <span className={getTimeColor(selectedSchedule.time)}>
                  {(() => {
                    const time = selectedSchedule.time;
                    // If time already has AM/PM, use it as is
                    if (time.includes('AM') || time.includes('PM')) {
                      return time;
                    }
                    // Otherwise, use the original formatTimeDisplay and add AM/PM logic
                    return formatTimeDisplay(time);
                  })()}
                </span>
                <span className="text-white font-medium">
                  {selectedSchedule.dayPattern === 'everyday' 
                    ? 'Everyday'
                    : selectedSchedule.dayPattern.split(',').map(day => {
                        // Get abbreviated form and remove the first 2 characters if it's 3 chars (Mon -> M, Tue -> T, etc.)
                        const abbrev = getDayAbbreviation(day);
                        return abbrev.length === 3 ? abbrev.charAt(0) : abbrev;
                      }).join(',')
                  }
                </span>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <div className="space-y-2">
                  {selectedSchedule.medications.map((med, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: '#F26C3A' }}>
                        <Pill size={20} className="text-white" />
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white">{med.name} {med.strength}</h3>
                        </div>
                        <div className="text-base text-white/70">
                          {med.quantity}x {med.quantity === 1 ? 'pill' : 'pills'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MedicationsScreen;
