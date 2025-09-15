import React, { useState } from 'react';
import { useProcrastinationDetection, useProcrastinationInsights } from '../../hooks/useProcrastinationDetection';

const ProcrastinationInsights = ({ tasks = [], analytics = null }) => {
  const [showDetails, setShowDetails] = useState(false);
  const {
    patterns,
    userPatterns,
    procrastinationCoefficient,
    estimationAccuracy,
    resetPatterns
  } = useProcrastinationDetection(tasks, analytics);

  const insights = useProcrastinationInsights(tasks);

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'danger': return '🚨';
      case 'info': return 'ℹ️';
      case 'tip': return '💡';
      default: return '📊';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'danger': return 'border-red-500 bg-red-500/10';
      case 'info': return 'border-blue-500 bg-blue-500/10';
      case 'tip': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTendencyColor = (tendency) => {
    switch (tendency) {
      case 'high': return 'text-red-400';
      case 'moderate': return 'text-yellow-400';
      case 'normal': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (!patterns && insights.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Procrastination Insights</h3>
        <p className="text-gray-400">Complete more tasks to see personalized insights and patterns.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">📊 Procrastination Insights</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400">Procrastination Level</div>
          <div className={`text-xl font-semibold ${getTendencyColor(patterns?.overallTendency)}`}>
            {patterns?.overallTendency || 'Normal'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Coefficient: {procrastinationCoefficient.toFixed(2)}x
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400">Estimation Accuracy</div>
          <div className="text-xl font-semibold text-white">
            {Math.round(estimationAccuracy * 100)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {estimationAccuracy > 0.8 ? 'Excellent' : 
             estimationAccuracy > 0.6 ? 'Good' : 'Needs improvement'}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-400">Confidence Level</div>
          <div className="text-xl font-semibold text-white">
            {Math.round((patterns?.confidence || 0) * 100)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Based on {tasks.filter(t => t.completed).length} completed tasks
          </div>
        </div>
      </div>

      {/* Insights and Alerts */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-medium text-white">Current Insights</h4>
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <h5 className="font-medium text-white">{insight.title}</h5>
                  <p className="text-sm text-gray-300 mt-1">{insight.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{insight.action}</p>
                  
                  {insight.tasks.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {insight.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="text-xs text-gray-300 bg-gray-700/50 rounded px-2 py-1">
                          {task.content}
                          {task.deadline && (
                            <span className="text-gray-400 ml-2">
                              Due: {formatDate(task.deadline)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Patterns */}
      {showDetails && patterns && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">Detailed Analysis</h4>
          
          {/* Risk Factors */}
          {patterns.riskFactors.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h5 className="font-medium text-white mb-2">Risk Factors</h5>
              <ul className="space-y-1">
                {patterns.riskFactors.map((factor, index) => (
                  <li key={index} className="text-sm text-red-300 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {patterns.suggestions.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h5 className="font-medium text-white mb-2">Suggestions</h5>
              <ul className="space-y-1">
                {patterns.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-green-300 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pattern Multipliers */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-white mb-3">Time Adjustment Patterns</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h6 className="text-sm font-medium text-gray-300 mb-2">By Category</h6>
                <div className="space-y-1">
                  {Object.entries(userPatterns.taskTypeMultipliers).map(([category, multiplier]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{category}</span>
                      <span className={multiplier > 1.1 ? 'text-red-300' : multiplier < 0.9 ? 'text-green-300' : 'text-gray-300'}>
                        {multiplier.toFixed(2)}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h6 className="text-sm font-medium text-gray-300 mb-2">By Priority</h6>
                <div className="space-y-1">
                  {Object.entries(userPatterns.priorityMultipliers).map(([priority, multiplier]) => (
                    <div key={priority} className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{priority}</span>
                      <span className={multiplier > 1.1 ? 'text-red-300' : multiplier < 0.9 ? 'text-green-300' : 'text-gray-300'}>
                        {multiplier.toFixed(2)}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={resetPatterns}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Reset Patterns
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcrastinationInsights;