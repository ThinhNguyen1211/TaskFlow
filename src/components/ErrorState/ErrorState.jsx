import React from 'react';

const ErrorState = ({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryText = 'Try Again',
  icon = 'error',
  className = '',
  showRetry = true
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'network':
        return (
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'empty':
        return (
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'search':
        return (
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center py-8 px-4 ${className}`}>
      <div className="text-center max-w-md">
        <div className="mb-4">
          {getIcon()}
        </div>
        <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{message}</p>
        {showRetry && onRetry && (
          <button 
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
};

// Specific error state components
export const NetworkErrorState = ({ onRetry }) => (
  <ErrorState
    icon="network"
    title="Connection Error"
    message="Unable to connect to the server. Please check your internet connection and try again."
    onRetry={onRetry}
  />
);

export const EmptyState = ({ 
  title = 'No tasks yet',
  message = 'Add your first task using the input above',
  action,
  actionText = 'Add Task',
  illustration = true
}) => (
  <div className="flex items-center justify-center py-8 px-4 h-full">
    <div className="text-center max-w-md">
      {illustration && (
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
      )}
      <h3 className="text-white text-lg sm:text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">{message}</p>
      {action && (
        <button 
          onClick={action}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 font-medium"
        >
          {actionText}
        </button>
      )}
      <div className="mt-8 text-xs text-gray-500">
        <p>💡 Tip: Use <kbd className="px-2 py-1 bg-slate-700 rounded text-gray-300">Ctrl+N</kbd> to quickly add a new task</p>
      </div>
    </div>
  </div>
);

export const SearchEmptyState = ({ searchTerm, onClear }) => (
  <ErrorState
    icon="search"
    title="No results found"
    message={`No tasks match "${searchTerm}". Try adjusting your search or filters.`}
    onRetry={onClear}
    retryText="Clear Search"
    showRetry={!!onClear}
  />
);

export const LoadingErrorState = ({ onRetry }) => (
  <ErrorState
    title="Failed to load tasks"
    message="There was an error loading your tasks. Please check your connection and try again."
    onRetry={onRetry}
  />
);

export default ErrorState;