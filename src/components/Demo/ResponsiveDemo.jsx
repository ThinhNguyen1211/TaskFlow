import React, { useState } from 'react';
import ResponsiveContainer, { ResponsiveGrid, ResponsiveFlex, ResponsiveCard } from '../Layout/ResponsiveContainer';
import { TaskItemSkeleton, SearchSkeleton, CalendarSkeleton, AnalyticsSkeleton } from '../LoadingSkeleton/LoadingSkeleton';
import { EmptyState, NetworkErrorState, SearchEmptyState } from '../ErrorState/ErrorState';
import { FadeTransition, SlideTransition, ScaleTransition, LoadingTransition } from '../Transitions/Transitions';
import KeyboardShortcuts from '../KeyboardShortcuts/KeyboardShortcuts';
import ResponsiveSpinner, { SkeletonLoader, CardSkeleton } from '../LoadingSpinner/ResponsiveSpinner';
import { showToast } from '../Toast/ResponsiveToast';
import { useResponsive } from '../../utils/responsive';

/**
 * Demo component showcasing all responsive improvements
 */
const ResponsiveDemo = () => {
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [showEmptyStates, setShowEmptyStates] = useState(false);
  const [showTransitions, setShowTransitions] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { screenSize, isMobile, isTablet, isDesktop } = useResponsive();

  const handleToastDemo = () => {
    showToast.success('Responsive toast notification!', {
      title: 'Success',
      action: () => console.log('Action clicked'),
      actionText: 'Undo'
    });
  };

  return (
    <ResponsiveContainer className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Responsive Design Demo
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            Current screen: <span className="text-blue-400 font-medium">{screenSize}</span> 
            {isMobile && ' (Mobile)'}
            {isTablet && ' (Tablet)'}
            {isDesktop && ' (Desktop)'}
          </p>
        </div>

        {/* Control Panel */}
        <ResponsiveCard className="text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Demo Controls</h2>
          <ResponsiveFlex direction={{ xs: 'col', sm: 'row' }} justify="center" gap={4}>
            <button
              onClick={() => setShowSkeletons(!showSkeletons)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {showSkeletons ? 'Hide' : 'Show'} Loading Skeletons
            </button>
            <button
              onClick={() => setShowEmptyStates(!showEmptyStates)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              {showEmptyStates ? 'Hide' : 'Show'} Empty States
            </button>
            <button
              onClick={() => setShowTransitions(!showTransitions)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              {showTransitions ? 'Hide' : 'Show'} Transitions
            </button>
            <button
              onClick={() => setShowShortcuts(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              Keyboard Shortcuts
            </button>
            <button
              onClick={handleToastDemo}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
            >
              Show Toast
            </button>
          </ResponsiveFlex>
        </ResponsiveCard>

        {/* Loading Skeletons Demo */}
        <FadeTransition show={showSkeletons}>
          <ResponsiveCard>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Loading Skeletons</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-2">Task Items</h3>
                <div className="space-y-2">
                  <TaskItemSkeleton />
                  <TaskItemSkeleton />
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">Search</h3>
                <SearchSkeleton />
              </div>

              <ResponsiveGrid cols={{ xs: 1, md: 2 }} gap={4}>
                <div>
                  <h3 className="text-white font-medium mb-2">Cards</h3>
                  <CardSkeleton showAvatar showActions />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Content</h3>
                  <SkeletonLoader lines={4} />
                </div>
              </ResponsiveGrid>

              <div>
                <h3 className="text-white font-medium mb-2">Spinners</h3>
                <ResponsiveFlex direction={{ xs: 'col', sm: 'row' }} gap={4} align="center">
                  <ResponsiveSpinner size="sm" text="Small" />
                  <ResponsiveSpinner size="md" variant="dots" text="Dots" />
                  <ResponsiveSpinner size="lg" variant="pulse" text="Pulse" />
                  <ResponsiveSpinner size="xl" variant="gradient" text="Gradient" />
                </ResponsiveFlex>
              </div>
            </div>
          </ResponsiveCard>
        </FadeTransition>

        {/* Empty States Demo */}
        <FadeTransition show={showEmptyStates}>
          <ResponsiveCard>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Empty States</h2>
            <ResponsiveGrid cols={{ xs: 1, lg: 3 }} gap={4}>
              <div className="bg-slate-700/30 rounded-lg h-64">
                <EmptyState 
                  title="No Tasks"
                  message="Create your first task to get started"
                  action={() => console.log('Add task')}
                  actionText="Add Task"
                />
              </div>
              <div className="bg-slate-700/30 rounded-lg h-64">
                <SearchEmptyState 
                  searchTerm="example"
                  onClear={() => console.log('Clear search')}
                />
              </div>
              <div className="bg-slate-700/30 rounded-lg h-64">
                <NetworkErrorState 
                  onRetry={() => console.log('Retry')}
                />
              </div>
            </ResponsiveGrid>
          </ResponsiveCard>
        </FadeTransition>

        {/* Transitions Demo */}
        <FadeTransition show={showTransitions}>
          <ResponsiveCard>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Smooth Transitions</h2>
            <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 4 }} gap={4}>
              <div className="space-y-2">
                <h3 className="text-white font-medium">Fade</h3>
                <FadeTransition show={true}>
                  <div className="bg-blue-600/20 p-4 rounded-lg text-center text-blue-300">
                    Fade In/Out
                  </div>
                </FadeTransition>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white font-medium">Slide</h3>
                <SlideTransition show={true} direction="up">
                  <div className="bg-green-600/20 p-4 rounded-lg text-center text-green-300">
                    Slide Up
                  </div>
                </SlideTransition>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white font-medium">Scale</h3>
                <ScaleTransition show={true}>
                  <div className="bg-purple-600/20 p-4 rounded-lg text-center text-purple-300">
                    Scale In/Out
                  </div>
                </ScaleTransition>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white font-medium">Loading</h3>
                <LoadingTransition isLoading={false}>
                  <div className="bg-orange-600/20 p-4 rounded-lg text-center text-orange-300">
                    Content Loaded
                  </div>
                </LoadingTransition>
              </div>
            </ResponsiveGrid>
          </ResponsiveCard>
        </FadeTransition>

        {/* Responsive Features Summary */}
        <ResponsiveCard>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Responsive Features Implemented</h2>
          <ResponsiveGrid cols={{ xs: 1, md: 2 }} gap={6}>
            <div>
              <h3 className="text-white font-medium mb-3">✅ Mobile-First Design</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Breakpoints: 2xs (320px) to 4xl (1920px)</li>
                <li>• Touch-friendly interface</li>
                <li>• Optimized for small screens</li>
                <li>• Progressive enhancement</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">✅ Loading States</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Skeleton loaders for all components</li>
                <li>• Multiple spinner variants</li>
                <li>• Smooth loading transitions</li>
                <li>• Responsive loading indicators</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">✅ Error & Empty States</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Consistent error handling</li>
                <li>• Helpful empty state messages</li>
                <li>• Action buttons for recovery</li>
                <li>• Responsive error layouts</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-3">✅ Keyboard Shortcuts</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Ctrl+N: New task</li>
                <li>• Ctrl+F: Search</li>
                <li>• ?: Show shortcuts</li>
                <li>• Escape: Cancel/Close</li>
              </ul>
            </div>
          </ResponsiveGrid>
        </ResponsiveCard>

        {/* Performance Optimizations */}
        <ResponsiveCard>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Performance Optimizations</h2>
          <ResponsiveGrid cols={{ xs: 1, sm: 2, lg: 3 }} gap={4}>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h3 className="text-green-400 font-medium mb-2">Virtual Scrolling</h3>
              <p className="text-gray-300 text-sm">Handles 20+ tasks efficiently with react-window</p>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h3 className="text-blue-400 font-medium mb-2">Optimistic Updates</h3>
              <p className="text-gray-300 text-sm">Immediate UI feedback with rollback on failure</p>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <h3 className="text-purple-400 font-medium mb-2">Code Splitting</h3>
              <p className="text-gray-300 text-sm">Lazy loading for different views and components</p>
            </div>
          </ResponsiveGrid>
        </ResponsiveCard>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </ResponsiveContainer>
  );
};

export default ResponsiveDemo;