import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { getCalendarDates, getMonthName } from '../utils/dateUtils';

const CalendarView = ({ habit, completions }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const calendarDates = getCalendarDates(currentYear, currentMonth);
  const habitCompletions = completions[habit.id] || {};

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getCompletionLevel = (date) => {
    if (!habitCompletions[date]) return 0;
    return 1; // Simple binary completion, can be extended for multiple levels
  };

  const getCompletionColor = (level) => {
    if (level === 0) return 'bg-gray-100 dark:bg-gray-700';
    return 'bg-green-500';
  };

  return (
    <div className="habit-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{habit.icon}</div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {habit.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Progress View
            </p>
          </div>
        </div>
        <Calendar className="w-6 h-6 text-primary-500" />
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {getMonthName(currentMonth)} {currentYear}
        </h4>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar dates */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDates.map(({ date, dayNumber, isCurrentMonth, isToday }) => {
            const completionLevel = getCompletionLevel(date);
            const isCompleted = completionLevel > 0;
            
            return (
              <div
                key={date}
                className={`p-2 text-center text-sm rounded-lg transition-all duration-200 relative ${
                  isCurrentMonth
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-400 dark:text-gray-600'
                } ${isToday ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto ${
                    getCompletionColor(completionLevel)
                  } ${isCompleted ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {dayNumber}
                </div>
                {isToday && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 rounded"></div>
          Not completed
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          Completed
        </div>
      </div>
    </div>
  );
};

export default CalendarView;