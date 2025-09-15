import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useViewState = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current view from URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/calendar') return 'calendar';
    if (path === '/analytics') return 'analytics';
    return 'list';
  };

  const [currentView, setCurrentView] = useState(getCurrentView());

  // Update view when URL changes
  useEffect(() => {
    setCurrentView(getCurrentView());
  }, [location.pathname]);

  // Handle view change with navigation
  const handleViewChange = (view) => {
    const routes = {
      list: '/',
      calendar: '/calendar',
      analytics: '/analytics'
    };
    navigate(routes[view] || '/');
  };

  return {
    currentView,
    handleViewChange
  };
};