import { useEffect, useCallback, useState } from 'react';
import notificationService from '../services/notificationService';

export const useNotifications = (todos = [], userAnalytics = null) => {
  const [settings, setSettings] = useState(notificationService.getSettings());
  const [permission, setPermission] = useState(notificationService.permission);

  // Initialize notification service and set up event listeners
  useEffect(() => {
    const handlePermissionChange = () => {
      setPermission(notificationService.permission);
    };

    // Listen for overdue task requests
    const handleOverdueTasksRequest = () => {
      const now = new Date();
      const overdueTasks = todos.filter(task => 
        task.deadline && 
        new Date(task.deadline) < now && 
        !task.completed
      );
      
      if (overdueTasks.length > 0) {
        notificationService.handleOverdueTasks(overdueTasks);
      }
    };

    // Listen for focus task events
    const handleFocusTask = (event) => {
      const { taskId } = event.detail;
      // This could trigger opening a task modal or scrolling to the task
      console.log('Focus task requested:', taskId);
    };

    // Listen for start task events
    const handleStartTask = (event) => {
      const { taskId } = event.detail;
      // This could trigger starting the task timer
      console.log('Start task requested:', taskId);
    };

    // Listen for open analytics events
    const handleOpenAnalytics = () => {
      // This could trigger navigation to analytics view
      console.log('Open analytics requested');
    };

    // Add event listeners
    window.addEventListener('permissionChange', handlePermissionChange);
    window.addEventListener('requestOverdueTasks', handleOverdueTasksRequest);
    window.addEventListener('focusTask', handleFocusTask);
    window.addEventListener('startTask', handleStartTask);
    window.addEventListener('openAnalytics', handleOpenAnalytics);

    return () => {
      window.removeEventListener('permissionChange', handlePermissionChange);
      window.removeEventListener('requestOverdueTasks', handleOverdueTasksRequest);
      window.removeEventListener('focusTask', handleFocusTask);
      window.removeEventListener('startTask', handleStartTask);
      window.removeEventListener('openAnalytics', handleOpenAnalytics);
    };
  }, [todos]);

  // Schedule notifications for new or updated tasks
  useEffect(() => {
    todos.forEach(task => {
      if (task.deadline && !task.completed) {
        // Clear existing notifications for this task
        notificationService.clearTaskNotifications(task._id || task.id);
        
        // Schedule new notifications
        notificationService.scheduleDeadlineReminders(task);
        
        // Schedule procrastination alerts if we have user analytics
        if (userAnalytics?.procrastinationCoefficient) {
          notificationService.scheduleProcrastinationAlert(
            task, 
            userAnalytics.procrastinationCoefficient
          );
        }
      }
    });
  }, [todos, userAnalytics]);

  // Schedule productivity suggestions based on user patterns
  useEffect(() => {
    if (userAnalytics) {
      notificationService.scheduleProductivitySuggestions(userAnalytics);
    }
  }, [userAnalytics]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    const granted = await notificationService.requestPermission();
    setPermission(notificationService.permission);
    return granted;
  }, []);

  // Update notification settings
  const updateSettings = useCallback((newSettings) => {
    notificationService.updateSettings(newSettings);
    setSettings(notificationService.getSettings());
  }, []);

  // Test notification
  const testNotification = useCallback(async () => {
    await notificationService.testNotification();
  }, []);

  // Send custom notification
  const sendNotification = useCallback(async (title, options = {}) => {
    return await notificationService.sendNotification(title, options);
  }, []);

  // Clear notifications for a specific task
  const clearTaskNotifications = useCallback((taskId) => {
    notificationService.clearTaskNotifications(taskId);
  }, []);

  // Get notification statistics
  const getNotificationStats = useCallback(() => {
    return {
      scheduledCount: notificationService.scheduledNotifications.size,
      permission: notificationService.permission,
      canSendNotifications: notificationService.canSendNotification(),
      isQuietHours: notificationService.isQuietHours()
    };
  }, []);

  return {
    settings,
    permission,
    requestPermission,
    updateSettings,
    testNotification,
    sendNotification,
    clearTaskNotifications,
    getNotificationStats,
    isEnabled: permission === 'granted' && settings.enabled
  };
};

// Hook for notification settings management
export const useNotificationSettings = () => {
  const [settings, setSettings] = useState(notificationService.getSettings());

  const updateSettings = useCallback((newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    notificationService.updateSettings(updatedSettings);
    setSettings(notificationService.getSettings());
  }, [settings]);

  const resetSettings = useCallback(() => {
    const defaultSettings = {
      enabled: true,
      deadlineReminders: true,
      procrastinationAlerts: true,
      productivitySuggestions: true,
      reminderTiming: {
        urgent: [60, 30, 15, 5],
        high: [120, 60, 30], 
        medium: [240, 120],
        low: [480, 240]
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      maxNotificationsPerHour: 5
    };
    
    notificationService.updateSettings(defaultSettings);
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings
  };
};