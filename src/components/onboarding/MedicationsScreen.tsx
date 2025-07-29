import React, { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, EyeOff } from 'lucide-react';
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
  
  // Fix: Only show example medications when showExample is true
  const displayMedications = showExample ? exampleMedications : (userProfile.medications || []);
  const [selectedSchedule, setSelectedSchedule] = useState<DoseSchedule | null>(null);
  
  // Current medication being worked on (last one in the list) - only if showing example
  const currentMedication = showExample ? displayMedications[displayMedications.length - 1] : null;

  // Color palette matching the design system
  const scheduleColors = [
    '#F26C3A', // Primary highlight color
    '#FF8A5C', // Light highlight
    '#E55A2B', // Dark highlight  
    '#FF9F70', // Lighter highlight
    '#D14D1F', // Darker highlight
    '#FFA885', // Pastel highlight
    '#C43E13', // Deep highlight
    '#FFB299', // Very light highlight
    '#B52F07', // Very dark highlight
    '#FFC7B8', // Pale highlight
    '#A52500', // Ultra dark highlight
    '#FFD6CC'  // Ultra light highlight
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
                color: scheduleColors[colorIndex % scheduleColors.length],
                isCurrentMedSchedule: false,
                currentMedQuantity: 0
              };
              colorIndex++;
            }
            
            schedules[scheduleKey].medications.push({
              name: med.name,
              strength: med.strength,
              quantity: dose.quantity
            });
            
            // Check if this schedule contains the current medication and store its quantity
            if (currentMedication && med.id === currentMedication.id) {
              schedules[scheduleKey].isCurrentMedSchedule = true;
              schedules[scheduleKey].currentMedQuantity = dose.quantity;
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
      <div className="rounded-lg overflow-hidden border border-white/10 bg-charcoal">
        {/* Header matching AccountInfoScreen styling */}
        <div className="grid text-xs" style={{ 
          gridTemplateColumns: '120px repeat(7, 1fr)',
          background: 'linear-gradient(to right, rgba(242, 108, 58, 0.15), rgba(255, 138, 92, 0.15))',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
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
          return (
            <div key={time} className="grid border-b border-white/10 bg-charcoal" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)'
            }}>
              {/* Time column - clean without quantity */}
              <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r border-white/10">
                <div className="text-sm font-semibold text-white">
                  {time}
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
                  <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[50px] flex items-center justify-center border-white/10">
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
                          {/* Show quantity as small badge on medication tile */}
                          {schedule.medications.length === 1 && schedule.medications[0].quantity > 1 && (
                            <span className="text-xs font-bold text-white bg-black/30 rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                              {schedule.medications[0].quantity}
                            </span>
                          )}
                          {schedule.medications.length > 1 && (
                            <span className="text-xs font-bold text-white bg-black/30 rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                              {schedule.medications.length}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        })}

        {/* As needed row - matching AccountInfoScreen styling */}
        {asNeededMeds.length > 0 && (
          <div className="grid border-t border-white/10 bg-charcoal" style={{ 
            gridTemplateColumns: '120px repeat(7, 1fr)'
          }}>
            {/* Time column for as-needed */}
            <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r border-white/10">
              <div className="text-sm font-semibold text-white">As-needed</div>
            </div>
            
            {/* Span across all day columns for as-needed meds */}
            <div className="col-span-7 p-2 flex items-center gap-2 min-h-[50px]">
              {asNeededMeds.map((med, index) => (
                <div
                  key={med.id}
                  className="rounded h-8 px-3 flex items-center cursor-pointer hover:brightness-110 transition-all text-white text-sm font-medium relative"
                  style={{ 
                    backgroundColor: '#F26C3A',
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
                  {med.name}
                  {/* Show max per day as small badge */}
                  {med.asNeeded?.maxPerDay && med.asNeeded.maxPerDay > 1 && (
                    <span className="ml-2 text-xs font-bold text-white bg-black/30 rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center">
                      {med.asNeeded.maxPerDay}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
              <p className="text-3xl font-bold text-white/60 italic">New Medication</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60">
                  0 total • 0 PRN • 0 scheduled
                </span>
              </div>
            </div>
            
            <div className="space-y-3 ml-1 mt-2">
              <div className="flex items-center">
                <EyeOff className="text-white/60 h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-white/60 italic text-xl">Medication name</p>
              </div>
              
              <div className="flex items-center">
                <EyeOff className="text-white/60 h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-white/60 italic text-xl">Strength and form</p>
              </div>
              
              <div className="flex items-center">
                <EyeOff className="text-white/60 h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-white/60 italic text-xl">Schedule</p>
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
            
            {/* Empty time slots */}
            {['8:00 AM', '6:00 PM'].map((time) => (
              <div key={time} className="grid border-b border-white/10" style={{ 
                gridTemplateColumns: '120px repeat(7, 1fr)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}>
                <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r border-white/10">
                  <div className="text-sm font-semibold text-white/60">{time}</div>
                </div>
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[50px] flex items-center justify-center border-white/10">
                    <div className="w-full h-8 rounded bg-white/10"></div>
                  </div>
                ))}
              </div>
            ))}
            
            {/* As-needed row */}
            <div className="grid border-t border-white/10" style={{ 
              gridTemplateColumns: '120px repeat(7, 1fr)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div className="p-2 text-center min-h-[50px] flex items-center justify-center border-r border-white/10">
                <div className="text-sm font-semibold text-white/60">As-needed</div>
              </div>
              <div className="col-span-7 p-2 flex items-center gap-2 min-h-[50px]">
                <div className="rounded h-8 px-3 flex items-center text-white/60 text-sm italic bg-white/10">
                  No as-needed medications
                </div>
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
            <p className={`text-3xl font-bold break-words ${showExample || currentMedication ? 'text-white' : 'text-white/60 italic'}`}>
              {currentMedication ? `${currentMedication.name} ${currentMedication.strength}` : 'New Medication'}
            </p>
            <div className="flex items-center gap-2">
              {currentMedication && (
                <span className="text-highlight text-xl capitalize">{currentMedication.form}</span>
              )}
              <span className="text-xs text-white/60">
                {displayMedications.length} total • {displayMedications.filter(m => m.asNeeded).length} PRN • {displayMedications.filter(m => !m.asNeeded).length} scheduled
              </span>
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
