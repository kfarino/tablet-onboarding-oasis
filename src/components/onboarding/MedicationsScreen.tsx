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

  const renderUltraCompactSchedule = () => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const fullDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Create unique dose groups with medication info
    const doseGroups: Array<{
      id: string;
      time: string;
      days: string[];
      quantity: number;
      medName: string;
      medStrength: string;
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
            const groupId = `${med.id}-${dose.id}-${time}`;
            
            doseGroups.push({
              id: groupId,
              time: time,
              days: dose.days,
              quantity: dose.quantity,
              medName: med.name,
              medStrength: med.strength,
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

    // Get unique times
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
      <div className="bg-white/5 rounded-md overflow-hidden border border-white/10">
        {/* Ultra-compact header */}
        <div className="grid grid-cols-8 bg-blue-600 text-[10px]">
          <div className="p-1 font-semibold text-white text-center border-r border-blue-500">
            Time
          </div>
          {daysOfWeek.map((day) => (
            <div key={day} className="p-1 font-semibold text-white text-center border-r border-blue-500 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Time rows - ultra compact */}
        {uniqueTimes.map((time, timeIndex) => (
          <div key={time} className={`grid grid-cols-8 border-b border-white/10 ${timeIndex % 2 === 0 ? 'bg-white/2' : 'bg-white/5'}`}>
            {/* Time column */}
            <div className="p-1 text-white border-r border-white/10 text-center min-h-[32px] flex flex-col justify-center">
              <div className="text-[10px] font-semibold leading-tight">{time.split(' ')[0]}</div>
              <div className="text-[8px] text-white/70 leading-tight">{time.split(' ')[1]}</div>
            </div>
            
            {/* Day columns */}
            {daysOfWeek.map((_, dayIndex) => {
              const groupsForThisTimeAndDay = sortedGroups.filter(group => {
                if (group.time !== time) return false;
                if (group.days.includes('everyday')) return true;
                const fullDayName = fullDayNames[dayIndex];
                return group.days.includes(fullDayName);
              });

              return (
                <div key={dayIndex} className="p-0.5 border-r border-white/10 last:border-r-0 min-h-[32px] flex flex-col gap-0.5 justify-center">
                  {groupsForThisTimeAndDay.map(group => (
                    <div 
                      key={group.id}
                      className={`${group.color} rounded px-1 py-0.5 text-white text-[8px] font-medium flex items-center gap-0.5 justify-center`}
                      title={`${group.medName} ${group.medStrength} - ${group.quantity}x`}
                    >
                      <Pill className="h-2 w-2" />
                      <span className="truncate max-w-8" style={{ fontSize: '7px' }}>
                        {group.medName.length > 6 ? group.medName.substring(0, 6) : group.medName}
                      </span>
                      <span>{group.quantity}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}

        {/* As needed section - ultra compact */}
        {displayMedications.some(med => med.asNeeded) && (
          <div className="bg-yellow-500/20 border-t border-yellow-500/30">
            <div className="grid grid-cols-8 text-[10px]">
              <div className="p-1 font-medium text-yellow-400 border-r border-yellow-500/30 text-center">
                PRN
              </div>
              <div className="col-span-7 p-1 flex flex-wrap items-center gap-0.5">
                {displayMedications
                  .filter(med => med.asNeeded)
                  .map(med => (
                    <div key={med.id} className="bg-yellow-500 rounded px-1 py-0.5 text-white text-[8px] font-medium flex items-center gap-0.5">
                      <Pill className="h-2 w-2" />
                      <span className="truncate max-w-12">{med.name}</span>
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
      {/* Header with medication count */}
      <div className="flex items-center gap-2 px-1">
        <CalendarIcon className="h-4 w-4 text-white" />
        <h3 className="text-lg font-bold text-white">
          {displayMedications[0]?.name || 'Medication'} Schedule
        </h3>
        {displayMedications.length > 1 && (
          <Badge variant="outline" className="bg-white/10 text-white/70 text-xs">
            +{displayMedications.length - 1} more
          </Badge>
        )}
      </div>

      {/* Ultra-compact schedule */}
      {renderUltraCompactSchedule()}

      {/* Medication count summary */}
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
