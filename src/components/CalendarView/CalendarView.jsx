import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, parseISO } from 'date-fns';

const CalendarView = ({ todos, onTaskClick, onDateClick, onTaskUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    // Get first day of the week for the month (Sunday = 0)
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    // Get last day of the week for the month
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
    
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped = {};
    
    todos?.forEach(todo => {
      if (todo.deadline) {
        try {
          // Handle different date formats
          let dateKey;
          if (typeof todo.deadline === 'string') {
            // Try to parse as ISO string first
            if (todo.deadline.includes('T') || todo.deadline.includes('-')) {
              dateKey = format(parseISO(todo.deadline), 'yyyy-MM-dd');
            } else {
              // Fallback for other string formats
              dateKey = format(new Date(todo.deadline), 'yyyy-MM-dd');
            }
          } else if (todo.deadline instanceof Date) {
            dateKey = format(todo.deadline, 'yyyy-MM-dd');
          } else {
            // Skip invalid dates
            return;
          }
          
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(todo);
        } catch (error) {
          console.warn('Invalid date format for task:', todo.deadline, error);
        }
      }
    });
    
    return grouped;
  }, [todos]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleTaskDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDateDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDateDrop = (e, date) => {
    e.preventDefault();
    if (draggedTask && onTaskUpdate) {
      const newDeadline = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      onTaskUpdate(draggedTask._id || draggedTask.id, { deadline: newDeadline });
    }
    setDraggedTask(null);
  };

  const TaskPopover = ({ task, onClose }) => (
    <div className="absolute z-50 bg-slate-700 border border-slate-600 rounded-lg p-4 shadow-xl min-w-64 max-w-80">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-medium text-sm">{task.content}</h4>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {task.description && (
        <p className="text-gray-300 text-xs mb-2">{task.description}</p>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
        <span className="text-gray-400 text-xs capitalize">{task.priority} priority</span>
      </div>
      
      {task.estimatedTime && (
        <div className="text-gray-400 text-xs mb-2">
          Estimated: {Math.floor(task.estimatedTime / 60)}h {task.estimatedTime % 60}m
        </div>
      )}
      
      {task.category && (
        <div className="text-gray-400 text-xs mb-2">
          Category: {task.category}
        </div>
      )}
      
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag, index) => (
            <span key={index} className="bg-slate-600 text-gray-300 px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-2 mt-3">
        <button 
          onClick={() => onTaskClick?.(task)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
        >
          Edit
        </button>
        {!task.completed && (
          <button 
            onClick={() => onTaskUpdate?.(task._id || task.id, { completed: true })}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2 px-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 px-4 overflow-auto">
        <div className="grid grid-cols-7 gap-1 h-full">
          {calendarDays.map((date, index) => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const dayTasks = tasksByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={index}
                className={`
                  min-h-24 p-2 border border-slate-700 rounded-lg cursor-pointer transition-colors
                  ${isCurrentMonth ? 'bg-slate-800/50' : 'bg-slate-900/30'}
                  ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
                  hover:bg-slate-700/50
                `}
                onClick={() => onDateClick?.(date)}
                onDragOver={handleDateDragOver}
                onDrop={(e) => handleDateDrop(e, date)}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
                  ${isTodayDate ? 'text-blue-400' : ''}
                `}>
                  {format(date, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task, taskIndex) => (
                    <div
                      key={task._id || task.id}
                      draggable
                      onDragStart={(e) => handleTaskDragStart(e, task)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(selectedTask?._id === task._id ? null : task);
                      }}
                      className={`
                        relative text-xs p-1 rounded cursor-pointer transition-all
                        ${task.completed ? 'bg-green-600/20 text-green-300' : 'bg-slate-600/50 text-white'}
                        hover:bg-slate-500/70
                      `}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`}></span>
                        <span className="truncate flex-1">{task.content}</span>
                      </div>
                      
                      {selectedTask?._id === task._id && (
                        <TaskPopover 
                          task={task} 
                          onClose={() => setSelectedTask(null)}
                        />
                      )}
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-400 text-center">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;