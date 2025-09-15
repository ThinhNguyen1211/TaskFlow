import { demoTasks, demoAnalytics, demoUser } from './mockData';

class DemoService {
    constructor() {
        this.isDemo = false;
        this.demoData = {
            tasks: [...demoTasks],
            analytics: { ...demoAnalytics },
            user: { ...demoUser }
        };
    }

    // Initialize demo mode
    initializeDemo() {
        this.isDemo = true;
        localStorage.setItem('demoMode', 'true');
        
        // Only initialize if no demo data exists
        if (!localStorage.getItem('demoTasks')) {
            // Start with just 3 demo tasks to test scrolling
            const initialTasks = this.demoData.tasks.slice(0, 3);
            localStorage.setItem('demoTasks', JSON.stringify(initialTasks));
        }
        if (!localStorage.getItem('demoAnalytics')) {
            localStorage.setItem('demoAnalytics', JSON.stringify(this.demoData.analytics));
        }
        if (!localStorage.getItem('demoUser')) {
            localStorage.setItem('demoUser', JSON.stringify(this.demoData.user));
        }
        
        console.log('Demo mode initialized with sample data');
        return true;
    }

    // Check if demo mode is active
    isDemoMode() {
        return localStorage.getItem('demoMode') === 'true' || this.isDemo;
    }

    // Get demo tasks
    getDemoTasks() {
        if (!this.isDemoMode()) return [];
        
        try {
            const stored = localStorage.getItem('demoTasks');
            const tasks = stored ? JSON.parse(stored) : this.demoData.tasks;
            
            // Ensure all tasks have required properties
            return tasks.map(task => ({
                ...task,
                _id: task._id || task.id,
                id: task.id || task._id,
                deadline: task.deadline ? new Date(task.deadline) : null,
                createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
                updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
                tags: task.tags || [],
                priority: task.priority || 'medium',
                category: task.category || 'Study'
            }));
        } catch (error) {
            console.error('Error loading demo tasks:', error);
            return this.demoData.tasks;
        }
    }

    // Add demo task
    addDemoTask(task) {
        if (!this.isDemoMode()) return null;
        
        const tasks = this.getDemoTasks();
        const newTask = {
            ...task,
            id: `demo-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        tasks.push(newTask);
        localStorage.setItem('demoTasks', JSON.stringify(tasks));
        return newTask;
    }

    // Update demo task
    updateDemoTask(taskId, updates) {
        if (!this.isDemoMode()) return null;
        
        const tasks = this.getDemoTasks();
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) return null;
        
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            ...updates,
            updatedAt: new Date(),
        };
        
        localStorage.setItem('demoTasks', JSON.stringify(tasks));
        return tasks[taskIndex];
    }

    // Delete demo task
    deleteDemoTask(taskId) {
        if (!this.isDemoMode()) return false;
        
        const tasks = this.getDemoTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        
        localStorage.setItem('demoTasks', JSON.stringify(filteredTasks));
        return true;
    }

    // Get demo analytics
    getDemoAnalytics() {
        if (!this.isDemoMode()) return null;
        
        const stored = localStorage.getItem('demoAnalytics');
        return stored ? JSON.parse(stored) : this.demoData.analytics;
    }

    // Update demo analytics
    updateDemoAnalytics(updates) {
        if (!this.isDemoMode()) return null;
        
        const analytics = this.getDemoAnalytics();
        const updatedAnalytics = { ...analytics, ...updates };
        
        localStorage.setItem('demoAnalytics', JSON.stringify(updatedAnalytics));
        return updatedAnalytics;
    }

    // Get demo user
    getDemoUser() {
        if (!this.isDemoMode()) return null;
        
        const stored = localStorage.getItem('demoUser');
        return stored ? JSON.parse(stored) : this.demoData.user;
    }

    // Update demo user
    updateDemoUser(updates) {
        if (!this.isDemoMode()) return null;
        
        const user = this.getDemoUser();
        const updatedUser = { ...user, ...updates };
        
        localStorage.setItem('demoUser', JSON.stringify(updatedUser));
        return updatedUser;
    }

    // Clear demo data
    clearDemoData() {
        localStorage.removeItem('demoMode');
        localStorage.removeItem('demoTasks');
        localStorage.removeItem('demoAnalytics');
        localStorage.removeItem('demoUser');
        localStorage.removeItem('onboardingCompleted');
        this.isDemo = false;
        
        console.log('Demo data cleared');
    }

    // Reset demo data to defaults
    resetDemoData() {
        if (!this.isDemoMode()) return false;
        
        localStorage.setItem('demoTasks', JSON.stringify(this.demoData.tasks));
        localStorage.setItem('demoAnalytics', JSON.stringify(this.demoData.analytics));
        localStorage.setItem('demoUser', JSON.stringify(this.demoData.user));
        localStorage.removeItem('onboardingCompleted');
        
        console.log('Demo data reset to defaults');
        return true;
    }

    // Simulate API delay for realistic demo experience
    async simulateApiDelay(data, delay = 300) {
        return new Promise(resolve => {
            setTimeout(() => resolve(data), delay);
        });
    }

    // Generate additional demo tasks for initial setup
    generateAdditionalDemoTasks(count = 7) {
        const categories = ['Study', 'Assignment', 'Project', 'Personal'];
        const priorities = ['low', 'medium', 'high', 'urgent'];
        const sampleTasks = [
            'Review Physics Notes',
            'Complete Math Homework',
            'Prepare History Presentation',
            'Study for Biology Quiz',
            'Write English Essay',
            'Research for Thesis',
            'Practice Programming Problems',
            'Attend Study Group',
            'Complete Lab Report',
            'Read Literature Assignment',
            'Prepare for Oral Exam',
            'Work on Final Project',
            'Review Course Materials',
            'Complete Online Quiz',
            'Attend Office Hours'
        ];

        const newTasks = [];
        for (let i = 0; i < count; i++) {
            const randomDays = Math.floor(Math.random() * 10) + 1; // 1-10 days from now
            const task = {
                id: `demo-additional-${i + 9}`, // Start from 9 since we have 8 base tasks
                content: sampleTasks[i % sampleTasks.length],
                description: `Demo task ${i + 9} for testing scrolling and UI functionality.`,
                completed: Math.random() < 0.25, // 25% chance of being completed
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                estimatedTime: Math.floor(Math.random() * 150) + 30, // 30-180 minutes
                actualTime: null,
                deadline: new Date(Date.now() + randomDays * 24 * 60 * 60 * 1000),
                category: categories[Math.floor(Math.random() * categories.length)],
                tags: ['demo', 'scrolling-test'],
                createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000), // Created within last 5 days
                updatedAt: new Date(),
                startedAt: null,
                completedAt: null,
            };
            
            newTasks.push(task);
        }

        return newTasks;
    }

    // Generate additional demo tasks based on categories
    generateMoreDemoTasks(count = 5) {
        if (!this.isDemoMode()) return [];
        
        const categories = ['Study', 'Assignment', 'Project', 'Personal'];
        const priorities = ['low', 'medium', 'high', 'urgent'];
        const sampleTasks = [
            'Review lecture notes',
            'Complete homework',
            'Prepare presentation',
            'Study for quiz',
            'Write essay',
            'Do research',
            'Practice problems',
            'Group meeting',
            'Lab work',
            'Read textbook chapter'
        ];

        const newTasks = [];
        for (let i = 0; i < count; i++) {
            const task = {
                id: `generated-${Date.now()}-${i}`,
                content: sampleTasks[Math.floor(Math.random() * sampleTasks.length)],
                description: 'Auto-generated demo task for testing purposes.',
                completed: Math.random() < 0.3, // 30% chance of being completed
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                estimatedTime: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
                actualTime: null,
                deadline: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Within 7 days
                category: categories[Math.floor(Math.random() * categories.length)],
                tags: ['demo', 'generated'],
                createdAt: new Date(),
                updatedAt: new Date(),
                startedAt: null,
                completedAt: null,
            };
            
            newTasks.push(task);
        }

        const existingTasks = this.getDemoTasks();
        const allTasks = [...existingTasks, ...newTasks];
        localStorage.setItem('demoTasks', JSON.stringify(allTasks));
        
        return newTasks;
    }

    // Export demo data for sharing
    exportDemoData() {
        if (!this.isDemoMode()) return null;
        
        return {
            tasks: this.getDemoTasks(),
            analytics: this.getDemoAnalytics(),
            user: this.getDemoUser(),
            exportedAt: new Date().toISOString(),
        };
    }

    // Import demo data
    importDemoData(data) {
        if (!data || !data.tasks) return false;
        
        this.initializeDemo();
        
        if (data.tasks) {
            localStorage.setItem('demoTasks', JSON.stringify(data.tasks));
        }
        if (data.analytics) {
            localStorage.setItem('demoAnalytics', JSON.stringify(data.analytics));
        }
        if (data.user) {
            localStorage.setItem('demoUser', JSON.stringify(data.user));
        }
        
        console.log('Demo data imported successfully');
        return true;
    }
}

// Create singleton instance
const demoService = new DemoService();

export default demoService;