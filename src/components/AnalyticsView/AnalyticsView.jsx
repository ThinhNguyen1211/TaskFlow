import { useState, useMemo } from 'react';
import { format, subDays, startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';
import ProductivityChart from './ProductivityChart';
import TimeAccuracyChart from './TimeAccuracyChart';
import StreakCounter from './StreakCounter';
import InsightCards from './InsightCards';
import ProcrastinationInsights from '../ProcrastinationInsights/ProcrastinationInsights';

const AnalyticsView = ({ todos }) => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, quarter

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!todos || todos.length === 0) {
      return {
        completionRate: 0,
        averageEstimationAccuracy: 0,
        totalTasksCompleted: 0,
        totalTasksCreated: todos?.length || 0,
        totalTimeSpent: 0,
        productivityTrends: [],
        timeAccuracyData: [],
        streakData: { current: 0, longest: 0 },
        categoryBreakdown: {},
        priorityBreakdown: {},
        weeklyStats: []
      };
    }

    const now = new Date();
    const completedTasks = todos.filter(todo => todo.completed);
    const tasksWithTime = todos.filter(todo => todo.estimatedTime && todo.actualTime);
    
    // Basic metrics
    const completionRate = todos.length > 0 ? (completedTasks.length / todos.length) * 100 : 0;
    const totalTimeSpent = completedTasks.reduce((sum, todo) => sum + (todo.actualTime || 0), 0);
    
    // Time estimation accuracy
    let totalAccuracy = 0;
    let accuracyCount = 0;
    
    tasksWithTime.forEach(todo => {
      if (todo.estimatedTime > 0) {
        const accuracy = Math.min(todo.estimatedTime / todo.actualTime, todo.actualTime / todo.estimatedTime) * 100;
        totalAccuracy += accuracy;
        accuracyCount++;
      }
    });
    
    const averageEstimationAccuracy = accuracyCount > 0 ? totalAccuracy / accuracyCount : 0;

    // Productivity trends (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(now, 6 - i));
    const productivityTrends = last7Days.map(date => {
      const dayTasks = completedTasks.filter(todo => {
        if (!todo.completedAt) return false;
        try {
          // Handle different date formats
          let completedDate;
          if (typeof todo.completedAt === 'string') {
            if (todo.completedAt.includes('T') || todo.completedAt.includes('-')) {
              completedDate = parseISO(todo.completedAt);
            } else {
              completedDate = new Date(todo.completedAt);
            }
          } else if (todo.completedAt instanceof Date) {
            completedDate = todo.completedAt;
          } else {
            return false;
          }
          return format(completedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        } catch (error) {
          console.warn('Invalid completedAt date format:', todo.completedAt, error);
          return false;
        }
      });
      
      return {
        date: format(date, 'MMM dd'),
        completed: dayTasks.length,
        timeSpent: dayTasks.reduce((sum, todo) => sum + (todo.actualTime || 0), 0)
      };
    });

    // Time accuracy data for chart
    const timeAccuracyData = tasksWithTime.slice(-10).map(todo => ({
      task: todo.content.substring(0, 20) + (todo.content.length > 20 ? '...' : ''),
      estimated: todo.estimatedTime,
      actual: todo.actualTime,
      accuracy: Math.min(todo.estimatedTime / todo.actualTime, todo.actualTime / todo.estimatedTime) * 100
    }));

    // Streak calculation
    const sortedCompletedTasks = completedTasks
      .filter(todo => todo.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;

    sortedCompletedTasks.forEach(todo => {
      try {
        // Handle different date formats
        let completedDate;
        if (typeof todo.completedAt === 'string') {
          if (todo.completedAt.includes('T') || todo.completedAt.includes('-')) {
            completedDate = parseISO(todo.completedAt);
          } else {
            completedDate = new Date(todo.completedAt);
          }
        } else if (todo.completedAt instanceof Date) {
          completedDate = todo.completedAt;
        } else {
          return; // Skip invalid dates
        }
        
        const dateStr = format(completedDate, 'yyyy-MM-dd');
        
        if (!lastDate) {
          tempStreak = 1;
          if (format(now, 'yyyy-MM-dd') === dateStr || format(subDays(now, 1), 'yyyy-MM-dd') === dateStr) {
            currentStreak = 1;
          }
        } else {
          const daysDiff = Math.abs((new Date(lastDate) - completedDate) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 1) {
            tempStreak++;
            if (currentStreak > 0) currentStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
            currentStreak = 0;
          }
        }
        
        lastDate = dateStr;
      } catch (error) {
        console.warn('Invalid completedAt date format in streak calculation:', todo.completedAt, error);
      }
    });
    
    longestStreak = Math.max(longestStreak, tempStreak);

    // Category breakdown
    const categoryBreakdown = {};
    todos.forEach(todo => {
      const category = todo.category || 'uncategorized';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    // Priority breakdown
    const priorityBreakdown = {};
    todos.forEach(todo => {
      const priority = todo.priority || 'medium';
      priorityBreakdown[priority] = (priorityBreakdown[priority] || 0) + 1;
    });

    // Weekly stats for the last 4 weeks
    const weeklyStats = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(now, i * 7));
      const weekEnd = endOfWeek(weekStart);
      
      const weekTasks = todos.filter(todo => {
        if (!todo.createdAt) return false;
        try {
          // Handle different date formats
          let createdDate;
          if (typeof todo.createdAt === 'string') {
            if (todo.createdAt.includes('T') || todo.createdAt.includes('-')) {
              createdDate = parseISO(todo.createdAt);
            } else {
              createdDate = new Date(todo.createdAt);
            }
          } else if (todo.createdAt instanceof Date) {
            createdDate = todo.createdAt;
          } else {
            return false;
          }
          return isWithinInterval(createdDate, { start: weekStart, end: weekEnd });
        } catch (error) {
          console.warn('Invalid createdAt date format:', todo.createdAt, error);
          return false;
        }
      });
      
      const weekCompleted = weekTasks.filter(todo => todo.completed);
      
      weeklyStats.push({
        week: format(weekStart, 'MMM dd'),
        tasksCreated: weekTasks.length,
        tasksCompleted: weekCompleted.length,
        totalTimeSpent: weekCompleted.reduce((sum, todo) => sum + (todo.actualTime || 0), 0)
      });
    }

    return {
      completionRate,
      averageEstimationAccuracy,
      totalTasksCompleted: completedTasks.length,
      totalTasksCreated: todos.length,
      totalTimeSpent,
      productivityTrends,
      timeAccuracyData,
      streakData: { current: currentStreak, longest: longestStreak },
      categoryBreakdown,
      priorityBreakdown,
      weeklyStats
    };
  }, [todos]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {['week', 'month', 'quarter'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Insight Cards */}
      <InsightCards data={analyticsData} formatTime={formatTime} />

      {/* Procrastination Insights */}
      <ProcrastinationInsights tasks={todos} analytics={analyticsData} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Chart */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Productivity Trends</h3>
          <ProductivityChart data={analyticsData.productivityTrends} />
        </div>

        {/* Time Accuracy Chart */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Time Estimation Accuracy</h3>
          <TimeAccuracyChart data={analyticsData.timeAccuracyData} />
        </div>

        {/* Streak Counter */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Completion Streaks</h3>
          <StreakCounter data={analyticsData.streakData} />
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tasks by Category</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.categoryBreakdown).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / analyticsData.totalTasksCreated) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Stats Table */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-gray-400 pb-2">Week</th>
                <th className="text-left text-gray-400 pb-2">Created</th>
                <th className="text-left text-gray-400 pb-2">Completed</th>
                <th className="text-left text-gray-400 pb-2">Completion Rate</th>
                <th className="text-left text-gray-400 pb-2">Time Spent</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.weeklyStats.map((week, index) => (
                <tr key={index} className="border-b border-slate-700/50">
                  <td className="py-2 text-white">{week.week}</td>
                  <td className="py-2 text-gray-300">{week.tasksCreated}</td>
                  <td className="py-2 text-gray-300">{week.tasksCompleted}</td>
                  <td className="py-2 text-gray-300">
                    {week.tasksCreated > 0 ? Math.round((week.tasksCompleted / week.tasksCreated) * 100) : 0}%
                  </td>
                  <td className="py-2 text-gray-300">{formatTime(week.totalTimeSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;