import React from 'react';

/**
 * Responsive container component that adapts to different screen sizes
 */
const ResponsiveContainer = ({ 
  children, 
  className = '',
  maxWidth = '7xl',
  padding = 'responsive',
  fullHeight = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    responsive: 'px-2 2xs:px-3 xs:px-4 sm:px-6 lg:px-8',
    lg: 'px-4 sm:px-6 lg:px-8 xl:px-12'
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
    none: ''
  };

  return (
    <div className={`
      w-full mx-auto
      ${maxWidthClasses[maxWidth] || maxWidthClasses['7xl']}
      ${paddingClasses[padding] || paddingClasses.responsive}
      ${fullHeight ? 'min-h-screen' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Responsive grid component
 */
export const ResponsiveGrid = ({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = ''
}) => {
  const getGridCols = () => {
    const colsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2', 
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6'
    };

    let classes = `grid-cols-${cols.xs || 1}`;
    if (cols.sm) classes += ` sm:grid-cols-${cols.sm}`;
    if (cols.md) classes += ` md:grid-cols-${cols.md}`;
    if (cols.lg) classes += ` lg:grid-cols-${cols.lg}`;
    if (cols.xl) classes += ` xl:grid-cols-${cols.xl}`;
    if (cols['2xl']) classes += ` 2xl:grid-cols-${cols['2xl']}`;

    return classes;
  };

  return (
    <div className={`grid ${getGridCols()} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Responsive flex component
 */
export const ResponsiveFlex = ({ 
  children, 
  direction = { xs: 'col', md: 'row' },
  align = 'start',
  justify = 'start',
  gap = 4,
  wrap = true,
  className = ''
}) => {
  const getFlexDirection = () => {
    let classes = `flex-${direction.xs || 'col'}`;
    if (direction.sm) classes += ` sm:flex-${direction.sm}`;
    if (direction.md) classes += ` md:flex-${direction.md}`;
    if (direction.lg) classes += ` lg:flex-${direction.lg}`;
    if (direction.xl) classes += ` xl:flex-${direction.xl}`;

    return classes;
  };

  return (
    <div className={`
      flex ${getFlexDirection()}
      items-${align} justify-${justify}
      gap-${gap}
      ${wrap ? 'flex-wrap' : 'flex-nowrap'}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Responsive card component
 */
export const ResponsiveCard = ({ 
  children, 
  padding = { xs: 4, md: 6 },
  className = '',
  hover = true,
  ...props 
}) => {
  const getPadding = () => {
    let classes = `p-${padding.xs || 4}`;
    if (padding.sm) classes += ` sm:p-${padding.sm}`;
    if (padding.md) classes += ` md:p-${padding.md}`;
    if (padding.lg) classes += ` lg:p-${padding.lg}`;
    if (padding.xl) classes += ` xl:p-${padding.xl}`;

    return classes;
  };

  return (
    <div 
      className={`
        bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-700/50
        ${getPadding()}
        ${hover ? 'hover:bg-slate-800/95 hover:border-slate-600/50 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;