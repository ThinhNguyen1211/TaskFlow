import React, { useState } from 'react';
import { useProcrastinationDetection } from '../../hooks/useProcrastinationDetection';

const RealisticDeadline = ({ task, showDetails = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { 
    getRealisticDeadline, 
    getAdjustedEstimatedTime, 
    getProcrastinationRisk,
    getTimeEstimationSuggestions 
  } = useProcrastinationDetection();

  if (!task.deadline) return null;

  const officialDeadline = new Date(task.deadline);
  const realisticDeadline = getRealisticDeadline(task);
  const adjustedTime = getAdjustedEstimatedTime(task);
  const risk = getProcrastinationRisk(task);
  const suggestions = getTimeEstimationSuggestions(task);

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'overdue': return 'text-red-500 bg-red-500/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'overdue': return '🚨';
      case 'critical': return '⚠️';
      case 'high': return '🔶';
      case 'medium': return '🔸';
      case 'low': return '✅';
      default: return '❓';
    }
  };

  const timeDifference = realisticDeadline ? 
    (officialDeadline.getTime() - realisticDeadline.getTime()) / (1000 * 60 * 60) : 0;

  return (
    <div className="space-y-2">
      {/* Main deadline display */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-400">Due:</span>
        <span className="text-white">{formatDateTime(officialDeadline)}</span>
        
        {realisticDeadline && timeDifference > 1 && (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="text-blue-400 cursor-help">
              (Start by {formatDateTime(realisticDeadline)})
            </span>
            
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 border border-gray-600 rounded-lg shadow-lg z-10 w-64">
                <div className="text-xs text-gray-300 space-y-1">
                  <div><strong>Realistic start time:</strong> {formatDateTime(realisticDeadline)}</div>
                  <div><strong>Buffer time:</strong> {Math.round(timeDifference)}h earlier</div>
                  <div><strong>Adjusted estimate:</strong> {formatTime(adjustedTime)}</div>
                  {task.estimatedTime && (
                    <div><strong>Original estimate:</strong> {formatTime(task.estimatedTime)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Risk indicator */}
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getRiskColor(risk.level)}`}>
        <span>{getRiskIcon(risk.level)}</span>
        <span>{risk.message}</span>
      </div>

      {/* Detailed information */}
      {showDetails && (
        <div className="bg-gray-700 rounded-lg p-3 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-400">Official deadline:</span>
              <div className="text-white">{formatDateTime(officialDeadline)}</div>
            </div>
            
            {realisticDeadline && (
              <div>
                <span className="text-gray-400">Suggested start:</span>
                <div className="text-blue-300">{formatDateTime(realisticDeadline)}</div>
              </div>
            )}
          </div>

          {task.estimatedTime && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Your estimate:</span>
                <div className="text-white">{formatTime(task.estimatedTime)}</div>
              </div>
              
              <div>
                <span className="text-gray-400">Adjusted estimate:</span>
                <div className="text-yellow-300">{formatTime(adjustedTime)}</div>
              </div>
            </div>
          )}

          {suggestions.reasoning.length > 0 && (
            <div>
              <span className="text-gray-400">Adjustments based on:</span>
              <ul className="mt-1 space-y-1">
                {suggestions.reasoning.map((reason, index) => (
                  <li key={index} className="text-gray-300 flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.similarTasksAnalysis && (
            <div>
              <span className="text-gray-400">Similar tasks analysis:</span>
              <div className="text-gray-300 mt-1">
                Based on {suggestions.similarTasksAnalysis.count} similar tasks, 
                average actual time: {formatTime(suggestions.similarTasksAnalysis.avgActualTime)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealisticDeadline;