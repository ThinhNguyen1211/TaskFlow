import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './pages/Dashboard/Dashboard';
import SimpleDebug from './components/SimpleDebug';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Settings from './pages/Settings/Settings';
import CalendarView from './components/CalendarView/CalendarView';
import AnalyticsView from './components/AnalyticsView/AnalyticsView';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useTodos } from './hooks/useTodos';
import { useNotifications } from './hooks/useNotifications';
import demoService from './services/demoService';
import DemoBanner from './components/DemoBanner/DemoBanner';
import Onboarding from './components/Onboarding/Onboarding';
import HelpSystem from './components/HelpSystem/HelpSystem';

function App() {
    const [filters, setFilters] = useState({});
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    // Initialize demo mode on app start
    useEffect(() => {
        if (!demoService.isDemoMode()) {
            demoService.initializeDemo();
        }
        
        // Check if onboarding should be shown
        const onboardingCompleted = localStorage.getItem('onboardingCompleted');
        if (!onboardingCompleted) {
            setShowOnboarding(true);
        }
    }, []);

    // Use the demo todos hook
    const {
        todos,
        totalCount,
        hasNextPage,
        isLoading,
        isLoadingMore,
        error,
        availableTags,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
        startTask,
        completeTask,
        loadNextPage,
        resetPagination,
        mutate
    } = useTodos(filters);

    // Initialize notifications
    useNotifications();

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        resetPagination();
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        localStorage.setItem('onboardingCompleted', 'true');
    };

    const handleOnboardingSkip = () => {
        setShowOnboarding(false);
        localStorage.setItem('onboardingCompleted', 'true');
    };

    return (
        <ErrorBoundary>
            <Router basename="/TaskFlow">
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    {/* Demo Banner */}
                    <DemoBanner />
                    
                    {/* Navigation */}
                    <Navbar 
                        addTodo={addTodo}
                        isLoading={isLoading}
                    />
                    
                    {/* Main Content */}
                    <main className="relative">
                        <Routes>
                            <Route 
                                path="/" 
                                element={<SimpleDebug />}
                            />
                            <Route 
                                path="/calendar" 
                                element={
                                    <div className="min-h-screen flex items-center justify-center py-8 px-4">
                                        <div className="relative bg-slate-800/90 backdrop-blur-sm p-1 w-full max-w-7xl h-[85vh] rounded-lg gradient-border animate-gradient-spin">
                                            <div className="relative w-full h-full bg-slate-800 rounded-md p-6 overflow-hidden">
                                                <CalendarView
                                                    todos={todos}
                                                    onTaskClick={(task) => {
                                                        // Handle task click - could open edit modal
                                                        console.log('Task clicked:', task);
                                                    }}
                                                    onDateClick={(date) => {
                                                        // Handle date click - could create new task
                                                        console.log('Date clicked:', date);
                                                    }}
                                                    onTaskUpdate={updateTodo}
                                                />
                                            </div>
                                            <div className="absolute inset-0 gradient-glow animate-gradient-spin pointer-events-none"></div>
                                        </div>
                                    </div>
                                } 
                            />
                            <Route 
                                path="/analytics" 
                                element={
                                    <div className="min-h-screen flex items-center justify-center py-8 px-4">
                                        <div className="relative bg-slate-800/90 backdrop-blur-sm p-1 w-full max-w-7xl h-[85vh] rounded-lg gradient-border animate-gradient-spin">
                                            <div className="relative w-full h-full bg-slate-800 rounded-md overflow-hidden">
                                                <AnalyticsView todos={todos} />
                                            </div>
                                            <div className="absolute inset-0 gradient-glow animate-gradient-spin pointer-events-none"></div>
                                        </div>
                                    </div>
                                } 
                            />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </main>

                    {/* Onboarding */}
                    <Onboarding
                        isVisible={showOnboarding}
                        onComplete={handleOnboardingComplete}
                        onSkip={handleOnboardingSkip}
                    />

                    {/* Help System */}
                    <HelpSystem />

                    {/* Toast Notifications */}
                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                        toastStyle={{
                            background: '#1f2937',
                            color: '#f9fafb',
                            border: '1px solid #374151'
                        }}
                    />

                    {/* Speed Insights */}
                    <SpeedInsights />
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;