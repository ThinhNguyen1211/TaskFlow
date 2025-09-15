import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import demoService from '../services/demoService';
import procrastinationService from '../services/procrastinationService';

export const useTodos = (filters = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Initialize demo mode and load todos
  useEffect(() => {
    if (!demoService.isDemoMode()) {
      demoService.initializeDemo();
    }
    loadTodos();
  }, []);

  // Reload todos when filters change
  useEffect(() => {
    loadTodos();
  }, [filters]);

  // Load todos from demo service
  const loadTodos = useCallback(() => {
    try {
      setIsLoading(true);
      const demoTodos = demoService.getDemoTasks();
      const filteredTodos = applyFilters(demoTodos, filters);
      setTodos(filteredTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Apply filters to todos
  const applyFilters = useCallback((todoList, filterOptions) => {
    let filtered = [...todoList];

    // Apply completion filter
    if (filterOptions.completed !== undefined) {
      const isCompleted = filterOptions.completed === 'true' || filterOptions.completed === true;
      filtered = filtered.filter(todo => todo.completed === isCompleted);
    }

    // Apply priority filter
    if (filterOptions.priority) {
      filtered = filtered.filter(todo => todo.priority === filterOptions.priority);
    }

    // Apply category filter
    if (filterOptions.category) {
      filtered = filtered.filter(todo => 
        todo.category?.toLowerCase() === filterOptions.category.toLowerCase()
      );
    }

    // Apply tags filter
    if (filterOptions.tags) {
      const searchTags = filterOptions.tags.split(',').map(tag => tag.trim().toLowerCase());
      filtered = filtered.filter(todo => 
        todo.tags && todo.tags.some(tag => 
          searchTags.some(searchTag => 
            tag.toLowerCase().includes(searchTag)
          )
        )
      );
    }

    // Apply search filter
    if (filterOptions.search) {
      const searchTerm = filterOptions.search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.content?.toLowerCase().includes(searchTerm) ||
        todo.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    const sortBy = filterOptions.sortBy || 'createdAt';
    const sortOrder = filterOptions.sortOrder || 'desc';

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle date fields
      if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'deadline') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      // Handle priority sorting
      if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[aValue] || 0;
        bValue = priorityOrder[bValue] || 0;
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, []);

  // Get available tags from all todos
  const availableTags = useMemo(() => {
    const allTodos = demoService.getDemoTasks();
    const tagSet = new Set();
    allTodos.forEach(todo => {
      if (todo.tags) {
        todo.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [todos]);

  // Add todo
  const addTodo = useCallback(async (taskData) => {
    const todoData = typeof taskData === 'string' 
      ? { content: taskData.trim() }
      : taskData;

    if (!todoData?.content?.trim()) return;

    try {
      setIsLoading(true);
      
      const newTodo = demoService.addDemoTask(todoData);
      
      if (newTodo) {
        loadTodos(); // Reload to apply current filters
        toast.success('Task added successfully!');
        return newTodo;
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add task');
    } finally {
      setIsLoading(false);
    }
  }, [loadTodos]);

  // Update todo
  const updateTodo = useCallback(async (id, updateData) => {
    try {
      setIsLoading(true);
      
      const updatedTodo = demoService.updateDemoTask(id, updateData);
      
      if (updatedTodo) {
        loadTodos(); // Reload to apply current filters
        toast.success('Task updated successfully!');
        return updatedTodo;
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  }, [loadTodos]);

  // Toggle todo completion
  const toggleTodo = useCallback(async (id) => {
    const todoToUpdate = todos.find(todo => (todo._id || todo.id) === id);
    if (!todoToUpdate) return;
    
    await updateTodo(id, { completed: !todoToUpdate.completed });
  }, [todos, updateTodo]);

  // Delete todo
  const deleteTodo = useCallback(async (id) => {
    try {
      setIsLoading(true);
      
      const success = demoService.deleteDemoTask(id);
      
      if (success) {
        loadTodos(); // Reload to apply current filters
        toast.success('Task deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  }, [loadTodos]);

  // Start task timer
  const startTask = useCallback(async (id) => {
    try {
      setIsLoading(true);
      await updateTodo(id, { 
        startedAt: new Date().toISOString(),
        isRunning: true 
      });
      toast.success('Task timer started!');
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error('Failed to start task timer');
    } finally {
      setIsLoading(false);
    }
  }, [updateTodo]);

  // Complete task with time tracking
  const completeTask = useCallback(async (id, actualTime) => {
    try {
      setIsLoading(true);
      
      const completedTask = await updateTodo(id, { 
        completed: true, 
        actualTime,
        completedAt: new Date().toISOString(),
        isRunning: false
      });
      
      // Update procrastination patterns
      if (completedTask && completedTask.estimatedTime && completedTask.actualTime) {
        procrastinationService.updatePatternsFromCompletedTask(completedTask);
      }
      
      toast.success('Task completed!');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    } finally {
      setIsLoading(false);
    }
  }, [updateTodo]);

  // Load next page (for pagination - simplified for demo)
  const loadNextPage = useCallback(async () => {
    // In demo mode, we don't need real pagination
    // This is just for compatibility with existing components
    setIsLoadingMore(false);
  }, []);

  // Reset pagination
  const resetPagination = useCallback(() => {
    // No-op for demo mode
  }, []);

  // Mutate function for compatibility
  const mutate = useCallback(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos: todos || [],
    totalCount: todos.length,
    hasNextPage: false, // No pagination in demo mode
    isLoading,
    isLoadingMore,
    error: null,
    availableTags,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    startTask,
    completeTask,
    loadNextPage,
    resetPagination,
    mutate
  };
};