import { useState, useEffect, useCallback } from 'react';
import procrastinationService from '../services/procrastinationService';

export const useProcrastinationDetection = (tasks = [], analytics = null) => {
  const [patterns, setPatterns] = useState(null);
  const [userPatterns, setUserPatterns] = useState(procrastinationService.getUserPatterns());

  // Update patterns when tasks or analytics change
  useEffect(() => {
    if (tasks.length > 0) {
      const detectedPatterns = procrastinationService.detectProcrastinationPatterns(tasks, analytics);
      setPatterns(detectedPatterns);
      
      // Update procrastination coefficient based on completed tasks
      const completedTasks = tasks.filter(task => task.completed);
      if (completedTasks.length > 0) {
        procrastinationService.calculateProcrastinationCoefficient(completedTasks);
        setUserPatterns(procrastinationService.getUserPatterns());
      }
    }
  }, [tasks, analytics]);

  // Calculate realistic deadline for a task
  const getRealisticDeadline = useCallback((task) => {
    if (!task.deadline) return null;
    return procrastinationService.calculateRealisticDeadline(task, new Date(task.deadline));
  }, []);

  // Get adjusted estimated time for a task
  const getAdjustedEstimatedTime = useCallback((task) => {
    return procrastinationService.getAdjustedEstimatedTime(task);
  }, []);

  // Get time estimation suggestions for a task
  const getTimeEstimationSuggestions = useCallback((task, similarTasks = []) => {
    return procrastinationService.generateTimeEstimationSuggestions(task, similarTasks);
  }, []);

  // Get procrastination risk level for a task
  const getProcrastinationRisk = useCallback((task) => {
    return procrastinationService.getProcrastinationRisk(task);
  }, []);

  // Update patterns when a task is completed
  const updatePatternsFromTask = useCallback((task) => {
    procrastinationService.updatePatternsFromCompletedTask(task);
    setUserPatterns(procrastinationService.getUserPatterns());
  }, []);

  // Reset patterns to default
  const resetPatterns = useCallback(() => {
    procrastinationService.resetPatterns();
    setUserPatterns(procrastinationService.getUserPatterns());
    setPatterns(null);
  }, []);

  // Get tasks with procrastination analysis
  const getTasksWithAnalysis = useCallback(() => {
    return tasks.map(task => ({
      ...task,
      realisticDeadline: getRealisticDeadline(task),
      adjustedEstimatedTime: getAdjustedEstimatedTime(task),
      procrastinationRisk: getProcrastinationRisk(task),
      timeEstimationSuggestions: getTimeEstimationSuggestions(task)
    }));
  }, [tasks, getRealisticDeadline, getAdjustedEstimatedTime, getProcrastinationRisk, getTimeEstimationSuggestions]);

  return {
    patterns,
    userPatterns,
    getRealisticDeadline,
    getAdjustedEstimatedTime,
    getTimeEstimationSuggestions,
    getProcrastinationRisk,
    updatePatternsFromTask,
    resetPatterns,
    getTasksWithAnalysis,
    procrastinationCoefficient: userPatterns.procrastinationCoefficient,
    estimationAccuracy: userPatterns.averageEstimationAccuracy
  };
};

// Hook for displaying procrastination insights
export const useProcrastinationInsights = (tasks = []) => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (tasks.length === 0) {
      setInsights([]);
      return;
    }

    const newInsights = [];
    const now = new Date();

    // Check for overdue tasks
    const overdueTasks = tasks.filter(task => 
      task.deadline && 
      new Date(task.deadline) < now && 
      !task.completed
    );

    if (overdueTasks.length > 0) {
      newInsights.push({
        type: 'warning',
        title: 'Overdue Tasks',
        message: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
        action: 'Review and prioritize these tasks',
        tasks: overdueTasks.slice(0, 3) // Show max 3 tasks
      });
    }

    // Check for high-risk tasks
    const highRiskTasks = tasks.filter(task => {
      if (task.completed || !task.deadline) return false;
      const risk = procrastinationService.getProcrastinationRisk(task);
      return risk.level === 'critical' || risk.level === 'high';
    });

    if (highRiskTasks.length > 0) {
      newInsights.push({
        type: 'danger',
        title: 'High Risk Tasks',
        message: `${highRiskTasks.length} task${highRiskTasks.length > 1 ? 's' : ''} need immediate attention`,
        action: 'Start working on these tasks now',
        tasks: highRiskTasks.slice(0, 3)
      });
    }

    // Check for tasks that should be started soon
    const shouldStartSoon = tasks.filter(task => {
      if (task.completed || !task.deadline) return false;
      const realisticDeadline = procrastinationService.calculateRealisticDeadline(task, new Date(task.deadline));
      const hoursUntilRealistic = (realisticDeadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursUntilRealistic <= 24 && hoursUntilRealistic > 0;
    });

    if (shouldStartSoon.length > 0) {
      newInsights.push({
        type: 'info',
        title: 'Should Start Soon',
        message: `Based on your patterns, you should start ${shouldStartSoon.length} task${shouldStartSoon.length > 1 ? 's' : ''} within 24 hours`,
        action: 'Plan your schedule accordingly',
        tasks: shouldStartSoon.slice(0, 3)
      });
    }

    // Check estimation accuracy
    const completedTasksWithTiming = tasks.filter(task => 
      task.completed && task.estimatedTime && task.actualTime
    );

    if (completedTasksWithTiming.length >= 5) {
      const avgAccuracy = completedTasksWithTiming.reduce((sum, task) => {
        return sum + (Math.min(task.estimatedTime, task.actualTime) / 
                     Math.max(task.estimatedTime, task.actualTime));
      }, 0) / completedTasksWithTiming.length;

      if (avgAccuracy < 0.7) {
        newInsights.push({
          type: 'tip',
          title: 'Improve Time Estimation',
          message: `Your time estimation accuracy is ${Math.round(avgAccuracy * 100)}%`,
          action: 'Try breaking tasks into smaller chunks for better estimates',
          tasks: []
        });
      }
    }

    setInsights(newInsights);
  }, [tasks]);

  return insights;
};