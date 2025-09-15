const InsightCards = ({ data, formatTime }) => {
  const {
    completionRate,
    averageEstimationAccuracy,
    totalTasksCompleted,
    totalTasksCreated,
    totalTimeSpent,
    priorityBreakdown
  } = data;

  const cards = [
    {
      title: 'Completion Rate',
      value: `${Math.round(completionRate)}%`,
      subtitle: `${totalTasksCompleted} of ${totalTasksCreated} tasks`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: completionRate >= 80 ? 'text-green-400' : completionRate >= 60 ? 'text-yellow-400' : 'text-red-400',
      bgColor: completionRate >= 80 ? 'bg-green-500/10' : completionRate >= 60 ? 'bg-yellow-500/10' : 'bg-red-500/10'
    },
    {
      title: 'Time Accuracy',
      value: `${Math.round(averageEstimationAccuracy)}%`,
      subtitle: 'Estimation vs actual time',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: averageEstimationAccuracy >= 80 ? 'text-green-400' : averageEstimationAccuracy >= 60 ? 'text-yellow-400' : 'text-red-400',
      bgColor: averageEstimationAccuracy >= 80 ? 'bg-green-500/10' : averageEstimationAccuracy >= 60 ? 'bg-yellow-500/10' : 'bg-red-500/10'
    },
    {
      title: 'Total Time Spent',
      value: formatTime(totalTimeSpent),
      subtitle: 'On completed tasks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Urgent Tasks',
      value: priorityBreakdown.urgent || 0,
      subtitle: 'Require immediate attention',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: (priorityBreakdown.urgent || 0) > 0 ? 'text-red-400' : 'text-gray-400',
      bgColor: (priorityBreakdown.urgent || 0) > 0 ? 'bg-red-500/10' : 'bg-gray-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-slate-700/50`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`${card.color}`}>
              {card.icon}
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-400">{card.title}</h3>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-500">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InsightCards;