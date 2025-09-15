import React, { useState, memo, useCallback, useMemo } from 'react';
import TaskItem from '../../components/TaskItem/TaskItem';
import OptimizedTaskItem from '../../components/TaskItem/OptimizedTaskItem';
import VirtualizedTaskList from '../../components/VirtualizedTaskList/VirtualizedTaskList';
import TaskForm from '../../components/TaskForm/TaskForm';
import TaskFilters from '../../components/TaskFilters/TaskFilters';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ViewSwitcher from '../../components/ViewSwitcher/ViewSwitcher';
import CalendarView from '../../components/CalendarView/CalendarView';
import AnalyticsView from '../../components/AnalyticsView/AnalyticsView';
import DeadlinePressure from '../../components/DeadlinePressure/SimpleDeadlinePressure';
import KeyboardShortcuts from '../../components/KeyboardShortcuts/KeyboardShortcuts';
import { TaskListSkeleton, SearchSkeleton } from '../../components/LoadingSkeleton/LoadingSkeleton';
import { LoadingErrorState, EmptyState, SearchEmptyState } from '../../components/ErrorState/ErrorState';
import { FadeTransition, LoadingTransition } from '../../components/Transitions/Transitions';
import { useViewState } from '../../hooks/useViewState';
import { useTaskShortcuts, setShowShortcutsCallback } from '../../hooks/useKeyboardShortcuts';

const Dashboard = memo(({ 
    todos, 
    totalCount, 
    hasNextPage,
    isLoadingMore,
    loadNextPage,
    toggleTodo, 
    deleteTodo, 
    updateTodo, 
    addTodo,
    startTask,
    completeTask,
    isLoading, 
    error, 
    filters, 
    onFiltersChange 
}) => {
    const { currentView, handleViewChange } = useViewState();
    const [editingTask, setEditingTask] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [useVirtualization, setUseVirtualization] = useState(true);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

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

    const handleTaskClick = useCallback((task) => {
        handleEditTask(task);
    }, [handleEditTask]);

    const handleDateClick = useCallback((date) => {
        // Could open a modal to create a task for this date
        console.log('Date clicked:', date);
    }, []);

    // Determine whether to use virtualization (for 20+ items)
    const shouldUseVirtualization = useMemo(() => 
        useVirtualization && todos && todos.length >= 20, 
        [useVirtualization, todos]
    );

    // Set up keyboard shortcuts callback
    React.useEffect(() => {
        setShowShortcutsCallback(() => setShowShortcuts(true));
        return () => setShowShortcutsCallback(null);
    }, []);

    // Keyboard shortcuts
    useTaskShortcuts({
        onNewTask: useCallback(() => {
            // Focus on add task input or open task form
            const addButton = document.querySelector('[data-testid="add-task-button"]');
            if (addButton) addButton.click();
        }, []),
        onSearch: useCallback(() => {
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            if (searchInput) {
                searchInput.focus();
                setSearchFocused(true);
            }
        }, []),
        onToggleFilters: useCallback(() => {
            const filterButton = document.querySelector('[data-testid="filter-toggle"]');
            if (filterButton) filterButton.click();
        }, []),
        onRefresh: useCallback(() => {
            window.location.reload();
        }, []),
        onToggleView: useCallback(() => {
            const views = ['list', 'calendar', 'analytics'];
            const currentIndex = views.indexOf(currentView);
            const nextView = views[(currentIndex + 1) % views.length];
            handleViewChange(nextView);
        }, [currentView, handleViewChange]),
        onEscape: useCallback(() => {
            if (editingTask) {
                setEditingTask(null);
            }
            if (showShortcuts) {
                setShowShortcuts(false);
            }
            if (searchFocused) {
                const searchInput = document.querySelector('input[placeholder*="Search"]');
                if (searchInput) searchInput.blur();
                setSearchFocused(false);
            }
        }, [editingTask, showShortcuts, searchFocused])
    });

    if (error && !todos?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center py-4 px-4">
                <div className="w-full max-w-6xl">
                    <LoadingErrorState onRetry={() => window.location.reload()} />
                </div>
            </div>
        );
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'calendar':
                return (
                    <CalendarView
                        todos={todos}
                        onTaskClick={handleTaskClick}
                        onDateClick={handleDateClick}
                        onTaskUpdate={updateTodo}
                    />
                );
            case 'analytics':
                return (
                    <AnalyticsView
                        todos={todos}
                    />
                );
            case 'list':
            default:
                return (
                    <div className="h-full flex flex-col">
                        {/* Deadline Pressure Monitor */}
                        <div className="mb-4">
                            <DeadlinePressure tasks={todos || []} />
                        </div>

                        {/* Advanced Search and Filters */}
                        <AdvancedSearch
                            onFiltersChange={onFiltersChange}
                            totalCount={totalCount || todos?.length || 0}
                            availableTags={availableTags}
                            isLoading={isLoading}
                            initialFilters={filters || {}}
                        />
                        
                        <div className="flex-1 mt-2 sm:mt-4 relative min-h-0 overflow-hidden">
                            <LoadingTransition 
                                isLoading={isLoading && !todos?.length}
                                loadingComponent={<TaskListSkeleton count={3} />}
                            >
                                {shouldUseVirtualization ? (
                                <div className="task-list-container h-full">
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
                                        height={600} // Fixed height for better performance
                                        itemHeight={140} // Estimated height per task
                                        searchTerm={filters?.search || ''}
                                    />
                                </div>
                                ) : todos?.length > 0 ? (
                                    <div className="task-list-container non-virtualized custom-scrollbar">
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
                                ) : filters?.search ? (
                                    <SearchEmptyState 
                                        searchTerm={filters.search}
                                        onClear={() => onFiltersChange({})}
                                    />
                                ) : (
                                    <EmptyState />
                                )}
                            </LoadingTransition>
                            
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
                );
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center py-2 2xs:py-3 xs:py-4 sm:py-6 lg:py-8 px-1 2xs:px-2 xs:px-3 sm:px-4">
                <div className="relative bg-slate-800/90 backdrop-blur-sm p-0.5 sm:p-1 w-full max-w-7xl h-[95vh] 2xs:h-[92vh] xs:h-[90vh] sm:h-[88vh] lg:h-[85vh] rounded-lg text-center gradient-border animate-gradient-spin">
                    <div className="relative w-full h-full bg-slate-800 rounded-md p-2 2xs:p-3 xs:p-4 sm:p-6 overflow-hidden">
                        {/* Header with View Switcher */}
                        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-3 sm:mb-4 gap-2">
                            <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                                <span className="hidden sm:inline">Task Management</span>
                                <span className="sm:hidden">Tasks</span>
                            </h1>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <ViewSwitcher 
                                    currentView={currentView} 
                                    onViewChange={handleViewChange} 
                                />
                                <button
                                    onClick={() => setShowShortcuts(true)}
                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-slate-700/50"
                                    title="Keyboard shortcuts (?)"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Main Content */}
                        <div className="flex-1 min-h-0" style={{ height: 'calc(100% - 60px)' }}>
                            <FadeTransition show={true}>
                                {renderCurrentView()}
                            </FadeTransition>
                        </div>
                    </div>
                    <div className="absolute inset-0 gradient-glow animate-gradient-spin pointer-events-none"></div>
                </div>
            </div>
            
            {/* Task Form Modal */}
            <TaskForm
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={handleUpdateTask}
                initialData={editingTask}
                isLoading={isUpdating}
            />

            {/* Keyboard Shortcuts Modal */}
            <KeyboardShortcuts
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
        </>
    );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;