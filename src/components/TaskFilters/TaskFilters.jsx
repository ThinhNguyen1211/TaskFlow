import { useState } from 'react';

const TaskFilters = ({ 
  filters, 
  onFiltersChange, 
  totalCount = 0,
  isLoading = false,
  availableTags = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };
    
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    onFiltersChange(newFilters);
  };

  const handleSortChange = (sortBy, sortOrder = 'desc') => {
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder
    });
  };

  const handleTagFilter = (tag) => {
    const currentTags = filters.tags ? filters.tags.split(',') : [];
    const newTags = currentTags.includes(tag) 
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    if (newTags.length === 0) {
      const newFilters = { ...filters };
      delete newFilters.tags;
      onFiltersChange(newFilters);
    } else {
      onFiltersChange({
        ...filters,
        tags: newTags.join(',')
      });
    }
  };

  const handleTagSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      onFiltersChange({
        ...filters,
        tags: searchTerm.trim()
      });
    } else {
      const newFilters = { ...filters };
      delete newFilters.tags;
      onFiltersChange(newFilters);
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    key !== 'sortBy' && key !== 'sortOrder' && filters[key]
  );

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'study', label: '📚 Study' },
    { value: 'assignment', label: '📝 Assignment' },
    { value: 'project', label: '🚀 Project' },
    { value: 'personal', label: '👤 Personal' },
    { value: 'work', label: '💼 Work' },
    { value: 'general', label: '📋 General' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Created Date', order: 'desc' },
    { value: 'deadline', label: 'Deadline', order: 'asc' },
    { value: 'priority', label: 'Priority', order: 'desc' },
    { value: 'content', label: 'Title', order: 'asc' }
  ];

  const completionOptions = [
    { value: '', label: 'All Tasks' },
    { value: 'false', label: 'Pending' },
    { value: 'true', label: 'Completed' }
  ];

  return (
    <div className="bg-slate-700/30 rounded-lg p-4 mb-4 border border-slate-600/30">
      {/* Header with toggle and results count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            disabled={isLoading}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium">Filters & Sort</span>
          </button>
          
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-600/20 text-blue-300 border border-blue-600/30">
              {Object.keys(filters).filter(key => key !== 'sortBy' && key !== 'sortOrder' && filters[key]).length} active
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {totalCount} task{totalCount !== 1 ? 's' : ''}
          </span>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-white transition-colors"
              disabled={isLoading}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Quick filter buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => handleFilterChange('completed', 'false')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.completed === 'false'
              ? 'bg-orange-600/30 text-orange-300 border border-orange-600/50'
              : 'bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-slate-600/30'
          }`}
          disabled={isLoading}
        >
          Pending
        </button>
        
        <button
          onClick={() => handleSortChange('deadline', 'asc')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.sortBy === 'deadline'
              ? 'bg-red-600/30 text-red-300 border border-red-600/50'
              : 'bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-slate-600/30'
          }`}
          disabled={isLoading}
        >
          By Deadline
        </button>
        
        <button
          onClick={() => handleSortChange('priority', 'desc')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.sortBy === 'priority'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-600/50'
              : 'bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-slate-600/30'
          }`}
          disabled={isLoading}
        >
          By Priority
        </button>
        
        <button
          onClick={() => handleFilterChange('priority', 'urgent')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.priority === 'urgent'
              ? 'bg-red-600/30 text-red-300 border border-red-600/50'
              : 'bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-slate-600/30'
          }`}
          disabled={isLoading}
        >
          Urgent Only
        </button>
        
        <button
          onClick={() => handleFilterChange('category', 'study')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.category === 'study'
              ? 'bg-green-600/30 text-green-300 border border-green-600/50'
              : 'bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-slate-600/30'
          }`}
          disabled={isLoading}
        >
          📚 Study
        </button>
        
        <button
          onClick={() => handleFilterChange('category', 'assignment')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            filters.category === 'assignment'
              ? 'bg-blue-600/30 text-blue-300 border border-blue-600/50'
              : 'bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-slate-600/30'
          }`}
          disabled={isLoading}
        >
          📝 Assignment
        </button>
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-slate-600/30">
          {/* Main filter row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Priority Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-2 py-1 text-sm bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-2 py-1 text-sm bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Completion Status */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.completed || ''}
              onChange={(e) => handleFilterChange('completed', e.target.value)}
              className="w-full px-2 py-1 text-sm bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            >
              {completionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleSortChange(sortBy, sortOrder);
              }}
              className="w-full px-2 py-1 text-sm bg-slate-600 border border-slate-500 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            >
              {sortOptions.map(option => (
                <option key={`${option.value}-${option.order}`} value={`${option.value}-${option.order}`}>
                  {option.label} ({option.order === 'asc' ? 'Ascending' : 'Descending'})
                </option>
              ))}
            </select>
          </div>
          </div>

          {/* Tag search and filter */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Search by Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTagSearch(tagSearch);
                      setTagSearch('');
                    }
                  }}
                  placeholder="Type tag name and press Enter..."
                  className="flex-1 px-3 py-2 text-sm bg-slate-600 border border-slate-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={() => {
                    handleTagSearch(tagSearch);
                    setTagSearch('');
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading || !tagSearch.trim()}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Available tags */}
            {availableTags.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Available Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = filters.tags?.split(',').includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagFilter(tag)}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-600/30 text-blue-300 border border-blue-600/50'
                            : 'bg-slate-600/30 text-gray-300 hover:bg-slate-600/50 border border-slate-600/30'
                        }`}
                        disabled={isLoading}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active tag filters */}
            {filters.tags && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Active Tag Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  {filters.tags.split(',').map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-600/30"
                    >
                      #{tag}
                      <button
                        onClick={() => handleTagFilter(tag)}
                        className="text-blue-300 hover:text-white"
                        disabled={isLoading}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;