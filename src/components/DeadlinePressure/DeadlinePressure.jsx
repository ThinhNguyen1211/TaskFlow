import React, { useState, useEffect } from 'react';
import { useDeadlinePressure, usePressureMode } from '../../hooks/useDeadlinePressure';

// Error boundary wrapper for DeadlinePressure
class DeadlinePressureErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('DeadlinePressure Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-gray-800 rounded-lg p-6">
                    <div className="text-center text-gray-400">
                        <h3 className="text-lg font-semibold text-white mb-2">⚠️ Deadline Pressure Monitor</h3>
                        <p className="text-sm">Unable to load pressure monitoring. Please refresh the page.</p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const DeadlinePressure = ({ tasks = [] }) => {
    const [error, setError] = useState(null);
    const { isPressureModeEnabled, togglePressureMode } = usePressureMode();
    const [showDetails, setShowDetails] = useState(false);
    const [showPressureInfo, setShowPressureInfo] = useState(false);

    // Call hook at top level - React hooks cannot be in try-catch
    const hookData = useDeadlinePressure(tasks || [], isPressureModeEnabled);

    // Monitor for errors in hook data
    useEffect(() => {
        if (hookData === null || hookData === undefined) {
            console.warn('useDeadlinePressure returned null/undefined data');
            // Reset error if we were previously in error state
            if (error) {
                setError(null);
            }
        }
    }, [hookData, error]);

    // Wrap the entire component in error handling
    if (error || !hookData) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-center text-gray-400">
                    <h3 className="text-lg font-semibold text-white mb-2">⚠️ Deadline Pressure Monitor</h3>
                    <p className="text-sm">
                        {error ? 'Error loading pressure monitoring.' : 'Initializing pressure monitoring...'}
                    </p>
                    <button
                        onClick={() => {
                            setError(null);
                            // Try to force a re-render
                            window.location.reload();
                        }}
                        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                    >
                        {error ? 'Refresh Page' : 'Loading...'}
                    </button>
                </div>
            </div>
        );
    }

    // Ensure all required properties exist with fallbacks
    const safeHookData = {
        tasksByPressure: hookData?.tasksByPressure || [],
        pressureStats: hookData?.pressureStats || {
            total: 0,
            overdue: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            none: 0,
        },
        conflicts: hookData?.conflicts || [],
        suggestions: hookData?.suggestions || [],
        alerts: hookData?.alerts || [],
        formatTimeRemaining: hookData?.formatTimeRemaining || ((time) => `${Math.round(Math.abs(time || 0))} hours`),
        getPressureIcon:
            hookData?.getPressureIcon ||
            ((level) => {
                const icons = { 0: '📅', 1: '🔵', 2: '🟡', 3: '🟠', 4: '🔴', 5: '🚨' };
                return icons[level] || '📅';
            }),
    };

    const { tasksByPressure, pressureStats, conflicts, suggestions, alerts, formatTimeRemaining, getPressureIcon } =
        safeHookData;

    const getPressureColor = (level) => {
        const colors = {
            overdue: 'text-red-400 bg-red-500/20 border-red-500/50',
            critical: 'text-red-300 bg-red-400/20 border-red-400/50',
            high: 'text-orange-300 bg-orange-400/20 border-orange-400/50',
            medium: 'text-yellow-300 bg-yellow-400/20 border-yellow-400/50',
            low: 'text-blue-300 bg-blue-400/20 border-blue-400/50',
            none: 'text-gray-300 bg-gray-400/20 border-gray-400/50',
        };
        return colors[level] || colors.none;
    };

    const getSuggestionIcon = (type) => {
        const icons = {
            critical: '🚨',
            warning: '⚠️',
            info: 'ℹ️',
            suggestion: '💡',
        };
        return icons[type] || '📋';
    };

    const formatTime = (minutes) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    };
    return (
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            {/* Header with Pressure Mode Toggle */}
            <div className="flex items-center justify-center md:justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold text-white flex items-center justify-center gap-2 text-center">
                    🎯 Deadline Pressure Monitor
                    {isPressureModeEnabled && (
                        <div className="relative">
                            <button
                                onClick={() => setShowPressureInfo(!showPressureInfo)}
                                className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full animate-pulse hover:bg-red-500/30 transition-colors cursor-pointer"
                            >
                                PRESSURE MODE
                            </button>

                            {showPressureInfo && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-red-900/90 border border-red-500/50 rounded-lg p-3 min-w-64 shadow-xl">
                                    <div className="flex items-start gap-2 text-red-200">
                                        <span className="text-sm">🔥</span>
                                        <div className="text-xs">
                                            <div className="font-medium mb-1">Pressure Mode Active</div>
                                            <div className="text-red-300">
                                                Visual indicators are intensified to help you focus on urgent tasks.
                                                Tasks with approaching deadlines will pulse and glow.
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowPressureInfo(false)}
                                        className="absolute top-1 right-1 text-red-400 hover:text-red-200 text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </h3>

                <div className="flex items-center justify-center gap-3">
                    {(conflicts.length > 0 || suggestions.length > 0) && (
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {showDetails ? 'Hide Advanced' : 'Show Advanced'}
                        </button>
                    )}

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPressureModeEnabled}
                            onChange={togglePressureMode}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        <span className="ml-2 text-sm text-gray-300">Pressure Mode</span>
                    </label>
                </div>
            </div>
            {/* Alerts */}
            {alerts.length > 0 && (
                <div className="space-y-2">
                    {alerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg border ${
                                alert.type === 'error'
                                    ? 'bg-red-500/20 border-red-500/50 text-red-200'
                                    : 'bg-orange-500/20 border-orange-500/50 text-orange-200'
                            } ${isPressureModeEnabled ? 'animate-pulse' : ''}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">
                                    {alert.level === 'overdue' ? '🚨' : alert.level === 'critical' ? '⚠️' : '⚠️'}
                                </span>
                                <span className="font-medium">{alert.message}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pressure Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                    { key: 'overdue', label: 'Overdue', color: 'red' },
                    { key: 'critical', label: 'Critical', color: 'red' },
                    { key: 'high', label: 'High', color: 'orange' },
                    { key: 'medium', label: 'Medium', color: 'yellow' },
                    { key: 'low', label: 'Low', color: 'blue' },
                    { key: 'none', label: 'No Deadline', color: 'gray' },
                ].map(({ key, label, color }) => (
                    <div
                        key={key}
                        className={`bg-gray-700 rounded-lg p-3 text-center ${
                            pressureStats[key] > 0 && (key === 'overdue' || key === 'critical') && isPressureModeEnabled
                                ? 'animate-pulse'
                                : ''
                        }`}
                    >
                        <div
                            className={`text-2xl font-bold ${
                                color === 'red'
                                    ? 'text-red-400'
                                    : color === 'orange'
                                    ? 'text-orange-400'
                                    : color === 'yellow'
                                    ? 'text-yellow-400'
                                    : color === 'blue'
                                    ? 'text-blue-400'
                                    : 'text-gray-400'
                            }`}
                        >
                            {pressureStats[key]}
                        </div>
                        <div className="text-xs text-gray-400">{label}</div>
                    </div>
                ))}
            </div>
            {/* High Priority Tasks */}
            {tasksByPressure.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-md font-medium text-white">Tasks by Urgency</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {tasksByPressure.slice(0, 10).map((task) => (
                            <div
                                key={task._id || task.id}
                                className={`p-3 rounded-lg border transition-all duration-200 ${getPressureColor(
                                    task.pressure.name,
                                )} ${
                                    task.pressure.level >= 3 && isPressureModeEnabled ? 'animate-pulse shadow-lg' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-lg">{getPressureIcon(task.pressure?.level || 0)}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-white truncate">{task.content}</div>
                                            <div className="text-xs text-gray-300">{task.pressure.message}</div>
                                        </div>
                                    </div>

                                    <div className="text-right text-xs">
                                        <div className="text-gray-300">
                                            {formatTimeRemaining(task.pressure.timeRemaining)}
                                        </div>
                                        {task.estimatedTime && (
                                            <div className="text-gray-400">Est: {formatTime(task.estimatedTime)}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Urgency bar */}
                                <div className="mt-2 w-full bg-gray-600 rounded-full h-1">
                                    <div
                                        className={`h-1 rounded-full transition-all duration-300 ${
                                            task.pressure.urgency > 80
                                                ? 'bg-red-500'
                                                : task.pressure.urgency > 60
                                                ? 'bg-orange-500'
                                                : task.pressure.urgency > 40
                                                ? 'bg-yellow-500'
                                                : task.pressure.urgency > 20
                                                ? 'bg-blue-500'
                                                : 'bg-gray-500'
                                        }`}
                                        style={{ width: `${Math.min(task.pressure.urgency || 0, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Detailed Information */}
            {showDetails && (
                <div className="space-y-4">
                    {/* Deadline Conflicts */}
                    {conflicts.length > 0 && (
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-white mb-3">Deadline Conflicts</h5>
                            <div className="space-y-3">
                                {conflicts.map((conflict, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded border ${
                                            conflict.severity === 'high'
                                                ? 'border-red-500/50 bg-red-500/10'
                                                : conflict.severity === 'medium'
                                                ? 'border-orange-500/50 bg-orange-500/10'
                                                : 'border-yellow-500/50 bg-yellow-500/10'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium capitalize">
                                                {conflict.window.replace('_', ' ')}
                                            </span>
                                            <span
                                                className={`text-sm px-2 py-1 rounded ${
                                                    conflict.severity === 'high'
                                                        ? 'bg-red-500/20 text-red-300'
                                                        : conflict.severity === 'medium'
                                                        ? 'bg-orange-500/20 text-orange-300'
                                                        : 'bg-yellow-500/20 text-yellow-300'
                                                }`}
                                            >
                                                {Math.round(conflict.overcommitmentRatio * 100)}% overcommitted
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-300">
                                            <div>Tasks: {conflict.tasks.length}</div>
                                            <div>Estimated time needed: {formatTime(conflict.totalEstimatedTime)}</div>
                                            <div>Available time: {formatTime(conflict.availableTime)}</div>
                                        </div>

                                        <div className="mt-2 space-y-1">
                                            {conflict.tasks.slice(0, 3).map((task, taskIndex) => (
                                                <div
                                                    key={taskIndex}
                                                    className="text-xs text-gray-400 bg-gray-800/50 rounded px-2 py-1"
                                                >
                                                    {task.content}
                                                    {task.estimatedTime && (
                                                        <span className="ml-2">({formatTime(task.estimatedTime)})</span>
                                                    )}
                                                </div>
                                            ))}
                                            {conflict.tasks.length > 3 && (
                                                <div className="text-xs text-gray-500">
                                                    +{conflict.tasks.length - 3} more tasks
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Prioritization Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="bg-gray-700 rounded-lg p-4">
                            <h5 className="font-medium text-white mb-3">Prioritization Suggestions</h5>
                            <div className="space-y-3">
                                {suggestions.map((suggestion, index) => (
                                    <div key={index} className="p-3 rounded border border-gray-600 bg-gray-800/50">
                                        <div className="flex items-start gap-3">
                                            <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                                            <div className="flex-1">
                                                <h6 className="font-medium text-white">{suggestion.title}</h6>
                                                <p className="text-sm text-gray-300 mt-1">{suggestion.message}</p>
                                                <p className="text-xs text-gray-400 mt-2">{suggestion.action}</p>

                                                {suggestion.tasks.length > 0 && (
                                                    <div className="mt-3 space-y-1">
                                                        {suggestion.tasks.map((task, taskIndex) => (
                                                            <div
                                                                key={taskIndex}
                                                                className="text-xs text-gray-300 bg-gray-700/50 rounded px-2 py-1 flex items-center justify-between"
                                                            >
                                                                <span>{task.content}</span>
                                                                {task.deadline && (
                                                                    <span className="text-gray-400">
                                                                        {new Date(task.deadline).toLocaleDateString(
                                                                            'en-US',
                                                                            {
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit',
                                                                            },
                                                                        )}
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
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Wrapper component with error boundary
const DeadlinePressureWithErrorBoundary = (props) => (
    <DeadlinePressureErrorBoundary>
        <DeadlinePressure {...props} />
    </DeadlinePressureErrorBoundary>
);

export default DeadlinePressureWithErrorBoundary;
