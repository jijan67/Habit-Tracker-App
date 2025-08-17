import React, { useState } from 'react';
import { Download, Upload, BarChart3, Calendar, Home } from 'lucide-react';
import './App.css';

// Components
import HabitForm from './components/HabitForm';
import HabitCard from './components/HabitCard';
import CalendarView from './components/CalendarView';
import ProgressCharts from './components/ProgressCharts';
import ThemeToggle from './components/ThemeToggle';

// Hooks
import { useLocalStorage, useTheme } from './hooks/useLocalStorage';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [habits, setHabits] = useLocalStorage('habit-tracker-habits', []);
  const [completions, setCompletions] = useLocalStorage('habit-tracker-completions', {});
  const [activeTab, setActiveTab] = useState('habits');
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedHabitForCalendar, setSelectedHabitForCalendar] = useState(null);

  const addHabit = (habit) => {
    setHabits(prev => [...prev, habit]);
    setEditingHabit(null);
  };

  const updateHabit = (updatedHabit) => {
    setHabits(prev => prev.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
    setEditingHabit(null);
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    // Clean up completions for deleted habit
    setCompletions(prev => {
      const updated = { ...prev };
      delete updated[habitId];
      return updated;
    });
  };

  const toggleHabitCompletion = (habitId, date) => {
    setCompletions(prev => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [date]: !prev[habitId]?.[date]
      }
    }));
  };

  const exportData = () => {
    const data = {
      habits,
      completions,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.habits && data.completions) {
          setHabits(data.habits);
          setCompletions(data.completions);
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format. Please select a valid backup file.');
        }
      } catch (error) {
        alert('Error reading file. Please make sure it\'s a valid JSON backup.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'habits':
        return (
          <div className="space-y-6">
            {editingHabit ? (
              <HabitForm
                onSubmit={updateHabit}
                onCancel={() => setEditingHabit(null)}
                initialData={editingHabit}
              />
            ) : (
              <HabitForm onSubmit={addHabit} onCancel={() => {}} />
            )}
            
            {habits.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No habits yet!
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create your first habit above to start tracking your progress.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completions={completions}
                    onToggleComplete={toggleHabitCompletion}
                    onEdit={setEditingHabit}
                    onDelete={deleteHabit}
                  />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'calendar':
        return (
          <div className="space-y-6">
            {selectedHabitForCalendar ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedHabitForCalendar(null)}
                  className="btn-secondary mb-4"
                >
                  ← Back to Habit Selection
                </button>
                <CalendarView
                  habit={selectedHabitForCalendar}
                  completions={completions}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Select a Habit to View Calendar
                </h2>
                {habits.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No habits to display
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Create some habits first to see their calendar views.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {habits.map(habit => (
                      <button
                        key={habit.id}
                        onClick={() => setSelectedHabitForCalendar(habit)}
                        className="habit-card p-6 text-left hover:scale-105 transition-transform duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{habit.icon}</div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                              {habit.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Click to view calendar
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'analytics':
        return <ProgressCharts habits={habits} completions={completions} />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-40 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Habit Tracker
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Export/Import */}
              <div className="flex items-center gap-2">
                <button
                  onClick={exportData}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  title="Export Data"
                >
                  <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                
                <label className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                       title="Import Data">
                  <Upload className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>
              
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex gap-1 mt-4">
            {[
              { id: 'habits', label: 'Habits', icon: Home },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Build healthy habits, one day at a time. Your data stays private in your browser.
          </p>
          <div className="mt-3">
            <span className="text-sm">Made by </span>
            <a
              href="https://jijanurrahman.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="author-badge ml-2"
              aria-label="Jijanur Rahman - opens in a new tab"
            >
              <span className="author-link">Jijanur Rahman</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;