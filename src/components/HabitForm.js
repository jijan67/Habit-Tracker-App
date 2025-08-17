import React, { useState } from 'react';
import { Plus, X, Save } from 'lucide-react';

const availableIcons = [
  '💪', '🏃', '📚', '🧘', '💧', '🍎', '😴', '🎯', '🏋️', '🚶',
  '✍️', '🎨', '🎵', '🌱', '☕', '📝', '💊', '🧽', '📱', '⭐'
];

const HabitForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [icon, setIcon] = useState(initialData?.icon || '⭐');
  const [isOpen, setIsOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(initialData?.scheduledAt || null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        id: initialData?.id || Date.now().toString(),
        name: name.trim(),
        icon,
  scheduledAt,
        createdAt: initialData?.createdAt || new Date().toISOString()
      });
      if (!initialData) {
        setName('');
        setIcon('⭐');
  setScheduledAt(null);
      }
    }
  };

  const handleCancel = () => {
    setName(initialData?.name || '');
    setIcon(initialData?.icon || '⭐');
  setScheduledAt(initialData?.scheduledAt || null);
  // Close the create form when cancelling
  setIsOpen(false);
    onCancel();
  };

  if (!isOpen && !initialData) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
      >
        <Plus className="w-5 h-5" />
        Add New Habit
      </button>
    );
  }

  return (
    <div className="habit-card p-6 animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Habit Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter habit name..."
            className="input-field"
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose an Icon
          </label>
          <div className="grid grid-cols-10 gap-2 mb-2">
            {availableIcons.map((iconOption) => (
              <button
                key={iconOption}
                type="button"
                onClick={() => setIcon(iconOption)}
                className={`p-2 rounded-lg text-xl transition-all duration-200 ${
                  icon === iconOption
                    ? 'bg-primary-500 text-white scale-110'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {iconOption}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            When to do this habit?
          </label>
          <input
            type="datetime-local"
            value={scheduledAt || ''}
            onChange={(e) => setScheduledAt(e.target.value || null)}
            className="input-field"
            placeholder="Optional: choose a scheduled time"
          />
        </div>
        
        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {initialData ? 'Update' : 'Create'} Habit
          </button>
          <button 
            type="button" 
            onClick={handleCancel}
            className="btn-secondary flex items-center justify-center gap-2 px-4"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;