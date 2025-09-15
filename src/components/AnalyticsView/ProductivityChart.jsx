import { useMemo } from 'react';

const ProductivityChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { maxValue: 1, bars: [] };
    
    const maxCompleted = Math.max(...data.map(d => d.completed), 1);
    const maxTime = Math.max(...data.map(d => d.timeSpent), 1);
    
    return {
      maxCompleted,
      maxTime,
      bars: data.map(d => ({
        ...d,
        completedHeight: (d.completed / maxCompleted) * 100,
        timeHeight: (d.timeSpent / maxTime) * 100
      }))
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No productivity data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-48">
      <div className="flex items-end justify-between h-40 gap-2">
        {chartData.bars.map((bar, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            {/* Tasks Completed Bar */}
            <div className="w-full flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-400 relative group"
                style={{ height: `${bar.completedHeight}%`, minHeight: bar.completed > 0 ? '4px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {bar.completed} tasks
                </div>
              </div>
            </div>
            
            {/* Time Spent Bar */}
            <div className="w-full flex flex-col items-center">
              <div 
                className="w-full bg-green-500 rounded-t transition-all duration-300 hover:bg-green-400 relative group"
                style={{ height: `${bar.timeHeight}%`, minHeight: bar.timeSpent > 0 ? '4px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {Math.floor(bar.timeSpent / 60)}h {bar.timeSpent % 60}m
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {chartData.bars.map((bar, index) => (
          <div key={index} className="flex-1 text-center">
            <span className="text-xs text-gray-400">{bar.date}</span>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-400">Tasks Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-400">Time Spent</span>
        </div>
      </div>
    </div>
  );
};

export default ProductivityChart;