const StreakCounter = ({ data }) => {
  const { current, longest } = data || { current: 0, longest: 0 };

  const getStreakColor = (streak) => {
    if (streak >= 7) return 'text-green-400';
    if (streak >= 3) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it up!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "You're on fire! 🔥";
    return "Incredible dedication! 🏆";
  };

  return (
    <div className="text-center space-y-6">
      {/* Current Streak */}
      <div className="space-y-2">
        <h4 className="text-sm text-gray-400 uppercase tracking-wide">Current Streak</h4>
        <div className={`text-6xl font-bold ${getStreakColor(current)}`}>
          {current}
        </div>
        <p className="text-sm text-gray-300">
          {current === 1 ? 'day' : 'days'}
        </p>
        <p className="text-xs text-gray-400 italic">
          {getStreakMessage(current)}
        </p>
      </div>

      {/* Streak Visualization */}
      <div className="space-y-2">
        <div className="flex justify-center gap-1">
          {Array.from({ length: Math.min(current, 14) }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < current ? 'bg-green-500' : 'bg-slate-600'
              }`}
            />
          ))}
          {current > 14 && (
            <span className="text-green-400 text-sm ml-2">+{current - 14}</span>
          )}
        </div>
        <p className="text-xs text-gray-500">Last 14 days</p>
      </div>

      {/* Longest Streak */}
      <div className="border-t border-slate-700 pt-4 space-y-2">
        <h4 className="text-sm text-gray-400 uppercase tracking-wide">Personal Best</h4>
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-2xl font-bold text-yellow-400">{longest}</span>
          <span className="text-sm text-gray-300">
            {longest === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Motivational Section */}
      <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
        <h5 className="text-sm font-medium text-white">Next Milestone</h5>
        {current < 3 && (
          <p className="text-xs text-gray-400">
            Complete tasks for {3 - current} more {3 - current === 1 ? 'day' : 'days'} to reach a 3-day streak!
          </p>
        )}
        {current >= 3 && current < 7 && (
          <p className="text-xs text-gray-400">
            {7 - current} more {7 - current === 1 ? 'day' : 'days'} to reach a week-long streak!
          </p>
        )}
        {current >= 7 && current < 30 && (
          <p className="text-xs text-gray-400">
            {30 - current} more days to reach a month-long streak!
          </p>
        )}
        {current >= 30 && (
          <p className="text-xs text-gray-400">
            You're a productivity master! Keep up the amazing work!
          </p>
        )}
      </div>

      {/* Achievement Badges */}
      <div className="flex justify-center gap-2">
        {longest >= 3 && (
          <div className="bg-bronze-500 text-white px-2 py-1 rounded-full text-xs">
            3-Day Warrior
          </div>
        )}
        {longest >= 7 && (
          <div className="bg-silver-500 text-white px-2 py-1 rounded-full text-xs">
            Week Champion
          </div>
        )}
        {longest >= 30 && (
          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
            Month Master
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCounter;