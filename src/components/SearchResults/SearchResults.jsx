import React, { useMemo } from 'react';
import { highlightSearchTerm } from '../../utils/searchHighlight';
import { calculateSearchScore } from '../../services/searchService';

const SearchResults = ({ 
  tasks, 
  searchTerm, 
  totalCount, 
  isLoading,
  onTaskClick,
  className = ''
}) => {
  // Calculate search scores for ranking display
  const tasksWithScores = useMemo(() => {
    if (!searchTerm || !tasks) return tasks;
    
    return tasks.map(task => ({
      ...task,
      searchScore: calculateSearchScore(task, searchTerm)
    })).sort((a, b) => b.searchScore - a.searchScore);
  }, [tasks, searchTerm]);

  if (isLoading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-700/30 rounded-lg p-4">
              <div className="h-4 bg-slate-600/50 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-600/30 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-medium mb-2">
          {searchTerm ? 'No matching tasks found' : 'No tasks yet'}
        </h3>
        <p className="text-gray-400 text-sm">
          {searchTerm 
            ? `Try adjusting your search terms or filters`
            : 'Add your first task to get started'
          }
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Search summary */}
      {searchTerm && (
        <div className="px-4 py-2 bg-slate-700/20 rounded-lg border border-slate-600/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">
              Search results for: <span className="text-blue-300 font-medium">"{searchTerm}"</span>
            </span>
            <span className="text-gray-400">
              {totalCount} result{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Results list */}
      <div className="space-y-2">
        {tasksWithScores.map((task, index) => (
          <SearchResultItem
            key={task._id || task.id}
            task={task}
            searchTerm={searchTerm}
            rank={index + 1}
            onClick={() => onTaskClick?.(task)}
            showScore={process.env.NODE_ENV === 'development'}
          />
        ))}
      </div>
    </div>
  );
};

const SearchResultItem = ({ 
  task, 
  searchTerm, 
  rank, 
  onClick, 
  showScore = false 
}) => {
  const priorityColors = {
    urgent: 'bg-red-500/20 text-red-300 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-300 border-green-500/30'
  };

  const categoryIcons = {
    study: '📚',
    assignment: '📝',
    project: '🚀',
    personal: '👤',
    work: '💼',
    general: '📋'
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-400' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-400' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-yellow-400' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: 'text-blue-400' };
    } else {
      return { text: date.toLocaleDateString(), color: 'text-gray-400' };
    }
  };

  const deadlineInfo = formatDeadline(task.deadline);

  return (
    <div 
      className={`bg-slate-700/30 rounded-lg p-4 border border-slate-600/30 hover:bg-slate-700/50 transition-colors cursor-pointer ${
        task.completed ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Rank indicator */}
          <span className="text-xs text-gray-500 font-mono w-6">#{rank}</span>
          
          {/* Completion status */}
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
            task.completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-400'
          }`}>
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          
          {/* Category icon */}
          <span className="text-sm">
            {categoryIcons[task.category] || categoryIcons.general}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority badge */}
          <span className={`px-2 py-1 rounded-full text-xs border ${
            priorityColors[task.priority] || priorityColors.medium
          }`}>
            {task.priority}
          </span>
          
          {/* Search score (dev only) */}
          {showScore && task.searchScore > 0 && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
              Score: {task.searchScore}
            </span>
          )}
        </div>
      </div>

      {/* Task title with highlighting */}
      <h3 className={`font-medium mb-1 ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
        {searchTerm ? highlightSearchTerm(task.content, searchTerm) : task.content}
      </h3>

      {/* Task description with highlighting */}
      {task.description && (
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
          {searchTerm ? highlightSearchTerm(task.description, searchTerm) : task.description}
        </p>
      )}

      {/* Tags with highlighting */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
            >
              #{searchTerm ? highlightSearchTerm(tag, searchTerm) : tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer info */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          {/* Deadline */}
          {deadlineInfo && (
            <span className={deadlineInfo.color}>
              📅 {deadlineInfo.text}
            </span>
          )}
          
          {/* Time estimate */}
          {task.estimatedTime && (
            <span>
              ⏱️ {task.estimatedTime}min
            </span>
          )}
          
          {/* Actual time (if completed) */}
          {task.completed && task.actualTime && (
            <span>
              ✅ {task.actualTime}min
            </span>
          )}
        </div>

        {/* Created date */}
        <span>
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default SearchResults;