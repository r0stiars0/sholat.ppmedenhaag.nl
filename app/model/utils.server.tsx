/**
 * Finds the dates of the last Sunday in March and the last Sunday in October
 * for a specific year (European DST schedule).
 *
 * @param {number} year - The full year (e.g., 2024)
 * @returns {object} - An object containing the two Date objects
 */
function getEUDSTDates(year:number) {
    // --- Find Last Sunday in March ---
    // 1. Create a date for the very last day of March (March 31st)
    // Note: Months are 0-indexed in JS (0=Jan, 2=March, 9=Oct)
    const lastDayMarch = new Date(year, 2, 31);

    // 2. Get the day of the week (0=Sunday, 1=Monday... 6=Saturday)
    const dayOfWeekMarch = lastDayMarch.getDay();

    // 3. Subtract the day index from the date to "rewind" to the previous Sunday
    // If it is already Sunday (0), it subtracts nothing.
    const dstStart = new Date(year, 2, 31 - dayOfWeekMarch);

    // --- Find Last Sunday in October ---
    // 1. Create a date for the very last day of October (October 31st)
    const lastDayOct = new Date(year, 9, 31);

    // 2. Get the day of the week
    const dayOfWeekOct = lastDayOct.getDay();

    // 3. Subtract to find the Sunday
    const dstEnd = new Date(year, 9, 31 - dayOfWeekOct);

    return {
        year: year,
        dstStart: dstStart.toDateString(), // e.g., "Sun Mar 31 2024"
        dstEnd: dstEnd.toDateString()      // e.g., "Sun Oct 27 2024"
    };
}


function getLastSundayOfMonth(year:number, monthIndex:number) {
  // monthIndex: 0 = January, 2 = March, 9 = October
  // Create date for the last day of the month
  const date = new Date(year, monthIndex + 1, 0);

  // Move backwards to the last Sunday
  const dayOfWeek = date.getDay(); // 0 = Sunday
  date.setDate(date.getDate() - dayOfWeek);

  return date;
}

function getDSTChangeDates(year:number) {
  return {
    year,
    march: getLastSundayOfMonth(year, 2),    // March
    october: getLastSundayOfMonth(year, 9)   // October
  };
}