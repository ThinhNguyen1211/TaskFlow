import React from 'react';
import NotificationSettings from '../../components/NotificationSettings/NotificationSettings';

const Settings = () => {
    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-2">Manage your application preferences and notifications</p>
                </div>
                
                <div className="space-y-8">
                    <NotificationSettings />
                    
                    {/* Placeholder for other settings sections */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">General Settings</h3>
                        <p className="text-gray-400">Additional settings will be added here in future updates.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
