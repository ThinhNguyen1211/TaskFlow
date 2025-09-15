import {
  calculateSearchScore,
  filterTasks,
  sortTasks,
  sortByRelevance,
  processSearchResults,
  getQuickFilterPresets,
  savedFilterManager
} from './searchService';

describe('Search Service', () => {
  const mockTasks = [
    {
      _id: '1',
      content: 'Study for math exam',
      description: 'Review calculus chapters 1-5',
      category: 'study',
      priority: 'high',
      tags: ['math', 'exam'],
      completed: false,
      deadline: new Date('2024-12-20'),
      createdAt: new Date('2024-12-10')
    },
    {
      _id: '2',
      content: 'Complete assignment',
      description: 'Finish the programming assignment',
      category: 'assignment',
      priority: 'urgent',
      tags: ['programming', 'homework'],
      completed: false,
      deadline: new Date('2024-12-15'),
      createdAt: new Date('2024-12-08')
    },
    {
      _id: '3',
      content: 'Buy groceries',
      description: 'Get milk, bread, and eggs',
      category: 'personal',
      priority: 'low',
      tags: ['shopping'],
      completed: true,
      createdAt: new Date('2024-12-05')
    }
  ];

  describe('calculateSearchScore', () => {
    test('returns 0 for empty search term', () => {
      const score = calculateSearchScore(mockTasks[0], '');
      expect(score).toBe(0);
    });

    test('gives higher score for exact content match', () => {
      const exactScore = calculateSearchScore(mockTasks[0], 'Study for math exam');
      const partialScore = calculateSearchScore(mockTasks[0], 'math');
      expect(exactScore).toBeGreaterThan(partialScore);
    });

    test('gives higher score for urgent priority', () => {
      const urgentScore = calculateSearchScore(mockTasks[1], 'assignment');
      const highScore = calculateSearchScore(mockTasks[0], 'study');
      expect(urgentScore).toBeGreaterThan(highScore);
    });

    test('boosts score for incomplete tasks', () => {
      const incompleteScore = calculateSearchScore(mockTasks[0], 'study');
      const completedScore = calculateSearchScore(mockTasks[2], 'groceries');
      expect(incompleteScore).toBeGreaterThan(completedScore);
    });
  });

  describe('filterTasks', () => {
    test('filters by search text', () => {
      const filtered = filterTasks(mockTasks, { search: 'math' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].content).toContain('math');
    });

    test('filters by category', () => {
      const filtered = filterTasks(mockTasks, { category: 'study' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].category).toBe('study');
    });

    test('filters by priority', () => {
      const filtered = filterTasks(mockTasks, { priority: 'urgent' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].priority).toBe('urgent');
    });

    test('filters by completion status', () => {
      const completed = filterTasks(mockTasks, { completed: true });
      const incomplete = filterTasks(mockTasks, { completed: false });
      
      expect(completed).toHaveLength(1);
      expect(incomplete).toHaveLength(2);
    });

    test('filters by tags', () => {
      const filtered = filterTasks(mockTasks, { tags: ['math'] });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].tags).toContain('math');
    });

    test('combines multiple filters', () => {
      const filtered = filterTasks(mockTasks, {
        category: 'study',
        priority: 'high',
        completed: false
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].content).toContain('math');
    });
  });

  describe('sortTasks', () => {
    test('sorts by priority correctly', () => {
      const sorted = sortTasks(mockTasks, 'priority', 'desc');
      expect(sorted[0].priority).toBe('urgent');
      expect(sorted[1].priority).toBe('high');
      expect(sorted[2].priority).toBe('low');
    });

    test('sorts by deadline correctly', () => {
      const sorted = sortTasks(mockTasks, 'deadline', 'asc');
      // Tasks with deadlines should come first, sorted by date
      expect(sorted[0].deadline).toBeTruthy();
      expect(sorted[1].deadline).toBeTruthy();
      expect(new Date(sorted[0].deadline)).toBeLessThanOrEqual(new Date(sorted[1].deadline));
    });

    test('sorts by content alphabetically', () => {
      const sorted = sortTasks(mockTasks, 'content', 'asc');
      expect(sorted[0].content).toBe('Buy groceries');
      expect(sorted[1].content).toBe('Complete assignment');
      expect(sorted[2].content).toBe('Study for math exam');
    });
  });

  describe('sortByRelevance', () => {
    test('sorts by search relevance', () => {
      const sorted = sortByRelevance(mockTasks, 'assignment');
      expect(sorted[0].content).toContain('assignment');
    });

    test('returns original order for empty search term', () => {
      const sorted = sortByRelevance(mockTasks, '');
      expect(sorted).toEqual(mockTasks);
    });
  });

  describe('processSearchResults', () => {
    test('processes search with text query', () => {
      const processed = processSearchResults(mockTasks, { search: 'math' });
      expect(processed).toHaveLength(1);
      expect(processed[0].content).toContain('math');
    });

    test('processes with filters and sorting', () => {
      const processed = processSearchResults(mockTasks, {
        category: 'study',
        sortBy: 'priority',
        sortOrder: 'desc'
      });
      expect(processed).toHaveLength(1);
      expect(processed[0].category).toBe('study');
    });
  });

  describe('getQuickFilterPresets', () => {
    test('returns array of quick filter presets', () => {
      const presets = getQuickFilterPresets();
      expect(Array.isArray(presets)).toBe(true);
      expect(presets.length).toBeGreaterThan(0);
      
      // Check structure of first preset
      const firstPreset = presets[0];
      expect(firstPreset).toHaveProperty('id');
      expect(firstPreset).toHaveProperty('label');
      expect(firstPreset).toHaveProperty('icon');
      expect(firstPreset).toHaveProperty('filters');
    });
  });

  describe('savedFilterManager', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    test('saves and loads filters', () => {
      const filters = { category: 'study', priority: 'high' };
      const success = savedFilterManager.save('test-filter', filters);
      
      expect(success).toBe(true);
      
      const loaded = savedFilterManager.load('test-filter');
      expect(loaded.category).toBe('study');
      expect(loaded.priority).toBe('high');
    });

    test('gets all saved filters', () => {
      savedFilterManager.save('filter1', { category: 'study' });
      savedFilterManager.save('filter2', { priority: 'high' });
      
      const all = savedFilterManager.getAll();
      expect(all).toHaveLength(2);
    });

    test('deletes saved filters', () => {
      savedFilterManager.save('test-filter', { category: 'study' });
      const success = savedFilterManager.delete('test-filter');
      
      expect(success).toBe(true);
      
      const loaded = savedFilterManager.load('test-filter');
      expect(loaded).toBeNull();
    });

    test('clears all saved filters', () => {
      savedFilterManager.save('filter1', { category: 'study' });
      savedFilterManager.save('filter2', { priority: 'high' });
      
      const success = savedFilterManager.clear();
      expect(success).toBe(true);
      
      const all = savedFilterManager.getAll();
      expect(all).toHaveLength(0);
    });
  });
});