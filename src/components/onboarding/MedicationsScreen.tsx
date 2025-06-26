
import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Pill, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Medication } from '@/types/onboarding';

interface MedicationsScreenProps {
  showExample?: boolean;
  showMedicationSchedule?: boolean;
  setShowMedicationSchedule?: (show: boolean) => void;
  exampleMedications?: Medication[];
}

// Mock medications with varied schedules
const mockMedications: Medication[] = [
  // Regular daily medications
  {
    id: '1',
    name: 'Lisinopril',
    strength: '10mg',
    form: 'tablet',
    doses: [{ id: '1a', days: ['everyday'], times: ['8:00 AM'], quantity: 1 }],
  },
  {
    id: '2', 
    name: 'Metformin',
    strength: '500mg',
    form: 'tablet',
    doses: [{ id: '2a', days: ['everyday'], times: ['8:00 AM', '6:00 PM'], quantity: 1 }],
  },
  {
    id: '3',
    name: 'Atorvastatin',
    strength: '20mg', 
    form: 'tablet',
    doses: [{ id: '3a', days: ['everyday'], times: ['9:00 PM'], quantity: 1 }],
  },
  {
    id: '4',
    name: 'Levothyroxine',
    strength: '75mcg',
    form: 'tablet', 
    doses: [{ id: '4a', days: ['everyday'], times: ['6:30 AM'], quantity: 1 }],
  },
  // Twice daily medications
  {
    id: '5',
    name: 'Amlodipine',
    strength: '5mg',
    form: 'tablet',
    doses: [{ id: '5a', days: ['everyday'], times: ['9:00 AM', '9:00 PM'], quantity: 1 }],
  },
  {
    id: '6',
    name: 'Omeprazole', 
    strength: '20mg',
    form: 'capsule',
    doses: [{ id: '6a', days: ['everyday'], times: ['7:00 AM'], quantity: 1 }],
  },
  // Specific day schedules
  {
    id: '7',
    name: 'Vitamin D3',
    strength: '2000 IU',
    form: 'tablet',
    doses: [{ id: '7a', days: ['monday', 'wednesday', 'friday'], times: ['8:00 AM'], quantity: 1 }],
  },
  {
    id: '8',
    name: 'Calcium',
    strength: '500mg',
    form: 'tablet', 
    doses: [{ id: '8a', days: ['tuesday', 'thursday', 'saturday'], times: ['12:00 PM'], quantity: 2 }],
  },
  {
    id: '9',
    name: 'Fish Oil',
    strength: '1000mg',
    form: 'capsule',
    doses: [{ id: '9a', days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], times: ['8:00 AM'], quantity: 1 }],
  },
  // Multiple doses per day
  {
    id: '10',
    name: 'Gabapentin',
    strength: '300mg', 
    form: 'capsule',
    doses: [{ id: '10a', days: ['everyday'], times: ['8:00 AM', '2:00 PM', '8:00 PM'], quantity: 1 }],
  },
  {
    id: '11',
    name: 'Hydrochlorothiazide',
    strength: '25mg',
    form: 'tablet',
    doses: [{ id: '11a', days: ['everyday'], times: ['10:00 AM'], quantity: 1 }],
  },
  {
    id: '12',
    name: 'Sertraline',
    strength: '50mg',
    form: 'tablet', 
    doses: [{ id: '12a', days: ['everyday'], times: ['7:30 AM'], quantity: 1 }],
  },
  // As-needed medications
  {
    id: '13',
    name: 'Acetaminophen',
    strength: '500mg',
    form: 'tablet',
    doses: [],
    asNeeded: { maxPerDay: 6 }
  },
  {
    id: '14', 
    name: 'Ibuprofen',
    strength: '200mg',
    form: 'tablet',
    doses: [],
    asNeeded: { maxPerDay: 4 }
  },
  {
    id: '15',
    name: 'Lorazepam',
    strength: '0.5mg', 
    form: 'tablet',
    doses: [],
    asNeeded: { maxPerDay: 2 }
  }
];

const MedicationsScreen: React.FC<MedicationsScreenProps> = ({ 
  showExample = false,
  showMedicationSchedule = false,
  setShowMedicationSchedule = () => {},
  exampleMedications = []
}) => {
  const { userProfile } = useOnboarding();
  const displayMedications = showExample ? (exampleMedications.length > 0 ? exampleMedications : mockMedications) : userProfile.medications;

  // Show the first medication for now
  const currentMedication = displayMedications[0];

  const renderCompactCalendarView = () => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const fullDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Create unique dose groups (time + frequency combination)
    const doseGroups: Array<{
      id: string;
      time: string;
      days: string[];
      quantity: number;
      medName: string;
      color: string;
    }> = [];

    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-yellow-500',
      'bg-indigo-500', 'bg-cyan-500', 'bg-rose-500', 'bg-emerald-500',
      'bg-violet-500', 'bg-amber-500', 'bg-lime-500'
    ];

    let colorIndex = 0;

    displayMedications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() !== "as needed") {
            // Create a unique identifier for this dose group  
            const groupId = `${med.id}-${dose.id}-${time}`;
            
            doseGroups.push({
              id: groupId,
              time: time,
              days: dose.days,
              quantity: dose.quantity,
              medName: med.name,
              color: colors[colorIndex % colors.length]
            });
            colorIndex++;
          }
        });
      });
    });

    // Sort groups by time
    const sortedGroups = doseGroups.sort((a, b) => {
      const parseTime = (timeStr: string) => {
        const [time, meridiem] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
      };
      return parseTime(a.time) - parseTime(b.time);
    });

    // Get all unique times that have doses
    const uniqueTimes = [...new Set(sortedGroups.map(group => group.time))].sort((a, b) => {
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
      <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
        {/* Compact header with days of week */}
        <div className="grid grid-cols-8 bg-blue-600">
          <div className="p-1.5 font-semibold text-white text-center border-r border-blue-500 text-xs">
            Time
          </div>
          {daysOfWeek.map((day, index) => (
            <div key={day} className="p-1.5 font-semibold text-white text-center border-r border-blue-500 last:border-r-0 text-xs">
              {day}
            </div>
          ))}
        </div>

        {/* Render rows for each unique time */}
        {uniqueTimes.map((time, timeIndex) => (
          <div key={time} className={`grid grid-cols-8 border-b border-white/10 ${timeIndex % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
            {/* Time column - more compact */}
            <div className="p-1.5 font-medium text-white border-r border-white/10 text-center">
              <div className="text-xs font-semibold">{time.split(' ')[0]}</div>
              <div className="text-xs text-white/70">{time.split(' ')[1]}</div>
            </div>
            
            {/* Day columns - more compact */}
            {daysOfWeek.map((_, dayIndex) => {
              // Find all dose groups for this time and day
              const groupsForThisTimeAndDay = sortedGroups.filter(group => {
                if (group.time !== time) return false;
                
                // Check if this group applies to this day
                if (group.days.includes('everyday')) return true;
                
                const fullDayName = fullDayNames[dayIndex];
                return group.days.includes(fullDayName);
              });

              return (
                <div key={dayIndex} className="p-0.5 border-r border-white/10 last:border-r-0 min-h-10 flex flex-col gap-0.5 justify-center">
                  {groupsForThisTimeAndDay.map(group => (
                    <div 
                      key={group.id}
                      className={`${group.color} rounded px-1.5 py-0.5 text-white text-xs font-medium flex items-center gap-1 justify-center`}
                      title={`${group.medName} - ${group.quantity}x`}
                    >
                      <Pill className="h-2 w-2" />
                      <span>{group.quantity}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}

        {/* Compact as needed section if applicable */}
        {displayMedications.some(med => med.asNeeded) && (
          <div className="bg-yellow-500/20 border-t border-yellow-500/30">
            <div className="grid grid-cols-8">
              <div className="p-1.5 font-medium text-yellow-400 border-r border-yellow-500/30 text-center">
                <div className="text-xs font-semibold">As</div>
                <div className="text-xs">Needed</div>
              </div>
              <div className="col-span-7 p-1 flex flex-wrap items-center gap-1">
                {displayMedications
                  .filter(med => med.asNeeded)
                  .map(med => (
                    <div key={med.id} className="bg-yellow-500 rounded px-1.5 py-0.5 text-white text-xs font-medium flex items-center gap-1">
                      <Pill className="h-2 w-2" />
                      <span className="truncate max-w-16">{med.name}</span>
                      <span>({med.asNeeded?.maxPerDay})</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!currentMedication) {
    return (
      <div className="animate-fade-in px-6 pb-10">
        <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/20 rounded-lg">
          <Pill className="h-16 w-16 text-white/30 mb-4" />
          <p className="text-white/60 text-xl mb-2">No medications added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-3 pb-4 space-y-3">
      {/* Compact Medication Details */}
      <Card className="border-white/10 bg-white/5 overflow-hidden">
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-highlight/20 flex items-center justify-center flex-shrink-0">
              <Pill className="h-4 w-4 text-highlight" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1">
                {currentMedication.name} {currentMedication.strength}
              </h3>
              
              {currentMedication.form && (
                <Badge variant="outline" className="bg-white/10 text-white/70 mb-2 text-xs">
                  {currentMedication.form}
                </Badge>
              )}

              {/* Compact dose summary */}
              <div className="space-y-1">
                {currentMedication.doses.map(dose => (
                  <div key={dose.id} className="text-white/80 text-sm">
                    <span className="font-medium">
                      {dose.quantity} {currentMedication.form || 'dose'}{dose.quantity !== 1 ? 's' : ''}
                    </span>
                    <span className="text-white/60 mx-1">•</span>
                    <span>
                      {dose.days.includes('everyday')
                        ? 'Daily'
                        : dose.days.length > 3 
                          ? `${dose.days.length} days/week`
                          : dose.days.join(', ')}
                    </span>
                    <span className="text-white/60 mx-1">•</span>
                    <span className="text-highlight font-medium">
                      {dose.times.join(', ')}
                    </span>
                  </div>
                ))}
                
                {currentMedication.asNeeded && (
                  <div className="text-yellow-400 font-medium text-sm">
                    + Up to {currentMedication.asNeeded.maxPerDay}x as-needed per day
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Optimized Calendar View */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-white" />
          <h4 className="text-base font-semibold text-white">Weekly Schedule</h4>
          {displayMedications.length > 1 && (
            <Badge variant="outline" className="bg-white/10 text-white/70 text-xs">
              All {displayMedications.length} meds
            </Badge>
          )}
        </div>
        {renderCompactCalendarView()}
      </div>
    </div>
  );
};

export default MedicationsScreen;
