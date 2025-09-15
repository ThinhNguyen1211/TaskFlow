class ProcrastinationService {
  constructor() {
    this.userPatterns = this.loadUserPatterns();
  }

  // Load user patterns from localStorage or API
  loadUserPatterns() {
    try {
      const saved = localStorage.getItem('userProcrastinationPatterns');
      return saved ? JSON.parse(saved) : this.getDefaultPatterns();
    } catch (error) {
      console.error('Error loading user patterns:', error);
      return this.getDefaultPatterns();
    }
  }

  // Get default patterns for new users
  getDefaultPatterns() {
    return {
      procrastinationCoefficient: 1.0,
      averageEstimationAccuracy: 0.8,
      completionRate: 0.75,
      taskTypeMultipliers: {
        'study': 1.2,
        'assignment': 1.5,
        'project': 2.0,
        'personal': 0.9,
        'general': 1.0
      },
      priorityMultipliers: {
        'urgent': 0.8,
        'high': 1.0,
        'medium': 1.2,
        'low': 1.5
      },
      timeOfDayMultipliers: {
        'morning': 0.9,   // 6-12
        'afternoon': 1.0, // 12-18
        'evening': 1.2,   // 18-22
        'night': 1.5      // 22-6
      },
      historicalData: []
    };
  }

  // Save user patterns
  saveUserPatterns(patterns) {
    this.userPatterns = { ...this.userPatterns, ...patterns };
    localStorage.setItem('userProcrastinationPatterns', JSON.stringify(this.userPatterns));
  }

  // Calculate procrastination coefficient based on historical data
  calculateProcrastinationCoefficient(completedTasks) {
    if (!completedTasks || completedTasks.length === 0) {
      return this.userPatterns.procrastinationCoefficient;
    }

    // Filter tasks with both estimated and actual time
    const tasksWithTiming = completedTasks.filter(task => 
      task.estimatedTime && 
      task.actualTime && 
      task.estimatedTime > 0
    );

    if (tasksWithTiming.length === 0) {
      return this.userPatterns.procrastinationCoefficient;
    }

    // Calculate the ratio of actual time to estimated time
    const ratios = tasksWithTiming.map(task => task.actualTime / task.estimatedTime);
    
    // Use weighted average, giving more weight to recent tasks
    const weights = ratios.map((_, index) => Math.pow(0.9, ratios.length - 1 - index));
    const weightedSum = ratios.reduce((sum, ratio, index) => sum + ratio * weights[index], 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    const coefficient = weightedSum / totalWeight;
    
    // Update user patterns
    this.saveUserPatterns({ procrastinationCoefficient: coefficient });
    
    return coefficient;
  }

  // Calculate realistic deadline based on user's procrastination patterns
  calculateRealisticDeadline(task, officialDeadline) {
    if (!task.estimatedTime || !officialDeadline) {
      return officialDeadline;
    }

    const coefficient = this.userPatterns.procrastinationCoefficient;
    const adjustedTime = this.getAdjustedEstimatedTime(task);
    
    // Calculate how much earlier the user should start
    const bufferTime = (adjustedTime - task.estimatedTime) * 60 * 1000; // Convert to milliseconds
    
    const realisticDeadline = new Date(officialDeadline.getTime() - bufferTime);
    
    // Ensure realistic deadline is not in the past
    const now = new Date();
    if (realisticDeadline <= now) {
      // If realistic deadline is in the past, set it to a reasonable time from now
      const minimumBuffer = Math.max(task.estimatedTime * 0.5, 30); // At least 30 minutes or half estimated time
      return new Date(now.getTime() + minimumBuffer * 60 * 1000);
    }
    
    return realisticDeadline;
  }

  // Get adjusted estimated time based on user patterns and task characteristics
  getAdjustedEstimatedTime(task) {
    if (!task.estimatedTime) return 0;

    let adjustedTime = task.estimatedTime;
    
    // Apply procrastination coefficient
    adjustedTime *= this.userPatterns.procrastinationCoefficient;
    
    // Apply task type multiplier
    const category = task.category || 'general';
    const typeMultiplier = this.userPatterns.taskTypeMultipliers[category] || 1.0;
    adjustedTime *= typeMultiplier;
    
    // Apply priority multiplier
    const priority = task.priority || 'medium';
    const priorityMultiplier = this.userPatterns.priorityMultipliers[priority] || 1.0;
    adjustedTime *= priorityMultiplier;
    
    // Apply time of day multiplier if deadline is set
    if (task.deadline) {
      const timeOfDay = this.getTimeOfDay(new Date(task.deadline));
      const timeMultiplier = this.userPatterns.timeOfDayMultipliers[timeOfDay] || 1.0;
      adjustedTime *= timeMultiplier;
    }
    
    // Round to nearest 5 minutes
    return Math.round(adjustedTime / 5) * 5;
  }

  // Determine time of day category
  getTimeOfDay(date) {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  // Detect procrastination patterns and provide insights
  detectProcrastinationPatterns(tasks, analytics) {
    const patterns = {
      overallTendency: 'normal',
      riskFactors: [],
      suggestions: [],
      confidence: 0
    };

    if (!tasks || tasks.length === 0) {
      return patterns;
    }

    const completedTasks = tasks.filter(task => task.completed);
    const overdueTasks = tasks.filter(task => 
      task.deadline && 
      new Date(task.deadline) < new Date() && 
      !task.completed
    );

    // Analyze completion rate
    const completionRate = completedTasks.length / tasks.length;
    if (completionRate < 0.6) {
      patterns.riskFactors.push('Low completion rate');
      patterns.suggestions.push('Try breaking large tasks into smaller, manageable chunks');
    }

    // Analyze overdue rate
    const overdueRate = overdueTasks.length / tasks.length;
    if (overdueRate > 0.3) {
      patterns.riskFactors.push('High overdue rate');
      patterns.suggestions.push('Consider setting more realistic deadlines');
    }

    // Analyze procrastination coefficient
    const coefficient = this.userPatterns.procrastinationCoefficient;
    if (coefficient > 1.5) {
      patterns.overallTendency = 'high';
      patterns.riskFactors.push('Consistently underestimating task duration');
      patterns.suggestions.push('Use the Pomodoro technique to improve focus');
    } else if (coefficient > 1.2) {
      patterns.overallTendency = 'moderate';
      patterns.riskFactors.push('Moderate tendency to underestimate time');
      patterns.suggestions.push('Add 25% buffer time to your estimates');
    }

    // Analyze task timing patterns
    const tasksWithTiming = completedTasks.filter(task => 
      task.estimatedTime && task.actualTime
    );

    if (tasksWithTiming.length > 0) {
      const avgAccuracy = tasksWithTiming.reduce((sum, task) => {
        return sum + (Math.min(task.estimatedTime, task.actualTime) / 
                     Math.max(task.estimatedTime, task.actualTime));
      }, 0) / tasksWithTiming.length;

      if (avgAccuracy < 0.7) {
        patterns.riskFactors.push('Poor time estimation accuracy');
        patterns.suggestions.push('Track your time more carefully to improve estimates');
      }
    }

    // Analyze deadline pressure patterns
    const urgentTasks = tasks.filter(task => task.priority === 'urgent');
    const urgentCompletionRate = urgentTasks.length > 0 ? 
      urgentTasks.filter(task => task.completed).length / urgentTasks.length : 1;

    if (urgentCompletionRate > 0.8 && completionRate < 0.7) {
      patterns.riskFactors.push('Only performs well under pressure');
      patterns.suggestions.push('Try creating artificial deadlines to maintain motivation');
    }

    // Calculate confidence based on data availability
    patterns.confidence = Math.min(
      (completedTasks.length / 10) * 0.5 + // 50% based on completed tasks
      (tasksWithTiming.length / 5) * 0.3 + // 30% based on timing data
      0.2, // 20% base confidence
      1.0
    );

    return patterns;
  }

  // Generate time estimation suggestions based on historical data
  generateTimeEstimationSuggestions(task, similarTasks = []) {
    const suggestions = {
      recommended: task.estimatedTime,
      realistic: this.getAdjustedEstimatedTime(task),
      confidence: 'medium',
      reasoning: [],
      similarTasksAnalysis: null
    };

    // Analyze similar tasks if available
    if (similarTasks.length > 0) {
      const avgActualTime = similarTasks.reduce((sum, t) => sum + (t.actualTime || t.estimatedTime), 0) / similarTasks.length;
      const avgEstimatedTime = similarTasks.reduce((sum, t) => sum + t.estimatedTime, 0) / similarTasks.length;
      
      suggestions.similarTasksAnalysis = {
        count: similarTasks.length,
        avgActualTime: Math.round(avgActualTime),
        avgEstimatedTime: Math.round(avgEstimatedTime),
        accuracy: avgEstimatedTime > 0 ? avgActualTime / avgEstimatedTime : 1
      };

      if (similarTasks.length >= 3) {
        suggestions.recommended = Math.round(avgActualTime);
        suggestions.confidence = 'high';
        suggestions.reasoning.push(`Based on ${similarTasks.length} similar tasks`);
      }
    }

    // Add reasoning based on user patterns
    const coefficient = this.userPatterns.procrastinationCoefficient;
    if (coefficient > 1.2) {
      suggestions.reasoning.push(`Adjusted for your tendency to underestimate (+${Math.round((coefficient - 1) * 100)}%)`);
    }

    // Add category-specific reasoning
    const category = task.category || 'general';
    const typeMultiplier = this.userPatterns.taskTypeMultipliers[category];
    if (typeMultiplier !== 1.0) {
      const adjustment = Math.round((typeMultiplier - 1) * 100);
      suggestions.reasoning.push(`${category} tasks typically take ${adjustment > 0 ? '+' : ''}${adjustment}% longer`);
    }

    // Add priority-specific reasoning
    const priority = task.priority || 'medium';
    const priorityMultiplier = this.userPatterns.priorityMultipliers[priority];
    if (priorityMultiplier !== 1.0) {
      const adjustment = Math.round((priorityMultiplier - 1) * 100);
      suggestions.reasoning.push(`${priority} priority tasks typically take ${adjustment > 0 ? '+' : ''}${adjustment}% longer`);
    }

    return suggestions;
  }

  // Update patterns based on completed task
  updatePatternsFromCompletedTask(task) {
    if (!task.estimatedTime || !task.actualTime) return;

    // Add to historical data
    const dataPoint = {
      estimatedTime: task.estimatedTime,
      actualTime: task.actualTime,
      category: task.category,
      priority: task.priority,
      completedAt: task.completedAt || new Date(),
      accuracy: Math.min(task.estimatedTime, task.actualTime) / Math.max(task.estimatedTime, task.actualTime)
    };

    this.userPatterns.historicalData.push(dataPoint);

    // Keep only last 100 data points to prevent memory issues
    if (this.userPatterns.historicalData.length > 100) {
      this.userPatterns.historicalData = this.userPatterns.historicalData.slice(-100);
    }

    // Recalculate patterns
    this.recalculatePatterns();
  }

  // Recalculate all patterns based on historical data
  recalculatePatterns() {
    const data = this.userPatterns.historicalData;
    if (data.length === 0) return;

    // Recalculate procrastination coefficient
    const ratios = data.map(d => d.actualTime / d.estimatedTime);
    const avgRatio = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
    this.userPatterns.procrastinationCoefficient = avgRatio;

    // Recalculate category multipliers
    const categories = [...new Set(data.map(d => d.category))];
    categories.forEach(category => {
      const categoryData = data.filter(d => d.category === category);
      if (categoryData.length >= 3) {
        const categoryRatios = categoryData.map(d => d.actualTime / d.estimatedTime);
        const avgCategoryRatio = categoryRatios.reduce((sum, ratio) => sum + ratio, 0) / categoryRatios.length;
        this.userPatterns.taskTypeMultipliers[category] = avgCategoryRatio;
      }
    });

    // Recalculate priority multipliers
    const priorities = [...new Set(data.map(d => d.priority))];
    priorities.forEach(priority => {
      const priorityData = data.filter(d => d.priority === priority);
      if (priorityData.length >= 3) {
        const priorityRatios = priorityData.map(d => d.actualTime / d.estimatedTime);
        const avgPriorityRatio = priorityRatios.reduce((sum, ratio) => sum + ratio, 0) / priorityRatios.length;
        this.userPatterns.priorityMultipliers[priority] = avgPriorityRatio;
      }
    });

    // Save updated patterns
    this.saveUserPatterns(this.userPatterns);
  }

  // Get procrastination risk level for a task
  getProcrastinationRisk(task) {
    const now = new Date();
    const deadline = task.deadline ? new Date(task.deadline) : null;
    
    if (!deadline) return { level: 'unknown', message: 'No deadline set' };

    const timeRemaining = deadline.getTime() - now.getTime();
    const hoursRemaining = timeRemaining / (1000 * 60 * 60);
    
    const adjustedTime = this.getAdjustedEstimatedTime(task);
    const hoursNeeded = adjustedTime / 60;

    const ratio = hoursRemaining / hoursNeeded;

    if (ratio < 0) {
      return { level: 'overdue', message: 'Task is overdue!' };
    } else if (ratio < 0.5) {
      return { level: 'critical', message: 'Very high risk - start immediately!' };
    } else if (ratio < 1) {
      return { level: 'high', message: 'High risk - should start soon' };
    } else if (ratio < 1.5) {
      return { level: 'medium', message: 'Moderate risk - plan to start' };
    } else {
      return { level: 'low', message: 'Low risk - plenty of time' };
    }
  }

  // Get user patterns for display
  getUserPatterns() {
    return { ...this.userPatterns };
  }

  // Reset patterns to default (for testing or new users)
  resetPatterns() {
    this.userPatterns = this.getDefaultPatterns();
    this.saveUserPatterns(this.userPatterns);
  }
}

// Create singleton instance
const procrastinationService = new ProcrastinationService();

export default procrastinationService;