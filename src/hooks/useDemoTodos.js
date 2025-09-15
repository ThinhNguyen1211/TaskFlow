import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import demoService from '../services/demoService';

export const useDemoTodos = (filters = {}) => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load demo todos on mount
  useEffect(() => {
    const demoTodos = demoService.getDemoTasks();
    setTodos(demoTodos);
  }, []);
  
  // Filter todos based on filters
  const filteredTodos = todos.filter(todo => {
    if (filters.completed !== undefined && todo.completed !== filters.completed) {
      return false;
    }
    if (filters.priority && todo.priority !== filters.priority) {
      return false;
    }
    if (filters.category && todo.category !== filters.category) {
      return false;
    }
    if (filters.search && !todo.content.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });
  
  const addTodo = useCallback(async (taskData) => {
    const todoData = typeof taskData === 'string' 
      ? { content: taskData.trim() }
      : taskData;

    if (!todoData?.content?.trim()) return;

    setIsLoading(true);
    
    try {
      const newTodo = demoService.addDemoTask({
        content: todoData.content.trim(),
        description: todoData.description || '',
        completed: false,
        priority: todoData.priority || 'medium',
        estimatedTime: todoData.estimatedTime || undefined,
        deadline: todoData.deadline || undefined,
        category: todoData.category || 'Study',
        tags: todoData.tags || [],
      });
      
      setTodos(prev => [newTodo, ...prev]);
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const updateTodo = useCallback(async (id, updates) => {
    setIsLoading(true);
    
    try {
      const updatedTodo = demoService.updateDemoTask(id, updates);
      if (updatedTodo) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? updatedTodo : todo
        ));
        toast.success('Task updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const toggleTodo = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    await updateTodo(id, { completed: !todo.completed });
  }, [todos, updateTodo]);
  
  const deleteTodo = useCallback(async (id) => {
    setIsLoading(true);
    
    try {
      const success = demoService.deleteDemoTask(id);
      if (success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        toast.success('Task deleted successfully!');
      }
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const startTask = useCallback(async (id) => {
    await updateTodo(id, { 
      startedAt: new Date(),
      isRunning: true 
    });
  }, [updateTodo]);
  
  const completeTask = useCallback(async (id, actualTime) => {
    await updateTodo(id, { 
      completed: true,
      actualTime: actualTime,
      completedAt: new Date(),
      isRunning: false
    });
  }, [updateTodo]);
  
  return {
    todos: filteredTodos,
    totalCount: filteredTodos.length,
    hasNextPage: false,
    isLoading,
    isLoadingMore: false,
    error: null,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    startTask,
    completeTask,
    loadNextPage: () => {},
  };
};