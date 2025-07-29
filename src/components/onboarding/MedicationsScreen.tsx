import React, { useState, Fragment } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Medication } from '@/types/onboarding';
import { Badge } from '@/components/ui/badge';
import { formatTimeDisplay, parseTimeForSorting, getTimeColor } from '@/utils/dateUtils';

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
  const [showAllMedicationsDialog, setShowAllMedicationsDialog] = useState(false);
  
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

    // Sort times using the new parsing function
    const sortedTimes = Object.keys(timeGroups).sort((a, b) => {
      return parseTimeForSorting(formatTimeDisplay(a)) - parseTimeForSorting(formatTimeDisplay(b));
    });

    // Check if we have as-needed medications
    const asNeededMeds = displayMedications.filter(med => med.asNeeded);

    return (
      <div className="rounded-lg overflow-hidden border border-white/10 bg-charcoal">
        {/* Header */}
        <div className="grid text-xs bg-charcoal" style={{ 
          gridTemplateColumns: '120px repeat(7, 1fr)'
        }}>
          <div className="p-2 font-semibold text-white text-center border-r border-white/10">
            Time
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 font-semibold text-white text-center border-r last:border-r-0 border-white/10">
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
            const currentTimeMinutes = parseTimeForSorting(formatTimeDisplay(time));
            const prevTime = sortedTimes[timeIndex - 1];
            const prevTimeMinutes = parseTimeForSorting(formatTimeDisplay(prevTime));
            
            // Show noon if we're crossing from AM (< 720) to PM (> 720)
            return prevTimeMinutes < 720 && currentTimeMinutes > 720;
          })();

          return (
            <React.Fragment key={time}>
              {/* Noon separator */}
              {shouldShowNoonSeparator && (
                <div className="grid" style={{ 
                  gridTemplateColumns: '120px repeat(7, 1fr)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}>
                  <div className="py-0.5 text-center flex items-center justify-center border-r border-white/10">
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
                {/* Time column with horizontal inline layout */}
                <div className="p-2 text-center h-[40px] flex items-center justify-center border-r border-white/10">
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-bold ${getTimeColor(time)}`}>
                      {formatTimeDisplay(time)}
                    </span>
                    {hasCurrentMedication && currentMedication && (
                      (() => {
                        // Find the current medication's quantity for this time
                        const currentMedSchedule = timeSchedules.find(schedule => schedule.isCurrentMedSchedule);
                        if (currentMedSchedule && currentMedSchedule.currentMedQuantity) {
                          const quantity = currentMedSchedule.currentMedQuantity;
                          return (
                            <>
                              <span className="text-white/60">•</span>
                              <span className="text-sm text-white/80 font-medium">
                                {quantity} {quantity === 1 ? 'pill' : 'pills'}
                              </span>
                            </>
                          );
                        }
                        return null;
                      })()
                    )}
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
                    <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[40px] flex items-center justify-center border-white/10">
                      <div className="flex gap-1 w-full">
                        {applicableSchedules.map((schedule, scheduleIndex) => (
                           <div 
                             key={scheduleIndex}
                             className="rounded flex-1 h-8 relative cursor-pointer hover:brightness-110 transition-all flex items-center justify-center"
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
      <div className="bg-charcoal text-white rounded-lg p-4 relative min-h-[400px]">
        <div className="space-y-4">
          {/* No-data medication container matching AccountInfoScreen style */}
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xl font-bold text-white/60 italic">Name • Strength • Form</p>
                <p className="text-sm text-white/40 italic">As needed: [frequency per day]</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">
                  0 total meds
                </span>
              </div>
            </div>
          </div>
          
          {/* Empty schedule grid matching the layout but with no-data styling */}
          <div className="rounded-lg overflow-hidden border-2 border-white/10 bg-white/5">
            {/* Header */}
            <div className="grid text-xs" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }}>
              <div className="p-2 font-semibold text-white/60 text-center border-r border-white/10">
                Time
              </div>
              {['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'].map((day) => (
                <div key={day} className="p-2 font-semibold text-white/60 text-center border-r last:border-r-0 border-white/10">
                  {day}
                </div>
              ))}
            </div>
            
            {/* AM time slot */}
            <div className="grid border-b border-white/10" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r border-white/10">
                <div className="text-sm font-semibold text-orange-400">AM</div>
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[50px] flex items-center justify-center border-white/10">
                  <div className="w-full h-8 rounded bg-white/10"></div>
                </div>
              ))}
            </div>
            
            {/* Noon indicator */}
            <div className="grid" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="py-0.5 text-center flex items-center justify-center border-r border-white/10">
                <div className="text-sm font-semibold text-white">Noon</div>
              </div>
              <div className="col-span-7 py-0.5"></div>
            </div>
            
            {/* PM time slot */}
            <div className="grid border-b border-white/10" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r border-white/10">
                <div className="text-sm font-semibold text-blue-400">PM</div>
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[50px] flex items-center justify-center border-white/10">
                  <div className="w-full h-8 rounded bg-white/10"></div>
                </div>
              ))}
            </div>
            
            {/* As-needed row */}
            <div className="grid border-t border-white/10" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div className="p-2 text-center min-h-[32px] flex items-center justify-center border-r border-white/10">
                <div className="text-sm font-semibold text-white/60">As-needed</div>
              </div>
              <div className="col-span-7 p-2 flex items-center gap-2 min-h-[32px]">
                {/* Empty - no pill needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-in px-2 pb-2 space-y-4">
        {/* Current medication container - matching AccountInfoScreen styling */}
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className={`text-xl font-bold break-words ${showExample || currentMedication ? 'text-white' : 'text-white/60 italic'}`}>
                {currentMedication ? 
                  `${currentMedication.name} ${currentMedication.strength} • ${currentMedication.form.charAt(0).toUpperCase() + currentMedication.form.slice(1)}` :
                  'New Medication'
                }
              </p>
              {/* Show as-needed info for current medication only */}
              {currentMedication && currentMedication.asNeeded && (
                <p className="text-sm text-white/70 italic">
                  As needed: up to {currentMedication.asNeeded.maxPerDay}x per day
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-full border border-white/20 hover:border-white/30 cursor-pointer transition-all duration-200 hover:scale-105" 
                onClick={() => setShowAllMedicationsDialog(true)}
              >
                <span className="text-xs text-white/80 hover:text-white font-medium">
                  {displayMedications.length} total meds
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Consolidated schedule - only show if we have medications */}
        {displayMedications.length > 0 && renderConsolidatedSchedule()}
      </div>

      {/* Dose Details Dialog */}
      <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dose Details - {selectedSchedule ? formatTimeDisplay(selectedSchedule.time) : ''}</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              <div className="space-y-3">
                {selectedSchedule.medications.map((med, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: '#F26C3A' }}>
                      <Pill size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{med.name}</h3>
                      <p className="text-white/70">{med.strength}</p>
                      <p className="text-white/70">
                        {med.quantity} {med.quantity === 1 ? 'dose' : 'doses'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <div className="text-sm">
                  <span className="text-white/70">Schedule:</span>
                  <p className="text-white font-medium">
                    {selectedSchedule.dayPattern === 'everyday' 
                      ? 'Every day'
                      : selectedSchedule.dayPattern.split(',').map(day => 
                          day.charAt(0).toUpperCase() + day.slice(1)
                        ).join(', ')
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* All Medications Dialog */}
      <Dialog open={showAllMedicationsDialog} onOpenChange={setShowAllMedicationsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>All Medications ({displayMedications.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {displayMedications.map((med, index) => (
              <div key={med.id || index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: '#F26C3A' }}>
                  <Pill size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{med.name}</h3>
                  <p className="text-white/70">{med.strength} • {med.form.charAt(0).toUpperCase() + med.form.slice(1)}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={med.asNeeded ? "secondary" : "default"} className="text-xs">
                      {med.asNeeded ? 'As needed' : 'Scheduled'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MedicationsScreen;
