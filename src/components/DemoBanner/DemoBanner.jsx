import React, { useState } from 'react';
import demoService from '../../services/demoService';
import './DemoBanner.css';

const DemoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!demoService.isDemoMode() || !isVisible) {
        return null;
    }

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('demoBannerDismissed', 'true');
    };

    const handleResetDemo = () => {
        if (confirm('Reset demo data to defaults? This will clear all your demo progress.')) {
            demoService.resetDemoData();
            window.location.reload();
        }
    };

    const handleExitDemo = () => {
        if (confirm('Exit demo mode? This will clear all demo data and return to the normal app.')) {
            demoService.clearDemoData();
            window.location.reload();
        }
    };

    const handleExportData = () => {
        const data = demoService.exportDemoData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `demo-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAddMoreTasks = () => {
        const newTasks = demoService.generateMoreDemoTasks(5);
        if (newTasks.length > 0) {
            window.location.reload(); // Refresh to show new tasks
        }
    };

    return (
        <div className="demo-banner">
            <div className="demo-banner-content">
                <div className="demo-banner-main">
                    <div className="demo-banner-icon">
                        🎯
                    </div>
                    <div className="demo-banner-text">
                        <strong>Demo Mode Active</strong>
                        <span>You're exploring the Student Time Management System with sample data.</span>
                    </div>
                    <div className="demo-banner-actions">
                        <button
                            className="demo-banner-btn demo-banner-btn-expand"
                            onClick={() => setIsExpanded(!isExpanded)}
                            aria-label={isExpanded ? 'Collapse options' : 'Expand options'}
                        >
                            {isExpanded ? '−' : '+'}
                        </button>
                        <button
                            className="demo-banner-btn demo-banner-btn-dismiss"
                            onClick={handleDismiss}
                            aria-label="Dismiss banner"
                        >
                            ×
                        </button>
                    </div>
                </div>
                
                {isExpanded && (
                    <div className="demo-banner-expanded">
                        <div className="demo-banner-info">
                            <h4>Demo Features Available:</h4>
                            <ul>
                                <li>✅ Sample tasks with different priorities and categories</li>
                                <li>📊 Productivity analytics and insights</li>
                                <li>📅 Calendar view with deadline visualization</li>
                                <li>⏱️ Time tracking and estimation learning</li>
                                <li>🔔 Smart notifications and procrastination detection</li>
                                <li>🎯 Interactive onboarding tour</li>
                            </ul>
                        </div>
                        
                        <div className="demo-banner-controls">
                            <button
                                className="demo-banner-control-btn demo-banner-control-add"
                                onClick={handleAddMoreTasks}
                            >
                                ➕ Add More Tasks
                            </button>
                            <button
                                className="demo-banner-control-btn demo-banner-control-reset"
                                onClick={handleResetDemo}
                            >
                                🔄 Reset Demo Data
                            </button>
                            <button
                                className="demo-banner-control-btn demo-banner-control-export"
                                onClick={handleExportData}
                            >
                                💾 Export Demo Data
                            </button>
                            <button
                                className="demo-banner-control-btn demo-banner-control-exit"
                                onClick={handleExitDemo}
                            >
                                🚪 Exit Demo Mode
                            </button>
                        </div>
                        
                        <div className="demo-banner-note">
                            <p>
                                <strong>Note:</strong> All data is stored locally in your browser and will persist until you clear your browser data or exit demo mode.
                                Your tasks and progress are automatically saved to local storage.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DemoBanner;