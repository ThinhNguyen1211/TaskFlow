import React, { useState, useEffect } from 'react';
import { searchAnalytics } from '../../services/searchService';

const SearchStats = ({ 
  currentResults = 0, 
  searchTerm = '', 
  filters = {},
  className = '' 
}) => {
  const [stats, setStats] = useState({
    popularSearches: [],
    totalSearches: 0,
    averageResults: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const popularSearches = searchAnalytics.getPopularSearches(7);
    const analytics = JSON.parse(localStorage.getItem('searchAnalytics') || '{}');
    
    // Calculate total searches and average results
    let totalSearches = 0;
    let totalResults = 0;
    
    Object.values(analytics).forEach(dayData => {
      totalSearches += dayData.totalSearches || 0;
      dayData.searches?.forEach(search => {
        totalResults += search.resultCount || 0;
      });
    });
    
    const averageResults = totalSearches > 0 ? Math.round(totalResults / totalSearches) : 0;
    
    setStats({
      popularSearches,
      totalSearches,
      averageResults
    });
  }, []);

  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key] !== undefined && 
    filters[key] !== '' && 
    filters[key] !== 'all' &&
    !(Array.isArray(filters[key]) && filters[key].length === 0)
  ).length;

  return (
    <div className={`bg-slate-700/20 rounded-lg border border-slate-600/30 ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-700/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm font-medium text-gray-300">Search Statistics</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {currentResults} results
          </span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-4 border-t border-slate-600/30 pt-3">
          {/* Current search info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-600/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Current Results</div>
              <div className="text-lg font-semibold text-white">{currentResults}</div>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Active Filters</div>
              <div className="text-lg font-semibold text-white">{activeFilterCount}</div>
            </div>
          </div>

          {/* Search analytics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-600/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Total Searches</div>
              <div className="text-lg font-semibold text-white">{stats.totalSearches}</div>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Avg Results</div>
              <div className="text-lg font-semibold text-white">{stats.averageResults}</div>
            </div>
          </div>

          {/* Popular searches */}
          {stats.popularSearches.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Popular Searches (Last 7 Days)</div>
              <div className="space-y-1">
                {stats.popularSearches.slice(0, 5).map((search, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-1 px-2 bg-slate-600/20 rounded text-xs"
                  >
                    <span className="text-gray-300">{search.term}</span>
                    <span className="text-gray-500">{search.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current filters breakdown */}
          {activeFilterCount > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Active Filters</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(filters).map(([key, value]) => {
                  if (value === undefined || value === '' || value === 'all' || 
                      (Array.isArray(value) && value.length === 0)) {
                    return null;
                  }
                  
                  let displayValue = value;
                  if (Array.isArray(value)) {
                    displayValue = value.join(', ');
                  }
                  
                  return (
                    <span 
                      key={key}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                    >
                      {key}: {displayValue}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search tips */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="text-xs text-blue-300 font-medium mb-1">💡 Search Tips</div>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• Use quotes for exact phrases: "urgent task"</li>
              <li>• Search in tags with #: #study #assignment</li>
              <li>• Combine filters for better results</li>
              <li>• Save frequently used filter combinations</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchStats;