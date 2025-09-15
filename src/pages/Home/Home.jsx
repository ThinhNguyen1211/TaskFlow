import { useState, memo, useCallback, useMemo } from 'react';
import TaskItem from '../../components/TaskItem/TaskItem';
import OptimizedTaskItem from '../../components/TaskItem/OptimizedTaskItem';
import VirtualizedTaskList from '../../components/VirtualizedTaskList/VirtualizedTaskList';
import TaskForm from '../../components/TaskForm/TaskForm';
import TaskFilters from '../../components/TaskFilters/TaskFilters';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import SearchResults from '../../components/SearchResults/SearchResults';
import SearchStats from '../../components/SearchStats/SearchStats';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const Home = memo(({ 
    todos, 
    totalCount, 
    hasNextPage,
    isLoadingMore,
    loadNextPage,
    toggleTodo, 
    deleteTodo, 
    updateTodo, 
    startTask,
    completeTask,
    isLoading, 
    error, 
    filters, 
    onFiltersChange 
}) => {
    const [editingTask, setEditingTask] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [useVirtualization, setUseVirtualization] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'search'

    // Memoize available tags to prevent recalculation
    const availableTags = useMemo(() => 
        [...new Set(todos?.flatMap(todo => todo.tags || []) || [])].sort(),
        [todos]
    );

    // Memoized event handlers to prevent unnecessary re-renders
    const handleEditTask = useCallback((task) => {
        setEditingTask(task);
    }, []);

    const handleUpdateTask = useCallback(async (taskData) => {
        if (!editingTask) return;
        
        setIsUpdating(true);
        try {
            await updateTodo(editingTask._id || editingTask.id, taskData);
            setEditingTask(null);
        } finally {
            setIsUpdating(false);
        }
    }, [editingTask, updateTodo]);

    // Determine whether to use virtualization (for 20+ items)
    const shouldUseVirtualization = useMemo(() => 
        useVirtualization && todos && todos.length >= 20, 
        [useVirtualization, todos]
    );

    // Determine if we should show search results view
    const shouldShowSearchResults = useMemo(() => {
        return filters?.search && filters.search.trim().length > 0;
    }, [filters?.search]);

    // Handle task click from search results
    const handleTaskClick = useCallback((task) => {
        setEditingTask(task);
    }, []);

    if (error && !todos?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <div className="bg-slate-800/90 backdrop-blur-sm p-6 sm:p-8 w-full max-w-md rounded-lg text-center border border-slate-700/50 shadow-2xl">
                    <div className="text-red-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">Failed to load tasks</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        There was an error loading your tasks. Please check your connection and try again.
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-8 px-4">
            <div className="relative bg-slate-800/90 backdrop-blur-sm p-1 w-full max-w-4xl h-[85vh] rounded-lg text-center gradient-border animate-gradient-spin">
                <div className="relative w-full h-full bg-slate-800 rounded-md p-4 overflow-hidden">
                    {/* Advanced Search and Filters */}
                    <AdvancedSearch
                        onFiltersChange={onFiltersChange}
                        totalCount={totalCount || todos?.length || 0}
                        availableTags={availableTags}
                        isLoading={isLoading}
                        initialFilters={filters || {}}
                    />
                    
                    {/* Search Statistics */}
                    {shouldShowSearchResults && (
                        <SearchStats
                            currentResults={totalCount || todos?.length || 0}
                            searchTerm={filters?.search || ''}
                            filters={filters || {}}
                            className="mb-4"
                        />
                    )}
                    
                    <div className="h-full" style={{ height: 'calc(100% - 120px)' }}>
                        {isLoading && !todos?.length ? (
                            <div className="flex items-center justify-center py-8 h-full">
                                <div className="text-center">
                                    <LoadingSpinner size="lg" />
                                    <span className="block mt-3 text-white">Loading tasks...</span>
                                </div>
                            </div>
                        ) : shouldShowSearchResults ? (
                            <SearchResults
                                tasks={todos}
                                searchTerm={filters?.search || ''}
                                totalCount={totalCount || todos?.length || 0}
                                isLoading={isLoading}
                                onTaskClick={handleTaskClick}
                                className="h-full overflow-y-auto custom-scrollbar"
                            />
                        ) : shouldUseVirtualization ? (
                            <VirtualizedTaskList
                                todos={todos}
                                totalCount={totalCount}
                                hasNextPage={hasNextPage}
                                isNextPageLoading={isLoadingMore}
                                loadNextPage={loadNextPage}
                                toggleTodo={toggleTodo}
                                deleteTodo={deleteTodo}
                                updateTodo={updateTodo}
                                startTask={startTask}
                                completeTask={completeTask}
                                onEditTask={handleEditTask}
                                height={window.innerHeight * 0.6} // 60% of viewport height
                                itemHeight={140} // Estimated height per task
                                searchTerm={filters?.search || ''}
                            />
                        ) : todos?.length > 0 ? (
                            <div className="h-full overflow-y-auto custom-scrollbar space-y-2 p-2">
                                {todos.map((todo) => (
                                    <OptimizedTaskItem
                                        key={todo._id || todo.id}
                                        todo={todo}
                                        onToggle={toggleTodo}
                                        onDelete={deleteTodo}
                                        onEdit={handleEditTask}
                                        onStartTimer={startTask}
                                        onStopTimer={updateTodo}
                                        onCompleteTask={completeTask}
                                        isLoading={isLoading}
                                        searchTerm={filters?.search || ''}
                                    />
                                ))}
                                {/* Load more button for non-virtualized view */}
                                {hasNextPage && (
                                    <div className="flex justify-center py-4">
                                        <button
                                            onClick={loadNextPage}
                                            disabled={isLoadingMore}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoadingMore ? (
                                                <>
                                                    <LoadingSpinner size="sm" className="inline mr-2" />
                                                    Loading...
                                                </>
                                            ) : (
                                                'Load More'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
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
                        )}
                        
                        {/* Performance toggle for development */}
                        {process.env.NODE_ENV === 'development' && todos?.length >= 10 && (
                            <div className="absolute top-2 right-2">
                                <button
                                    onClick={() => setUseVirtualization(!useVirtualization)}
                                    className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded"
                                    title={`Switch to ${useVirtualization ? 'regular' : 'virtualized'} list`}
                                >
                                    {useVirtualization ? 'Virtual' : 'Regular'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute inset-0 gradient-glow animate-gradient-spin pointer-events-none"></div>
            </div>
            <TaskForm
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={handleUpdateTask}
                initialData={editingTask}
                isLoading={isUpdating}
            />
        </div>
    );
});

Home.displayName = 'Home';

export default Home;
