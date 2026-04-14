export function getCalendarWeeks(currentDate: Date) {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  const weeks = [];
  const currentCalendarDate = new Date(startDate);

  while (currentCalendarDate <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentCalendarDate));
      currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export function isCurrentMonth(date: Date, currentMonth: number) {
  return date.getMonth() === currentMonth;
}

export function isToday(date: Date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isDateInRange(date: Date, startDateStr: string, endDateStr?: string) {
  // JST基準のYYYY-MM-DD形式で比較するため、文字列で直接比較
  const targetDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const endDate = endDateStr || startDateStr;

  return targetDateStr >= startDateStr && targetDateStr <= endDate;
}