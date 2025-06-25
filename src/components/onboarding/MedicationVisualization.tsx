import React, { useState } from 'react';
import { Calendar, List, Grid, Sun, Clock, Pill, AlertCircle, Sunrise, Sunset, Moon, Calendar as CalendarIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, startOfWeek, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  const renderTimelineView = () => {
    const timeSlots: Record<string, { meds: Medication[], doses: MedicationDose[] }> = {};
    
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
      <div className="space-y-4">
        {sortedTimes.map(time => (
          <Card key={time} className="overflow-hidden border-white/10 bg-white/5">
            <div className="bg-white/10 p-4 flex items-center gap-3">
              {getTimeIcon(time)}
              <span className="text-xl font-semibold text-white">{time}</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                {timeSlots[time].meds.map((med, index) => (
                  <div 
                    key={`${med.id}-${index}`} 
                    className="flex items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-full bg-highlight/20 flex items-center justify-center mr-4">
                      <Pill className="h-6 w-6 text-highlight" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-medium text-white">{med.name}</h3>
                        {med.strength && <span className="text-white/70">{med.strength}</span>}
                      </div>
                      {med.form && <p className="text-sm text-white/60 mt-1">{med.form}</p>}
                    </div>
                    <div className="bg-white/10 h-10 min-w-10 w-10 rounded-full flex items-center justify-center">
                      <span className="text-base font-bold text-white">
                        {timeSlots[time].doses[index].quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}

        <Card className="border-white/10 bg-white/5 overflow-hidden">
          <div className="bg-yellow-500/20 p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <span className="text-xl font-semibold text-white">As Needed</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-3">
              {medications
                .filter(med => med.asNeeded || med.doses.some(d => d.times.includes('As needed')))
                .map(med => (
                  <div 
                    key={med.id} 
                    className="flex items-center p-4 bg-white/5 rounded-lg border border-yellow-500/30 hover:bg-white/10 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center mr-4">
                      <Pill className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-medium text-white">{med.name}</h3>
                        {med.strength && <span className="text-white/70">{med.strength}</span>}
                      </div>
                      {med.form && <p className="text-sm text-white/60 mt-1">{med.form}</p>}
                    </div>
                    {med.asNeeded && (
                      <div className="bg-yellow-500/20 rounded-lg px-3 py-2">
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
        </Card>
      </div>
    );
  };

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
    
    // Create a flattened array of all medication doses
    const allDoses: Array<{
      medId: string,
      doseId: string,
      medName: string,
      strength?: string,
      form?: string,
      time: string,
      days: string[],
      quantity: number
    }> = [];
    
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() !== "as needed") {
            allDoses.push({
              medId: med.id,
              doseId: dose.id,
              medName: med.name,
              strength: med.strength,
              form: med.form,
              time,
              days: dose.days,
              quantity: dose.quantity
            });
          }
        });
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
      <div className="h-full max-h-[60vh]">
        {/* Compact week header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
          {weekDays.map((day) => (
            <div key={day.dayName} className="flex flex-col items-center">
              <div className="text-white/60 text-xs font-medium mb-1">{day.dayName}</div>
              <div className="bg-white/15 rounded-full h-6 w-6 flex items-center justify-center text-white text-sm font-medium">
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>
        
        <ScrollArea className="h-full">
          <div className="space-y-2 pr-2">
            {/* Everyday doses - shown as one row spanning the entire week */}
            {sortedTimes.map(time => {
              const everydayDoses = dosesByTime[time].filter(dose => 
                dose.days.includes('everyday')
              );
              
              if (everydayDoses.length === 0) return null;
              
              return (
                <Card key={`everyday-${time}`} className="overflow-hidden border-white/10 bg-white/5">
                  <div className="bg-white/10 p-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-highlight" />
                    <span className="text-sm font-medium text-white">{time}</span>
                    <Badge variant="outline" className="ml-auto bg-white/5 text-white/70 text-xs py-0">Everyday</Badge>
                  </div>
                  <div className="p-2 space-y-1">
                    {everydayDoses.map(dose => (
                      <div key={`${dose.medId}-${dose.doseId}`} className="flex items-center bg-white/5 p-2 rounded text-xs">
                        <div className="h-6 w-6 rounded-full bg-highlight/20 flex items-center justify-center mr-2">
                          <Pill className="h-3 w-3 text-highlight" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1">
                            <span className="font-medium text-white truncate">{dose.medName}</span>
                            {dose.strength && <span className="text-white/70">{dose.strength}</span>}
                          </div>
                        </div>
                        <div className="ml-2 px-2 py-1 bg-white/10 rounded text-xs font-medium text-white">
                          {dose.quantity}x
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
            
            {/* Specific day doses */}
            {sortedTimes.map(time => {
              const specificDayDoses = dosesByTime[time].filter(dose => 
                !dose.days.includes('everyday') && dose.days.length > 0
              );
              
              if (specificDayDoses.length === 0) return null;
              
              return (
                <Card key={`specific-${time}`} className="overflow-hidden border-white/10 bg-white/5">
                  <div className="bg-white/10 p-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-highlight" />
                    <span className="text-sm font-medium text-white">{time}</span>
                    <Badge variant="outline" className="ml-auto bg-white/5 text-white/70 text-xs py-0">Specific Days</Badge>
                  </div>
                  <div className="grid grid-cols-7 gap-1 p-1">
                    {weekDays.map(day => {
                      const dosesForDay = specificDayDoses.filter(dose => 
                        dose.days.includes(day.fullDayName)
                      );
                      
                      return (
                        <div key={`${day.dayName}-${time}`} className="p-1 min-h-12 border border-white/5 rounded">
                          {dosesForDay.length > 0 ? (
                            <div className="space-y-1">
                              {dosesForDay.map(dose => (
                                <div key={`${dose.medId}-${day.dayName}`} className="bg-white/10 p-1 rounded text-center">
                                  <div className="text-xs font-medium text-white truncate" title={dose.medName}>
                                    {dose.medName.length > 8 ? dose.medName.substring(0, 8) + '...' : dose.medName}
                                  </div>
                                  <div className="text-xs text-white/70">{dose.quantity}x</div>
                                </div>
                              ))}
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
                </Card>
              );
            })}

            {/* As Needed Medications - Compact */}
            {medications.some(med => med.asNeeded) && (
              <Card className="overflow-hidden border-white/10 bg-white/5">
                <div className="bg-yellow-500/20 p-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-white">As Needed</span>
                </div>
                <div className="p-2 space-y-1">
                  {medications
                    .filter(med => med.asNeeded)
                    .map(med => (
                      <div key={med.id} className="flex items-center bg-white/5 p-2 rounded border-l-2 border-yellow-500/30">
                        <div className="h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center mr-2">
                          <Pill className="h-3 w-3 text-yellow-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm font-medium text-white truncate">{med.name}</span>
                            {med.strength && <span className="text-xs text-white/70">{med.strength}</span>}
                          </div>
                        </div>
                        {med.asNeeded && (
                          <div className="ml-2 text-xs text-yellow-400 font-medium">
                            Max {med.asNeeded.maxPerDay}/day
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderMedicationCardsView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {medications.map(med => {
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
            <Card key={med.id} className="overflow-hidden border-white/10 bg-white/5">
              <div className="bg-white/10 p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-highlight/20 flex items-center justify-center">
                  <Pill className="h-5 w-5 text-highlight" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{med.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {med.form && (
                      <Badge variant="outline" className="bg-white/10 text-white/70 hover:bg-white/20">
                        {med.form}
                      </Badge>
                    )}
                    {med.strength && (
                      <Badge variant="outline" className="bg-white/10 text-white/70 hover:bg-white/20">
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
                      <span className="text-white font-medium capitalize">
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
            </Card>
          );
        })}
      </div>
    );
  };

  const renderTimeOfDayView = () => {
    const timeOfDaySections = [
      { id: 'morning', label: 'Morning', icon: <Sunrise className="h-6 w-6 text-yellow-400" /> },
      { id: 'afternoon', label: 'Afternoon', icon: <Sun className="h-6 w-6 text-yellow-500" /> },
      { id: 'evening', label: 'Evening', icon: <Sunset className="h-6 w-6 text-orange-400" /> },
      { id: 'night', label: 'Night', icon: <Moon className="h-6 w-6 text-blue-400" /> },
      { id: 'asNeeded', label: 'As Needed', icon: <AlertCircle className="h-6 w-6 text-yellow-500" /> }
    ];
    
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
      
      return 'morning';
    };
    
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
      <div className="space-y-4 mt-4">
        {timeOfDaySections.map(section => {
          const sectionMeds = medsByTimeOfDay[section.id];
          if (section.id !== 'asNeeded' && sectionMeds.length === 0) return null;
          
          return (
            <Card key={section.id} className="overflow-hidden border-white/10 bg-white/5">
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
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-fade-in bg-white/5 rounded-lg p-4 h-full overflow-hidden flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Medication Schedule</h3>
      <Tabs defaultValue="timeline" className="w-full flex-1 flex flex-col min-h-0">
        <TabsList className="bg-white/10 mb-4 w-full grid grid-cols-4 p-1 rounded-lg flex-shrink-0">
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white/15 py-2 rounded-md">
            <Clock className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2 text-sm">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white/15 py-2 rounded-md">
            <Calendar className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2 text-sm">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="data-[state=active]:bg-white/15 py-2 rounded-md">
            <Pill className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2 text-sm">Cards</span>
          </TabsTrigger>
          <TabsTrigger value="timeofday" className="data-[state=active]:bg-white/15 py-2 rounded-md">
            <Sun className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2 text-sm">Day Parts</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-0 focus-visible:outline-none focus-visible:ring-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            {renderTimelineView()}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0 focus-visible:outline-none focus-visible:ring-0 flex-1 min-h-0">
          {renderCalendarView()}
        </TabsContent>
        
        <TabsContent value="cards" className="mt-0 focus-visible:outline-none focus-visible:ring-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            {renderMedicationCardsView()}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="timeofday" className="mt-0 focus-visible:outline-none focus-visible:ring-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            {renderTimeOfDayView()}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationVisualization;
