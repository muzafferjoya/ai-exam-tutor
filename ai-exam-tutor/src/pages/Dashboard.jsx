import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Clock, 
  Award,
  ChevronRight,
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import Card, { StatsCard, TaskCard } from '../components/Card';
import ProgressChart, { WeakTopicsChart, StatsDisplay } from '../components/ProgressChart';
import { dashboardAPI, progressAPI } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    todaysTasks: [],
    streak: 0,
    weakTopics: [],
    stats: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data
      const [tasksRes, streakRes, weakTopicsRes, statsRes] = await Promise.all([
        dashboardAPI.getTodaysTasks(),
        dashboardAPI.getStreak(),
        dashboardAPI.getWeakTopicsChart(),
        progressAPI.getStats()
      ]);

      setData({
        todaysTasks: tasksRes.data || mockTasks,
        streak: streakRes.data?.streak || 5,
        weakTopics: weakTopicsRes.data || mockWeakTopics,
        stats: statsRes.data || mockStats,
        recentActivity: mockRecentActivity
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use mock data as fallback
      setData({
        todaysTasks: mockTasks,
        streak: 5,
        weakTopics: mockWeakTopics,
        stats: mockStats,
        recentActivity: mockRecentActivity
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const mockTasks = [
    {
      id: 1,
      title: 'Physics - Mechanics',
      description: 'Complete lesson on Newton\'s Laws',
      type: 'lesson',
      status: 'pending',
      dueTime: '10:00 AM',
      progress: 0,
      estimatedTime: 45
    },
    {
      id: 2,
      title: 'Mathematics Quiz',
      description: 'Algebra practice questions',
      type: 'quiz',
      status: 'pending',
      dueTime: '2:00 PM',
      progress: 0,
      estimatedTime: 30
    },
    {
      id: 3,
      title: 'Chemistry - Organic',
      description: 'Review previous lesson notes',
      type: 'review',
      status: 'completed',
      dueTime: '9:00 AM',
      progress: 100,
      estimatedTime: 20
    }
  ];

  const mockWeakTopics = [
    { topic: 'Organic Chemistry', accuracy: 45 },
    { topic: 'Calculus', accuracy: 52 },
    { topic: 'Thermodynamics', accuracy: 58 },
    { topic: 'Probability', accuracy: 61 },
    { topic: 'Mechanics', accuracy: 67 }
  ];

  const mockStats = [
    { label: 'Study Streak', value: '5 days' },
    { label: 'Topics Completed', value: '23/45' },
    { label: 'Average Accuracy', value: '78%' },
    { label: 'Time Studied', value: '12.5h' }
  ];

  const mockRecentActivity = [
    { id: 1, type: 'lesson', title: 'Completed Physics - Waves', time: '2 hours ago' },
    { id: 2, type: 'quiz', title: 'Scored 85% in Math Quiz', time: '4 hours ago' },
    { id: 3, type: 'achievement', title: 'Reached 5-day study streak!', time: '1 day ago' }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'quiz': return Target;
      case 'review': return Clock;
      default: return BookOpen;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'quiz': return Target;
      case 'achievement': return Award;
      default: return CheckCircle;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to continue your learning journey? Here's what's planned for today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Study Streak"
            value={`${data.streak} days`}
            icon={Award}
            trend="positive"
            change="+1 from yesterday"
          />
          <StatsCard
            title="Today's Progress"
            value={`${data.todaysTasks.filter(t => t.status === 'completed').length}/${data.todaysTasks.length}`}
            icon={Target}
            trend="neutral"
          />
          <StatsCard
            title="Average Accuracy"
            value="78%"
            icon={TrendingUp}
            trend="positive"
            change="+5% this week"
          />
          <StatsCard
            title="Time Studied"
            value="2.5h"
            icon={Clock}
            trend="neutral"
            change="Today"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Tasks */}
            <Card title="Today's Tasks" icon={Calendar}>
              <div className="space-y-4">
                {data.todaysTasks.length > 0 ? (
                  data.todaysTasks.map((task) => {
                    const Icon = getTaskIcon(task.type);
                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          task.status === 'completed'
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`p-2 rounded-lg ${
                              task.status === 'completed'
                                ? 'bg-green-100'
                                : 'bg-blue-100'
                            }`}>
                              <Icon className={`h-5 w-5 ${
                                task.status === 'completed'
                                  ? 'text-green-600'
                                  : 'text-blue-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {task.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>Due: {task.dueTime}</span>
                                <span>~{task.estimatedTime} min</span>
                                <span className={`px-2 py-1 rounded-full ${
                                  task.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {task.status === 'completed' ? 'Completed' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                          {task.status !== 'completed' && (
                            <Button size="sm" className="ml-4">
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                        </div>
                        {task.progress > 0 && task.status !== 'completed' && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      All caught up!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      You've completed all your tasks for today. Great job!
                    </p>
                    <Link to="/study-plan">
                      <Button>
                        View Study Plan
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Weak Topics Chart */}
            <WeakTopicsChart 
              data={data.weakTopics} 
              title="Topics Needing Attention"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Link to="/quiz/random">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="mr-2 h-4 w-4" />
                    Take Random Quiz
                  </Button>
                </Link>
                <Link to="/study-plan">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Study Plan
                  </Button>
                </Link>
                <Link to="/progress">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Check Progress
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card title="Recent Activity">
              <div className="space-y-4">
                {data.recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Study Streak */}
            <Card title="Study Streak" icon={Award}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {data.streak}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Days in a row
                </p>
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full ${
                        i < data.streak ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Keep it up! Study tomorrow to extend your streak.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

