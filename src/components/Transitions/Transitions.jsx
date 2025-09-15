import React, { useState, useEffect } from 'react';

// Fade transition component
export const FadeTransition = ({ 
  show, 
  children, 
  duration = 300,
  className = '',
  onEnter,
  onExit
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Small delay to ensure element is rendered before fade in
      const timer = setTimeout(() => {
        setIsVisible(true);
        onEnter?.();
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      onExit?.();
      // Wait for fade out animation to complete
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onEnter, onExit]);

  if (!shouldRender) return null;

  return (
    <div
      className={`transition-opacity duration-${duration} ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

// Slide transition component
export const SlideTransition = ({ 
  show, 
  children, 
  direction = 'down',
  duration = 300,
  className = ''
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  const getTransform = () => {
    const transforms = {
      up: isVisible ? 'translateY(0)' : 'translateY(10px)',
      down: isVisible ? 'translateY(0)' : 'translateY(-10px)',
      left: isVisible ? 'translateX(0)' : 'translateX(10px)',
      right: isVisible ? 'translateX(0)' : 'translateX(-10px)'
    };
    return transforms[direction] || transforms.down;
  };

  return (
    <div
      className={`transition-all duration-${duration} ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ 
        transform: getTransform(),
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

// Scale transition component
export const ScaleTransition = ({ 
  show, 
  children, 
  duration = 200,
  className = ''
}) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={`transition-all duration-${duration} ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

// Stagger animation for lists
export const StaggeredList = ({ 
  children, 
  staggerDelay = 50,
  className = ''
}) => {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const items = React.Children.toArray(children);
    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]));
      }, index * staggerDelay);
    });

    return () => setVisibleItems(new Set());
  }, [children, staggerDelay]);

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`transition-all duration-300 ${
            visibleItems.has(index) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Loading transition with spinner
export const LoadingTransition = ({ 
  isLoading, 
  children, 
  loadingComponent,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <FadeTransition show={!isLoading}>
        {children}
      </FadeTransition>
      <FadeTransition show={isLoading}>
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
          {loadingComponent || (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <span className="text-white text-sm">Loading...</span>
            </div>
          )}
        </div>
      </FadeTransition>
    </div>
  );
};

// Hover scale animation
export const HoverScale = ({ 
  children, 
  scale = 1.05,
  duration = 200,
  className = ''
}) => {
  return (
    <div
      className={`transition-transform duration-${duration} hover:scale-${Math.round(scale * 100)} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};

// Bounce animation
export const BounceAnimation = ({ 
  children, 
  trigger = false,
  className = ''
}) => {
  return (
    <div
      className={`${trigger ? 'animate-bounce' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// Pulse animation
export const PulseAnimation = ({ 
  children, 
  active = false,
  className = ''
}) => {
  return (
    <div
      className={`${active ? 'animate-pulse' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default FadeTransition;