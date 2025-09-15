import { useState, useEffect, useRef } from 'react';

const Timer = ({ 
  task, 
  onStart, 
  onStop, 
  onComplete, 
  isLoading = false 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  // Initialize timer state based on task
  useEffect(() => {
    if (task?.startedAt && !task?.completed) {
      const started = new Date(task.startedAt);
      const now = new Date();
      const elapsed = Math.floor((now - started) / 1000);
      setElapsedTime(elapsed);
      setIsRunning(true);
      setStartTime(started);
    } else {
      setIsRunning(false);
      setElapsedTime(0);
      setStartTime(null);
    }
  }, [task]);

  // Timer interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = async () => {
    if (isLoading || task?.completed) return;
    
    try {
      await onStart(task._id || task.id);
      setIsRunning(true);
      setStartTime(new Date());
      setElapsedTime(0);
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  };

  const handleStop = async () => {
    if (isLoading) return;
    
    try {
      const actualTimeMinutes = Math.ceil(elapsedTime / 60);
      await onStop(task._id || task.id, actualTimeMinutes);
      setIsRunning(false);
      setElapsedTime(0);
      setStartTime(null);
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };

  const handleComplete = async () => {
    if (isLoading) return;
    
    try {
      const actualTimeMinutes = Math.ceil(elapsedTime / 60);
      await onComplete(task._id || task.id, actualTimeMinutes);
      setIsRunning(false);
      setElapsedTime(0);
      setStartTime(null);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress vs estimate
  const getProgressInfo = () => {
    if (!task?.estimatedTime) return null;
    
    const elapsedMinutes = Math.ceil(elapsedTime / 60);
    const estimatedMinutes = task.estimatedTime;
    const progress = (elapsedMinutes / estimatedMinutes) * 100;
    
    return {
      progress: Math.min(progress, 100),
      isOvertime: elapsedMinutes > estimatedMinutes,
      elapsedMinutes,
      estimatedMinutes
    };
  };

  const progressInfo = getProgressInfo();

  if (task?.completed) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Completed</span>
        {task.actualTime && task.estimatedTime && (
          <span className={`ml-2 ${task.actualTime > task.estimatedTime ? 'text-orange-400' : 'text-green-400'}`}>
            {Math.ceil(task.actualTime)}m / {task.estimatedTime}m
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Timer display */}
      <div className="flex items-center gap-3">
        <div className={`font-mono text-lg ${isRunning ? 'text-blue-400' : 'text-gray-400'}`}>
          {formatTime(elapsedTime)}
        </div>
        
        {/* Timer controls */}
        <div className="flex items-center gap-1">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="flex items-center gap-1 px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded text-xs transition-colors disabled:opacity-50"
              title="Start timer"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1M9 6h6" />
              </svg>
              Start
            </button>
          ) : (
            <>
              <button
                onClick={handleStop}
                disabled={isLoading}
                className="flex items-center gap-1 px-2 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded text-xs transition-colors disabled:opacity-50"
                title="Pause timer"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
                Pause
              </button>
              
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs transition-colors disabled:opacity-50"
                title="Complete task"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Done
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress bar (if estimated time exists) */}
      {progressInfo && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress</span>
            <span className={progressInfo.isOvertime ? 'text-orange-400' : 'text-gray-400'}>
              {progressInfo.elapsedMinutes}m / {progressInfo.estimatedMinutes}m
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                progressInfo.isOvertime 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                  : 'bg-gradient-to-r from-blue-500 to-green-500'
              }`}
              style={{ width: `${Math.min(progressInfo.progress, 100)}%` }}
            />
          </div>
          {progressInfo.isOvertime && (
            <div className="text-xs text-orange-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Over estimated time
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timer;