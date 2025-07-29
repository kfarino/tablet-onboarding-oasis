
/**
 * Returns the abbreviated form of a day name.
 * @param day The full day name or "everyday"
 * @returns The abbreviated form (3 letters) or "Everyday" for the special case
 */
export const getDayAbbreviation = (day: string): string => {
  if (day === 'everyday') return 'Everyday';
  
  // Handle both formats: full day name or already abbreviated
  const dayMapping: Record<string, string> = {
    'monday': 'Mon',
    'mon': 'Mon',
    'tuesday': 'Tue',
    'tue': 'Tue',
    'wednesday': 'Wed',
    'wed': 'Wed',
    'thursday': 'Thu', 
    'thu': 'Thu',
    'friday': 'Fri',
    'fri': 'Fri',
    'saturday': 'Sat',
    'sat': 'Sat',
    'sunday': 'Sun',
    'sun': 'Sun'
  };

  // Convert to lowercase to match the keys in our mapping
  const lowerDay = day.toLowerCase();
  
  // Return the abbreviation or the original if not found
  return dayMapping[lowerDay] || day;
};

/**
 * Formats time display without AM/PM and convert 12:00 PM to "Noon"
 * @param time Time string like "8:00 AM", "12:00 PM", "6:00 PM"
 * @returns Formatted time like "8:00", "Noon", "6:00"
 */
export const formatTimeDisplay = (time: string): string => {
  if (time === "12:00 PM") return "Noon";
  
  // Remove AM/PM from time display
  return time.replace(/ (AM|PM)/g, '');
};

/**
 * Gets color based on time of day for day/night theme
 * @param time Time string like "8:00 AM", "12:00 PM", "6:00 PM"
 * @returns Tailwind color class for the time
 */
export const getTimeColor = (time: string): string => {
  if (time === "12:00 PM" || time === "Noon") return "text-primary";
  
  // Parse the time to determine if it's AM or PM
  const isAM = time.includes("AM");
  const isPM = time.includes("PM");
  
  if (isAM) {
    // Morning times - warm orange/amber
    return "text-orange-400";
  } else if (isPM) {
    // Evening times - cool blue/purple  
    return "text-blue-400";
  }
  
  // Fallback to primary color
  return "text-primary";
};

/**
 * Parses time for sorting purposes, handling both "Noon" and regular time formats
 * @param timeStr Time string like "8:00", "Noon", "6:00"
 * @returns Number representing minutes from midnight for sorting
 */
export const parseTimeForSorting = (timeStr: string): number => {
  if (timeStr === "Noon") return 12 * 60; // 12:00 PM = 720 minutes
  
  // Handle times without AM/PM - assume standard schedule
  const [time] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  // For times without AM/PM, use context to determine:
  // 1-7 are typically AM in medication schedules, 8-12 are PM
  let adjustedHours = hours;
  if (hours >= 1 && hours <= 7) {
    // Morning times (1:00-7:59 should be AM)
    if (hours === 12) adjustedHours = 0; // 12 AM = midnight
  } else if (hours >= 8 && hours <= 11) {
    // Evening times (8:00-11:59 should be PM) 
    adjustedHours = hours + 12;
  }
  // 12 stays as 12 (noon)
  
  return adjustedHours * 60 + (minutes || 0);
};
