[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)

# To-Do App – Preliminary Assignment Submission

⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage

**How to install and run your project:**

```bash
# Clone the repository
git clone <repository-url>
cd web-track-vietnam-ai-hackathon-ThinhNguyen1211

# Install dependencies
npm install

# Start development server (frontend only - uses demo mode)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Additional Setup Options:**

```bash
# For full backend integration (optional)
cd backend
npm install
npm start

# Run with backend API (in separate terminal)
npm run dev
```

**Access the application:**

-   Development: http://localhost:5173
-   Production preview: http://localhost:4173

## 🔗 Deployed Web URL or APK file

📱 Demo Mode: The application runs in demo mode with sample data for easy testing and evaluation.

## 🎥 Demo Video

**Demo video link (≤ 2 minutes):**

📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.

-   "Unlisted" videos can only be viewed by users who have the link.
-   The video will not appear in search results or on your channel.
-   Share the link in your README so mentors can access it.

Youtube: https://youtu.be/PSv8U2rZ1Oc

## 💻 Project Introduction

### a. Overview

A comprehensive task management application designed specifically for Vietnamese university students to help them organize academic and personal responsibilities effectively. This application transforms a basic todo list into an intelligent time management system that addresses the unique challenges faced by university students. It features smart deadline tracking, procrastination detection, time estimation learning, and productivity analytics.

### b. Key Features & Function Manual

#### 📋 Enhanced Task Management

-   **Smart Task Creation**: Add tasks with priorities, deadlines, time estimates, categories, and tags
-   **Multiple Priority Levels**: Low, Medium, High, and Urgent priority classification
-   **Category Organization**: Pre-defined student categories (Study, Assignment, Project, Personal)
-   **Flexible Tagging**: Custom tags for better task organization
-   **Time Tracking**: Built-in timer to track actual time spent vs estimates

#### 📅 Multiple View Modes

-   **List View**: Traditional task list with advanced filtering and sorting
-   **Calendar View**: Visual deadline management with drag-and-drop rescheduling
-   **Analytics Dashboard**: Comprehensive productivity insights and trends

#### 🧠 Smart Features

-   **Procrastination Detection**: AI-powered analysis of completion patterns
-   **Realistic Deadline Calculation**: Adjusts deadlines based on your historical performance
-   **Smart Notifications**: Context-aware reminders based on task complexity and user patterns
-   **Time Estimation Learning**: Improves time estimates based on your actual completion times

#### 📊 Analytics & Insights

-   **Productivity Trends**: Visual charts showing your productivity patterns over time
-   **Completion Rate Tracking**: Monitor your task completion statistics
-   **Time Accuracy Analysis**: Compare estimated vs actual time spent
-   **Streak Tracking**: Gamified completion streaks to maintain motivation
-   **Optimal Work Time Detection**: Identifies your most productive hours

### c. Unique Features (What's special about this app?)

-   **Student-Centric Design**: Specifically tailored for Vietnamese university students' needs
-   **AI-Powered Procrastination Detection**: Learns from user behavior to provide personalized insights
-   **Realistic Time Estimation**: Adjusts time estimates based on individual completion patterns
-   **Multiple Visualization Modes**: List, Calendar, and Analytics views for different planning needs
-   **Performance Optimization**: Virtual scrolling and optimistic updates for smooth user experience
-   **Smart Notification System**: Context-aware reminders that adapt to user patterns

### d. Technology Stack and Implementation Methods

#### Frontend

-   **React 18.3.1** - Modern React with hooks and concurrent features
-   **Vite 6.0.1** - Fast build tool and development server
-   **Tailwind CSS 3.4.15** - Utility-first CSS framework
-   **React Router DOM 7.0.1** - Client-side routing
-   **SWR 2.3.3** - Data fetching with caching and revalidation
-   **React Window 2.1.0** - Virtualized scrolling for performance
-   **Date-fns 4.1.0** - Modern date utility library
-   **React Toastify 11.0.5** - Toast notifications
-   **Axios 1.7.8** - HTTP client for API calls

#### Backend

-   **Node.js** - JavaScript runtime
-   **Express.js** - Web application framework
-   **MongoDB** - NoSQL database with Mongoose ODM
-   **JWT** - JSON Web Tokens for authentication
-   **bcryptjs** - Password hashing
-   **CORS** - Cross-origin resource sharing

#### Development Tools

-   **ESLint** - Code linting and formatting
-   **Prettier** - Code formatting
-   **PostCSS** - CSS processing
-   **Autoprefixer** - CSS vendor prefixing

### e. Service Architecture & Database structure (when used)

#### Architecture Overview

-   **Frontend**: React SPA with component-based architecture
-   **State Management**: SWR for server state, React Context for client state
-   **Routing**: React Router for client-side navigation
-   **Styling**: Tailwind CSS with responsive design patterns

#### Storage Structure

-   **Tasks Collection**: Enhanced task model with priority, deadlines, time tracking
-   **Analytics Collection**: User productivity metrics and patterns
-   **Categories Collection**: Task categorization system
-   **Tags Collection**: Flexible tagging system for task organization

#### API Architecture

-   RESTful API design with Express.js
-   JWT-based authentication
-   Middleware for validation and error handling
-   Optimized queries with MongoDB indexing

## 🧠 Reflection

### a. If you had more time, what would you expand?

With more time, I would expand the application in several key areas:

**🤖 Advanced AI Integration**

-   Implement machine learning models for better task prioritization based on user behavior patterns
-   Add natural language processing for smart task creation from voice or text input
-   Develop predictive analytics to suggest optimal study schedules and break times

**👥 Collaborative Features**

-   Add team/group project management capabilities for student group work
-   Implement shared calendars and task assignments for study groups
-   Create peer accountability features and progress sharing

**📱 Mobile Application**

-   Develop native iOS and Android apps with offline synchronization
-   Add location-based reminders (e.g., "Study for exam when you arrive at library")
-   Implement push notifications with smart timing based on user habits

**🎓 Academic Integration**

-   Connect with university LMS systems (Moodle, Canvas) to auto-import assignments
-   Add grade tracking and GPA calculation features
-   Integrate with academic calendars for automatic deadline imports

**🧠 Enhanced Analytics**

-   Develop more sophisticated procrastination detection algorithms
-   Add mood tracking and correlation with productivity patterns
-   Implement personalized productivity coaching with actionable insights

### b. If you integrate AI APIs more for your app, what would you do?

Integrating more AI APIs would significantly enhance the application's intelligence and user experience:

**🗣️ Natural Language Processing (OpenAI GPT/Claude)**

-   Smart task creation: "I need to study for my calculus exam next Friday" → automatically creates task with appropriate category, deadline, and time estimate
-   Intelligent task descriptions: Auto-generate detailed study plans and break down complex assignments
-   Smart search: Natural language queries like "show me all urgent math assignments due this week"

**🎯 Personalized Recommendations (Machine Learning APIs)**

-   Use TensorFlow.js or cloud ML services to analyze user patterns and suggest optimal study times
-   Implement recommendation engines for task prioritization based on historical completion rates
-   Predict task difficulty and suggest realistic time estimates using regression models

**📊 Advanced Analytics (Google Analytics Intelligence API)**

-   Implement predictive analytics to forecast productivity trends and potential burnout periods
-   Use clustering algorithms to identify user behavior patterns and suggest improvements
-   Create personalized productivity coaching with data-driven insights

**🔊 Voice Integration (Speech-to-Text APIs)**

-   Add voice commands for hands-free task creation and management
-   Implement voice-activated timers and progress updates
-   Create audio summaries of daily/weekly productivity reports

**🌐 Smart Integrations (Various APIs)**

-   Weather API integration to suggest indoor/outdoor study activities
-   Calendar APIs (Google/Outlook) for seamless schedule synchronization
-   Translation APIs for international students to manage tasks in multiple languages
-   Sentiment analysis to detect stress levels in task descriptions and suggest wellness breaks

## ✅ Checklist

-   [x] Code runs without errors
-   [x] All required features implemented (add/edit/delete/complete tasks)
-   [x] Enhanced features: priorities, deadlines, time tracking, categories, tags
-   [x] Multiple view modes: List, Calendar, Analytics
-   [x] Smart features: procrastination detection, time estimation learning
-   [x] Performance optimizations: virtual scrolling, optimistic updates
-   [x] Responsive design for mobile and desktop
-   [x] Demo mode with sample data for easy testing
-   [x] All ✍️ sections are filled
