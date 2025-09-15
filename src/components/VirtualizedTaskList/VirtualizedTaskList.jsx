import React, { memo, useMemo, useCallback } from 'react';
import { List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import TaskItem from '../TaskItem/TaskItem';
import OptimizedTaskItem from '../TaskItem/OptimizedTaskItem';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

// Memoized task item component for better performance
const VirtualizedTaskItem = memo(({ index, style, data }) => {
  const { 
    todos, 
    hasNextPage, 
    isNextPageLoading, 
    toggleTodo, 
    deleteTodo, 
    updateTodo, 
    startTask, 
    completeTask, 
    onEditTask,
    searchTerm 
  } = data;

  let content;

  // Show loading spinner for items that are being loaded
  if (index >= todos.length) {
    content = (
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-gray-400">Loading more tasks...</span>
      </div>
    );
  } else {
    const todo = todos[index];
    content = (
      <OptimizedTaskItem
        todo={todo}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={onEditTask}
        onStartTimer={startTask}
        onStopTimer={updateTodo}
        onCompleteTask={completeTask}
        searchTerm={searchTerm}
      />
    );
  }

  return (
    <div style={style} className="task-item-wrapper">
      <div className="w-full">
        {content}
      </div>
    </div>
  );
});

VirtualizedTaskItem.displayName = 'VirtualizedTaskItem';

const VirtualizedTaskList = ({
  todos = [],
  totalCount = 0,
  hasNextPage = false,
  isNextPageLoading = false,
  loadNextPage,
  toggleTodo,
  deleteTodo,
  updateTodo,
  startTask,
  completeTask,
  onEditTask,
  height = 400,
  itemHeight = 120, // Estimated height per task item
  searchTerm = '',
}) => {
  // Calculate total item count (existing items + loading items)
  const itemCount = hasNextPage ? todos.length + 1 : todos.length;

  // Check if an item is loaded
  const isItemLoaded = useCallback((index) => {
    return !!todos[index];
  }, [todos]);

  // Prepare data for virtual list
  const itemData = useMemo(() => ({
    todos,
    hasNextPage,
    isNextPageLoading,
    toggleTodo,
    deleteTodo,
    updateTodo,
    startTask,
    completeTask,
    onEditTask,
    searchTerm,
  }), [
    todos,
    hasNextPage,
    isNextPageLoading,
    toggleTodo,
    deleteTodo,
    updateTodo,
    startTask,
    completeTask,
    onEditTask,
    searchTerm,
  ]);

  // Handle loading next page
  const handleLoadNextPage = useCallback(async () => {
    if (isNextPageLoading) return;
    await loadNextPage();
  }, [loadNextPage, isNextPageLoading]);

  if (todos.length === 0 && !isNextPageLoading) {
    return (
      <div className="flex items-center justify-center py-8 h-full">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-white text-xl font-medium mb-2">No tasks yet</h3>
          <p className="text-gray-400 text-sm">Add your first task using the input above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-hidden">
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={handleLoadNextPage}
          threshold={5} // Load more items when 5 items from the end
        >
          {({ onItemsRendered, ref }) => (
            <List
              ref={ref}
              height={height || 500}
              width="100%"
              itemCount={itemCount}
              itemSize={itemHeight}
              itemData={itemData}
              onItemsRendered={onItemsRendered}
              className="custom-scrollbar virtualized-task-list"
              overscanCount={5} // Render 5 extra items outside visible area for smoother scrolling
            >
              {VirtualizedTaskItem}
            </List>
          )}
        </InfiniteLoader>
      </div>
      
      {/* Show total count info */}
      {totalCount > 0 && (
        <div className="text-xs text-gray-400 text-center py-2 flex-shrink-0 border-t border-gray-700">
          Showing {todos.length} of {totalCount} tasks
        </div>
      )}
    </div>
  );
};

export default memo(VirtualizedTaskList);