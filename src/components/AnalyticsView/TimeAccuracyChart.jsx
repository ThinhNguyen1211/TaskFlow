import { useMemo } from 'react';

const TimeAccuracyChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { maxValue: 1, bars: [] };
    
    const maxTime = Math.max(...data.flatMap(d => [d.estimated, d.actual]), 1);
    
    return {
      maxTime,
      bars: data.map(d => ({
        ...d,
        estimatedHeight: (d.estimated / maxTime) * 100,
        actualHeight: (d.actual / maxTime) * 100
      }))
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No time tracking data available</p>
        </div>
      </div>
    );
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="h-48">
      <div className="flex items-end justify-between h-40 gap-1">
        {chartData.bars.map((bar, index) => (
          <div key={index} className="flex-1 flex gap-1 items-end">
            {/* Estimated Time Bar */}
            <div className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-yellow-500 rounded-t transition-all duration-300 hover:bg-yellow-400 relative group"
                style={{ height: `${bar.estimatedHeight}%`, minHeight: bar.estimated > 0 ? '4px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Est: {formatTime(bar.estimated)}
                </div>
              </div>
            </div>
            
            {/* Actual Time Bar */}
            <div className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-purple-500 rounded-t transition-all duration-300 hover:bg-purple-400 relative group"
                style={{ height: `${bar.actualHeight}%`, minHeight: bar.actual > 0 ? '4px' : '0' }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Act: {formatTime(bar.actual)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 gap-1">
        {chartData.bars.map((bar, index) => (
          <div key={index} className="flex-1 text-center">
            <span className="text-xs text-gray-400 block truncate" title={bar.task}>
              {bar.task}
            </span>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-xs text-gray-400">Estimated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-xs text-gray-400">Actual</span>
        </div>
      </div>
      
      {/* Average Accuracy */}
      {data.length > 0 && (
        <div className="text-center mt-2">
          <span className="text-sm text-gray-400">
            Avg Accuracy: {Math.round(data.reduce((sum, d) => sum + d.accuracy, 0) / data.length)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default TimeAccuracyChart;