import React, { useState } from 'react';
import { Edit, Trash2, Calendar, TrendingUp, Check, X } from 'lucide-react';
import { getToday, getStreak, getCurrentWeekDates, formatDateTime } from '../utils/dateUtils';

const HabitCard = ({ habit, completions, onToggleComplete, onEdit, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const today = getToday();
  const isCompletedToday = completions[habit.id]?.[today] || false;
  const currentStreak = getStreak(completions, habit.id);
  const weekDates = getCurrentWeekDates();

  const handleToggleComplete = () => {
    onToggleComplete(habit.id, today);
  };

  const handleDelete = () => {
    onDelete(habit.id);
    setShowConfirmDelete(false);
  };

  return (
    <div className="habit-card p-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{habit.icon}</div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {habit.name}
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <div>Created: {formatDateTime(habit.createdAt)}</div>
                {habit.scheduledAt && (
                  <div>Scheduled: {formatDateTime(habit.scheduledAt)}</div>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {currentStreak} day streak
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(habit)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Today's completion toggle */}
        <div className="mb-4">
          <button
            onClick={handleToggleComplete}
            className={`w-full p-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-102 ${
              isCompletedToday
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isCompletedToday ? (
                <>
                  <Check className="w-5 h-5" />
                  Completed Today!
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Mark as Done
                </>
              )}
            </div>
          </button>
        </div>

        {/* Week overview */}
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map(({ date, dayName, isToday }) => {
            const isCompleted = completions[habit.id]?.[date] || false;
            return (
              <div
                key={date}
                className={`text-center p-2 rounded-lg text-xs transition-colors duration-200 ${
                  isToday
                    ? 'bg-primary-100 dark:bg-primary-900/50 border border-primary-300 dark:border-primary-700'
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {dayName}
                </div>
                <div
                  className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  {isCompleted && <Check className="w-3 h-3" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 rounded-xl">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
              Delete Habit?
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This will permanently delete "{habit.name}" and all its data.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;