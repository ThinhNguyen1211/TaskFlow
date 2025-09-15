import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedSearch from './AdvancedSearch';

// Mock the services
jest.mock('../../services/searchService', () => ({
  getQuickFilterPresets: () => [
    {
      id: 'overdue',
      label: 'Overdue',
      icon: '⚠️',
      color: 'bg-red-500/20 text-red-300 border-red-500/30',
      filters: { deadline: 'overdue', completed: false }
    }
  ],
  savedFilterManager: {
    getAll: () => [],
    save: jest.fn(),
    load: jest.fn(),
    delete: jest.fn()
  },
  searchAnalytics: {
    getPopularSearches: () => [
      { term: 'study', count: 5 },
      { term: 'assignment', count: 3 }
    ],
    trackSearch: jest.fn()
  }
}));

jest.mock('../../hooks/useDebouncedSearch', () => ({
  useDebouncedFilters: (onFiltersChange, initialFilters) => ({
    filters: initialFilters || {},
    debouncedFilters: initialFilters || {},
    isFiltering: false,
    updateFilter: jest.fn(),
    updateFilters: jest.fn(),
    clearFilters: jest.fn(),
    clearFilter: jest.fn()
  })
}));

describe('AdvancedSearch Component', () => {
  const mockOnFiltersChange = jest.fn();
  const defaultProps = {
    onFiltersChange: mockOnFiltersChange,
    totalCount: 10,
    availableTags: ['study', 'work', 'personal'],
    isLoading: false,
    initialFilters: {}
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input with placeholder', () => {
    render(<AdvancedSearch {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/search tasks by title/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('displays quick filter buttons', () => {
    render(<AdvancedSearch {...defaultProps} />);
    
    const overdueButton = screen.getByText('Overdue');
    expect(overdueButton).toBeInTheDocument();
  });

  test('shows results count', () => {
    render(<AdvancedSearch {...defaultProps} />);
    
    const resultsText = screen.getByText(/10 tasks? found/i);
    expect(resultsText).toBeInTheDocument();
  });

  test('expands advanced filters when button is clicked', () => {
    render(<AdvancedSearch {...defaultProps} />);
    
    const filtersButton = screen.getByText('Filters');
    fireEvent.click(filtersButton);
    
    // Should show advanced filter options
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  test('displays available tags when expanded', () => {
    render(<AdvancedSearch {...defaultProps} />);
    
    const filtersButton = screen.getByText('Filters');
    fireEvent.click(filtersButton);
    
    // Should show available tags
    expect(screen.getByText('#study')).toBeInTheDocument();
    expect(screen.getByText('#work')).toBeInTheDocument();
    expect(screen.getByText('#personal')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<AdvancedSearch {...defaultProps} isLoading={true} />);
    
    const loadingText = screen.getByText('Searching...');
    expect(loadingText).toBeInTheDocument();
  });

  test('keyboard shortcut focuses search input', () => {
    render(<AdvancedSearch {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText(/search tasks by title/i);
    
    // Simulate Ctrl+K
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    
    expect(searchInput).toHaveFocus();
  });
});