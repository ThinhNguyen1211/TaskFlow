import React from 'react';

/**
 * Utility functions for search highlighting and result ranking
 */

/**
 * Highlights search terms in text
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The search term to highlight
 * @param {string} className - CSS class for highlighted text
 * @returns {JSX.Element} - React element with highlighted text
 */
export const highlightSearchTerm = (text, searchTerm, className = 'bg-yellow-400/30 text-yellow-200') => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <span key={index} className={className}>
          {part}
        </span>
      );
    }
    return part;
  });
};

/**
 * Escapes special regex characters
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Calculates relevance score for search results
 * @param {Object} task - Task object
 * @param {string} searchTerm - Search term
 * @returns {number} - Relevance score (higher is more relevant)
 */
export const calculateRelevanceScore = (task, searchTerm) => {
  if (!searchTerm) return 0;

  const term = searchTerm.toLowerCase();
  let score = 0;

  // Title/content matches (highest priority)
  if (task.content?.toLowerCase().includes(term)) {
    const contentLower = task.content.toLowerCase();
    // Exact match bonus
    if (contentLower === term) score += 100;
    // Starts with term bonus
    else if (contentLower.startsWith(term)) score += 50;
    // Contains term
    else score += 25;
  }

  // Description matches
  if (task.description?.toLowerCase().includes(term)) {
    score += 15;
  }

  // Tag matches
  if (task.tags?.some(tag => tag.toLowerCase().includes(term))) {
    score += 20;
  }

  // Category matches
  if (task.category?.toLowerCase().includes(term)) {
    score += 10;
  }

  // Priority matches
  if (task.priority?.toLowerCase().includes(term)) {
    score += 5;
  }

  return score;
};

/**
 * Sorts tasks by relevance score
 * @param {Array} tasks - Array of tasks
 * @param {string} searchTerm - Search term
 * @returns {Array} - Sorted tasks by relevance
 */
export const sortByRelevance = (tasks, searchTerm) => {
  if (!searchTerm) return tasks;

  return [...tasks].sort((a, b) => {
    const scoreA = calculateRelevanceScore(a, searchTerm);
    const scoreB = calculateRelevanceScore(b, searchTerm);
    return scoreB - scoreA;
  });
};

/**
 * Filters tasks based on search criteria
 * @param {Array} tasks - Array of tasks
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered tasks
 */
export const filterTasks = (tasks, filters) => {
  if (!tasks || !Array.isArray(tasks)) return [];

  return tasks.filter(task => {
    // Search text filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        task.content,
        task.description,
        task.category,
        task.priority,
        ...(task.tags || [])
      ].join(' ').toLowerCase();

      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && task.category !== filters.category) {
      return false;
    }

    // Priority filter
    if (filters.priority) {
      if (Array.isArray(filters.priority)) {
        if (!filters.priority.includes(task.priority)) {
          return false;
        }
      } else if (task.priority !== filters.priority) {
        return false;
      }
    }

    // Completion status filter
    if (filters.completed !== undefined && task.completed !== filters.completed) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const taskTags = task.tags || [];
      const hasMatchingTag = filters.tags.some(tag => taskTags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Deadline filters
    if (filters.deadline) {
      const now = new Date();
      const taskDeadline = task.deadline ? new Date(task.deadline) : null;

      switch (filters.deadline) {
        case 'overdue':
          if (!taskDeadline || taskDeadline >= now) return false;
          break;
        case 'today':
          if (!taskDeadline) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (taskDeadline < today || taskDeadline >= tomorrow) return false;
          break;
        case 'week':
          if (!taskDeadline) return false;
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          if (taskDeadline > weekFromNow) return false;
          break;
        case 'none':
          if (taskDeadline) return false;
          break;
      }
    }

    // Date range filters
    if (filters.deadlineFrom) {
      const fromDate = new Date(filters.deadlineFrom);
      const taskDeadline = task.deadline ? new Date(task.deadline) : null;
      if (!taskDeadline || taskDeadline < fromDate) {
        return false;
      }
    }

    if (filters.deadlineTo) {
      const toDate = new Date(filters.deadlineTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      const taskDeadline = task.deadline ? new Date(task.deadline) : null;
      if (!taskDeadline || taskDeadline > toDate) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sorts tasks based on sort criteria
 * @param {Array} tasks - Array of tasks
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted tasks
 */
export const sortTasks = (tasks, sortBy = 'createdAt', sortOrder = 'desc') => {
  if (!tasks || !Array.isArray(tasks)) return [];

  return [...tasks].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
        break;
      case 'deadline':
        aValue = a.deadline ? new Date(a.deadline).getTime() : 0;
        bValue = b.deadline ? new Date(b.deadline).getTime() : 0;
        // Tasks without deadlines go to the end
        if (!a.deadline && b.deadline) return 1;
        if (a.deadline && !b.deadline) return -1;
        break;
      case 'content':
        aValue = (a.content || '').toLowerCase();
        bValue = (b.content || '').toLowerCase();
        break;
      case 'createdAt':
      case 'updatedAt':
        aValue = new Date(a[sortBy] || 0).getTime();
        bValue = new Date(b[sortBy] || 0).getTime();
        break;
      default:
        aValue = a[sortBy] || '';
        bValue = b[sortBy] || '';
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Processes tasks with search, filter, and sort
 * @param {Array} tasks - Array of tasks
 * @param {Object} filters - Filter and sort criteria
 * @returns {Array} - Processed tasks
 */
export const processTasksWithSearch = (tasks, filters) => {
  let processedTasks = filterTasks(tasks, filters);

  // Sort by relevance if there's a search term, otherwise by specified sort
  if (filters.search) {
    processedTasks = sortByRelevance(processedTasks, filters.search);
  } else {
    processedTasks = sortTasks(processedTasks, filters.sortBy, filters.sortOrder);
  }

  return processedTasks;
};