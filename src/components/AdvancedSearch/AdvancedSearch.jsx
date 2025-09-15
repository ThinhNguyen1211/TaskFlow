import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useDebouncedFilters } from '../../hooks/useDebouncedSearch';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { 
  getQuickFilterPresets, 
  savedFilterManager, 
  searchAnalytics 
} from '../../services/searchService';

const AdvancedSearch = ({ 
  onFiltersChange, 
  totalCount = 0, 
  availableTags = [], 
  isLoading = false,
  initialFilters = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedFilters, setSavedFilters] = useState(() => {
    const saved = localStorage.getItem('savedTaskFilters');
    return saved ? JSON.parse(saved) : {};
  });

  // Use debounced filters hook
  const {
    filters,
    debouncedFilters,
    isFiltering,
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter
  } = useDebouncedFilters(onFiltersChange, initialFilters, 300);

  // Quick filter presets from service
  const quickFilters = useMemo(() => getQuickFilterPresets(), []);

  // Popular searches for suggestions
  const [popularSearches, setPopularSearches] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchInputRef = useRef(null);

  // Load popular searches on mount
  useEffect(() => {
    const popular = searchAnalytics.getPopularSearches(7);
    setPopularSearches(popular);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Escape to clear search
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        clearFilters();
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearFilters]);

  // Handle search text change
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    updateFilter('search', value);
    
    // Show suggestions when typing
    setShowSearchSuggestions(value.length > 0 && popularSearches.length > 0);
    
    // Track search analytics when user stops typing
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        searchAnalytics.trackSearch(value.trim(), totalCount);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [updateFilter, popularSearches.length, totalCount]);

  // Handle search suggestion click
  const handleSearchSuggestion = useCallback((suggestion) => {
    updateFilter('search', suggestion);
    setShowSearchSuggestions(false);
  }, [updateFilter]);

  // Handle quick filter click
  const handleQuickFilter = useCallback((quickFilter) => {
    const isActive = JSON.stringify(debouncedFilters) === JSON.stringify(quickFilter.filters);
    if (isActive) {
      clearFilters();
    } else {
      updateFilters(quickFilter.filters);
    }
  }, [debouncedFilters, clearFilters, updateFilters]);

  // Handle category change
  const handleCategoryChange = useCallback((e) => {
    const value = e.target.value;
    updateFilter('category', value === 'all' ? undefined : value);
  }, [updateFilter]);

  // Handle priority change
  const handlePriorityChange = useCallback((e) => {
    const value = e.target.value;
    updateFilter('priority', value === 'all' ? undefined : value);
  }, [updateFilter]);

  // Handle completion status change
  const handleCompletionChange = useCallback((e) => {
    const value = e.target.value;
    updateFilter('completed', value === 'all' ? undefined : value === 'true');
  }, [updateFilter]);

  // Handle tag selection
  const handleTagToggle = useCallback((tag) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilter('tags', newTags.length > 0 ? newTags : undefined);
  }, [filters.tags, updateFilter]);

  // Handle date range change
  const handleDateRangeChange = useCallback((field, value) => {
    updateFilter(field, value || undefined);
  }, [updateFilter]);

  // Handle sorting change
  const handleSortChange = useCallback((field, value) => {
    updateFilter(field, value);
  }, [updateFilter]);

  // Save current filters using service
  const handleSaveFilters = useCallback(() => {
    const name = prompt('Enter a name for this filter preset:');
    if (name && name.trim()) {
      const success = savedFilterManager.save(name.trim(), debouncedFilters);
      if (success) {
        // Refresh saved filters list
        const allSaved = savedFilterManager.getAll();
        const savedObj = {};
        allSaved.forEach(filter => {
          savedObj[filter.name] = filter;
        });
        setSavedFilters(savedObj);
      }
    }
  }, [debouncedFilters]);

  // Load saved filters using service
  const handleLoadFilters = useCallback((name) => {
    const filter = savedFilterManager.load(name);
    if (filter) {
      // Remove metadata before applying
      const { savedAt, name: filterName, ...filterData } = filter;
      updateFilters(filterData);
    }
  }, [updateFilters]);

  // Delete saved filters using service
  const handleDeleteSavedFilter = useCallback((name) => {
    const success = savedFilterManager.delete(name);
    if (success) {
      // Refresh saved filters list
      const allSaved = savedFilterManager.getAll();
      const savedObj = {};
      allSaved.forEach(filter => {
        savedObj[filter.name] = filter;
      });
      setSavedFilters(savedObj);
    }
  }, []);

  // Load saved filters on mount
  useEffect(() => {
    const allSaved = savedFilterManager.getAll();
    const savedObj = {};
    allSaved.forEach(filter => {
      savedObj[filter.name] = filter;
    });
    setSavedFilters(savedObj);
  }, []);

  // Check if a quick filter is active
  const isQuickFilterActive = useCallback((quickFilter) => {
    return JSON.stringify(debouncedFilters) === JSON.stringify(quickFilter.filters);
  }, [debouncedFilters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.keys(debouncedFilters).filter(key => 
      debouncedFilters[key] !== undefined && 
      debouncedFilters[key] !== '' &&
      !(Array.isArray(debouncedFilters[key]) && debouncedFilters[key].length === 0)
    ).length;
  }, [debouncedFilters]);

  return (
    <div className="bg-slate-700/30 rounded-lg p-4 mb-4">
      {/* Search Bar and Quick Actions */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tasks by title, description, tags, or category... (Ctrl+K)"
            value={filters.search || ''}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchSuggestions(popularSearches.length > 0 && !filters.search)}
            onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
            className="w-full pl-10 pr-4 py-2 bg-slate-600/50 border border-slate-500/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {isFiltering && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <LoadingSpinner size="sm" />
            </div>
          )}
          
          {/* Search Suggestions */}
          {showSearchSuggestions && popularSearches.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
              <div className="p-2 text-xs text-gray-400 border-b border-slate-600">
                Popular searches
              </div>
              {popularSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchSuggestion(search.term)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-slate-600 flex items-center justify-between"
                >
                  <span>{search.term}</span>
                  <span className="text-xs text-gray-500">{search.count} searches</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
            isExpanded 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-600/50 text-gray-300 hover:bg-slate-600'
          }`}
        >
          <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 bg-red-600/20 text-red-300 rounded-md hover:bg-red-600/30 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickFilters.map((quickFilter) => (
          <button
            key={quickFilter.id}
            onClick={() => handleQuickFilter(quickFilter)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 flex items-center gap-1.5 ${
              isQuickFilterActive(quickFilter)
                ? `${quickFilter.color} ring-2 ring-blue-500/50`
                : 'bg-slate-600/30 text-gray-300 border-slate-500/30 hover:bg-slate-600/50'
            }`}
          >
            <span className="text-xs">{quickFilter.icon}</span>
            {quickFilter.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-slate-600/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={filters.category || 'all'}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="study">📚 Study</option>
                <option value="assignment">📝 Assignment</option>
                <option value="project">🚀 Project</option>
                <option value="personal">👤 Personal</option>
                <option value="work">💼 Work</option>
                <option value="general">📋 General</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                value={filters.priority || 'all'}
                onChange={handlePriorityChange}
                className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">🚨 Urgent</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            {/* Completion Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={filters.completed === undefined ? 'all' : filters.completed.toString()}
                onChange={handleCompletionChange}
                className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tasks</option>
                <option value="false">📋 Pending</option>
                <option value="true">✅ Completed</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleSortChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="deadline">Deadline</option>
                <option value="priority">Priority</option>
                <option value="content">Name</option>
                <option value="updatedAt">Last Modified</option>
              </select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deadline From</label>
              <input
                type="date"
                value={filters.deadlineFrom || ''}
                onChange={(e) => handleDateRangeChange('deadlineFrom', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Deadline To</label>
              <input
                type="date"
                value={filters.deadlineTo || ''}
                onChange={(e) => handleDateRangeChange('deadlineTo', e.target.value)}
                className="w-full px-3 py-2 bg-slate-600/50 border border-slate-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      (filters.tags || []).includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-600/50 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Saved Filters */}
          {Object.keys(savedFilters).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Saved Filters</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(savedFilters).map((name) => (
                  <div key={name} className="flex items-center gap-1">
                    <button
                      onClick={() => handleLoadFilters(name)}
                      className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-md hover:bg-purple-600/30 transition-colors text-sm"
                    >
                      {name}
                    </button>
                    <button
                      onClick={() => handleDeleteSavedFilter(name)}
                      className="w-5 h-5 bg-red-600/20 text-red-300 rounded hover:bg-red-600/30 transition-colors flex items-center justify-center"
                      title="Delete saved filter"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Current Filters */}
          {activeFilterCount > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleSaveFilters}
                className="px-4 py-2 bg-green-600/20 text-green-300 rounded-md hover:bg-green-600/30 transition-colors text-sm"
              >
                Save Current Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
        <span>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Searching...
            </span>
          ) : (
            `${totalCount} task${totalCount !== 1 ? 's' : ''} found`
          )}
        </span>
        
        {activeFilterCount > 0 && (
          <span className="text-blue-300">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </span>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;