import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FadeTransition, SlideTransition } from '../Transitions/Transitions';

const MobileNavigation = ({ isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/list', label: 'List View', icon: '📋' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/list' || 
             location.pathname === '/calendar' || location.pathname === '/analytics';
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Toggle navigation menu"
      >
        <svg 
          className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile navigation overlay */}
      <FadeTransition show={isOpen}>
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <SlideTransition show={isOpen} direction="up">
            <div className="absolute bottom-0 left-0 right-0 bg-slate-800 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Navigation</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation items */}
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* User actions */}
              {isLoggedIn && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 w-full"
                  >
                    <span className="text-lg">🚪</span>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}

              {/* Keyboard shortcuts hint */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-gray-400 text-center">
                  Press <kbd className="px-1 py-0.5 bg-slate-700 text-gray-300 rounded">?</kbd> for keyboard shortcuts
                </p>
              </div>
            </div>
          </SlideTransition>
        </div>
      </FadeTransition>
    </>
  );
};

export default MobileNavigation;