import React, { useState } from 'react';
import './HelpSystem.css';

const HelpSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('getting-started');

    const helpSections = {
        'getting-started': {
            title: 'Getting Started',
            icon: '🚀',
            content: [
                {
                    title: 'Creating Your First Task',
                    content: 'Click the "+" button to create a new task. Fill in the title, description, priority, deadline, and estimated time to get the most out of the smart features.'
                },
                {
                    title: 'Setting Priorities',
                    content: 'Use priority levels to organize your tasks: Low (nice to have), Medium (important), High (urgent), and Urgent (critical deadline).'
                },
                {
                    title: 'Time Estimation',
                    content: 'Provide time estimates for your tasks. The app will learn from your patterns and suggest more accurate estimates over time.'
                }
            ]
        },
        'features': {
            title: 'Key Features',
            icon: '⭐',
            content: [
                {
                    title: 'Smart Time Tracking',
                    content: 'Start the timer when working on tasks. The app tracks actual vs estimated time to improve future predictions.'
                },
                {
                    title: 'Procrastination Detection',
                    content: 'The system analyzes your completion patterns and adjusts deadlines to account for your procrastination tendencies.'
                },
                {
                    title: 'Multiple Views',
                    content: 'Switch between List view (traditional), Calendar view (deadline visualization), and Analytics view (productivity insights).'
                },
                {
                    title: 'Smart Notifications',
                    content: 'Receive contextual reminders based on task complexity, your work patterns, and deadline proximity.'
                }
            ]
        },
        'views': {
            title: 'Views & Navigation',
            icon: '👁️',
            content: [
                {
                    title: 'List View',
                    content: 'The default view showing all tasks in a sortable, filterable list. Use filters to find specific tasks quickly.'
                },
                {
                    title: 'Calendar View',
                    content: 'Visualize your deadlines on a calendar. Drag and drop tasks to reschedule them easily.'
                },
                {
                    title: 'Analytics View',
                    content: 'See your productivity trends, completion rates, time accuracy, and get insights to improve your planning.'
                }
            ]
        },
        'shortcuts': {
            title: 'Keyboard Shortcuts',
            icon: '⌨️',
            content: [
                {
                    title: 'Task Management',
                    content: 'Ctrl/Cmd + N: Create new task\nCtrl/Cmd + F: Focus search\nEscape: Close modals'
                },
                {
                    title: 'Navigation',
                    content: 'Ctrl/Cmd + 1: List view\nCtrl/Cmd + 2: Calendar view\nCtrl/Cmd + 3: Analytics view'
                },
                {
                    title: 'Quick Actions',
                    content: 'Space: Start/stop timer\nEnter: Save task\nDelete: Remove selected task'
                }
            ]
        },
        'troubleshooting': {
            title: 'Troubleshooting',
            icon: '🔧',
            content: [
                {
                    title: 'Tasks Not Saving',
                    content: 'In demo mode, all data is stored locally in your browser. Clear your browser cache if you experience issues.'
                },
                {
                    title: 'Performance Issues',
                    content: 'Clear browser cache and cookies. If you have many tasks, use filters to reduce the displayed list size.'
                },
                {
                    title: 'Demo Data Reset',
                    content: 'You can reset demo data anytime from the demo banner at the top of the page.'
                },
                {
                    title: 'Browser Compatibility',
                    content: 'This app works best in modern browsers like Chrome, Firefox, Safari, and Edge.'
                }
            ]
        }
    };

    const handleRestartTour = () => {
        localStorage.removeItem('onboardingCompleted');
        setIsOpen(false);
        window.location.reload();
    };

    if (!isOpen) {
        return (
            <button
                className="help-system-trigger"
                onClick={() => setIsOpen(true)}
                aria-label="Open help system"
                title="Help & Support"
            >
                ?
            </button>
        );
    }

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div className="help-system-overlay" onClick={handleBackdropClick}>
            <div className="help-system-modal" onClick={(e) => e.stopPropagation()}>
                <div className="help-system-header">
                    <h2>Help & Support</h2>
                    <button
                        className="help-system-close"
                        onClick={handleClose}
                        aria-label="Close help system"
                    >
                        ×
                    </button>
                </div>
                
                <div className="help-system-content">
                    <div className="help-system-sidebar">
                        {Object.entries(helpSections).map(([key, section]) => (
                            <button
                                key={key}
                                className={`help-system-nav-item ${activeSection === key ? 'active' : ''}`}
                                onClick={() => setActiveSection(key)}
                            >
                                <span className="help-system-nav-icon">{section.icon}</span>
                                <span className="help-system-nav-title">{section.title}</span>
                            </button>
                        ))}
                        
                        <div className="help-system-nav-divider" />
                        
                        <button
                            className="help-system-nav-item help-system-tour-btn"
                            onClick={handleRestartTour}
                        >
                            <span className="help-system-nav-icon">🎯</span>
                            <span className="help-system-nav-title">Restart Tour</span>
                        </button>
                    </div>
                    
                    <div className="help-system-main">
                        <div className="help-system-section">
                            <h3 className="help-system-section-title">
                                <span className="help-system-section-icon">
                                    {helpSections[activeSection].icon}
                                </span>
                                {helpSections[activeSection].title}
                            </h3>
                            
                            <div className="help-system-section-content">
                                {helpSections[activeSection].content.map((item, index) => (
                                    <div key={index} className="help-system-item">
                                        <h4 className="help-system-item-title">
                                            {item.title}
                                        </h4>
                                        <p className="help-system-item-content">
                                            {item.content.split('\n').map((line, lineIndex) => (
                                                <React.Fragment key={lineIndex}>
                                                    {line}
                                                    {lineIndex < item.content.split('\n').length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="help-system-footer">
                    <p>
                        This is a demo version of the Student Time Management System.{' '}
                        <strong>All data is stored locally in your browser.</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpSystem;