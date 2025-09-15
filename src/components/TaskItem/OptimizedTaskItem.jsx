import React, { memo, useMemo, useCallback } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import Timer from '../Timer/Timer';
import RealisticDeadline from '../RealisticDeadline/RealisticDeadline';
import { useDeadlinePressure, usePressureMode } from '../../hooks/useDeadlinePressure';
import { highlightSearchTerm } from '../../utils/searchHighlight.jsx';
import images from '~/assets/index.js';

// Memoized priority configuration to prevent recalculation
const PRIORITY_CONFIG = {
  low: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  high: { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  urgent: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' }
};

// Memoized category icons
const CATEGORY_ICONS = {
  study: '📚',
  assignment: '📝',
  project: '🚀',
  personal: '👤',
  work: '💼',
  general: '📋'
};

// Memoized utility functions
const getCategoryIcon = (category) => CATEGORY_ICONS[category] || '📋';

const formatTime = (minutes) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatDeadline = (deadline) => {
  if (!deadline) return null;
  const date = new Date(deadline);
  const now = new Date();
  const diffTime = date - now;
  const diffHours = diffTime / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { 
      text: 'Overdue', 
      color: 'text-red-400', 
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      pulse: true,
      icon: '⚠️'
    };
  }
  if (diffHours <= 24) {
    return { 
      text: diffHours <= 1 ? 'Due now!' : diffDays === 0 ? 'Today' : 'Tomorrow',
      color: 'text-orange-400', 
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/50',
      pulse: diffHours <= 2,
      icon: '🔥'
    };
  }
  if (diffDays <= 3) {
    return { 
      text: `${diffDays} days`, 
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      pulse: false,
      icon: '⏰'
    };
  }
  if (diffDays <= 7) {
    return { 
      text: `${diffDays} days`, 
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      pulse: false,
      icon: '📅'
    };
  }
  return { 
    text: date.toLocaleDateString(), 
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    pulse: false,
    icon: '📅'
  };
};

// Memoized sub-components
const TaskCheckbox = memo(({ todo, onToggle, isDisabled, isToggling }) => (
  <div className="relative flex-shrink-0 mt-0.5">
    <label className="relative cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={todo.completed}
        onChange={onToggle}
        disabled={isDisabled}
      />
      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
        todo.completed 
          ? 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 border-transparent' 
          : 'border-gray-400 hover:border-gray-300'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {isToggling && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </label>
  </div>
));

TaskCheckbox.displayName = 'TaskCheckbox';

const TaskContent = memo(({ todo, searchTerm }) => (
  <div className="flex-1 min-w-0">
    <h3 className={`text-white font-medium transition-all duration-200 ${
      todo.completed ? 'line-through opacity-60' : ''
    } ${todo.isOptimistic ? 'italic' : ''}`}>
      {searchTerm ? highlightSearchTerm(todo.content, searchTerm) : todo.content}
      {todo.isOptimistic && <span className="text-xs text-gray-400 ml-2">(saving...)</span>}
    </h3>
    
    {todo.description && (
      <p className={`text-sm text-gray-400 mt-1 ${todo.completed ? 'line-through opacity-60' : ''}`}>
        {searchTerm ? highlightSearchTerm(todo.description, searchTerm) : todo.description}
      </p>
    )}
  </div>
));

TaskContent.displayName = 'TaskContent';

const TaskActions = memo(({ onEdit, onDelete, isDisabled, isDeleting }) => (
  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    {onEdit && (
      <button
        onClick={onEdit}
        className="w-6 h-6 rounded-full bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
        disabled={isDisabled}
        title="Edit task"
      >
        <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    )}
    
    <button
      onClick={onDelete}
      className={`w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-all duration-200 ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
      }`}
      disabled={isDisabled}
      title="Delete task"
    >
      {isDeleting ? (
        <LoadingSpinner size="sm" />
      ) : (
        <img src={images.closeWhiteIcon} alt="Delete task" className="w-3 h-3" />
      )}
    </button>
  </div>
));

TaskActions.displayName = 'TaskActions';

const TaskMetadata = memo(({ todo, priority, deadlineInfo }) => (
  <div className="flex items-center gap-4 text-xs">
    {/* Priority */}
    <span className={`inline-flex items-center px-2 py-1 rounded-full ${priority.bg} ${priority.color} ${priority.border} border`}>
      {todo.priority}
    </span>

    {/* Category */}
    {todo.category && (
      <span className="text-gray-400 flex items-center gap-1">
        {getCategoryIcon(todo.category)}
        <span className="capitalize">{todo.category}</span>
      </span>
    )}

    {/* Estimated time */}
    {todo.estimatedTime && (
      <span className="text-gray-400 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {formatTime(todo.estimatedTime)}
      </span>
    )}

    {/* Deadline */}
    {deadlineInfo && (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${deadlineInfo.color} ${deadlineInfo.bg} ${deadlineInfo.border} ${
        deadlineInfo.pulse ? 'animate-pulse' : ''
      }`}>
        <span className="text-xs">{deadlineInfo.icon}</span>
        {deadlineInfo.text}
      </span>
    )}

    {/* Time tracking statistics */}
    {todo.completed && todo.actualTime && todo.estimatedTime && (
      <span className="flex items-center gap-1">
        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className={`text-xs ${
          todo.actualTime > todo.estimatedTime 
            ? 'text-orange-400' 
            : todo.actualTime <= todo.estimatedTime * 0.8 
              ? 'text-green-400' 
              : 'text-gray-400'
        }`}>
          {formatTime(todo.actualTime)} / {formatTime(todo.estimatedTime)}
        </span>
        {todo.actualTime !== todo.estimatedTime && (
          <span className={`text-xs px-1 py-0.5 rounded ${
            todo.actualTime > todo.estimatedTime 
              ? 'bg-orange-500/20 text-orange-300' 
              : 'bg-green-500/20 text-green-300'
          }`}>
            {todo.actualTime > todo.estimatedTime ? '+' : ''}{Math.round(((todo.actualTime - todo.estimatedTime) / todo.estimatedTime) * 100)}%
          </span>
        )}
      </span>
    )}
  </div>
));

TaskMetadata.displayName = 'TaskMetadata';

const TaskTags = memo(({ tags }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-block px-2 py-0.5 text-xs bg-blue-600/20 text-blue-300 rounded-full"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
});

TaskTags.displayName = 'TaskTags';

const OptimizedTaskItem = memo(({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit, 
  onStartTimer, 
  onStopTimer, 
  onCompleteTask, 
  isLoading = false,
  searchTerm = '' 
}) => {
  // Memoize expensive calculations
  const priority = useMemo(() => PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium, [todo.priority]);
  const deadlineInfo = useMemo(() => todo.deadline ? formatDeadline(todo.deadline) : null, [todo.deadline]);
  
  // Deadline pressure hooks (memoized)
  const { isPressureModeEnabled } = usePressureMode();
  const memoizedTasks = useMemo(() => [todo], [todo]);
  const { getTaskPressure, getTaskVisualization, getTaskAnimations } = useDeadlinePressure(memoizedTasks, isPressureModeEnabled);
  
  const taskPressure = useMemo(() => getTaskPressure(todo._id || todo.id), [getTaskPressure, todo._id, todo.id]);
  const pressureVisualization = useMemo(() => getTaskVisualization(todo._id || todo.id), [getTaskVisualization, todo._id, todo.id]);
  const pressureAnimations = useMemo(() => getTaskAnimations(todo._id || todo.id), [getTaskAnimations, todo._id, todo.id]);

  // Memoize loading states
  const [isToggling, setIsToggling] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Calculate disabled state
  const isOptimistic = todo.isOptimistic;
  const isDisabled = isLoading || isToggling || isDeleting;

  // Memoized event handlers
  const handleToggle = useCallback(async (e) => {
    if (isLoading || isToggling || isDeleting) return;
    
    setIsToggling(true);
    try {
      await onToggle(todo._id || todo.id);
    } finally {
      setIsToggling(false);
    }
  }, [onToggle, todo._id, todo.id, isLoading, isToggling, isDeleting]);

  const handleDelete = useCallback(async () => {
    if (isLoading || isToggling || isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete(todo._id || todo.id);
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete, todo._id, todo.id, isLoading, isToggling, isDeleting]);

  const handleEdit = useCallback(() => {
    if (onEdit && !isDisabled) {
      onEdit(todo);
    }
  }, [onEdit, todo, isDisabled]);

  // Memoize container styling
  const containerStyling = useMemo(() => {
    if (todo.completed) {
      return 'bg-slate-700/20 hover:bg-slate-700/30 border-l-4 border-green-500/30';
    }
    
    if (todo.deadline && taskPressure.level > 0) {
      const baseClasses = `${pressureVisualization.backgroundColor} hover:${pressureVisualization.backgroundColor.replace('/30', '/40')} border-l-4 ${pressureVisualization.borderColor}`;
      const glowClasses = pressureVisualization.glowClass ? `shadow-lg ${pressureVisualization.glowClass}` : '';
      const animationClasses = pressureVisualization.pulseClass || '';
      
      return `${baseClasses} ${glowClasses} ${animationClasses} ${pressureAnimations}`.trim();
    }
    
    if (deadlineInfo?.pulse) {
      return `bg-red-900/20 hover:bg-red-900/30 border-l-4 ${deadlineInfo.border} animate-pulse`;
    }
    
    if (deadlineInfo?.color === 'text-orange-400') {
      return `bg-orange-900/10 hover:bg-orange-900/20 border-l-4 ${deadlineInfo.border}`;
    }
    
    if (deadlineInfo?.color === 'text-yellow-400') {
      return `bg-yellow-900/10 hover:bg-yellow-900/20 border-l-4 ${deadlineInfo.border}`;
    }
    
    return `bg-slate-700/30 hover:bg-slate-700/50 border-l-4 ${priority.border}`;
  }, [todo.completed, todo.deadline, taskPressure.level, pressureVisualization, pressureAnimations, deadlineInfo, priority.border]);

  return (
    <div className={`relative p-2.5 rounded-lg transition-all duration-200 group ${containerStyling} ${
      isOptimistic ? 'opacity-70' : 'opacity-100'
    }`}>
      {/* Main content row */}
      <div className="flex items-start gap-2.5 mb-1">
        <TaskCheckbox 
          todo={todo}
          onToggle={handleToggle}
          isDisabled={isDisabled}
          isToggling={isToggling}
        />
        
        <TaskContent todo={todo} searchTerm={searchTerm} />

        <TaskActions 
          onEdit={onEdit ? handleEdit : null}
          onDelete={handleDelete}
          isDisabled={isDisabled}
          isDeleting={isDeleting}
        />
      </div>

      {/* Metadata row */}
      <TaskMetadata 
        todo={todo}
        priority={priority}
        deadlineInfo={deadlineInfo}
      />

      {/* Tags */}
      <TaskTags tags={todo.tags} />

      {/* Realistic deadline component */}
      {todo.deadline && !todo.completed && (
        <div className="mt-1.5 pt-1.5 border-t border-slate-600/30">
          <RealisticDeadline task={todo} />
        </div>
      )}

      {/* Timer component for active tasks */}
      {!todo.completed && (onStartTimer || onStopTimer || onCompleteTask) && (
        <div className="mt-1.5 pt-1.5 border-t border-slate-600/30">
          <Timer
            task={todo}
            onStart={onStartTimer}
            onStop={onStopTimer}
            onComplete={onCompleteTask}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
});

OptimizedTaskItem.displayName = 'OptimizedTaskItem';

export default OptimizedTaskItem;