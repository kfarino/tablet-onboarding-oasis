import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Medication } from '@/types/onboarding';
import { Badge } from '@/components/ui/badge';

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
  
  // Fix: Properly determine which medications to display
  const displayMedications = showExample ? exampleMedications : (userProfile.medications || []);
  const [selectedSchedule, setSelectedSchedule] = useState<DoseSchedule | null>(null);
  
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
      medications: Array<{
        name: string;
        strength: string;
        quantity: number;
      }>;
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
            
            schedules[scheduleKey].medications.push({
              name: med.name,
              strength: med.strength,
              quantity: dose.quantity
            });
            
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

    // Check if we have as-needed medications
    const asNeededMeds = displayMedications.filter(med => med.asNeeded);

    return (
      <div className="rounded-lg overflow-hidden border-2" style={{ 
        borderColor: '#F26C3A', 
        backgroundColor: '#000000' 
      }}>
        {/* Header */}
        <div className="grid grid-cols-8 text-xs" style={{ 
          background: 'linear-gradient(to right, rgba(242, 108, 58, 0.15), rgba(255, 138, 92, 0.15))',
          backgroundColor: '#374151'
        }}>
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
            backgroundColor: '#000000'
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
                        className="rounded flex-1 h-8 relative cursor-pointer hover:brightness-110 transition-all"
                        style={{ 
                          backgroundColor: schedule.color,
                          opacity: schedule.isCurrentMedSchedule ? 1 : 0.3
                        }}
                        onClick={() => handleDoseClick(schedule)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* As needed row - redesigned to match grid structure */}
        {asNeededMeds.length > 0 && (
          <div className="grid grid-cols-8 border-t" style={{ 
            backgroundColor: '#000000', 
            borderColor: '#4B5563' 
          }}>
            {/* Time column for as-needed */}
            <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r" style={{ 
              borderColor: '#4B5563',
              color: '#E5E7EB'
            }}>
              <div className="text-sm font-semibold">PRN</div>
            </div>
            
            {/* Span across all day columns for as-needed meds */}
            <div className="col-span-7 p-2 flex items-center gap-2 min-h-[50px]">
              {asNeededMeds.map((med, index) => (
                <div
                  key={med.id}
                  className="rounded h-8 px-3 flex items-center cursor-pointer hover:brightness-110 transition-all text-white text-sm font-medium"
                  style={{ 
                    backgroundColor: '#FF6B35',
                    opacity: currentMedication && med.id === currentMedication.id ? 1 : 0.3
                  }}
                  onClick={() => setSelectedSchedule({
                    time: 'As needed',
                    dayPattern: 'as needed',
                    medications: [{
                      name: med.name,
                      strength: med.strength,
                      quantity: med.asNeeded?.maxPerDay || 0,
                    }]
                  })}
                >
                  {med.name} ({med.asNeeded?.maxPerDay}/day)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Check if we should show empty state - only when not showing example AND no real medications
  if (!showExample && displayMedications.length === 0) {
    return (
      <div className="animate-fade-in px-6 pb-10 space-y-6">
        {/* Current medication container */}
        <Card className="border p-4" style={{ 
          background: 'linear-gradient(to right, rgba(242, 108, 58, 0.1), rgba(255, 138, 92, 0.1))',
          borderColor: 'rgba(242, 108, 58, 0.3)',
          backgroundColor: '#374151'
        }}>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="h-12 w-12 mx-auto mb-3 rounded-full flex items-center justify-center text-xl font-bold" style={{ 
                backgroundColor: '#F26C3A',
                color: '#FFFFFF'
              }}>
                0
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
    <>
      <div className="animate-fade-in px-2 pb-2 space-y-4">
        {/* Current medication container - updated header */}
        <Card className="border p-3" style={{ 
          background: 'linear-gradient(to right, rgba(242, 108, 58, 0.15), rgba(255, 138, 92, 0.15))',
          borderColor: 'rgba(242, 108, 58, 0.4)',
          backgroundColor: '#374151'
        }}>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white min-w-0 flex-1">
                  <h3 className="text-2xl font-bold truncate">
                    {currentMedication ? `${currentMedication.name} ${currentMedication.strength}` : 'New Medication'}
                  </h3>
                  {currentMedication && (
                    <>
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

      {/* Dose Details Dialog */}
      <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dose Details - {selectedSchedule?.time}</DialogTitle>
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
    </>
  );
};

export default MedicationsScreen;
