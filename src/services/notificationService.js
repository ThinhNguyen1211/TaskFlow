import { toast } from 'react-toastify';

class NotificationService {
  constructor() {
    this.permission = 'default';
    this.scheduledNotifications = new Map();
    this.settings = this.loadSettings();
    this.init();
  }

  // Initialize the service
  async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      
      // Request permission if not already granted
      if (this.permission === 'default') {
        await this.requestPermission();
      }
    }
    
    // Start the notification scheduler
    this.startScheduler();
  }

  // Load notification settings from localStorage
  loadSettings() {
    const defaultSettings = {
      enabled: true,
      deadlineReminders: true,
      procrastinationAlerts: true,
      productivitySuggestions: true,
      reminderTiming: {
        urgent: [60, 30, 15, 5], // minutes before deadline
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

    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return defaultSettings;
    }
  }

  // Save notification settings
  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
  }

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        toast.success('Notifications enabled successfully!');
        return true;
      } else if (permission === 'denied') {
        toast.warning('Notifications blocked. You can enable them in browser settings.');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
    
    return false;
  }

  // Check if notifications are allowed
  canSendNotification() {
    return (
      'Notification' in window &&
      this.permission === 'granted' &&
      this.settings.enabled &&
      !this.isQuietHours()
    );
  }

  // Check if current time is within quiet hours
  isQuietHours() {
    if (!this.settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = this.settings.quietHours.start.split(':').map(Number);
    const [endHour, endMin] = this.settings.quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    
    return currentTime >= startTime && currentTime <= endTime;
  }

  // Send a browser notification
  async sendNotification(title, options = {}) {
    if (!this.canSendNotification()) {
      // Fallback to toast notification
      toast.info(title);
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/naver-favicon.ico',
        badge: '/naver-favicon.ico',
        tag: options.tag || 'task-reminder',
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        ...options
      });

      // Auto-close after 10 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 10000);
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        if (options.onClick) {
          options.onClick();
        }
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.info(title); // Fallback to toast
      return null;
    }
  }

  // Schedule deadline reminders for a task
  scheduleDeadlineReminders(task) {
    if (!task.deadline || !this.settings.deadlineReminders) return;

    const deadline = new Date(task.deadline);
    const now = new Date();
    const timings = this.settings.reminderTiming[task.priority] || this.settings.reminderTiming.medium;

    timings.forEach(minutesBefore => {
      const reminderTime = new Date(deadline.getTime() - minutesBefore * 60 * 1000);
      
      if (reminderTime > now) {
        const timeoutId = setTimeout(() => {
          this.sendDeadlineReminder(task, minutesBefore);
        }, reminderTime.getTime() - now.getTime());

        const notificationKey = `deadline-${task._id}-${minutesBefore}`;
        this.scheduledNotifications.set(notificationKey, timeoutId);
      }
    });
  }

  // Send deadline reminder notification
  sendDeadlineReminder(task, minutesBefore) {
    const urgencyLevel = this.getUrgencyLevel(minutesBefore);
    const title = `⏰ Task Deadline ${urgencyLevel}`;
    
    let body;
    if (minutesBefore < 60) {
      body = `"${task.content}" is due in ${minutesBefore} minutes!`;
    } else {
      const hours = Math.floor(minutesBefore / 60);
      body = `"${task.content}" is due in ${hours} hour${hours > 1 ? 's' : ''}!`;
    }

    this.sendNotification(title, {
      body,
      tag: `deadline-${task._id}`,
      requireInteraction: minutesBefore <= 15,
      onClick: () => {
        // Focus on the task (could navigate to task or open task modal)
        window.dispatchEvent(new CustomEvent('focusTask', { detail: { taskId: task._id } }));
      }
    });
  }

  // Get urgency level text based on time remaining
  getUrgencyLevel(minutesBefore) {
    if (minutesBefore <= 5) return 'URGENT!';
    if (minutesBefore <= 15) return 'Soon';
    if (minutesBefore <= 60) return 'Approaching';
    return 'Reminder';
  }

  // Schedule procrastination alert
  scheduleProcrastinationAlert(task, procrastinationCoefficient = 1.5) {
    if (!this.settings.procrastinationAlerts || !task.estimatedTime) return;

    // Calculate when user should start based on their procrastination pattern
    const adjustedTime = task.estimatedTime * procrastinationCoefficient;
    const deadline = new Date(task.deadline);
    const suggestedStartTime = new Date(deadline.getTime() - adjustedTime * 60 * 1000);
    const now = new Date();

    if (suggestedStartTime > now) {
      const timeoutId = setTimeout(() => {
        this.sendProcrastinationAlert(task);
      }, suggestedStartTime.getTime() - now.getTime());

      const notificationKey = `procrastination-${task._id}`;
      this.scheduledNotifications.set(notificationKey, timeoutId);
    }
  }

  // Send procrastination alert
  sendProcrastinationAlert(task) {
    const title = '🎯 Time to Start!';
    const body = `Based on your patterns, you should start "${task.content}" now to meet your deadline comfortably.`;

    this.sendNotification(title, {
      body,
      tag: `procrastination-${task._id}`,
      requireInteraction: true,
      onClick: () => {
        window.dispatchEvent(new CustomEvent('startTask', { detail: { taskId: task._id } }));
      }
    });
  }

  // Send productivity suggestion
  sendProductivitySuggestion(suggestion) {
    if (!this.settings.productivitySuggestions) return;

    const title = '💡 Productivity Tip';
    
    this.sendNotification(title, {
      body: suggestion,
      tag: 'productivity-tip',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('openAnalytics'));
      }
    });
  }

  // Schedule daily productivity suggestions
  scheduleProductivitySuggestions(userPatterns) {
    if (!this.settings.productivitySuggestions) return;

    const suggestions = this.generateProductivitySuggestions(userPatterns);
    
    // Schedule suggestions for optimal times based on user patterns
    const optimalTimes = userPatterns.productiveHours || [9, 14, 16]; // Default times
    
    optimalTimes.forEach((hour, index) => {
      if (index < suggestions.length) {
        const suggestionTime = new Date();
        suggestionTime.setHours(hour, 0, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (suggestionTime <= new Date()) {
          suggestionTime.setDate(suggestionTime.getDate() + 1);
        }

        const timeoutId = setTimeout(() => {
          this.sendProductivitySuggestion(suggestions[index]);
        }, suggestionTime.getTime() - new Date().getTime());

        this.scheduledNotifications.set(`productivity-${hour}`, timeoutId);
      }
    });
  }

  // Generate productivity suggestions based on user patterns
  generateProductivitySuggestions(userPatterns) {
    const suggestions = [];

    if (userPatterns.averageEstimationAccuracy < 0.7) {
      suggestions.push('Try breaking large tasks into smaller, more manageable chunks for better time estimation.');
    }

    if (userPatterns.procrastinationCoefficient > 1.3) {
      suggestions.push('Consider using the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break.');
    }

    if (userPatterns.completionRate < 0.8) {
      suggestions.push('Set more realistic deadlines. Your current completion rate suggests you might be overcommitting.');
    }

    // Add more suggestions based on different patterns
    suggestions.push(
      'Review your most productive hours and schedule important tasks during those times.',
      'Take regular breaks to maintain focus and prevent burnout.',
      'Celebrate small wins to maintain motivation throughout the day.'
    );

    return suggestions;
  }

  // Clear scheduled notifications for a task
  clearTaskNotifications(taskId) {
    const keysToRemove = [];
    
    for (const [key, timeoutId] of this.scheduledNotifications) {
      if (key.includes(taskId)) {
        clearTimeout(timeoutId);
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      this.scheduledNotifications.delete(key);
    });
  }

  // Clear all scheduled notifications
  clearAllNotifications() {
    for (const timeoutId of this.scheduledNotifications.values()) {
      clearTimeout(timeoutId);
    }
    this.scheduledNotifications.clear();
  }

  // Start the notification scheduler (runs periodically)
  startScheduler() {
    // Check for overdue tasks every 5 minutes
    setInterval(() => {
      this.checkOverdueTasks();
    }, 5 * 60 * 1000);

    // Daily cleanup of old notifications
    setInterval(() => {
      this.cleanupOldNotifications();
    }, 24 * 60 * 60 * 1000);
  }

  // Check for overdue tasks and send notifications
  checkOverdueTasks() {
    const event = new CustomEvent('requestOverdueTasks');
    window.dispatchEvent(event);
  }

  // Handle overdue tasks
  handleOverdueTasks(overdueTasks) {
    overdueTasks.forEach(task => {
      const title = '🚨 Task Overdue!';
      const body = `"${task.content}" was due ${this.getTimeAgo(task.deadline)}`;

      this.sendNotification(title, {
        body,
        tag: `overdue-${task._id}`,
        requireInteraction: true,
        onClick: () => {
          window.dispatchEvent(new CustomEvent('focusTask', { detail: { taskId: task._id } }));
        }
      });
    });
  }

  // Get human-readable time ago string
  getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'just now';
  }

  // Cleanup old scheduled notifications
  cleanupOldNotifications() {
    // This would typically involve checking which notifications are no longer relevant
    // For now, we'll just log the cleanup
    console.log('Cleaning up old notifications...');
  }

  // Get notification settings
  getSettings() {
    return { ...this.settings };
  }

  // Update notification settings
  updateSettings(newSettings) {
    this.saveSettings(newSettings);
    
    // Reschedule notifications if timing settings changed
    if (newSettings.reminderTiming) {
      // This would require re-scheduling all notifications
      // For now, we'll just update the settings
      toast.success('Notification settings updated!');
    }
  }

  // Test notification (for settings page)
  async testNotification() {
    const success = await this.sendNotification('Test Notification', {
      body: 'If you can see this, notifications are working correctly!',
      tag: 'test-notification'
    });

    if (!success && this.permission !== 'granted') {
      toast.error('Please enable notifications in your browser settings');
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;