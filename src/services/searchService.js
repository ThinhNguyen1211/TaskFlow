/**
 * Comprehensive search and filtering service
 * Handles advanced search functionality, result ranking, and filter management
 */

/**
 * Search result ranking algorithm
 * Calculates relevance score based on multiple factors
 */
export const calculateSearchScore = (task, searchTerm) => {
  if (!searchTerm || !task) return 0;

  const term = searchTerm.toLowerCase().trim();
  let score = 0;

  // Content/title matches (highest priority)
  if (task.content) {
    const content = task.content.toLowerCase();
    if (content === term) score += 100; // Exact match
    else if (content.startsWith(term)) score += 80; // Starts with
    else if (content.includes(term)) {
      // Word boundary matches get higher score
      const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
      if (wordBoundaryRegex.test(content)) score += 60;
      else score += 40; // Contains term
    }
  }

  // Description matches
  if (task.description) {
    const description = task.description.toLowerCase();
    if (description.includes(term)) {
      const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
      if (wordBoundaryRegex.test(description)) score += 30;
      else score += 20;
    }
  }

  // Tag matches (high priority for exact matches)
  if (task.tags && Array.isArray(task.tags)) {
    task.tags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      if (tagLower === term) score += 70; // Exact tag match
      else if (tagLower.includes(term)) score += 35;
    });
  }

  // Category matches
  if (task.category && task.category.toLowerCase().includes(term)) {
    score += 25;
  }

  // Priority matches
  if (task.priority && task.priority.toLowerCase().includes(term)) {
    score += 15;
  }

  // Boost score for incomplete tasks (more relevant for active work)
  if (!task.completed) {
    score *= 1.2;
  }

  // Boost score for urgent/high priority tasks
  if (task.priority === 'urgent') score *= 1.3;
  else if (task.priority === 'high') score *= 1.1;

  // Boost score for tasks with approaching deadlines
  if (task.deadline) {
    const deadline = new Date(task.deadline);
    const now = new Date();
    const daysUntilDeadline = (deadline - now) / (1000 * 60 * 60 * 24);
    
    if (daysUntilDeadline <= 1 && daysUntilDeadline >= 0) {
      score *= 1.4; // Due today or tomorrow
    } else if (daysUntilDeadline <= 7 && daysUntilDeadline >= 0) {
      score *= 1.2; // Due this week
    } else if (daysUntilDeadline < 0) {
      score *= 1.5; // Overdue
    }
  }

  return Math.round(score);
};

/**
 * Escapes special regex characters
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Advanced task filtering with multiple criteria
 */
export const filterTasks = (tasks, filters) => {
  if (!tasks || !Array.isArray(tasks)) return [];

  return tasks.filter(task => {
    // Text search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      const searchableContent = [
        task.content || '',
        task.description || '',
        task.category || '',
        task.priority || '',
        ...(task.tags || [])
      ].join(' ').toLowerCase();

      if (!searchableContent.includes(searchTerm)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'all' && task.category !== filters.category) {
      return false;
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      if (Array.isArray(filters.priority)) {
        if (!filters.priority.includes(task.priority)) return false;
      } else if (task.priority !== filters.priority) {
        return false;
      }
    }

    // Completion status filter
    if (filters.completed !== undefined && filters.completed !== 'all') {
      if (task.completed !== filters.completed) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const taskTags = task.tags || [];
      const hasMatchingTag = filters.tags.some(tag => taskTags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // Deadline-based filters
    if (filters.deadline) {
      const now = new Date();
      const taskDeadline = task.deadline ? new Date(task.deadline) : null;

      switch (filters.deadline) {
        case 'overdue':
          if (!taskDeadline || taskDeadline >= now || task.completed) return false;
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
          if (taskDeadline > weekFromNow || task.completed) return false;
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
      if (!taskDeadline || taskDeadline < fromDate) return false;
    }

    if (filters.deadlineTo) {
      const toDate = new Date(filters.deadlineTo);
      toDate.setHours(23, 59, 59, 999);
      const taskDeadline = task.deadline ? new Date(task.deadline) : null;
      if (!taskDeadline || taskDeadline > toDate) return false;
    }

    return true;
  });
};

/**
 * Sorts tasks based on criteria
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
      case 'relevance':
        // This should be handled separately with search term
        return 0;
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
 * Sorts tasks by search relevance
 */
export const sortByRelevance = (tasks, searchTerm) => {
  if (!searchTerm || !tasks) return tasks;

  return [...tasks].sort((a, b) => {
    const scoreA = calculateSearchScore(a, searchTerm);
    const scoreB = calculateSearchScore(b, searchTerm);
    return scoreB - scoreA; // Higher scores first
  });
};

/**
 * Main search processing function
 * Combines filtering, sorting, and relevance ranking
 */
export const processSearchResults = (tasks, filters) => {
  let processedTasks = filterTasks(tasks, filters);

  // If there's a search term, sort by relevance
  if (filters.search && filters.search.trim()) {
    processedTasks = sortByRelevance(processedTasks, filters.search);
  } else {
    // Otherwise, sort by specified criteria
    processedTasks = sortTasks(processedTasks, filters.sortBy, filters.sortOrder);
  }

  return processedTasks;
};

/**
 * Quick filter presets for common search patterns
 */
export const getQuickFilterPresets = () => [
  {
    id: 'overdue',
    label: 'Overdue',
    icon: '⚠️',
    color: 'bg-red-500/20 text-red-300 border-red-500/30',
    filters: {
      deadline: 'overdue',
      completed: false
    },
    description: 'Tasks past their deadline'
  },
  {
    id: 'due-today',
    label: 'Due Today',
    icon: '🔥',
    color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    filters: {
      deadline: 'today',
      completed: false
    },
    description: 'Tasks due today'
  },
  {
    id: 'this-week',
    label: 'This Week',
    icon: '📅',
    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    filters: {
      deadline: 'week',
      completed: false
    },
    description: 'Tasks due within 7 days'
  },
  {
    id: 'high-priority',
    label: 'High Priority',
    icon: '🚨',
    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    filters: {
      priority: ['high', 'urgent'],
      completed: false
    },
    description: 'High and urgent priority tasks'
  },
  {
    id: 'completed-today',
    label: 'Completed Today',
    icon: '✅',
    color: 'bg-green-500/20 text-green-300 border-green-500/30',
    filters: {
      completed: true,
      // Note: This would need backend support for completion date filtering
    },
    description: 'Tasks completed today'
  },
  {
    id: 'no-deadline',
    label: 'No Deadline',
    icon: '📋',
    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    filters: {
      deadline: 'none'
    },
    description: 'Tasks without deadlines'
  },
  {
    id: 'study-tasks',
    label: 'Study Tasks',
    icon: '📚',
    color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    filters: {
      category: 'study',
      completed: false
    },
    description: 'Study-related tasks'
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: '📝',
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    filters: {
      category: 'assignment',
      completed: false
    },
    description: 'Assignment tasks'
  }
];

/**
 * Saved filter management
 */
export const savedFilterManager = {
  STORAGE_KEY: 'taskSearchFilters',

  save: (name, filters) => {
    try {
      const saved = JSON.parse(localStorage.getItem(savedFilterManager.STORAGE_KEY) || '{}');
      saved[name] = {
        ...filters,
        savedAt: new Date().toISOString(),
        name
      };
      localStorage.setItem(savedFilterManager.STORAGE_KEY, JSON.stringify(saved));
      return true;
    } catch (error) {
      console.error('Failed to save filter:', error);
      return false;
    }
  },

  load: (name) => {
    try {
      const saved = JSON.parse(localStorage.getItem(savedFilterManager.STORAGE_KEY) || '{}');
      return saved[name] || null;
    } catch (error) {
      console.error('Failed to load filter:', error);
      return null;
    }
  },

  getAll: () => {
    try {
      const saved = JSON.parse(localStorage.getItem(savedFilterManager.STORAGE_KEY) || '{}');
      return Object.values(saved).sort((a, b) => 
        new Date(b.savedAt) - new Date(a.savedAt)
      );
    } catch (error) {
      console.error('Failed to get saved filters:', error);
      return [];
    }
  },

  delete: (name) => {
    try {
      const saved = JSON.parse(localStorage.getItem(savedFilterManager.STORAGE_KEY) || '{}');
      delete saved[name];
      localStorage.setItem(savedFilterManager.STORAGE_KEY, JSON.stringify(saved));
      return true;
    } catch (error) {
      console.error('Failed to delete filter:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(savedFilterManager.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear saved filters:', error);
      return false;
    }
  }
};

/**
 * Search analytics and insights
 */
export const searchAnalytics = {
  // Track search patterns
  trackSearch: (searchTerm, resultCount) => {
    try {
      const analytics = JSON.parse(localStorage.getItem('searchAnalytics') || '{}');
      const today = new Date().toISOString().split('T')[0];
      
      if (!analytics[today]) {
        analytics[today] = { searches: [], totalSearches: 0 };
      }
      
      analytics[today].searches.push({
        term: searchTerm,
        resultCount,
        timestamp: new Date().toISOString()
      });
      analytics[today].totalSearches++;
      
      // Keep only last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      Object.keys(analytics).forEach(date => {
        if (new Date(date) < thirtyDaysAgo) {
          delete analytics[date];
        }
      });
      
      localStorage.setItem('searchAnalytics', JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  },

  // Get popular search terms
  getPopularSearches: (days = 7) => {
    try {
      const analytics = JSON.parse(localStorage.getItem('searchAnalytics') || '{}');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const termCounts = {};
      
      Object.entries(analytics).forEach(([date, data]) => {
        if (new Date(date) >= cutoffDate) {
          data.searches.forEach(search => {
            const term = search.term.toLowerCase().trim();
            if (term) {
              termCounts[term] = (termCounts[term] || 0) + 1;
            }
          });
        }
      });
      
      return Object.entries(termCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([term, count]) => ({ term, count }));
    } catch (error) {
      console.error('Failed to get popular searches:', error);
      return [];
    }
  }
};

export default {
  calculateSearchScore,
  filterTasks,
  sortTasks,
  sortByRelevance,
  processSearchResults,
  getQuickFilterPresets,
  savedFilterManager,
  searchAnalytics
};