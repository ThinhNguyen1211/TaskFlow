import { useEffect, useCallback } from 'react';

/**
 * Custom hook for handling keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to functions
 * @param {Array} dependencies - Dependencies array for useCallback
 */
export const useKeyboardShortcuts = (shortcuts, dependencies = []) => {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.contentEditable === 'true') {
      return;
    }

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Create key combination string
    let combination = '';
    if (ctrl) combination += 'ctrl+';
    if (shift) combination += 'shift+';
    if (alt) combination += 'alt+';
    combination += key;

    // Check if this combination has a handler
    if (shortcuts[combination]) {
      event.preventDefault();
      shortcuts[combination](event);
    }
  }, [shortcuts, ...dependencies]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Hook for common task management shortcuts
 * @param {Object} handlers - Object with handler functions
 */
export const useTaskShortcuts = ({
  onNewTask,
  onSearch,
  onToggleFilters,
  onSelectAll,
  onDeleteSelected,
  onRefresh,
  onToggleView,
  onEscape
}) => {
  const shortcuts = {
    'ctrl+n': onNewTask,           // New task
    'ctrl+f': onSearch,            // Focus search
    'ctrl+shift+f': onToggleFilters, // Toggle filters
    'ctrl+a': onSelectAll,         // Select all
    'delete': onDeleteSelected,    // Delete selected
    'ctrl+r': onRefresh,           // Refresh
    'ctrl+shift+v': onToggleView,  // Toggle view
    'escape': onEscape,            // Escape/cancel
    '/': onSearch,                 // Quick search (like GitHub)
    '?': () => showShortcutsHelp() // Show shortcuts help
  };

  useKeyboardShortcuts(shortcuts, [
    onNewTask, onSearch, onToggleFilters, onSelectAll, 
    onDeleteSelected, onRefresh, onToggleView, onEscape
  ]);
};

/**
 * Show keyboard shortcuts help modal
 */
let showShortcutsCallback = null;

export const setShowShortcutsCallback = (callback) => {
  showShortcutsCallback = callback;
};

const showShortcutsHelp = () => {
  if (showShortcutsCallback) {
    showShortcutsCallback();
  } else {
    console.log('Keyboard Shortcuts Help - Press ? to show shortcuts');
  }
};

/**
 * Hook for navigation shortcuts
 */
export const useNavigationShortcuts = ({
  onGoHome,
  onGoCalendar,
  onGoAnalytics,
  onGoSettings
}) => {
  const shortcuts = {
    'ctrl+1': onGoHome,
    'ctrl+2': onGoCalendar,
    'ctrl+3': onGoAnalytics,
    'ctrl+4': onGoSettings,
    'alt+h': onGoHome,
    'alt+c': onGoCalendar,
    'alt+a': onGoAnalytics,
    'alt+s': onGoSettings
  };

  useKeyboardShortcuts(shortcuts, [
    onGoHome, onGoCalendar, onGoAnalytics, onGoSettings
  ]);
};

/**
 * Hook for form shortcuts
 */
export const useFormShortcuts = ({
  onSave,
  onCancel,
  onSubmit
}) => {
  const shortcuts = {
    'ctrl+s': onSave || onSubmit,
    'ctrl+enter': onSubmit,
    'escape': onCancel
  };

  useKeyboardShortcuts(shortcuts, [onSave, onCancel, onSubmit]);
};

/**
 * Get platform-specific modifier key text
 */
export const getModifierKey = () => {
  return navigator.platform.indexOf('Mac') > -1 ? '⌘' : 'Ctrl';
};

/**
 * Format shortcut for display
 */
export const formatShortcut = (shortcut) => {
  const modifierKey = getModifierKey();
  return shortcut
    .replace('ctrl+', `${modifierKey}+`)
    .replace('shift+', 'Shift+')
    .replace('alt+', 'Alt+')
    .toUpperCase();
};

/**
 * Common shortcuts configuration
 */
export const SHORTCUTS = {
  NEW_TASK: 'ctrl+n',
  SEARCH: 'ctrl+f',
  TOGGLE_FILTERS: 'ctrl+shift+f',
  SELECT_ALL: 'ctrl+a',
  DELETE: 'delete',
  REFRESH: 'ctrl+r',
  TOGGLE_VIEW: 'ctrl+shift+v',
  ESCAPE: 'escape',
  QUICK_SEARCH: '/',
  HELP: '?',
  SAVE: 'ctrl+s',
  SUBMIT: 'ctrl+enter'
};

export default useKeyboardShortcuts;