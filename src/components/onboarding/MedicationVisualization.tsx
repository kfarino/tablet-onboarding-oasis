
import React, { useState } from 'react';
import { Calendar, List, Grid, Sun, Clock, Pill, AlertCircle, Sunrise, Sunset, Moon, Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, startOfWeek, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface MedicationDose {
  id: string;
  days: string[];
  times: string[];
  quantity: number;
}

interface Medication {
  id: string;
  name: string;
  strength?: string;
  form?: string;
  doses: MedicationDose[];
  asNeeded?: { maxPerDay: number } | null;
}

interface MedicationVisualizationProps {
  medications: Medication[];
}

const MedicationVisualization: React.FC<MedicationVisualizationProps> = ({ medications }) => {
  const [currentDate] = useState(new Date());
  
  // Daily Timeline View
  const renderTimelineView = () => {
    // Group medications by time slots
    const timeSlots: Record<string, { meds: Medication[], doses: MedicationDose[] }> = {};
    
    // Get all unique time slots
    medications.forEach(medication => {
      medication.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() === "as needed") return;
          
          if (!timeSlots[time]) {
            timeSlots[time] = { meds: [], doses: [] };
          }
          
          if (!timeSlots[time].meds.includes(medication)) {
            timeSlots[time].meds.push(medication);
            timeSlots[time].doses.push(dose);
          }
        });
      });
    });
    
    // Sort time slots
    const sortedTimes = Object.keys(timeSlots).sort((a, b) => {
      const parseTime = (timeStr: string) => {
        const [time, meridiem] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      
      return parseTime(a) - parseTime(b);
    });
    
    // Helper for time of day icon
    const getTimeIcon = (time: string) => {
      const timeValue = time.toLowerCase();
      if (timeValue.includes('am') || timeValue.includes('morning')) return <Sunrise className="h-5 w-5 text-yellow-400" />;
      if (timeValue.includes('pm') && (timeValue.includes('12:') || parseInt(timeValue) < 5)) 
        return <Sun className="h-5 w-5 text-yellow-500" />;
      if (timeValue.includes('evening') || (timeValue.includes('pm') && parseInt(timeValue) >= 5)) 
        return <Sunset className="h-5 w-5 text-orange-400" />;
      return <Clock className="h-5 w-5 text-blue-400" />;
    };
    
    return (
      <div className="space-y-6 mt-4">
        {sortedTimes.map(time => (
          <div key={time} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
            <div className="bg-white/10 p-3 flex items-center gap-3">
              {getTimeIcon(time)}
              <span className="text-xl font-semibold text-white">{time}</span>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-1 gap-2">
                {timeSlots[time].meds.map((med, index) => (
                  <div key={`${med.id}-${index}`} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="h-10 w-10 rounded-full bg-highlight/20 flex items-center justify-center mr-3">
                      <Pill className="h-5 w-5 text-highlight" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-medium text-white">{med.name}</h3>
                        {med.strength && <span className="text-white/70">{med.strength}</span>}
                      </div>
                      {med.form && <p className="text-sm text-white/60">{med.form}</p>}
                    </div>
                    <div className="bg-white/10 h-8 min-w-8 w-8 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {timeSlots[time].doses[index].quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {/* As Needed Section */}
        <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
          <div className="bg-yellow-500/30 p-3 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span className="text-xl font-semibold text-white">As Needed</span>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-1 gap-2">
              {medications
                .filter(med => med.asNeeded || med.doses.some(d => d.times.includes('As needed')))
                .map(med => (
                  <div key={med.id} className="flex items-center p-3 bg-white/5 rounded-lg border border-yellow-500/30">
                    <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                      <Pill className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-medium text-white">{med.name}</h3>
                        {med.strength && <span className="text-white/70">{med.strength}</span>}
                      </div>
                      {med.form && <p className="text-sm text-white/60">{med.form}</p>}
                    </div>
                    {med.asNeeded && (
                      <div className="bg-yellow-500/20 rounded-lg px-2 py-1">
                        <span className="text-sm font-medium text-yellow-500">
                          Max {med.asNeeded.maxPerDay}/day
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              {!medications.some(med => med.asNeeded || med.doses.some(d => d.times.includes('As needed'))) && (
                <p className="text-white/50 text-base p-2">No as-needed medications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calendar Week View
  const renderCalendarView = () => {
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
    
    // Get all unique time slots and sort them
    const allTimes = new Set<string>();
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() !== "as needed") {
            allTimes.add(time);
          }
        });
      });
    });
    
    const sortedTimes = Array.from(allTimes).sort((a, b) => {
      const parseTime = (timeStr: string) => {
        const [time, meridiem] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      
      return parseTime(a) - parseTime(b);
    });
    
    return (
      <div className="mt-4 space-y-4">
        {/* Week header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((day) => (
            <div key={day.dayName} className="flex flex-col items-center">
              <div className="text-white/80 font-medium mb-1">{day.dayName}</div>
              <div className="bg-white/15 rounded-full h-8 w-8 flex items-center justify-center text-white font-medium">
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>
        
        {/* Time slots and medications */}
        {sortedTimes.map(time => {
          // Find medications for this time
          const medsForTime = medications.filter(med => 
            med.doses.some(dose => dose.times.includes(time))
          );
          
          return (
            <div key={time} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <div className="bg-white/10 p-2 px-3">
                <span className="text-lg font-medium text-highlight">{time}</span>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map(day => {
                  // Find medications that should be taken on this day at this time
                  const relevantMeds = medsForTime.filter(med => 
                    med.doses.some(dose => 
                      dose.times.includes(time) && 
                      (dose.days.includes('everyday') || dose.days.includes(day.fullDayName))
                    )
                  );
                  
                  return (
                    <div key={`${day.dayName}-${time}`} className="p-2 min-h-16 border-t border-white/5">
                      {relevantMeds.length > 0 ? (
                        <div className="space-y-2">
                          {relevantMeds.map(med => {
                            const dose = med.doses.find(d => 
                              d.times.includes(time) && 
                              (d.days.includes('everyday') || d.days.includes(day.fullDayName))
                            );
                            
                            return (
                              <div key={med.id} className="bg-white/10 p-2 rounded text-center">
                                <div className="text-sm font-medium text-white truncate" title={med.name}>
                                  {med.name.length > 10 ? `${med.name.substring(0, 9)}...` : med.name}
                                </div>
                                <div className="text-xs text-white/70 mt-1">{dose?.quantity || 1}x</div>
                              </div>
                            );
                          })}
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
            </div>
          );
        })}
      </div>
    );
  };

  // Medication Cards View
  const renderMedicationCardsView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {medications.map(med => {
          // Group doses by day
          const dosesByDay = med.doses.reduce<Record<string, {times: string[], quantity: number}>>(
            (acc, dose) => {
              dose.days.forEach(day => {
                if (!acc[day]) {
                  acc[day] = { times: [], quantity: dose.quantity };
                }
                acc[day].times.push(...dose.times);
              });
              return acc;
            }, {}
          );
          
          return (
            <div key={med.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <div className="bg-white/10 p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-highlight/20 flex items-center justify-center">
                  <Pill className="h-5 w-5 text-highlight" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{med.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {med.form && (
                      <Badge variant="secondary" className="bg-white/10 text-white/70 hover:bg-white/20">
                        {med.form}
                      </Badge>
                    )}
                    {med.strength && (
                      <Badge variant="secondary" className="bg-white/10 text-white/70 hover:bg-white/20">
                        {med.strength}
                      </Badge>
                    )}
                  </div>
                </div>
                {med.asNeeded && (
                  <Badge className="ml-auto bg-yellow-500/30 text-yellow-400 hover:bg-yellow-500/50">
                    As needed
                  </Badge>
                )}
              </div>
              
              <div className="p-3 divide-y divide-white/10">
                {Object.entries(dosesByDay).map(([day, info]) => (
                  <div key={`${med.id}-${day}`} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="h-4 w-4 text-white/70 mr-2" />
                      <span className="text-white font-medium">
                        {day === 'everyday' ? 'Every day' : day}
                      </span>
                    </div>
                    <div className="pl-6 space-y-2">
                      {info.times.map((time, idx) => (
                        <div key={`${med.id}-${day}-${time}-${idx}`} className="flex items-center">
                          <Clock className="h-4 w-4 text-white/70 mr-2" />
                          <span className="text-white">{time}</span>
                          <span className="ml-auto text-white/80">{info.quantity}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {med.asNeeded && (
                  <div className="py-3">
                    <div className="flex items-center text-yellow-400">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="font-medium">Maximum {med.asNeeded.maxPerDay} per day</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Time of Day View (Morning, Afternoon, Evening, Night)
  const renderTimeOfDayView = () => {
    // Define time of day sections
    const timeOfDaySections = [
      { id: 'morning', label: 'Morning', icon: <Sunrise className="h-6 w-6 text-yellow-400" /> },
      { id: 'afternoon', label: 'Afternoon', icon: <Sun className="h-6 w-6 text-yellow-500" /> },
      { id: 'evening', label: 'Evening', icon: <Sunset className="h-6 w-6 text-orange-400" /> },
      { id: 'night', label: 'Night', icon: <Moon className="h-6 w-6 text-blue-400" /> },
      { id: 'asNeeded', label: 'As Needed', icon: <AlertCircle className="h-6 w-6 text-yellow-500" /> }
    ];
    
    // Helper to determine time of day
    const getTimeOfDay = (time: string): string => {
      const lowerTime = time.toLowerCase();
      
      if (lowerTime === 'as needed') return 'asNeeded';
      
      if (lowerTime.includes('am') || lowerTime.includes('morning') || 
          (lowerTime.includes(':') && parseInt(lowerTime) < 12)) return 'morning';
      
      if ((lowerTime.includes('pm') && parseInt(lowerTime) <= 5) || 
          lowerTime.includes('afternoon')) return 'afternoon';
      
      if (lowerTime.includes('evening') || 
          (lowerTime.includes('pm') && parseInt(lowerTime) > 5 && parseInt(lowerTime) < 9)) return 'evening';
      
      if (lowerTime.includes('night') || lowerTime.includes('bedtime') || 
          (lowerTime.includes('pm') && parseInt(lowerTime) >= 9)) return 'night';
      
      return 'morning'; // Default
    };
    
    // Group medications by time of day
    const medsByTimeOfDay: Record<string, Medication[]> = {
      morning: [],
      afternoon: [],
      evening: [],
      night: [],
      asNeeded: []
    };
    
    medications.forEach(med => {
      if (med.asNeeded) {
        medsByTimeOfDay.asNeeded.push(med);
        return;
      }
      
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          const timeOfDay = getTimeOfDay(time);
          if (!medsByTimeOfDay[timeOfDay].includes(med)) {
            medsByTimeOfDay[timeOfDay].push(med);
          }
        });
      });
    });
    
    return (
      <div className="space-y-6 mt-4">
        {timeOfDaySections.map(section => {
          const sectionMeds = medsByTimeOfDay[section.id];
          if (section.id !== 'asNeeded' && sectionMeds.length === 0) return null;
          
          return (
            <div key={section.id} className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <div className={`p-3 flex items-center gap-3 ${
                section.id === 'asNeeded' ? 'bg-yellow-500/20' : 'bg-white/10'
              }`}>
                {section.icon}
                <span className="text-xl font-semibold text-white">{section.label}</span>
              </div>
              
              <div className="p-3">
                {sectionMeds.length > 0 ? (
                  <div className="grid gap-2">
                    {sectionMeds.map(med => {
                      // Find doses for this time of day
                      const relevantDoses = med.doses.filter(dose => 
                        dose.times.some(time => getTimeOfDay(time) === section.id)
                      );
                      
                      return (
                        <div key={med.id} className="flex items-center p-3 bg-white/10 rounded-lg">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-white">{med.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {med.strength && <span className="text-white/70 text-sm">{med.strength}</span>}
                              {med.form && <span className="text-white/70 text-sm">· {med.form}</span>}
                            </div>
                            
                            {section.id !== 'asNeeded' && relevantDoses.length > 0 && (
                              <div className="mt-2 border-t border-white/10 pt-2 grid gap-1">
                                {relevantDoses.map((dose, index) => {
                                  const timesForSection = dose.times.filter(
                                    time => getTimeOfDay(time) === section.id
                                  );
                                  
                                  return (
                                    <div key={index} className="flex items-center">
                                      <Clock className="h-4 w-4 text-white/60 mr-2" />
                                      <span className="text-white/80 text-sm">
                                        {timesForSection.join(', ')} - {dose.quantity} {med.form || 'pill'}
                                        {dose.quantity !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            
                            {section.id === 'asNeeded' && med.asNeeded && (
                              <div className="mt-2 text-yellow-400 text-sm">
                                Maximum {med.asNeeded.maxPerDay} per day
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-white/50 text-base p-2">No medications for this time</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-fade-in bg-white/5 rounded-lg p-6 h-full overflow-auto">
      <h3 className="text-2xl font-bold text-white mb-6">Medication Schedule</h3>
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="bg-white/15 mb-6 w-full grid grid-cols-4 p-1">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white/20 py-3">
            <Clock className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white/20 py-3">
            <Calendar className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="data-[state=active]:bg-white/20 py-3">
            <Pill className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Cards</span>
          </TabsTrigger>
          <TabsTrigger value="timeofday" className="data-[state=active]:bg-white/20 py-3">
            <Sun className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">Day Parts</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          {renderTimelineView()}
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          {renderCalendarView()}
        </TabsContent>
        
        <TabsContent value="cards" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          {renderMedicationCardsView()}
        </TabsContent>
        
        <TabsContent value="timeofday" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          {renderTimeOfDayView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationVisualization;
