import React from 'react';

/**
 * Responsive loading spinner with different sizes and styles
 */
const ResponsiveSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  text,
  fullScreen = false,
  overlay = false
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const getSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}></div>
        );
      
      case 'ring':
        return (
          <div className={`${sizeClasses[size]} border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin`}></div>
        );
      
      case 'gradient':
        return (
          <div className={`${sizeClasses[size]} relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin"></div>
            <div className="absolute inset-1 bg-slate-800 rounded-full"></div>
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin`}></div>
        );
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      {getSpinner()}
      {text && (
        <span className={`text-gray-300 ${textSizeClasses[size]} animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm flex items-center justify-center z-10">
        {content}
      </div>
    );
  }

  return content;
};

/**
 * Skeleton loader for content
 */
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  animate = true 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`h-4 bg-slate-700/50 rounded ${animate ? 'animate-pulse' : ''} ${
            index === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Card skeleton loader
 */
export const CardSkeleton = ({ 
  className = '',
  showAvatar = false,
  showActions = false 
}) => {
  return (
    <div className={`bg-slate-700/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {showAvatar && (
          <div className="w-10 h-10 bg-slate-600/50 rounded-full animate-pulse flex-shrink-0"></div>
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-600/50 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-slate-600/50 rounded animate-pulse w-1/2"></div>
        </div>
        {showActions && (
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-slate-600/50 rounded-full animate-pulse"></div>
            <div className="w-6 h-6 bg-slate-600/50 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Button loading state
 */
export const ButtonSpinner = ({ size = 'sm', className = '' }) => {
  return (
    <ResponsiveSpinner 
      size={size} 
      variant="ring" 
      className={`inline-flex ${className}`} 
    />
  );
};

export default ResponsiveSpinner;