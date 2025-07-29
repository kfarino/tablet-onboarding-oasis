
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
 * @param time Time string like "8:00 AM", "12:00 PM", "6:00 PM" or "6:00", "8:00", "12:00"
 * @returns Tailwind color class for the time
 */
export const getTimeColor = (time: string): string => {
  if (time === "12:00 PM" || time === "Noon" || time === "12:00") return "text-white";
  
  // Check if time has AM/PM - prioritize this
  if (time.includes("AM")) {
    return "text-orange-400"; // Morning - warm orange
  } else if (time.includes("PM")) {
    return "text-blue-400";   // Evening - cool blue
  }
  
  // For times without AM/PM, use logical mapping
  const [hours] = time.split(':').map(Number);
  
  if (hours === 6) {
    return "text-orange-400"; // 6:00 is AM - warm orange
  } else if (hours === 8) {
    return "text-blue-400";   // 8:00 is PM - cool blue
  } else if (hours >= 1 && hours <= 11) {
    return "text-orange-400"; // Other hours 1-11 default to AM - warm orange
  }
  
  // Fallback to white
  return "text-white";
};

/**
 * Parses time for sorting purposes, handling both "Noon" and regular time formats
 * @param timeStr Time string like "8:00", "Noon", "6:00"
 * @returns Number representing minutes from midnight for sorting
 */
export const parseTimeForSorting = (timeStr: string): number => {
  if (timeStr === "Noon") return 12 * 60; // 12:00 PM = 720 minutes
  
  // Check if time has AM/PM first
  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let adjustedHours = hours;
    if (period === "AM") {
      if (hours === 12) adjustedHours = 0; // 12 AM = midnight
    } else if (period === "PM") {
      if (hours !== 12) adjustedHours = hours + 12; // Don't add 12 to 12 PM
    }
    
    return adjustedHours * 60 + (minutes || 0);
  }
  
  // Handle times without AM/PM - assume standard schedule
  const [time] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  // For times without AM/PM, use context to determine:
  // 6-11 are typically AM in medication schedules, 1-5 are PM
  let adjustedHours = hours;
  if (hours >= 6 && hours <= 11) {
    // Morning times (6:00-11:59 should be AM)
    // Keep as is
  } else if (hours >= 1 && hours <= 5) {
    // Afternoon/Evening times (1:00-5:59 should be PM) 
    adjustedHours = hours + 12;
  }
  // 12 stays as 12 (noon)
  
  return adjustedHours * 60 + (minutes || 0);
};
