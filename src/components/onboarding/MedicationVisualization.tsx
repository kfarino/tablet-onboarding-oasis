
import React, { useState } from 'react';
import { Calendar, List, LayoutGrid, Sun, Moon, Info, Clock, Calendar as CalendarIcon, Pill, AlertCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, startOfWeek, addDays } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

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
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day) => (
            <div key={day.dayName} className="text-center">
              <div className="text-white/70 text-sm">{day.dayName}</div>
              <div className="bg-white/10 rounded-full h-8 w-8 flex items-center justify-center mx-auto mt-1 text-white">{day.dayNumber}</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          {sortedTimes.map(({ time, meds }) => (
            <div key={time} className="bg-white/5 rounded-lg p-3">
              <div className="text-highlight font-medium mb-2">{time}</div>
              <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day) => {
                  const relevantMeds = meds.filter(({ med, dose }) => {
                    return dose.days.includes('everyday') || 
                           dose.days.some(doseDay => 
                             doseDay.toLowerCase() === day.fullDayName.toLowerCase()
                           );
                  });
                  
                  return (
                    <div key={`${time}-${day.dayName}`} className="min-h-[60px] border border-white/10 rounded p-1">
                      {relevantMeds.length > 0 ? (
                        <div className="text-xs text-white space-y-1">
                          {relevantMeds.map(({ med, dose }) => (
                            <div key={`${time}-${day.dayName}-${med.id}`} className="bg-white/10 p-1 rounded">
                              <div className="font-medium truncate">{med.name}</div>
                              <div>{dose.quantity} {med.form || 'pill'}{dose.quantity !== 1 ? 's' : ''}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-white/30 text-xs flex items-center justify-center h-full">None</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-white/5 rounded-lg p-3">
          <div className="text-yellow-500 font-medium mb-2">As Needed</div>
          <div className="space-y-2">
            {medications
              .filter(med => 
                med.asNeeded || 
                med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
              )
              .map(med => (
                <div key={med.id} className="bg-white/10 p-2 rounded">
                  <div className="font-medium">{med.name} {med.strength}</div>
                  {med.asNeeded && (
                    <div className="text-sm text-white/70">Max {med.asNeeded.maxPerDay} per day</div>
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
                      <div className="text-xs text-white/70">{med.form || 'tablet'}</div>
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
                    <div className="text-xs text-white/70">{med.form || 'tablet'}</div>
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

  const renderSimpleTimelineView = () => {
    const timeGroups = {
      morning: { 
        label: "Morning", 
        icon: <Sun className="h-5 w-5 text-yellow-400" />, 
        meds: [] as { med: Medication, dose: MedicationDose, time: string }[] 
      },
      day: { 
        label: "Day", 
        icon: <Sun className="h-5 w-5 text-orange-400" />, 
        meds: [] as { med: Medication, dose: MedicationDose, time: string }[] 
      },
      night: { 
        label: "Night", 
        icon: <Moon className="h-5 w-5 text-blue-400" />, 
        meds: [] as { med: Medication, dose: MedicationDose, time: string }[] 
      }
    };
    
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() === "as needed") return;
          
          const timeGroup = getTimeGroup(time);
          timeGroups[timeGroup].meds.push({ med, dose, time });
        });
      });
    });
    
    Object.values(timeGroups).forEach(group => {
      group.meds.sort((a, b) => {
        return compareTimeStrings(a.time, b.time);
      });
    });
    
    const groupMedsByTime = (meds: { med: Medication, dose: MedicationDose, time: string }[]) => {
      const timeMap: Record<string, { med: Medication, dose: MedicationDose, time: string }[]> = {};
      
      meds.forEach(item => {
        if (!timeMap[item.time]) {
          timeMap[item.time] = [];
        }
        timeMap[item.time].push(item);
      });
      
      return Object.entries(timeMap).sort((a, b) => compareTimeStrings(a[0], b[0]));
    };
    
    const renderMedicationCard = (time: string, meds: { med: Medication, dose: MedicationDose, time: string }[]) => {
      return (
        <Card key={time} className="bg-white/10 hover:bg-white/15 transition-colors">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="bg-white/20 text-white px-2 py-1 rounded text-sm font-medium">
                {time}
              </div>
              <div className="text-white/70 text-sm">
                {meds.length} medication{meds.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="space-y-1.5">
              {meds.map((item, index) => {
                return (
                  <HoverCard key={`${item.med.id}-${index}`}>
                    <HoverCardTrigger asChild>
                      <div className="bg-white/10 p-2 rounded-md flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors">
                        <div className="text-white font-medium truncate">
                          {item.med.name}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="text-white/70 text-xs">
                            {formatDays(item.dose.days)}
                          </div>
                          <Info className="h-4 w-4 text-white/60" />
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 border-white/30">
                      <div className="space-y-3">
                        <h4 className="text-lg font-medium text-white">{item.med.name} {item.med.strength}</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-white/70" />
                            <span className="text-white/70 text-sm">Form:</span>
                          </div>
                          <div className="text-white text-sm font-medium">{item.med.form || 'Unknown'}</div>
                          
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-white/70" />
                            <span className="text-white/70 text-sm">Dosage:</span>
                          </div>
                          <div className="text-white text-sm font-medium">
                            {item.dose.quantity} {item.med.form || 'pill'}{item.dose.quantity !== 1 ? 's' : ''}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-white/70" />
                            <span className="text-white/70 text-sm">Time:</span>
                          </div>
                          <div className="text-white text-sm font-medium">{item.time}</div>
                          
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-white/70" />
                            <span className="text-white/70 text-sm">Days:</span>
                          </div>
                          <div className="text-white text-sm font-medium">{formatDays(item.dose.days)}</div>
                          
                          {item.med.asNeeded && (
                            <>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                <span className="text-yellow-500 text-sm">As needed:</span>
                              </div>
                              <div className="text-white text-sm font-medium">Max {item.med.asNeeded.maxPerDay} per day</div>
                            </>
                          )}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full mt-2 py-1 text-xs text-white/70 bg-white/5 rounded hover:bg-white/10 transition-colors">
                  View all medications
                </button>
              </DialogTrigger>
              <DialogContent className="text-white border-white/30 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl">{time} Medications</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  {meds.map((item, index) => (
                    <div key={`dialog-${item.med.id}-${index}`} className="bg-white/10 p-4 rounded-lg">
                      <h4 className="text-lg font-medium text-white flex items-center gap-2 mb-3">
                        <Pill className="h-5 w-5 text-highlight" />
                        {item.med.name} {item.med.strength}
                      </h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 h-6 w-6 rounded-full flex items-center justify-center">
                            <Pill className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-white/70">Form:</span>
                        </div>
                        <div className="text-white text-md font-medium">{item.med.form || 'Unknown'}</div>
                        
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 h-6 w-6 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">{item.dose.quantity}</span>
                          </div>
                          <span className="text-white/70">Dosage:</span>
                        </div>
                        <div className="text-white text-md font-medium">
                          {item.dose.quantity} {item.med.form || 'pill'}{item.dose.quantity !== 1 ? 's' : ''}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 h-6 w-6 rounded-full flex items-center justify-center">
                            <Clock className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-white/70">Time:</span>
                        </div>
                        <div className="text-white text-md font-medium">{item.time}</div>
                        
                        <div className="flex items-center gap-2">
                          <div className="bg-white/20 h-6 w-6 rounded-full flex items-center justify-center">
                            <CalendarIcon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-white/70">Days:</span>
                        </div>
                        <div className="text-white text-md font-medium">{formatDays(item.dose.days)}</div>
                        
                        {item.med.asNeeded && (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="bg-yellow-500/30 h-6 w-6 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-3 w-3 text-yellow-500" />
                              </div>
                              <span className="text-yellow-500">As needed:</span>
                            </div>
                            <div className="text-white text-md font-medium">Max {item.med.asNeeded.maxPerDay} per day</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      );
    };
    
    return (
      <div className="space-y-4 my-4">
        {Object.entries(timeGroups).map(([key, group]) => (
          <div key={key} className="bg-white/5 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              {group.icon}
              <div className="text-lg font-medium text-white">{group.label}</div>
              <div className="text-white/70 text-sm">
                {group.meds.length} dose{group.meds.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {group.meds.length > 0 ? (
              <div className="space-y-3 ml-8">
                {groupMedsByTime(group.meds).map(([time, medsAtTime]) => (
                  renderMedicationCard(time, medsAtTime)
                ))}
              </div>
            ) : (
              <div className="text-white/30 text-sm ml-8">No medications scheduled</div>
            )}
          </div>
        ))}
        
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-yellow-500 font-medium mb-3">As Needed</div>
          <div className="space-y-2 ml-8">
            {medications
              .filter(med => 
                med.asNeeded || 
                med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
              )
              .map(med => (
                <Popover key={med.id}>
                  <PopoverTrigger asChild>
                    <div className="bg-white/10 p-2 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors">
                      <div className="font-medium text-white">{med.name}</div>
                      {med.asNeeded && (
                        <div className="text-yellow-500 text-xs px-1.5 py-0.5 bg-yellow-500/20 rounded">
                          Max {med.asNeeded.maxPerDay}/day
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-3">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold text-white">{med.name}</h4>
                      {med.strength && (
                        <div className="bg-white/10 px-2 py-1 rounded text-xs inline-block text-white/90">
                          {med.strength}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center mt-2 text-sm">
                        <Pill className="h-4 w-4 text-white/70" />
                        <div className="text-white">{med.form || 'Unknown'}</div>
                        
                        {med.asNeeded && (
                          <>
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <div className="text-yellow-500">Max {med.asNeeded.maxPerDay} per day</div>
                          </>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
    const timeGroups = {
      morning: { 
        label: "Morning", 
        icon: <Sun className="h-5 w-5 text-yellow-400" />, 
        meds: [] as { med: Medication, dose: MedicationDose, time: string }[] 
      },
      day: { 
        label: "Day", 
        icon: <Sun className="h-5 w-5 text-orange-400" />, 
        meds: [] as { med: Medication, dose: MedicationDose, time: string }[] 
      },
      night: { 
        label: "Night", 
        icon: <Moon className="h-5 w-5 text-blue-400" />, 
        meds: [] as { med: Medication, dose: MedicationDose, time: string }[] 
      }
    };
    
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() === "as needed") return;
          
          const timeGroup = getTimeGroup(time);
          timeGroups[timeGroup].meds.push({ med, dose, time });
        });
      });
    });
    
    Object.values(timeGroups).forEach(group => {
      group.meds.sort((a, b) => {
        return compareTimeStrings(a.time, b.time);
      });
    });
    
    const groupMedsByTime = (meds: { med: Medication, dose: MedicationDose, time: string }[]) => {
      const timeMap: Record<string, { med: Medication, dose: MedicationDose, time: string }[]> = {};
      
      meds.forEach(item => {
        if (!timeMap[item.time]) {
          timeMap[item.time] = [];
        }
        timeMap[item.time].push(item);
      });
      
      return Object.entries(timeMap).sort((a, b) => compareTimeStrings(a[0], b[0]));
    };
    
    const renderMedicationTimeCard = (time: string, meds: { med: Medication, dose: MedicationDose, time: string }[]) => {
      return (
        <Card key={time} className="bg-white/10 hover:bg-white/15 transition-colors">
          <CardContent className="p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-highlight rounded-md px-2 py-1 text-charcoal font-medium text-sm">
                  {time}
                </div>
                <div className="text-white/90 text-sm font-medium">
                  {meds.length} {meds.length === 1 ? 'medication' : 'medications'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {meds.map((item, index) => (
                <Popover key={`${item.med.id}-${index}`}>
                  <PopoverTrigger asChild>
                    <div className="bg-white/10 px-2 py-1.5 rounded-md flex flex-col cursor-pointer hover:bg-white/20 transition-colors">
                      <div className="text-white font-medium truncate text-sm">
                        {item.med.name}
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <span>{formatFrequency(item.dose.days)}</span>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-highlight" />
                        <h4 className="text-base font-semibold">{item.med.name}</h4>
                      </div>
                      
                      {item.med.strength && (
                        <div className="bg-white/10 px-2 py-1 rounded text-xs inline-block text-white/90">
                          {item.med.strength}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center mt-2 text-sm">
                        <Clock className="h-4 w-4 text-white/70" />
                        <div className="text-white">{item.time}</div>
                        
                        <CalendarIcon className="h-4 w-4 text-white/70" />
                        <div className="text-white">{formatDays(item.dose.days)}</div>
                        
                        <Pill className="h-4 w-4 text-white/70" />
                        <div className="text-white">
                          {item.dose.quantity} {item.med.form || 'dose'}{item.dose.quantity !== 1 ? 's' : ''}
                        </div>
                        
                        {item.med.asNeeded && (
                          <>
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <div className="text-yellow-500">Max {item.med.asNeeded.maxPerDay}/day</div>
                          </>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full mt-2 py-1 text-xs text-white/70 bg-white/5 rounded hover:bg-white/10 transition-colors">
                  View all {meds.length} medications
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{time} Medications</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-3">
                  {meds.map((item, index) => (
                    <div key={`dialog-${item.med.id}-${index}`} className="bg-white/10 p-3 rounded-lg">
                      <h4 className="text-lg font-medium flex items-center gap-2 mb-2">
                        <Pill className="h-5 w-5 text-highlight" />
                        {item.med.name} {item.med.strength}
                      </h4>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-2 mt-3">
                        <div className="text-white/70 text-sm">Form:</div>
                        <div className="text-white text-sm font-medium">{item.med.form || 'Unknown'}</div>
                        
                        <div className="text-white/70 text-sm">Quantity:</div>
                        <div className="text-white text-sm font-medium">
                          {item.dose.quantity} {item.med.form || 'pill'}{item.dose.quantity !== 1 ? 's' : ''}
                        </div>
                        
                        <div className="text-white/70 text-sm">Time:</div>
                        <div className="text-white text-sm font-medium">{item.time}</div>
                        
                        <div className="text-white/70 text-sm">Days:</div>
                        <div className="text-white text-sm font-medium">{formatDays(item.dose.days)}</div>
                        
                        {item.med.asNeeded && (
                          <>
                            <div className="text-yellow-500 text-sm">As needed:</div>
                            <div className="text-white text-sm font-medium">Max {item.med.asNeeded.maxPerDay} per day</div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      );
    };
    
    return (
      <div className="space-y-4 my-4">
        {Object.entries(timeGroups).map(([key, group]) => (
          <div key={key} className="bg-white/5 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              {group.icon}
              <div className="text-lg font-medium text-white">{group.label}</div>
              <div className="text-white/70 text-sm">
                {group.meds.length} dose{group.meds.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {group.meds.length > 0 ? (
              <div className="space-y-3 ml-8">
                {groupMedsByTime(group.meds).map(([time, medsAtTime]) => (
                  renderMedicationTimeCard(time, medsAtTime)
                ))}
              </div>
            ) : (
              <div className="text-white/30 text-sm ml-8">No medications scheduled</div>
            )}
          </div>
        ))}
        
        <div className="bg-white/5 p-3 rounded-lg">
          <div className="text-yellow-500 font-medium mb-3">As Needed</div>
          <div className="space-y-2 ml-8">
            {medications
              .filter(med => 
                med.asNeeded || 
                med.doses.some(dose => dose.times.some(time => time.toLowerCase() === "as needed"))
              )
              .map(med => (
                <Popover key={med.id}>
                  <PopoverTrigger asChild>
                    <div className="bg-white/10 p-2 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors">
                      <div className="font-medium text-white">{med.name}</div>
                      {med.asNeeded && (
                        <div className="text-yellow-500 text-xs px-1.5 py-0.5 bg-yellow-500/20 rounded">
                          Max {med.asNeeded.maxPerDay}/day
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold text-white">{med.name}</h4>
                      {med.strength && (
                        <div className="bg-white/10 px-2 py-1 rounded text-xs inline-block text-white/90">
                          {med.strength}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center mt-2 text-sm">
                        <Pill className="h-4 w-4 text-white/70" />
                        <div className="text-white">{med.form || 'Unknown'}</div>
                        
                        {med.asNeeded && (
                          <>
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                            <div className="text-yellow-500">Max {med.asNeeded.maxPerDay} per day</div>
                          </>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
          <TableHeader className="bg-white/10">
            <TableRow>
              <TableHead className="text-white">Medication</TableHead>
              <TableHead className="text-white">Form/Strength</TableHead>
              <TableHead className="text-white">Schedule</TableHead>
              <TableHead className="text-white">Dosage</TableHead>
              <TableHead className="text-white">Special</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map(med => (
              <TableRow key={med.id} className="border-b border-white/10">
                <TableCell className="text-white font-medium">{med.name}</TableCell>
                <TableCell className="text-white/70">
                  {med.form}{med.strength ? `, ${med.strength}` : ''}
                </TableCell>
                <TableCell>
                  {med.doses.map(dose => (
                    <div key={dose.id} className="mb-1 last:mb-0">
                      <div className="text-white/80">
                        {dose.days.includes('everyday') ? 'Daily' : dose.days.map(d => d.substring(0, 3)).join(', ')}
                      </div>
                      <div className="text-white/70 text-xs">
                        {dose.times.join(', ')}
                      </div>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {med.doses.map(dose => (
                    <div key={dose.id} className="text-white mb-1 last:mb-0">
                      {dose.quantity} {med.form || 'pill'}{dose.quantity !== 1 ? 's' : ''}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  {med.asNeeded ? (
                    <div className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs inline-block">
                      As needed (max {med.asNeeded.maxPerDay}/day)
                    </div>
                  ) : (
                    <span className="text-white/30">-</span>
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
    <div className="animate-fade-in bg-white/5 rounded-lg p-4">
      <h3 className="text-xl font-bold text-white mb-4">Medication Schedule</h3>
      <Tabs defaultValue="interactive">
        <TabsList className="bg-white/10 mb-4">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white/20">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white/20">
            <List className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="interactive" className="data-[state=active]:bg-white/20">
            <Info className="h-4 w-4 mr-2" />
            Interactive
          </TabsTrigger>
          <TabsTrigger value="table" className="data-[state=active]:bg-white/20">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Table
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-0">
          {renderCalendarView()}
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-0">
          {renderTimelineView()}
        </TabsContent>
        
        <TabsContent value="interactive" className="mt-0">
          {renderInteractiveDayPartsView()}
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
          {renderTableView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationVisualization;
