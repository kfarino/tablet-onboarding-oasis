import React, { useState } from 'react';
import { Calendar, List, LayoutGrid } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format, startOfWeek, addDays } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { v4 as uuidv4 } from 'uuid';

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
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Start on Sunday
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(weekStart, i);
      return {
        date: day,
        dayName: format(day, 'EEE'),
        dayNumber: format(day, 'd'),
        fullDayName: format(day, 'EEEE').toLowerCase(),
      };
    });

    // Find all unique times across all medications
    const allTimes = new Set<string>();
    
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          // Skip "as needed" which isn't a specific time
          if (time.toLowerCase() === "as needed") return;
          allTimes.add(time);
        });
      });
    });
    
    // Group medications by time
    const medicationsByTime: Record<string, { time: string, meds: { med: Medication, dose: MedicationDose }[] }> = {};
    
    // Initialize all times with empty arrays
    Array.from(allTimes).forEach(time => {
      medicationsByTime[time] = { time, meds: [] };
    });
    
    // Add medications to each time slot
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          // Skip "as needed" which isn't a specific time
          if (time.toLowerCase() === "as needed") return;
          
          medicationsByTime[time].meds.push({ med, dose });
        });
      });
    });

    // Sort times chronologically
    const sortedTimes = Object.values(medicationsByTime).sort((a, b) => {
      // Parse times for comparison, assuming they're in format like "8:00 AM"
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
                  // Find medications that should be taken on this day at this time
                  const relevantMeds = meds.filter(({ med, dose }) => {
                    // Check if this medication should be taken on this day
                    return dose.days.includes('everyday') || 
                           dose.days.includes(day.fullDayName);
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
        
        {/* As needed medications */}
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
    
    // Group medications by time
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
    
    // Sort times
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
        
        {/* As needed medications */}
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

  const renderTableView = () => {
    // Get all unique days across all medications
    const allDays = new Set<string>();
    medications.forEach(med => {
      med.doses.forEach(dose => {
        dose.days.forEach(day => {
          allDays.add(day);
        });
      });
    });
    
    // Convert to array and sort days of week
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

  return (
    <div className="animate-fade-in bg-white/5 rounded-lg p-4">
      <h3 className="text-xl font-bold text-white mb-4">Medication Schedule</h3>
      <Tabs defaultValue="calendar">
        <TabsList className="bg-white/10 mb-4">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white/20">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-white/20">
            <List className="h-4 w-4 mr-2" />
            Timeline
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
        
        <TabsContent value="table" className="mt-0">
          {renderTableView()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationVisualization;
