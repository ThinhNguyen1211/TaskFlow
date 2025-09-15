import { Link } from 'react-router-dom';
import { useState } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import TaskForm from '../TaskForm/TaskForm';
import images from '~/assets/index.js';

const Navbar = ({ addTodo, isLoading }) => {
    const [newTodo, setNewTodo] = useState('');
    const [isAddingTodo, setIsAddingTodo] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);

    const handleAddTodo = async () => {
        if (!newTodo.trim() || isAddingTodo) return;
        
        setIsAddingTodo(true);
        try {
            await addTodo(newTodo);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        } finally {
            setIsAddingTodo(false);
        }
    };

    const handleShowTaskForm = () => {
        setShowTaskForm(true);
    };

    const handleCloseTaskForm = () => {
        setShowTaskForm(false);
    };

    const handleTaskFormSubmit = async (taskData) => {
        try {
            await addTodo(taskData);
            setShowTaskForm(false);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-gray-700/50 sticky top-0 z-40 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-2 xs:px-4 sm:px-6 lg:px-8">
                    <div className="relative flex h-14 xs:h-16 sm:h-20 items-center justify-between">
                        {/* Logo and Navigation */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link to="/" className="flex items-center space-x-2 xs:space-x-3">
                                    <div className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white font-bold text-xs xs:text-sm sm:text-base">T</span>
                                    </div>
                                    <span className="text-white font-bold text-sm xs:text-base sm:text-lg lg:text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        TaskFlow
                                    </span>
                                </Link>
                            </div>
                            <div className="hidden md:block ml-6 lg:ml-10">
                                <div className="flex space-x-1 lg:space-x-4">
                                    <ul className="flex space-x-1 lg:space-x-4">
                                        <li>
                                            <Link
                                                className="rounded-md px-2 lg:px-3 py-2 text-sm lg:text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                                to="/"
                                            >
                                                Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="rounded-md px-2 lg:px-3 py-2 text-sm lg:text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                                to="/calendar"
                                            >
                                                Calendar
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="rounded-md px-2 lg:px-3 py-2 text-sm lg:text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                                to="/analytics"
                                            >
                                                Analytics
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="rounded-md px-2 lg:px-3 py-2 text-sm lg:text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                                to="/about"
                                            >
                                                About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="rounded-md px-2 lg:px-3 py-2 text-sm lg:text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                                                to="/contact"
                                            >
                                                Contact
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Task Input */}
                        <div className="flex-1 flex items-center justify-center px-1 xs:px-2 sm:px-4 max-w-2xl mx-auto">
                            <div className="relative w-full max-w-lg flex gap-1 xs:gap-2">
                                <div className="relative flex-1">
                                    <input
                                        placeholder="Add new task..."
                                        spellCheck={false}
                                        value={newTodo}
                                        onChange={(e) => setNewTodo(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !isAddingTodo && handleAddTodo()}
                                        disabled={isAddingTodo}
                                        className="w-full px-3 xs:px-4 pr-16 xs:pr-20 py-2 xs:py-2.5 text-xs xs:text-sm sm:text-base bg-gradient-to-r from-gray-800 to-gray-700 text-white placeholder-gray-400 rounded-full border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTodo}
                                        disabled={isAddingTodo || !newTodo.trim()}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-xs xs:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        data-testid="add-task-button"
                                    >
                                        <span className="flex items-center">
                                            {isAddingTodo ? (
                                                <>
                                                    <LoadingSpinner size="sm" />
                                                    <span className="ml-1 hidden sm:inline">Adding...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="hidden sm:inline">Add</span>
                                                    <span className="sm:hidden">+</span>
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>
                                
                                {/* Advanced Task Form Button */}
                                <button
                                    onClick={handleShowTaskForm}
                                    className="px-2 xs:px-3 py-2 xs:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full text-xs xs:text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    title="Advanced Task Form"
                                >
                                    <span className="hidden xs:inline">⚙️</span>
                                    <span className="xs:hidden">+</span>
                                </button>
                            </div>
                        </div>

                        {/* Demo Mode Indicator */}
                        <div className="flex items-center space-x-2">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-600/30 rounded-full">
                                <span className="text-blue-400 text-sm">🎯</span>
                                <span className="text-blue-300 text-xs font-medium">Demo Mode</span>
                            </div>
                            <div className="sm:hidden flex items-center">
                                <span className="text-blue-400 text-lg">🎯</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Task Form Modal */}
            <TaskForm
                isOpen={showTaskForm}
                onSubmit={handleTaskFormSubmit}
                onClose={handleCloseTaskForm}
                isLoading={isAddingTodo}
            />
        </>
    );
};

export default Navbar;