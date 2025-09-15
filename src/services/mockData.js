import { addDays, subDays, subHours } from 'date-fns';

// Demo tasks for new users to showcase features
export const demoTasks = [
    {
        id: 'demo-1',
        content: 'Complete Data Structures Assignment',
        description: 'Implement binary search tree with insertion, deletion, and traversal methods. Include unit tests and documentation.',
        completed: false,
        priority: 'high',
        estimatedTime: 180, // 3 hours
        actualTime: null,
        deadline: addDays(new Date(), 2),
        category: 'Assignment',
        tags: ['programming', 'algorithms', 'computer-science'],
        createdAt: subDays(new Date(), 1),
        updatedAt: subDays(new Date(), 1),
        startedAt: null,
        completedAt: null,
    },
    {
        id: 'demo-2',
        content: 'Study for Calculus Midterm',
        description: 'Review chapters 5-8: derivatives, integrals, and applications. Practice problem sets and past exams.',
        completed: false,
        priority: 'urgent',
        estimatedTime: 240, // 4 hours
        actualTime: null,
        deadline: addDays(new Date(), 1),
        category: 'Study',
        tags: ['mathematics', 'exam', 'calculus'],
        createdAt: subDays(new Date(), 3),
        updatedAt: subDays(new Date(), 1),
        startedAt: null,
        completedAt: null,
    },
    {
        id: 'demo-3',
        content: 'Group Project Meeting',
        description: 'Discuss project timeline, assign roles, and review requirements for the software engineering project.',
        completed: true,
        priority: 'medium',
        estimatedTime: 90, // 1.5 hours
        actualTime: 105, // Took a bit longer
        deadline: subDays(new Date(), 1),
        category: 'Project',
        tags: ['teamwork', 'planning', 'software-engineering'],
        createdAt: subDays(new Date(), 5),
        updatedAt: subDays(new Date(), 1),
        startedAt: subHours(new Date(), 26),
        completedAt: subHours(new Date(), 24),
    },
    {
        id: 'demo-4',
        content: 'Read Research Paper on Machine Learning',
        description: 'Read and summarize "Attention Is All You Need" paper for AI course. Prepare presentation slides.',
        completed: false,
        priority: 'medium',
        estimatedTime: 120, // 2 hours
        actualTime: null,
        deadline: addDays(new Date(), 5),
        category: 'Study',
        tags: ['research', 'ai', 'machine-learning', 'presentation'],
        createdAt: subDays(new Date(), 2),
        updatedAt: subDays(new Date(), 2),
        startedAt: null,
        completedAt: null,
    },
    {
        id: 'demo-5',
        content: 'Submit Scholarship Application',
        description: 'Complete scholarship application form, gather required documents, and write personal statement.',
        completed: false,
        priority: 'high',
        estimatedTime: 150, // 2.5 hours
        actualTime: null,
        deadline: addDays(new Date(), 7),
        category: 'Personal',
        tags: ['scholarship', 'application', 'documents'],
        createdAt: subDays(new Date(), 4),
        updatedAt: subDays(new Date(), 4),
        startedAt: null,
        completedAt: null,
    },
    {
        id: 'demo-6',
        content: 'Lab Report - Chemistry Experiment',
        description: 'Write lab report for organic chemistry synthesis experiment. Include methodology, results, and analysis.',
        completed: true,
        priority: 'medium',
        estimatedTime: 120, // 2 hours
        actualTime: 95, // Finished early
        deadline: subDays(new Date(), 2),
        category: 'Assignment',
        tags: ['chemistry', 'lab-report', 'experiment'],
        createdAt: subDays(new Date(), 7),
        updatedAt: subDays(new Date(), 2),
        startedAt: subHours(new Date(), 50),
        completedAt: subHours(new Date(), 48),
    },
    {
        id: 'demo-7',
        content: 'Prepare for Job Interview',
        description: 'Research company background, practice common interview questions, and prepare portfolio presentation.',
        completed: false,
        priority: 'urgent',
        estimatedTime: 180, // 3 hours
        actualTime: null,
        deadline: addDays(new Date(), 3),
        category: 'Personal',
        tags: ['career', 'interview', 'preparation'],
        createdAt: subDays(new Date(), 1),
        updatedAt: subDays(new Date(), 1),
        startedAt: null,
        completedAt: null,
    },
    {
        id: 'demo-8',
        content: 'Exercise - Go to Gym',
        description: 'Cardio and strength training session. Focus on upper body workout and 30 minutes cardio.',
        completed: false,
        priority: 'low',
        estimatedTime: 90, // 1.5 hours
        actualTime: null,
        deadline: addDays(new Date(), 1),
        category: 'Personal',
        tags: ['health', 'fitness', 'exercise'],
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: null,
        completedAt: null,
    },
];

// Demo analytics data
export const demoAnalytics = {
    completionRate: 0.75,
    averageEstimationAccuracy: 0.85,
    procrastinationCoefficient: 1.2,
    productiveHours: [9, 10, 11, 14, 15, 16, 20, 21], // Hours when user is most productive
    weeklyStats: [
        {
            week: subDays(new Date(), 14),
            tasksCompleted: 8,
            tasksCreated: 12,
            totalTimeSpent: 1200, // minutes
        },
        {
            week: subDays(new Date(), 7),
            tasksCompleted: 6,
            tasksCreated: 10,
            totalTimeSpent: 980,
        },
        {
            week: new Date(),
            tasksCompleted: 4,
            tasksCreated: 8,
            totalTimeSpent: 720,
        },
    ],
    streaks: {
        current: 3,
        longest: 12,
        lastUpdated: new Date(),
    },
};

// Onboarding steps
export const onboardingSteps = [
    {
        id: 'welcome',
        title: 'Welcome to Student Time Management!',
        description: 'Let\'s take a quick tour of the features that will help you stay organized and productive.',
        target: null,
        placement: 'center',
    },
    {
        id: 'task-creation',
        title: 'Create Your First Task',
        description: 'Click the "+" button to add a new task. You can set priorities, deadlines, and time estimates.',
        target: '[data-tour="add-task-button"]',
        placement: 'bottom',
    },
    {
        id: 'task-details',
        title: 'Rich Task Details',
        description: 'Add descriptions, categories, tags, and time estimates to make your tasks more organized.',
        target: '[data-tour="task-form"]',
        placement: 'left',
    },
    {
        id: 'priority-system',
        title: 'Priority Levels',
        description: 'Use priority levels (Low, Medium, High, Urgent) to focus on what matters most.',
        target: '[data-tour="priority-selector"]',
        placement: 'top',
    },
    {
        id: 'time-tracking',
        title: 'Time Tracking',
        description: 'Start the timer when working on tasks to improve your time estimation accuracy.',
        target: '[data-tour="timer-button"]',
        placement: 'top',
    },
    {
        id: 'view-switcher',
        title: 'Multiple Views',
        description: 'Switch between List, Calendar, and Analytics views to see your tasks from different perspectives.',
        target: '[data-tour="view-switcher"]',
        placement: 'bottom',
    },
    {
        id: 'calendar-view',
        title: 'Calendar View',
        description: 'Visualize your deadlines and schedule tasks more effectively with the calendar view.',
        target: '[data-tour="calendar-view"]',
        placement: 'center',
    },
    {
        id: 'analytics',
        title: 'Productivity Analytics',
        description: 'Track your productivity patterns, completion rates, and time estimation accuracy.',
        target: '[data-tour="analytics-view"]',
        placement: 'center',
    },
    {
        id: 'smart-features',
        title: 'Smart Features',
        description: 'The app learns from your patterns to provide realistic deadlines and smart notifications.',
        target: '[data-tour="smart-features"]',
        placement: 'center',
    },
    {
        id: 'complete',
        title: 'You\'re All Set!',
        description: 'Start adding your tasks and let the app help you become more productive. You can replay this tour anytime from settings.',
        target: null,
        placement: 'center',
    },
];

// Feature highlights for tooltips
export const featureTooltips = {
    'deadline-pressure': {
        title: 'Deadline Pressure Indicator',
        description: 'Colors change from green to red as deadlines approach to help you prioritize.',
    },
    'realistic-deadline': {
        title: 'Realistic Deadline',
        description: 'Based on your completion patterns, this shows when you\'ll likely finish the task.',
    },
    'procrastination-insights': {
        title: 'Procrastination Detection',
        description: 'The app analyzes your patterns and suggests better planning strategies.',
    },
    'time-accuracy': {
        title: 'Time Estimation Accuracy',
        description: 'Compare your estimates with actual time to improve future planning.',
    },
    'productivity-trends': {
        title: 'Productivity Trends',
        description: 'Visualize your productivity patterns over time to optimize your schedule.',
    },
    'smart-notifications': {
        title: 'Smart Notifications',
        description: 'Contextual reminders based on task complexity and your work patterns.',
    },
};

// Demo user profile
export const demoUser = {
    id: 'demo-user',
    name: 'Demo Student',
    email: 'demo@student.edu.vn',
    university: 'Vietnam National University',
    major: 'Computer Science',
    year: 3,
    preferences: {
        theme: 'light',
        notifications: true,
        defaultPriority: 'medium',
        defaultCategory: 'Study',
        workingHours: {
            start: 9,
            end: 22,
        },
        reminderSettings: {
            enabled: true,
            beforeDeadline: [24, 6, 1], // hours before deadline
        },
    },
    onboardingCompleted: false,
    createdAt: subDays(new Date(), 30),
};

// Export legacy mock posts for backward compatibility
export const mockPosts = [
    { id: 1, content: 'This is the content of post 111111111 111 213131 123123 31231241.' },
    { id: 2, content: 'This is the content of post 2.' },
    { id: 3, content: 'This is the content of post 3.' },
];
