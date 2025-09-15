import { useState, useEffect, useCallback, useMemo } from 'react';
import deadlinePressureService from '../services/deadlinePressureService';

// Define fallback pressure levels in case service is not available
const FALLBACK_PRESSURE_LEVELS = {
    NONE: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4,
    OVERDUE: 5,
};

// Ensure service is properly initialized with fallback
const safeService = deadlinePressureService || {
    pressureLevels: FALLBACK_PRESSURE_LEVELS,
    calculatePressureLevel: (task) => ({
        level: FALLBACK_PRESSURE_LEVELS.NONE,
        name: 'none',
        color: 'gray',
        message: 'No deadline set',
        urgency: 0,
        timeRemaining: 0,
    }),
    getDeadlineConflicts: () => [],
    generatePrioritizationSuggestions: () => [],
    formatTimeRemaining: (hours) => `${Math.round(Math.abs(hours || 0))} hours`,
    getPressureIcon: (level) => {
        const icons = {
            0: '📅', // NONE
            1: '🔵', // LOW
            2: '🟡', // MEDIUM
            3: '🟠', // HIGH
            4: '🔴', // CRITICAL
            5: '🚨', // OVERDUE
        };
        return icons[level] || '📅';
    },
    getPressureVisualization: () => ({
        backgroundColor: 'bg-gray-800',
        borderColor: 'border-gray-600',
        textColor: 'text-gray-300',
    }),
    getPressureModeVisualization: () => ({
        backgroundColor: 'bg-gray-800',
        borderColor: 'border-gray-600',
        textColor: 'text-gray-300',
    }),
    getUrgencyAnimations: () => '',
};

export const useDeadlinePressure = (tasks = [], pressureModeEnabled = false) => {
    const [pressureData, setPressureData] = useState(new Map());
    const [conflicts, setConflicts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    // Update pressure data when tasks change
    useEffect(() => {
        const newPressureData = new Map();

        tasks.forEach((task) => {
            if (task.deadline) {
                try {
                    const pressure = safeService.calculatePressureLevel(task);
                    newPressureData.set(task._id || task.id, pressure);
                } catch (error) {
                    console.error('Error calculating pressure for task:', task, error);
                    // Use fallback pressure data
                    newPressureData.set(task._id || task.id, {
                        level: FALLBACK_PRESSURE_LEVELS.NONE,
                        name: 'none',
                        color: 'gray',
                        message: 'No deadline set',
                        urgency: 0,
                    });
                }
            }
        });

        setPressureData(newPressureData);

        // Update conflicts and suggestions with error handling
        try {
            const newConflicts = safeService.getDeadlineConflicts(tasks);
            const newSuggestions = safeService.generatePrioritizationSuggestions(tasks);

            setConflicts(newConflicts);
            setSuggestions(newSuggestions);
        } catch (error) {
            console.error('Error updating conflicts and suggestions:', error);
            setConflicts([]);
            setSuggestions([]);
        }
    }, [tasks, tasks.length]);

    // Get pressure data for a specific task
    const getTaskPressure = useCallback(
        (taskId) => {
            return (
                pressureData.get(taskId) || {
                    level: safeService.pressureLevels?.NONE || 0,
                    name: 'none',
                    color: 'gray',
                    message: 'No deadline set',
                    urgency: 0,
                }
            );
        },
        [pressureData],
    );

    // Get visualization styling for a task
    const getTaskVisualization = useCallback(
        (taskId) => {
            const pressure = getTaskPressure(taskId);
            try {
                return safeService.getPressureModeVisualization
                    ? safeService.getPressureModeVisualization(pressure, pressureModeEnabled)
                    : { backgroundColor: 'bg-gray-800', borderColor: 'border-gray-600', textColor: 'text-gray-300' };
            } catch (error) {
                console.error('Error getting task visualization:', error);
                return { backgroundColor: 'bg-gray-800', borderColor: 'border-gray-600', textColor: 'text-gray-300' };
            }
        },
        [getTaskPressure, pressureModeEnabled],
    );

    // Get urgency animations for a task
    const getTaskAnimations = useCallback(
        (taskId) => {
            const pressure = getTaskPressure(taskId);
            try {
                return safeService.getUrgencyAnimations ? safeService.getUrgencyAnimations(pressure) : '';
            } catch (error) {
                console.error('Error getting task animations:', error);
                return '';
            }
        },
        [getTaskPressure],
    );

    // Get tasks sorted by pressure level
    const tasksByPressure = useMemo(() => {
        try {
            return tasks
                .filter((task) => task && task.deadline && !task.completed)
                .map((task) => {
                    const pressure = getTaskPressure(task._id || task.id);
                    return {
                        ...task,
                        pressure: pressure || {
                            level: FALLBACK_PRESSURE_LEVELS.NONE,
                            name: 'none',
                            color: 'gray',
                            message: 'No deadline set',
                            urgency: 0,
                            timeRemaining: 0,
                        },
                    };
                })
                .sort((a, b) => {
                    const aLevel = a.pressure?.level || 0;
                    const bLevel = b.pressure?.level || 0;
                    if (aLevel !== bLevel) {
                        return bLevel - aLevel;
                    }
                    return (b.pressure?.urgency || 0) - (a.pressure?.urgency || 0);
                });
        } catch (error) {
            console.error('Error processing tasksByPressure:', error);
            return [];
        }
    }, [tasks, getTaskPressure]);

    // Get pressure statistics
    const pressureStats = useMemo(() => {
        const stats = {
            total: 0,
            overdue: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            none: 0,
        };

        tasks.forEach((task) => {
            if (!task.completed) {
                stats.total++;
                const pressure = getTaskPressure(task._id || task.id);

                switch (pressure.level) {
                    case safeService.pressureLevels.OVERDUE:
                        stats.overdue++;
                        break;
                    case safeService.pressureLevels.CRITICAL:
                        stats.critical++;
                        break;
                    case safeService.pressureLevels.HIGH:
                        stats.high++;
                        break;
                    case safeService.pressureLevels.MEDIUM:
                        stats.medium++;
                        break;
                    case safeService.pressureLevels.LOW:
                        stats.low++;
                        break;
                    default:
                        stats.none++;
                }
            }
        });

        return stats;
    }, [tasks, getTaskPressure]);

    // Get high-priority alerts
    const alerts = useMemo(() => {
        const alerts = [];

        if (pressureStats.overdue > 0) {
            alerts.push({
                type: 'error',
                message: `${pressureStats.overdue} task${pressureStats.overdue > 1 ? 's are' : ' is'} overdue`,
                count: pressureStats.overdue,
                level: 'overdue',
            });
        }

        if (pressureStats.critical > 0) {
            alerts.push({
                type: 'warning',
                message: `${pressureStats.critical} task${
                    pressureStats.critical > 1 ? 's have' : ' has'
                } critical deadlines`,
                count: pressureStats.critical,
                level: 'critical',
            });
        }

        if (conflicts.length > 0) {
            const highSeverityConflicts = conflicts.filter((c) => c.severity === 'high');
            if (highSeverityConflicts.length > 0) {
                alerts.push({
                    type: 'warning',
                    message: `${highSeverityConflicts.length} deadline conflict${
                        highSeverityConflicts.length > 1 ? 's' : ''
                    } detected`,
                    count: highSeverityConflicts.length,
                    level: 'conflict',
                });
            }
        }

        return alerts;
    }, [pressureStats, conflicts]);

    return {
        // Pressure data
        pressureData,
        getTaskPressure,
        getTaskVisualization,
        getTaskAnimations,

        // Sorted and filtered tasks
        tasksByPressure,

        // Statistics
        pressureStats,

        // Conflicts and suggestions
        conflicts,
        suggestions,
        alerts,

        // Utility functions
        formatTimeRemaining: safeService.formatTimeRemaining,
        getPressureIcon: safeService.getPressureIcon,

        // Refresh function
        refresh: () => {
            const newPressureData = new Map();

            tasks.forEach((task) => {
                if (task.deadline) {
                    try {
                        const pressure = safeService.calculatePressureLevel(task);
                        newPressureData.set(task._id || task.id, pressure);
                    } catch (error) {
                        console.error('Error calculating pressure for task:', task, error);
                        newPressureData.set(task._id || task.id, {
                            level: FALLBACK_PRESSURE_LEVELS.NONE,
                            name: 'none',
                            color: 'gray',
                            message: 'No deadline set',
                            urgency: 0,
                        });
                    }
                }
            });

            setPressureData(newPressureData);
        },
    };
};

// Hook for pressure mode toggle
export const usePressureMode = () => {
    const [isPressureModeEnabled, setIsPressureModeEnabled] = useState(() => {
        try {
            const saved = localStorage.getItem('pressureModeEnabled');
            return saved ? JSON.parse(saved) : false;
        } catch {
            return false;
        }
    });

    const togglePressureMode = useCallback(() => {
        const newValue = !isPressureModeEnabled;
        setIsPressureModeEnabled(newValue);
        localStorage.setItem('pressureModeEnabled', JSON.stringify(newValue));
    }, [isPressureModeEnabled]);

    const enablePressureMode = useCallback(() => {
        setIsPressureModeEnabled(true);
        localStorage.setItem('pressureModeEnabled', JSON.stringify(true));
    }, []);

    const disablePressureMode = useCallback(() => {
        setIsPressureModeEnabled(false);
        localStorage.setItem('pressureModeEnabled', JSON.stringify(false));
    }, []);

    return {
        isPressureModeEnabled,
        togglePressureMode,
        enablePressureMode,
        disablePressureMode,
    };
};
