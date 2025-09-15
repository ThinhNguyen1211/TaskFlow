import React, { useMemo } from 'react';

const SimpleDeadlinePressure = ({ tasks = [] }) => {
    // Simple pressure calculation
    const pressureData = useMemo(() => {
        const now = new Date();
        const stats = {
            total: 0,
            overdue: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            none: 0,
        };

        const tasksWithPressure = tasks.map(task => {
            if (!task.deadline) {
                stats.none++;
                return { ...task, pressure: { level: 0, name: 'none', color: 'gray' } };
            }

            const deadline = new Date(task.deadline);
            const timeRemaining = deadline.getTime() - now.getTime();
            const hoursRemaining = timeRemaining / (1000 * 60 * 60);
            
            let pressure;
            if (timeRemaining < 0) {
                stats.overdue++;
                pressure = { level: 5, name: 'overdue', color: 'red' };
            } else if (hoursRemaining < 24) {
                stats.critical++;
                pressure = { level: 4, name: 'critical', color: 'red' };
            } else if (hoursRemaining < 72) {
                stats.high++;
                pressure = { level: 3, name: 'high', color: 'orange' };
            } else if (hoursRemaining < 168) {
                stats.medium++;
                pressure = { level: 2, name: 'medium', color: 'yellow' };
            } else {
                stats.low++;
                pressure = { level: 1, name: 'low', color: 'green' };
            }

            stats.total++;
            return { ...task, pressure };
        });

        return { stats, tasksWithPressure };
    }, [tasks]);

    const { stats, tasksWithPressure } = pressureData;

    if (tasks.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">📊 Deadline Pressure</h3>
                <p className="text-gray-400 text-sm">No tasks with deadlines to monitor.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">📊 Deadline Pressure Monitor</h3>
                <div className="text-sm text-gray-400">
                    {stats.total} tasks monitored
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{stats.overdue}</div>
                    <div className="text-xs text-gray-400">Overdue</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
                    <div className="text-xs text-gray-400">Critical</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{stats.high}</div>
                    <div className="text-xs text-gray-400">High</div>
                </div>
            </div>

            {(stats.overdue > 0 || stats.critical > 0) && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
                    <div className="text-red-300 text-sm font-medium">
                        ⚠️ {stats.overdue + stats.critical} tasks need immediate attention!
                    </div>
                </div>
            )}

            <div className="mt-3 text-xs text-gray-500">
                Medium: {stats.medium} • Low: {stats.low} • None: {stats.none}
            </div>
        </div>
    );
};

export default SimpleDeadlinePressure;