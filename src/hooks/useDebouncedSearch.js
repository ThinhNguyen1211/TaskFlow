import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

/**
 * Custom hook for debounced search functionality
 * @param {Function} onSearch - Callback function to execute when search changes
 * @param {number} delay - Debounce delay in milliseconds (default: 300)
 * @param {string} initialValue - Initial search value
 * @returns {Object} - { searchTerm, setSearchTerm, debouncedSearchTerm, isSearching }
 */
export const useDebouncedSearch = (onSearch, delay = 300, initialValue = '') => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);

  // Create debounced function
  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
      setIsSearching(false);
      if (onSearch) {
        onSearch(term);
      }
    }, delay),
    [onSearch, delay]
  );

  // Effect to handle search term changes
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
    debouncedSearch(searchTerm);

    // Cleanup function to cancel debounced calls
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch, debouncedSearchTerm]);

  // Clear search function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setIsSearching(false);
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isSearching,
    clearSearch,
  };
};

/**
 * Hook for advanced search with multiple filters
 * @param {Function} onFiltersChange - Callback when filters change
 * @param {Object} initialFilters - Initial filter values
 * @param {number} delay - Debounce delay
 * @returns {Object} - Filter management functions and state
 */
export const useDebouncedFilters = (onFiltersChange, initialFilters = {}, delay = 300) => {
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(initialFilters);
  const [isFiltering, setIsFiltering] = useState(false);

  // Create debounced function for filters
  const debouncedFilterChange = useCallback(
    debounce((newFilters) => {
      setDebouncedFilters(newFilters);
      setIsFiltering(false);
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    }, delay),
    [onFiltersChange, delay]
  );

  // Effect to handle filter changes
  useEffect(() => {
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(debouncedFilters);
    if (filtersChanged) {
      setIsFiltering(true);
    }
    debouncedFilterChange(filters);

    return () => {
      debouncedFilterChange.cancel();
    };
  }, [filters, debouncedFilterChange, debouncedFilters]);

  // Update specific filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    setDebouncedFilters(emptyFilters);
    setIsFiltering(false);
    if (onFiltersChange) {
      onFiltersChange(emptyFilters);
    }
  }, [onFiltersChange]);

  // Clear specific filter
  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    filters,
    debouncedFilters,
    isFiltering,
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    setFilters,
  };
};