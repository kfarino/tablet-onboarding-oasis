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
  // Everyday medications
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
    doses: [{ id: '2a', days: ['everyday'], times: ['8:00 AM', '4:45 PM'], quantity: 1 }],
  },
  {
    id: '3',
    name: 'Atorvastatin',
    strength: '20mg', 
    form: 'tablet',
    doses: [{ id: '3a', days: ['everyday'], times: ['8:45 PM'], quantity: 1 }],
  },
  {
    id: '4',
    name: 'Levothyroxine',
    strength: '75mcg',
    form: 'tablet', 
    doses: [{ id: '4a', days: ['everyday'], times: ['8:00 AM'], quantity: 1 }],
  },
  {
    id: '5',
    name: 'Amlodipine',
    strength: '5mg',
    form: 'tablet',
    doses: [{ id: '5a', days: ['everyday'], times: ['4:45 PM'], quantity: 1 }],
  },
  // Weekend only medications
  {
    id: '6',
    name: 'Vitamin D3',
    strength: '2000 IU',
    form: 'tablet',
    doses: [{ id: '6a', days: ['sunday', 'saturday'], times: ['8:00 AM'], quantity: 1 }],
  },
  {
    id: '7',
    name: 'Fish Oil',
    strength: '1000mg',
    form: 'capsule',
    doses: [{ id: '7a', days: ['sunday', 'saturday'], times: ['8:00 AM'], quantity: 1 }],
  },
  // Tuesday and Thursday medications
  {
    id: '8',
    name: 'Calcium',
    strength: '500mg',
    form: 'tablet', 
    doses: [{ id: '8a', days: ['tuesday', 'thursday'], times: ['10:00 AM'], quantity: 2 }],
  },
  {
    id: '9',
    name: 'Iron',
    strength: '65mg',
    form: 'tablet',
    doses: [{ id: '9a', days: ['tuesday', 'thursday'], times: ['10:00 AM'], quantity: 1 }],
  },
  // Sunday and Monday medications
  {
    id: '10',
    name: 'B-Complex',
    strength: '50mg', 
    form: 'capsule',
    doses: [{ id: '10a', days: ['sunday', 'monday'], times: ['10:45 AM'], quantity: 1 }],
  },
  {
    id: '11',
    name: 'Magnesium',
    strength: '400mg',
    form: 'tablet',
    doses: [{ id: '11a', days: ['sunday', 'monday'], times: ['10:45 AM'], quantity: 1 }],
  },
  {
    id: '12',
    name: 'CoQ10',
    strength: '100mg',
    form: 'capsule', 
    doses: [{ id: '12a', days: ['everyday'], times: ['8:45 PM'], quantity: 1 }],
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

  const renderConsolidatedSchedule = () => {
    const daysOfWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    const fullDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Group medications by time and day pattern
    const timeGroups: Record<string, Record<string, string[]>> = {};

    displayMedications.forEach(med => {
      med.doses.forEach(dose => {
        dose.times.forEach(time => {
          if (time.toLowerCase() !== "as needed") {
            const dayPattern = dose.days.sort().join(',');
            
            if (!timeGroups[time]) {
              timeGroups[time] = {};
            }
            if (!timeGroups[time][dayPattern]) {
              timeGroups[time][dayPattern] = [];
            }
            
            // Add medication name to this time/day pattern group
            timeGroups[time][dayPattern].push(med.name);
          }
        });
      });
    });

    // Get color for day pattern
    const getColorForDayPattern = (days: string[]): string => {
      const daySet = new Set(days);
      
      if (daySet.has('everyday')) return 'bg-green-500';
      if (daySet.size === 2 && daySet.has('sunday') && daySet.has('saturday')) return 'bg-red-500';
      if (daySet.size === 2 && daySet.has('tuesday') && daySet.has('thursday')) return 'bg-blue-500';
      if (daySet.size === 2 && daySet.has('sunday') && daySet.has('monday')) return 'bg-purple-500';
      
      return 'bg-gray-500';
    };

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

    return (
      <div className="bg-white/5 rounded-md overflow-hidden border border-white/10">
        {/* Header */}
        <div className="grid grid-cols-8 bg-blue-600 text-xs">
          <div className="p-2 font-semibold text-white text-center border-r border-blue-500">
            Time
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 font-semibold text-white text-center border-r border-blue-500 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Time rows */}
        {sortedTimes.map((time, timeIndex) => (
          <div key={time} className={`grid grid-cols-8 border-b border-white/10 ${timeIndex % 2 === 0 ? 'bg-white/2' : 'bg-white/5'}`}>
            {/* Time column */}
            <div className="p-2 text-white border-r border-white/10 text-center min-h-[60px] flex flex-col justify-center">
              <div className="text-sm font-semibold leading-tight">{time.split(' ')[0]}</div>
              <div className="text-xs text-white/70 leading-tight">{time.split(' ')[1]}</div>
            </div>
            
            {/* Day columns */}
            {daysOfWeek.map((_, dayIndex) => {
              const fullDayName = fullDayNames[dayIndex];
              const dayPatterns = Object.keys(timeGroups[time]).filter(dayPattern => {
                const days = dayPattern.split(',');
                return days.includes('everyday') || days.includes(fullDayName);
              });

              return (
                <div key={dayIndex} className="p-1 border-r border-white/10 last:border-r-0 min-h-[60px] flex flex-col gap-1 justify-center">
                  {dayPatterns.map(dayPattern => {
                    const days = dayPattern.split(',');
                    const medNames = timeGroups[time][dayPattern];
                    const color = getColorForDayPattern(days);
                    
                    return (
                      <div key={dayPattern} className="space-y-1">
                        {medNames.map((medName, medIndex) => (
                          <div 
                            key={`${dayPattern}-${medIndex}`}
                            className={`${color} rounded px-2 py-1 text-white text-xs font-medium flex items-center gap-1 justify-center`}
                            title={medName}
                          >
                            <Pill className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate text-center">
                              {medName.length > 8 ? medName.substring(0, 8) + '...' : medName}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}

        {/* As needed section */}
        {displayMedications.some(med => med.asNeeded) && (
          <div className="bg-yellow-500/20 border-t border-yellow-500/30">
            <div className="grid grid-cols-8 text-xs">
              <div className="p-2 font-medium text-yellow-400 border-r border-yellow-500/30 text-center">
                PRN
              </div>
              <div className="col-span-7 p-2 flex flex-wrap items-center gap-1">
                {displayMedications
                  .filter(med => med.asNeeded)
                  .map(med => (
                    <div key={med.id} className="bg-yellow-500 rounded px-2 py-1 text-white text-xs font-medium flex items-center gap-1">
                      <Pill className="h-3 w-3" />
                      <span className="truncate">{med.name}</span>
                      <span className="text-yellow-200">({med.asNeeded?.maxPerDay}/day)</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!displayMedications || displayMedications.length === 0) {
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
    <div className="animate-fade-in px-2 pb-2 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 px-1">
        <CalendarIcon className="h-4 w-4 text-white" />
        <h3 className="text-lg font-bold text-white">
          Medications
        </h3>
        <Badge variant="outline" className="bg-white/10 text-white/70 text-xs">
          {displayMedications.length} medications
        </Badge>
      </div>

      {/* Consolidated schedule */}
      {renderConsolidatedSchedule()}

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-white/60 px-1">
        <span>{displayMedications.length} medications total</span>
        <span>
          {displayMedications.filter(m => m.asNeeded).length} as-needed, {' '}
          {displayMedications.filter(m => !m.asNeeded).length} scheduled
        </span>
      </div>
    </div>
  );
};

export default MedicationsScreen;
