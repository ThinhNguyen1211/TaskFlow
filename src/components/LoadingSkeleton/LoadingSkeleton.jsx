import React from 'react';

// Base skeleton component
const SkeletonBase = ({ className = '', children, ...props }) => (
  <div 
    className={`animate-pulse bg-slate-700/50 rounded ${className}`} 
    {...props}
  >
    {children}
  </div>
);

// Task item skeleton
export const TaskItemSkeleton = () => (
  <div className="bg-slate-700/30 hover:bg-slate-700/50 border-l-4 border-slate-600/50 p-3 sm:p-4 rounded-lg transition-all duration-200">
    <div className="flex items-start gap-2 sm:gap-3 mb-2">
      {/* Checkbox skeleton */}
      <SkeletonBase className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-slate-600/50 flex-shrink-0 mt-0.5" />
      
      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        <SkeletonBase className="h-4 sm:h-5 w-3/4 mb-1 sm:mb-2" />
        <SkeletonBase className="h-3 sm:h-4 w-1/2 hidden sm:block" />
      </div>

      {/* Action buttons skeleton */}
      <div className="flex items-center gap-1 sm:gap-2">
        <SkeletonBase className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
        <SkeletonBase className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
      </div>
    </div>

    {/* Metadata skeleton */}
    <div className="flex items-center gap-2 sm:gap-4 text-xs flex-wrap">
      <SkeletonBase className="h-5 sm:h-6 w-12 sm:w-16 rounded-full" />
      <SkeletonBase className="h-3 sm:h-4 w-16 sm:w-20 hidden xs:block" />
      <SkeletonBase className="h-3 sm:h-4 w-10 sm:w-12 hidden sm:block" />
      <SkeletonBase className="h-5 sm:h-6 w-20 sm:w-24 rounded-full hidden md:block" />
    </div>

    {/* Tags skeleton */}
    <div className="flex flex-wrap gap-1 mt-2 hidden sm:flex">
      <SkeletonBase className="h-4 sm:h-5 w-10 sm:w-12 rounded-full" />
      <SkeletonBase className="h-4 sm:h-5 w-12 sm:w-16 rounded-full" />
    </div>
  </div>
);

// Task list skeleton
export const TaskListSkeleton = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }, (_, index) => (
      <TaskItemSkeleton key={index} />
    ))}
  </div>
);

// Search skeleton
export const SearchSkeleton = () => (
  <div className="bg-slate-700/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
      <SkeletonBase className="flex-1 h-10 sm:h-12 rounded-md" />
      <SkeletonBase className="w-full sm:w-20 h-8 sm:h-10 rounded-md" />
    </div>
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {Array.from({ length: 6 }, (_, index) => (
        <SkeletonBase key={index} className="h-6 sm:h-8 w-16 sm:w-20 rounded-full" />
      ))}
    </div>
  </div>
);

// Calendar skeleton
export const CalendarSkeleton = () => (
  <div className="bg-slate-700/30 rounded-lg p-4">
    {/* Calendar header */}
    <div className="flex items-center justify-between mb-4">
      <SkeletonBase className="h-8 w-32" />
      <div className="flex gap-2">
        <SkeletonBase className="w-8 h-8 rounded" />
        <SkeletonBase className="w-8 h-8 rounded" />
      </div>
    </div>

    {/* Calendar grid */}
    <div className="grid grid-cols-7 gap-1">
      {/* Day headers */}
      {Array.from({ length: 7 }, (_, index) => (
        <SkeletonBase key={`header-${index}`} className="h-8 text-center" />
      ))}
      
      {/* Calendar days */}
      {Array.from({ length: 35 }, (_, index) => (
        <SkeletonBase key={`day-${index}`} className="h-20 rounded" />
      ))}
    </div>
  </div>
);

// Analytics skeleton
export const AnalyticsSkeleton = () => (
  <div className="space-y-6">
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="bg-slate-700/30 rounded-lg p-4">
          <SkeletonBase className="h-4 w-20 mb-2" />
          <SkeletonBase className="h-8 w-16 mb-1" />
          <SkeletonBase className="h-3 w-24" />
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-700/30 rounded-lg p-4">
        <SkeletonBase className="h-6 w-32 mb-4" />
        <SkeletonBase className="h-64 w-full" />
      </div>
      <div className="bg-slate-700/30 rounded-lg p-4">
        <SkeletonBase className="h-6 w-32 mb-4" />
        <SkeletonBase className="h-64 w-full" />
      </div>
    </div>
  </div>
);

// Form skeleton
export const FormSkeleton = () => (
  <div className="space-y-4">
    <div>
      <SkeletonBase className="h-4 w-20 mb-2" />
      <SkeletonBase className="h-10 w-full rounded-md" />
    </div>
    <div>
      <SkeletonBase className="h-4 w-24 mb-2" />
      <SkeletonBase className="h-20 w-full rounded-md" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <SkeletonBase className="h-4 w-16 mb-2" />
        <SkeletonBase className="h-10 w-full rounded-md" />
      </div>
      <div>
        <SkeletonBase className="h-4 w-20 mb-2" />
        <SkeletonBase className="h-10 w-full rounded-md" />
      </div>
    </div>
    <div className="flex justify-end gap-2">
      <SkeletonBase className="h-10 w-20 rounded-md" />
      <SkeletonBase className="h-10 w-16 rounded-md" />
    </div>
  </div>
);

// Generic content skeleton
export const ContentSkeleton = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, index) => (
      <SkeletonBase 
        key={index} 
        className={`h-4 ${
          index === lines - 1 ? 'w-2/3' : 'w-full'
        }`} 
      />
    ))}
  </div>
);

export default SkeletonBase;