import React from 'react';

/**
 * Responsive utility functions and constants
 */

// Breakpoint constants (matching Tailwind CSS)
export const BREAKPOINTS = {
  '2xs': 320,
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1600,
  '4xl': 1920
};

/**
 * Get current screen size category
 */
export const getScreenSize = () => {
  if (typeof window === 'undefined') return 'md';
  
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.xs) return '2xs';
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  if (width < BREAKPOINTS['3xl']) return '2xl';
  if (width < BREAKPOINTS['4xl']) return '3xl';
  return '4xl';
};

/**
 * Check if screen is mobile size
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS.md;
};

/**
 * Check if screen is tablet size
 */
export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
};

/**
 * Check if screen is desktop size
 */
export const isDesktop = () => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= BREAKPOINTS.lg;
};

/**
 * Get responsive value based on screen size
 */
export const getResponsiveValue = (values, currentSize = null) => {
  const size = currentSize || getScreenSize();
  
  // If values is not an object, return as is
  if (typeof values !== 'object' || values === null) {
    return values;
  }
  
  // Priority order for fallback
  const fallbackOrder = ['4xl', '3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs'];
  
  // Return exact match if available
  if (values[size] !== undefined) {
    return values[size];
  }
  
  // Find the closest smaller breakpoint
  const sizeIndex = fallbackOrder.indexOf(size);
  for (let i = sizeIndex; i < fallbackOrder.length; i++) {
    if (values[fallbackOrder[i]] !== undefined) {
      return values[fallbackOrder[i]];
    }
  }
  
  // If no smaller breakpoint found, find the closest larger one
  for (let i = sizeIndex - 1; i >= 0; i--) {
    if (values[fallbackOrder[i]] !== undefined) {
      return values[fallbackOrder[i]];
    }
  }
  
  // Return default value or first available value
  return values.default || Object.values(values)[0];
};

/**
 * Generate responsive classes
 */
export const generateResponsiveClasses = (baseClass, values) => {
  let classes = '';
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint === 'default' || breakpoint === '2xs') {
      classes += `${baseClass}-${value} `;
    } else {
      classes += `${breakpoint}:${baseClass}-${value} `;
    }
  });
  
  return classes.trim();
};

/**
 * Hook for responsive values
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = React.useState(getScreenSize());
  
  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    screenSize,
    isMobile: screenSize === '2xs' || screenSize === 'xs' || screenSize === 'sm',
    isTablet: screenSize === 'md',
    isDesktop: screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl' || screenSize === '3xl' || screenSize === '4xl',
    getValue: (values) => getResponsiveValue(values, screenSize)
  };
};

/**
 * Responsive grid configurations
 */
export const RESPONSIVE_GRIDS = {
  tasks: {
    '2xs': 1,
    xs: 1,
    sm: 1,
    md: 1,
    lg: 2,
    xl: 2,
    '2xl': 3
  },
  cards: {
    '2xs': 1,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 4
  },
  analytics: {
    '2xs': 1,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 4
  }
};

/**
 * Responsive spacing configurations
 */
export const RESPONSIVE_SPACING = {
  container: {
    '2xs': 'px-2 py-2',
    xs: 'px-3 py-3',
    sm: 'px-4 py-4',
    md: 'px-6 py-6',
    lg: 'px-8 py-8'
  },
  card: {
    '2xs': 'p-3',
    xs: 'p-4',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-6'
  },
  gap: {
    '2xs': 'gap-2',
    xs: 'gap-3',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }
};

/**
 * Responsive text sizes
 */
export const RESPONSIVE_TEXT = {
  heading: {
    '2xs': 'text-lg',
    xs: 'text-xl',
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  },
  subheading: {
    '2xs': 'text-base',
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  },
  body: {
    '2xs': 'text-sm',
    xs: 'text-base',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-lg'
  },
  small: {
    '2xs': 'text-xs',
    xs: 'text-sm',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-base'
  }
};

export default {
  BREAKPOINTS,
  getScreenSize,
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveValue,
  generateResponsiveClasses,
  RESPONSIVE_GRIDS,
  RESPONSIVE_SPACING,
  RESPONSIVE_TEXT
};