
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
