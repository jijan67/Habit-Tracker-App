// Date utility functions for the habit tracker

export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getToday = () => {
  return formatDate(new Date());
};

export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(formatDate(new Date(current)));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

export const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push({
      date: formatDate(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: formatDate(date) === getToday()
    });
  }
  
  return dates;
};

export const getCalendarDates = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);
  
  // Adjust to start from Sunday of the week containing the first day
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // Adjust to end on Saturday of the week containing the last day
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
  return getDatesInRange(startDate, endDate).map(date => {
    const d = new Date(date);
    return {
      date,
      dayNumber: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: date === getToday()
    };
  });
};

export const getStreak = (completions, habitId) => {
  if (!completions[habitId]) return 0;
  
  let streak = 0;
  const today = new Date();
  
  // Check backwards from today
  for (let i = 0; i >= -365; i--) { // Check up to a year back
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const dateStr = formatDate(checkDate);
    
    if (completions[habitId][dateStr]) {
      streak++;
    } else if (i < 0) { // Only break streak for past dates
      break;
    }
  }
  
  return streak;
};

export const getMonthName = (monthIndex) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
};

export const getCompletionRate = (completions, habitId, days = 30) => {
  if (!completions[habitId]) return 0;
  
  const today = new Date();
  let completed = 0;
  
  for (let i = 0; i < days; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = formatDate(checkDate);
    
    if (completions[habitId][dateStr]) {
      completed++;
    }
  }
  
  return Math.round((completed / days) * 100);
};

// Format an ISO datetime to a readable local string
export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleString();
  } catch (e) {
    return isoString;
  }
};

// Convert an ISO datetime (or current time) to the format suitable for <input type="datetime-local" />
export const toLocalInputValue = (isoString) => {
  const d = isoString ? new Date(isoString) : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};