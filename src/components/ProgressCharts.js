import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Calendar } from 'lucide-react';
import { getCompletionRate, formatDate } from '../utils/dateUtils';

const ProgressCharts = ({ habits, completions }) => {
  // Prepare data for completion rates
  const completionRates = habits.map(habit => ({
    name: habit.name,
    icon: habit.icon,
    rate: getCompletionRate(completions, habit.id, 30),
    rate7Days: getCompletionRate(completions, habit.id, 7),
    rate14Days: getCompletionRate(completions, habit.id, 14)
  }));

  // Prepare data for weekly trend
  const getWeeklyTrendData = () => {
    const today = new Date();
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = formatDate(date);
      
      let totalCompleted = 0;
      habits.forEach(habit => {
        if (completions[habit.id] && completions[habit.id][dateStr]) {
          totalCompleted++;
        }
      });
      
      weeklyData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: totalCompleted,
        total: habits.length,
        percentage: habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0
      });
    }
    
    return weeklyData;
  };

  const weeklyTrendData = getWeeklyTrendData();

  // Overall completion pie chart data
  const overallStats = habits.reduce((acc, habit) => {
    const rate = getCompletionRate(completions, habit.id, 7);
    if (rate >= 80) acc.excellent++;
    else if (rate >= 60) acc.good++;
    else if (rate >= 40) acc.average++;
    else acc.needsWork++;
    return acc;
  }, { excellent: 0, good: 0, average: 0, needsWork: 0 });

  const pieData = [
    { name: 'Excellent (80%+)', value: overallStats.excellent, color: '#10B981' },
    { name: 'Good (60-79%)', value: overallStats.good, color: '#3B82F6' },
    { name: 'Average (40-59%)', value: overallStats.average, color: '#F59E0B' },
    { name: 'Needs Work (<40%)', value: overallStats.needsWork, color: '#EF4444' }
  ].filter(item => item.value > 0);

  if (habits.length === 0) {
    return (
      <div className="habit-card p-6 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Data Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add some habits and start tracking to see your progress charts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weekly Progress Trend */}
      <div className="habit-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary-500" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              Weekly Progress Trend
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daily completion percentage over the last 7 days
            </p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [`${value}%`, 'Completion Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#0EA5E9" 
                strokeWidth={3}
                dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0EA5E9', strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Habit Performance */}
      <div className="habit-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-primary-500" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              Individual Habit Performance
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              30-day completion rates for each habit
            </p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionRates} margin={{ left: 20, right: 20, top: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [`${value}%`, 'Completion Rate']}
              />
              <Bar 
                dataKey="rate" 
                fill="#0EA5E9"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Overview */}
      {pieData.length > 0 && (
        <div className="habit-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-primary-500" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Performance Overview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                How your habits are performing (last 7 days)
              </p>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    formatter={(value) => [`${value} habits`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-3">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                    {item.name}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="habit-card p-4 text-center">
          <div className="text-2xl font-bold text-primary-500">
            {habits.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Active Habits
          </div>
        </div>
        
        <div className="habit-card p-4 text-center">
          <div className="text-2xl font-bold text-green-500">
            {completionRates.length > 0 
              ? Math.round(completionRates.reduce((sum, habit) => sum + habit.rate7Days, 0) / completionRates.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            7-Day Average
          </div>
        </div>
        
        <div className="habit-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">
            {weeklyTrendData.reduce((sum, day) => sum + day.completed, 0)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Week Total
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;