class DeadlinePressureService {
    constructor() {
        this.pressureLevels = {
            NONE: 0,
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
            CRITICAL: 4,
            OVERDUE: 5,
        };
    }

    // Calculate pressure level based on time remaining and task characteristics
    calculatePressureLevel(task) {
        if (!task.deadline) {
            return {
                level: this.pressureLevels.NONE,
                name: 'none',
                color: 'gray',
                message: 'No deadline set',
                urgency: 0,
                timeRemaining: 0,
            };
        }

        const now = new Date();
        const deadline = new Date(task.deadline);
        const timeRemaining = deadline.getTime() - now.getTime();
        const hoursRemaining = timeRemaining / (1000 * 60 * 60);
        const daysRemaining = timeRemaining / (1000 * 60 * 60 * 24);

        // If overdue
        if (timeRemaining < 0) {
            return {
                level: this.pressureLevels.OVERDUE,
                name: 'overdue',
                color: 'red',
                message: 'Task is overdue!',
                urgency: 100,
                timeRemaining: Math.abs(hoursRemaining),
            };
        }

        // Calculate urgency based on time remaining and task priority
        const priorityMultiplier = this.getPriorityMultiplier(task.priority);
        const estimatedHours = (task.estimatedTime || 60) / 60; // Default 1 hour if not specified

        // Calculate pressure ratio (time needed vs time available)
        const pressureRatio = estimatedHours / Math.max(hoursRemaining, 0.1);
        const adjustedPressure = pressureRatio * priorityMultiplier;

        // Determine pressure level
        if (hoursRemaining <= 1) {
            return {
                level: this.pressureLevels.CRITICAL,
                name: 'critical',
                color: 'red',
                message: 'Due within 1 hour!',
                urgency: 95,
                timeRemaining: hoursRemaining,
                pressureRatio: adjustedPressure,
            };
        } else if (hoursRemaining <= 6) {
            return {
                level: this.pressureLevels.CRITICAL,
                name: 'critical',
                color: 'red',
                message: 'Due very soon!',
                urgency: 85 + (6 - hoursRemaining) * 2,
                timeRemaining: hoursRemaining,
                pressureRatio: adjustedPressure,
            };
        } else if (hoursRemaining <= 24) {
            return {
                level: this.pressureLevels.HIGH,
                name: 'high',
                color: 'orange',
                message: 'Due today!',
                urgency: 70 + (24 - hoursRemaining) * 0.8,
                timeRemaining: hoursRemaining,
                pressureRatio: adjustedPressure,
            };
        } else if (daysRemaining <= 3) {
            return {
                level: this.pressureLevels.HIGH,
                name: 'high',
                color: 'orange',
                message: `Due in ${Math.ceil(daysRemaining)} day${Math.ceil(daysRemaining) > 1 ? 's' : ''}`,
                urgency: 50 + (3 - daysRemaining) * 10,
                timeRemaining: hoursRemaining,
                pressureRatio: adjustedPressure,
            };
        } else if (daysRemaining <= 7) {
            return {
                level: this.pressureLevels.MEDIUM,
                name: 'medium',
                color: 'yellow',
                message: `Due in ${Math.ceil(daysRemaining)} days`,
                urgency: 30 + (7 - daysRemaining) * 5,
                timeRemaining: hoursRemaining,
                pressureRatio: adjustedPressure,
            };
        } else if (daysRemaining <= 14) {
            return {
                level: this.pressureLevels.LOW,
                name: 'low',
                color: 'blue',
                message: `Due in ${Math.ceil(daysRemaining)} days`,
                urgency: 10 + (14 - daysRemaining) * 2,
                timeRemaining: hoursRemaining,
                pressureRatio: adjustedPressure,
            };
        } else {
            return {
                level: this.pressureLevels.NONE,
                name: 'none',
                color: 'gray',
                message: `Due in ${Math.ceil(daysRemaining)} days`,
                urgency: 5,
                timeRemaining: hoursRemaining,
                pressureRatio: adjustedPressure,
            };
        }
    }

    // Get priority multiplier for pressure calculation
    getPriorityMultiplier(priority) {
        const multipliers = {
            low: 0.7,
            medium: 1.0,
            high: 1.3,
            urgent: 1.6,
        };
        return multipliers[priority] || 1.0;
    }

    // Get visual styling based on pressure level
    getPressureVisualization(pressureData) {
        const { level, color, urgency = 0 } = pressureData;

        const visualizations = {
            [this.pressureLevels.NONE]: {
                backgroundColor: 'bg-gray-800',
                borderColor: 'border-gray-600',
                textColor: 'text-gray-300',
                glowClass: '',
                pulseClass: '',
                gradientClass: 'from-gray-800 to-gray-700',
                iconColor: 'text-gray-400',
                progressColor: 'bg-gray-500',
            },
            [this.pressureLevels.LOW]: {
                backgroundColor: 'bg-blue-900/30',
                borderColor: 'border-blue-500/50',
                textColor: 'text-blue-200',
                glowClass: 'shadow-blue-500/20',
                pulseClass: '',
                gradientClass: 'from-blue-900/30 to-blue-800/20',
                iconColor: 'text-blue-400',
                progressColor: 'bg-blue-500',
            },
            [this.pressureLevels.MEDIUM]: {
                backgroundColor: 'bg-yellow-900/40',
                borderColor: 'border-yellow-500/60',
                textColor: 'text-yellow-200',
                glowClass: 'shadow-yellow-500/30',
                pulseClass: '',
                gradientClass: 'from-yellow-900/40 to-yellow-800/30',
                iconColor: 'text-yellow-400',
                progressColor: 'bg-yellow-500',
            },
            [this.pressureLevels.HIGH]: {
                backgroundColor: 'bg-orange-900/50',
                borderColor: 'border-orange-500/70',
                textColor: 'text-orange-200',
                glowClass: 'shadow-orange-500/40',
                pulseClass: 'animate-pulse',
                gradientClass: 'from-orange-900/50 to-orange-800/40',
                iconColor: 'text-orange-400',
                progressColor: 'bg-orange-500',
            },
            [this.pressureLevels.CRITICAL]: {
                backgroundColor: 'bg-red-900/60',
                borderColor: 'border-red-500/80',
                textColor: 'text-red-200',
                glowClass: 'shadow-red-500/50 shadow-lg',
                pulseClass: 'animate-pulse',
                gradientClass: 'from-red-900/60 to-red-800/50',
                iconColor: 'text-red-400',
                progressColor: 'bg-red-500',
            },
            [this.pressureLevels.OVERDUE]: {
                backgroundColor: 'bg-red-900/80',
                borderColor: 'border-red-400',
                textColor: 'text-red-100',
                glowClass: 'shadow-red-500/70 shadow-xl',
                pulseClass: 'animate-bounce',
                gradientClass: 'from-red-900/80 to-red-800/70',
                iconColor: 'text-red-300',
                progressColor: 'bg-red-400',
            },
        };

        const baseVisualization = visualizations[level] || visualizations[this.pressureLevels.NONE];

        // Add intensity-based modifications
        if (urgency > 80) {
            baseVisualization.pulseClass = 'animate-pulse';
            baseVisualization.glowClass += ' animate-pulse';
        }

        return baseVisualization;
    }

    // Get urgency animation classes
    getUrgencyAnimations(pressureData) {
        const { urgency = 0, level } = pressureData;

        const animations = [];

        if (level >= this.pressureLevels.HIGH) {
            animations.push('animate-pulse');
        }

        if (level >= this.pressureLevels.CRITICAL) {
            animations.push('hover:animate-bounce');
        }

        if (level === this.pressureLevels.OVERDUE) {
            animations.push('animate-bounce');
        }

        // Add shake animation for very urgent tasks
        if (urgency > 90) {
            animations.push('hover:animate-shake');
        }

        return animations.join(' ');
    }

    // Get pressure mode styling (intensified visual indicators)
    getPressureModeVisualization(pressureData, isPressureModeEnabled = false) {
        const baseVisualization = this.getPressureVisualization(pressureData);

        if (!isPressureModeEnabled) {
            return baseVisualization;
        }

        // Intensify colors and effects in pressure mode
        const intensifiedVisualization = { ...baseVisualization };

        switch (pressureData.level) {
            case this.pressureLevels.HIGH:
                intensifiedVisualization.backgroundColor = 'bg-orange-800/70';
                intensifiedVisualization.borderColor = 'border-orange-400';
                intensifiedVisualization.glowClass += ' shadow-2xl';
                intensifiedVisualization.pulseClass = 'animate-pulse';
                break;

            case this.pressureLevels.CRITICAL:
                intensifiedVisualization.backgroundColor = 'bg-red-800/80';
                intensifiedVisualization.borderColor = 'border-red-300';
                intensifiedVisualization.glowClass += ' shadow-2xl animate-pulse';
                intensifiedVisualization.pulseClass = 'animate-bounce';
                break;

            case this.pressureLevels.OVERDUE:
                intensifiedVisualization.backgroundColor = 'bg-red-700/90';
                intensifiedVisualization.borderColor = 'border-red-200';
                intensifiedVisualization.glowClass += ' shadow-2xl animate-pulse';
                intensifiedVisualization.pulseClass = 'animate-bounce';
                break;
        }

        return intensifiedVisualization;
    }

    // Generate task prioritization suggestions based on deadline conflicts
    generatePrioritizationSuggestions(tasks) {
        if (!tasks || tasks.length === 0) return [];

        const activeTasks = tasks.filter((task) => !task.completed && task.deadline);
        const tasksWithPressure = activeTasks.map((task) => ({
            ...task,
            pressure: this.calculatePressureLevel(task),
        }));

        // Sort by urgency and pressure level
        const sortedTasks = tasksWithPressure.sort((a, b) => {
            if (a.pressure.level !== b.pressure.level) {
                return b.pressure.level - a.pressure.level;
            }
            return (b.pressure.urgency || 0) - (a.pressure.urgency || 0);
        });

        const suggestions = [];

        // Check for overdue tasks
        const overdueTasks = sortedTasks.filter((task) => task.pressure.level === this.pressureLevels.OVERDUE);
        if (overdueTasks.length > 0) {
            suggestions.push({
                type: 'critical',
                title: 'Overdue Tasks Detected',
                message: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
                action: 'Address these immediately or consider rescheduling',
                tasks: overdueTasks.slice(0, 3),
                priority: 1,
            });
        }

        // Check for critical deadline conflicts
        const criticalTasks = sortedTasks.filter((task) => task.pressure.level === this.pressureLevels.CRITICAL);
        if (criticalTasks.length > 1) {
            suggestions.push({
                type: 'warning',
                title: 'Multiple Critical Deadlines',
                message: `${criticalTasks.length} tasks are due very soon`,
                action: 'Focus on the highest priority task first',
                tasks: criticalTasks.slice(0, 3),
                priority: 2,
            });
        }

        // Check for high-pressure tasks that might need attention
        const highPressureTasks = sortedTasks.filter(
            (task) => task.pressure.level === this.pressureLevels.HIGH && task.pressure.pressureRatio > 1.5,
        );

        if (highPressureTasks.length > 0) {
            suggestions.push({
                type: 'info',
                title: 'High Pressure Tasks',
                message: `${highPressureTasks.length} task${
                    highPressureTasks.length > 1 ? 's' : ''
                } may need more time than available`,
                action: 'Consider starting these tasks soon or adjusting estimates',
                tasks: highPressureTasks.slice(0, 3),
                priority: 3,
            });
        }

        // Suggest optimal task order
        if (sortedTasks.length > 2) {
            const topTasks = sortedTasks.slice(0, 3);
            suggestions.push({
                type: 'suggestion',
                title: 'Suggested Task Order',
                message: 'Based on deadlines and pressure levels',
                action: 'Consider working on tasks in this order',
                tasks: topTasks,
                priority: 4,
            });
        }

        return suggestions.sort((a, b) => a.priority - b.priority);
    }

    // Get deadline conflict analysis
    getDeadlineConflicts(tasks) {
        if (!tasks || tasks.length === 0) return [];

        const activeTasks = tasks.filter((task) => !task.completed && task.deadline);
        const conflicts = [];

        // Group tasks by deadline proximity
        const now = new Date();
        const timeWindows = [
            { name: 'next_hour', start: 0, end: 1 },
            { name: 'next_6_hours', start: 0, end: 6 },
            { name: 'today', start: 0, end: 24 },
            { name: 'tomorrow', start: 24, end: 48 },
            { name: 'this_week', start: 0, end: 168 },
        ];

        timeWindows.forEach((window) => {
            const tasksInWindow = activeTasks.filter((task) => {
                const deadline = new Date(task.deadline);
                const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
                return hoursUntilDeadline >= window.start && hoursUntilDeadline <= window.end;
            });

            if (tasksInWindow.length > 1) {
                const totalEstimatedTime = tasksInWindow.reduce((sum, task) => sum + (task.estimatedTime || 60), 0);
                const availableTime = window.end * 60; // Convert to minutes

                conflicts.push({
                    window: window.name,
                    tasks: tasksInWindow,
                    totalEstimatedTime,
                    availableTime,
                    overcommitment: totalEstimatedTime > availableTime,
                    overcommitmentRatio: totalEstimatedTime / availableTime,
                    severity:
                        totalEstimatedTime > availableTime * 1.5
                            ? 'high'
                            : totalEstimatedTime > availableTime
                            ? 'medium'
                            : 'low',
                });
            }
        });

        return conflicts.filter((conflict) => conflict.overcommitment);
    }

    // Format time remaining in human-readable format
    formatTimeRemaining(hours) {
        if (hours < 0) {
            const absHours = Math.abs(hours);
            if (absHours < 1) {
                return `${Math.round(absHours * 60)} minutes ago`;
            } else if (absHours < 24) {
                return `${Math.round(absHours)} hour${Math.round(absHours) !== 1 ? 's' : ''} ago`;
            } else {
                const days = Math.round(absHours / 24);
                return `${days} day${days !== 1 ? 's' : ''} ago`;
            }
        }

        if (hours < 1) {
            return `${Math.round(hours * 60)} minutes`;
        } else if (hours < 24) {
            return `${Math.round(hours)} hour${Math.round(hours) !== 1 ? 's' : ''}`;
        } else {
            const days = Math.round(hours / 24);
            return `${days} day${days !== 1 ? 's' : ''}`;
        }
    }

    // Get pressure level icon
    getPressureIcon(level) {
        const icons = {
            [this.pressureLevels.NONE]: '📅',
            [this.pressureLevels.LOW]: '🔵',
            [this.pressureLevels.MEDIUM]: '🟡',
            [this.pressureLevels.HIGH]: '🟠',
            [this.pressureLevels.CRITICAL]: '🔴',
            [this.pressureLevels.OVERDUE]: '🚨',
        };
        return icons[level] || '📅';
    }
}

// Create singleton instance with error handling
const createDeadlinePressureService = () => {
    try {
        return new DeadlinePressureService();
    } catch (error) {
        console.error('Failed to initialize DeadlinePressureService:', error);
        // Create a fallback service with all required methods
        return {
            pressureLevels: {
                NONE: 0,
                LOW: 1,
                MEDIUM: 2,
                HIGH: 3,
                CRITICAL: 4,
                OVERDUE: 5,
            },
            calculatePressureLevel: (task) => ({
                level: 0,
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
                glowClass: '',
                pulseClass: '',
                gradientClass: 'from-gray-800 to-gray-700',
                iconColor: 'text-gray-400',
                progressColor: 'bg-gray-500',
            }),
            getPressureModeVisualization: () => ({
                backgroundColor: 'bg-gray-800',
                borderColor: 'border-gray-600',
                textColor: 'text-gray-300',
            }),
            getUrgencyAnimations: () => '',
            getPriorityMultiplier: () => 1.0,
        };
    }
};

const deadlinePressureService = createDeadlinePressureService();

export default deadlinePressureService;
