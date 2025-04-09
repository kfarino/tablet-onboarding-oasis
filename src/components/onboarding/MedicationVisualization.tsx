import React, { useState } from 'react';
import { Calendar, List, LayoutGrid, Sun, Moon, Info, Clock, Calendar as CalendarIcon, Pill, AlertCircle, Sunrise, Sunset } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, startOfWeek, addDays } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
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

    const allTimes = new Set<string>();
    
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() === "as needed") return;
          allTimes.add(time);
        });
      });
    });
    
    const medicationsByTime: Record<string, { time: string, meds: { med: Medication, dose: MedicationDose }[] }> = {};
    
    Array.from(allTimes).forEach(time => {
      medicationsByTime[time] = { time, meds: [] };
    });
    
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() === "as needed") return;
          
          medicationsByTime[time].meds.push({ med, dose });
        });
      });
    });

    const sortedTimes = Object.values(medicationsByTime).sort((a, b) => {
      const parseTime = (timeStr: string) => {
        const [time, meridiem] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      
      return parseTime(a.time) - parseTime(b.time);
    });

    return (
      <div className="my-4">
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map((day) => (
            <div key={day.dayName} className="text-center">
              <div className="text-white/80 text-lg mb-1">{day.dayName}</div>
              <div className="bg-white/15 rounded-full h-10 w-10 flex items-center justify-center mx-auto text-white text-lg font-medium">{day.dayNumber}</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          {sortedTimes.map(({ time, meds }) => (
            <div key={time} className="bg-white/10 rounded-lg p-4">
              <div className="text-highlight text-xl font-bold mb-3">{time}</div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const relevantMeds = meds.filter(({ med, dose }) => {
                    return dose.days.includes('everyday') || 
                           dose.days.some(doseDay => 
                             doseDay.toLowerCase() === day.fullDayName.toLowerCase()
                           );
                  });
                  
                  return (
                    <div key={`${time}-${day.dayName}`} className="min-h-[80px] border border-white/15 rounded p-2 hover:bg-white/5">
                      {relevantMeds.length > 0 ? (
                        <div className="text-white space-y-2">
                          {relevantMeds.map(({ med, dose }) => (
                            <div key={`${time}-${day.dayName}-${med.id}`} className="bg-white/15 p-2 rounded">
                              <div className="font-medium text-base">{med.name} {med.strength}</div>
                              {med.form && <div className="text-white/60 text-xs mb-1">{med.form}</div>}
                              <div className="text-white/80">{dose.quantity}x</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-white/40 text-base flex items-center justify-center h-full">None</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white/10 rounded-lg p-4">
          <div className="text-yellow-400 text-xl font-bold mb-3">As Needed</div>
          <div className="space-y-3">
            {medications
              .filter(med => 
                med.asNeeded || 
                med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
              )
              .map(med => (
                <div key={med.id} className="bg-white/15 p-3 rounded">
                  <div className="font-medium text-lg">{med.name} {med.strength}</div>
                  {med.form && <div className="text-white/60 text-sm">{med.form}</div>}
                  {med.asNeeded && (
                    <div className="text-base text-white/80 mt-1">Max {med.asNeeded.maxPerDay}x daily</div>
                  )}
                </div>
              ))}
            {!medications.some(med => 
              med.asNeeded || 
              med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
            ) && (
              <div className="text-white/40 text-lg p-2">No as-needed medications</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTimelineView = () => {
    const timeSlots: Record<string, Medication[]> = {};
    
    medications.forEach(medication => {
      medication.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() === "as needed") return;
          
          if (!timeSlots[time]) {
            timeSlots[time] = [];
          }
          
          if (!timeSlots[time].includes(medication)) {
            timeSlots[time].push(medication);
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
    
    return (
      <div className="space-y-4 my-4">
        {sortedTimes.map(time => (
          <div key={time} className="bg-white/5 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-highlight text-charcoal font-bold rounded-full h-10 w-10 flex items-center justify-center">
                {time.split(':')[0]}
              </div>
              <div>
                <div className="text-white font-medium">{time}</div>
                <div className="text-white/70 text-sm">{timeSlots[time].length} medication{timeSlots[time].length !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div className="space-y-2 ml-12">
              {timeSlots[time].map(med => {
                const dose = med.doses.find(d => d.times.includes(time));
                return (
                  <div key={med.id} className="bg-white/10 p-2 rounded flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold">{dose?.quantity || 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{med.name} {med.strength}</div>
                      {med.form && <div className="text-white/60 text-xs">{med.form}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-yellow-500 font-medium mb-3">As Needed</div>
          <div className="space-y-2">
            {medications
              .filter(med => 
                med.asNeeded || 
                med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
              )
              .map(med => (
                <div key={med.id} className="bg-white/10 p-2 rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{med.name} {med.strength}</div>
                    {med.form && <div className="text-white/60 text-xs">{med.form}</div>}
                  </div>
                  {med.asNeeded && (
                    <div className="text-sm bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                      Max {med.asNeeded.maxPerDay}/day
                    </div>
                  )}
                </div>
              ))}
            {!medications.some(med => 
              med.asNeeded || 
              med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
            ) && (
              <div className="text-white/30 text-sm">No as-needed medications</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderInteractiveDayPartsView = () => {
    const dayParts = ["Morning", "Afternoon", "Evening", "Bedtime"];
    
    // Helper function to map time periods to day parts
    const getDayPartFromTime = (time: string): string => {
      const lowerTime = time.toLowerCase();
      if (lowerTime.includes('am') || lowerTime.includes('morning')) return 'Morning';
      if (lowerTime.includes('afternoon') || (lowerTime.includes('pm') && parseInt(lowerTime) < 6)) return 'Afternoon';
      if (lowerTime.includes('evening') || (lowerTime.includes('pm') && parseInt(lowerTime) >= 6)) return 'Evening';
      if (lowerTime.includes('bedtime') || lowerTime.includes('night')) return 'Bedtime';
      return 'Morning'; // Default fallback
    };
    
    // Group medications by day part
    const medsByDayPart: Record<string, Medication[]> = {
      'Morning': [],
      'Afternoon': [],
      'Evening': [],
      'Bedtime': []
    };
    
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() === "as needed") return;
          const dayPart = getDayPartFromTime(time);
          if (!medsByDayPart[dayPart].includes(med)) {
            medsByDayPart[dayPart].push(med);
          }
        });
      });
    });
    
    return (
      <div className="space-y-6">
        {dayParts.map((dayPart) => (
          <div key={dayPart} className="bg-white/15 rounded-lg p-4">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              {dayPart === "Morning" && <Sunrise className="h-6 w-6 mr-2 text-yellow-400" />}
              {dayPart === "Afternoon" && <Sun className="h-6 w-6 mr-2 text-yellow-400" />}
              {dayPart === "Evening" && <Sunset className="h-6 w-6 mr-2 text-orange-400" />}
              {dayPart === "Bedtime" && <Moon className="h-6 w-6 mr-2 text-blue-400" />}
              {dayPart}
            </h4>
            
            <div className="space-y-3">
              {medsByDayPart[dayPart].length > 0 ? (
                medsByDayPart[dayPart].map(med => {
                  // Find the dose that corresponds to this day part
                  const relevantDoses = med.doses.filter(dose => 
                    dose.times.some(time => getDayPartFromTime(time) === dayPart)
                  );
                  
                  return (
                    <div key={med.id} className="bg-white/15 rounded p-3 flex items-center">
                      <Pill className="h-6 w-6 mr-3 text-blue-400" />
                      <div>
                        <div className="text-xl font-medium text-white">{med.name} {med.strength}</div>
                        {med.form && <div className="text-white/60 text-sm">{med.form}</div>}
                        <div className="text-lg text-white/80">
                          {relevantDoses.map(dose => `${dose.quantity}x`).join(', ')}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-lg text-white/40 p-2">No medications for this time</div>
              )}
            </div>
          </div>
        ))}
        
        <div className="bg-white/15 rounded-lg p-4 mt-6">
          <h4 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
            <Clock className="h-6 w-6 mr-2" />
            As Needed
          </h4>
          
          <div className="space-y-3">
            {medications.filter(med => 
              med.asNeeded || 
              med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
            ).length > 0 ? (
              medications
                .filter(med => 
                  med.asNeeded || 
                  med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
                )
                .map(med => (
                  <div key={med.id} className="bg-white/15 rounded p-3 flex items-center">
                    <Pill className="h-6 w-6 mr-3 text-blue-400" />
                    <div>
                      <div className="text-xl font-medium text-white">{med.name} {med.strength}</div>
                      {med.form && <div className="text-white/60 text-sm">{med.form}</div>}
                      {med.asNeeded && (
                        <div className="text-lg text-white/80 mt-1">
                          Max per day: {med.asNeeded.maxPerDay || "As directed"}
                        </div>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-lg text-white/40 p-2">No as-needed medications</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    const allDays = new Set<string>();
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.days.forEach(day => {
          allDays.add(day);
        });
      });
    });
    
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'everyday'];
    const sortedDays = Array.from(allDays).sort((a, b) => {
      if (a === 'everyday') return 1;
      if (b === 'everyday') return -1;
      return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });

    return (
      <div className="my-4 rounded-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-white/15">
            <TableRow>
              <TableHead className="text-white text-xl py-5">Medication</TableHead>
              <TableHead className="text-white text-xl">Form/Strength</TableHead>
              <TableHead className="text-white text-xl">Schedule</TableHead>
              <TableHead className="text-white text-xl">Dosage</TableHead>
              <TableHead className="text-white text-xl">Special</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map(med => (
              <TableRow key={med.id} className="border-b border-white/10 hover:bg-white/5">
                <TableCell className="text-white font-medium text-xl py-4">{med.name}</TableCell>
                <TableCell className="text-white/80 text-lg">
                  {med.form}{med.strength ? `, ${med.strength}` : ''}
                </TableCell>
                <TableCell>
                  {med.doses.map(dose => (
                    <div key={dose.id} className="mb-3 last:mb-0">
                      <div className="text-white font-medium text-xl">
                        {dose.days.includes('everyday') ? 'Daily' : dose.days.map(d => d.substring(0, 3)).join(', ')}
                      </div>
                      <div className="text-highlight font-medium text-lg mt-1">
                        {dose.times.join(', ')}
                      </div>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {med.doses.map(dose => (
                    <div key={dose.id} className="text-white text-xl mb-2 last:mb-0">
                      {dose.quantity} {med.form || 'pill'}{dose.quantity !== 1 ? 's' : ''}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {med.asNeeded ? (
                    <div className="bg-yellow-500/20 text-yellow-400 px-3 py-2 rounded text-lg font-medium">
                      As needed (max {med.asNeeded.maxPerDay}/day)
                    </div>
                  ) : (
                    <span className="text-white/40 text-xl">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const getTimeGroup = (timeStr: string): "morning" | "day" | "night" => {
    const [time, meridiem] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    
    if (hours < 12) return "morning";
    if (hours < 17) return "day";
    return "night";
  };

  const compareTimeStrings = (a: string, b: string): number => {
    const parseTime = (timeStr: string) => {
      const [time, meridiem] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (meridiem === 'PM' && hours !== 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    
    return parseTime(a) - parseTime(b);
  };

  const formatDays = (days: string[]): string => {
    if (days.includes('everyday')) return 'Every day';
    return days.map(day => day.substring(0, 3)).join(', ');
  };

  const formatFrequency = (days: string[]): string => {
    if (days.includes('everyday')) return 'Daily';
    if (days.length >= 5) return `${days.length} days/week`;
    return days.map(day => day.substring(0, 1)).join('');
  };

  return (
    <div className="animate-fade-in bg-white/5 rounded-lg p-6 h-full overflow-auto">
      <h3 className="text-2xl font-bold text-white mb-6">Medication Schedule</h3>
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="bg-white/15 mb-6 w-full grid grid-cols-2 p-1">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white/20 py-3 text-lg">
            <Calendar className="h-5 w-5 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="days" className="data-[state=active]:bg-white/20 py-3 text-lg">
            <Sun className="h-5 w-5 mr-2" />
            Days
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-0">
          {renderCalendarView()}
        </TabsContent>
        
        <TabsContent value="days" className="mt-0">
          {renderInteractiveDayPartsView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationVisualization;
