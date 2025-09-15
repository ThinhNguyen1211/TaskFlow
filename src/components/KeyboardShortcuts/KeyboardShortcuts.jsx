import React, { useState } from 'react';
import { formatShortcut, getModifierKey } from '../../hooks/useKeyboardShortcuts';
import { FadeTransition, ScaleTransition } from '../Transitions/Transitions';

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  const modifierKey = getModifierKey();

  const shortcuts = [
    {
      category: 'General',
      items: [
        { key: `${modifierKey}+N`, description: 'Create new task' },
        { key: `${modifierKey}+F`, description: 'Focus search' },
        { key: `${modifierKey}+Shift+F`, description: 'Toggle filters' },
        { key: `${modifierKey}+R`, description: 'Refresh tasks' },
        { key: 'Escape', description: 'Cancel/Close' },
        { key: '?', description: 'Show this help' }
      ]
    },
    {
      category: 'Navigation',
      items: [
        { key: `${modifierKey}+1`, description: 'Go to List view' },
        { key: `${modifierKey}+2`, description: 'Go to Calendar view' },
        { key: `${modifierKey}+3`, description: 'Go to Analytics view' },
        { key: `${modifierKey}+Shift+V`, description: 'Toggle view mode' }
      ]
    },
    {
      category: 'Task Management',
      items: [
        { key: `${modifierKey}+A`, description: 'Select all tasks' },
        { key: 'Delete', description: 'Delete selected tasks' },
        { key: '/', description: 'Quick search' },
        { key: 'Enter', description: 'Edit selected task' }
      ]
    },
    {
      category: 'Forms',
      items: [
        { key: `${modifierKey}+S`, description: 'Save form' },
        { key: `${modifierKey}+Enter`, description: 'Submit form' },
        { key: 'Escape', description: 'Cancel form' }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <FadeTransition show={isOpen}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <ScaleTransition show={isOpen}>
          <div className="bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shortcuts.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-lg font-medium text-white mb-3">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">
                            {item.description}
                          </span>
                          <kbd className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded border border-slate-600 font-mono">
                            {item.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <p className="text-sm text-gray-400 text-center">
                  Press <kbd className="px-1 py-0.5 bg-slate-700 text-gray-300 text-xs rounded">?</kbd> anytime to show this help
                </p>
              </div>
            </div>
          </div>
        </ScaleTransition>
      </div>
    </FadeTransition>
  );
};

// Floating shortcut hint
export const ShortcutHint = ({ shortcut, description, position = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <FadeTransition show={isVisible}>
        <div className={`absolute z-10 ${positionClasses[position]} left-1/2 transform -translate-x-1/2`}>
          <div className="bg-slate-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap border border-slate-700">
            <span className="text-gray-300">{description}</span>
            <kbd className="ml-2 px-1 py-0.5 bg-slate-700 text-gray-300 rounded text-xs">
              {formatShortcut(shortcut)}
            </kbd>
          </div>
        </div>
      </FadeTransition>
    </div>
  );
};

// Quick shortcut display for buttons
export const ShortcutButton = ({ 
  children, 
  shortcut, 
  onClick, 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative ${className}`}
      title={`${children} (${formatShortcut(shortcut)})`}
      {...props}
    >
      {children}
      {shortcut && (
        <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <kbd className="px-1 py-0.5 bg-slate-900 text-gray-300 text-xs rounded border border-slate-600">
            {formatShortcut(shortcut).split('+').pop()}
          </kbd>
        </span>
      )}
    </button>
  );
};

export default KeyboardShortcuts;