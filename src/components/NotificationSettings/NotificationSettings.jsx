import React, { useState } from 'react';
import { useNotificationSettings } from '../../hooks/useNotifications';
import notificationService from '../../services/notificationService';
import { toast } from 'react-toastify';

const NotificationSettings = () => {
  const { settings, updateSettings, resetSettings } = useNotificationSettings();
  const [isTestingNotification, setIsTestingNotification] = useState(false);

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleReminderTimingChange = (priority, index, value) => {
    const newTiming = { ...settings.reminderTiming };
    newTiming[priority][index] = parseInt(value) || 0;
    updateSettings({ reminderTiming: newTiming });
  };

  const handleQuietHoursChange = (key, value) => {
    const newQuietHours = { ...settings.quietHours, [key]: value };
    updateSettings({ quietHours: newQuietHours });
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    try {
      if (notificationService.permission !== 'granted') {
        const granted = await notificationService.requestPermission();
        if (!granted) {
          toast.error('Please enable notifications in your browser settings');
          return;
        }
      }
      await notificationService.testNotification();
    } catch (error) {
      console.error('Error testing notification:', error);
      toast.error('Failed to send test notification');
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      updateSettings({ enabled: true });
    }
  };

  const formatMinutes = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Notification Settings</h3>
        <button
          onClick={resetSettings}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Reset to Default
        </button>
      </div>

      {/* Permission Status */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Browser Notifications</h4>
            <p className="text-sm text-gray-400">
              Status: {notificationService.permission === 'granted' ? 'Enabled' : 
                      notificationService.permission === 'denied' ? 'Blocked' : 'Not Requested'}
            </p>
          </div>
          <div className="flex space-x-2">
            {notificationService.permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enable
              </button>
            )}
            <button
              onClick={handleTestNotification}
              disabled={isTestingNotification || notificationService.permission !== 'granted'}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestingNotification ? 'Testing...' : 'Test'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Enable Notifications</h4>
            <p className="text-sm text-gray-400">Master switch for all notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={() => handleToggle('enabled')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Deadline Reminders</h4>
            <p className="text-sm text-gray-400">Get notified before task deadlines</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.deadlineReminders}
              onChange={() => handleToggle('deadlineReminders')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Procrastination Alerts</h4>
            <p className="text-sm text-gray-400">Smart alerts based on your patterns</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.procrastinationAlerts}
              onChange={() => handleToggle('procrastinationAlerts')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">Productivity Suggestions</h4>
            <p className="text-sm text-gray-400">Helpful tips based on your work patterns</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.productivitySuggestions}
              onChange={() => handleToggle('productivitySuggestions')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Reminder Timing Settings */}
      {settings.deadlineReminders && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-white mb-4">Reminder Timing (minutes before deadline)</h4>
          <div className="space-y-3">
            {Object.entries(settings.reminderTiming).map(([priority, timings]) => (
              <div key={priority} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-300 capitalize">{priority}:</div>
                <div className="flex space-x-2 flex-1">
                  {timings.map((timing, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <input
                        type="number"
                        value={timing}
                        onChange={(e) => handleReminderTimingChange(priority, index, e.target.value)}
                        className="w-16 px-2 py-1 bg-gray-600 text-white rounded text-sm"
                        min="1"
                      />
                      <span className="text-xs text-gray-400">{formatMinutes(timing)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiet Hours */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">Quiet Hours</h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.quietHours.enabled}
              onChange={() => handleQuietHoursChange('enabled', !settings.quietHours.enabled)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {settings.quietHours.enabled && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">From:</label>
              <input
                type="time"
                value={settings.quietHours.start}
                onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                className="px-2 py-1 bg-gray-600 text-white rounded text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">To:</label>
              <input
                type="time"
                value={settings.quietHours.end}
                onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                className="px-2 py-1 bg-gray-600 text-white rounded text-sm"
              />
            </div>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          No notifications will be sent during quiet hours
        </p>
      </div>

      {/* Rate Limiting */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-white mb-2">Notification Limit</h4>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-300">Max per hour:</label>
          <input
            type="number"
            value={settings.maxNotificationsPerHour}
            onChange={(e) => updateSettings({ maxNotificationsPerHour: parseInt(e.target.value) || 5 })}
            className="w-20 px-2 py-1 bg-gray-600 text-white rounded text-sm"
            min="1"
            max="20"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Prevents notification spam by limiting the number of notifications per hour
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;