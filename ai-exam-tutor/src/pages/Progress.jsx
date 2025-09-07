import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  BookOpen,
  Clock,
  BarChart3,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Card, { StatsCard } from '../components/Card';
import ProgressChart, { 
  ProgressLineChart, 
  AccuracyAreaChart, 
  WeakTopicsChart,
  StudyProgressPie,
  DailyStudyChart,
  PerformanceComparisonChart,
  StatsDisplay
} from '../components/ProgressChart';
import { progressAPI } from '../services/api';

const Progress = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [data, setData] = useState({
    stats: [],
    progressOverTime: [],
    accuracyTrend: [],
    weakTopics: [],
    studyProgress: [],
    dailyStudy: [],
    subjectPerformance: []
  });

  useEffect(() => {
    fetchProgressData();
  }, [timeRange, selectedSubject]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const [progressRes, statsRes, weakTopicsRes] = await Promise.all([
        progressAPI.getProgress(),
        progressAPI.getStats(),
        progressAPI.getWeakTopics()
      ]);

      setData({
        stats: statsRes.data || mockStats,
        progressOverTime: progressRes.data?.progressOverTime || mockProgressOverTime,
        accuracyTrend: progressRes.data?.accuracyTrend || mockAccuracyTrend,
        weakTopics: weakTopicsRes.data || mockWeakTopics,
        studyProgress: mockStudyProgress,
        dailyStudy: mockDailyStudy,
        subjectPerformance: mockSubjectPerformance
      });
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
      setData({
        stats: mockStats,
        progressOverTime: mockProgressOverTime,
        accuracyTrend: mockAccuracyTrend,
        weakTopics: mockWeakTopics,
        studyProgress: mockStudyProgress,
        dailyStudy: mockDailyStudy,
        subjectPerformance: mockSubjectPerformance
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const mockStats = [
    { label: 'Overall Accuracy', value: '78%' },
    { label: 'Topics Completed', value: '23/45' },
    { label: 'Study Streak', value: '5 days' },
    { label: 'Total Study Time', value: '42.5h' }
  ];

  const mockProgressOverTime = [
    { date: 'Jan 1', accuracy: 65, completed: 5 },
    { date: 'Jan 8', accuracy: 68, completed: 8 },
    { date: 'Jan 15', accuracy: 72, completed: 12 },
    { date: 'Jan 22', accuracy: 75, completed: 16 },
    { date: 'Jan 29', accuracy: 78, completed: 20 },
    { date: 'Feb 5', accuracy: 80, completed: 23 }
  ];

  const mockAccuracyTrend = [
    { date: 'Jan 1', accuracy: 65 },
    { date: 'Jan 3', accuracy: 67 },
    { date: 'Jan 5', accuracy: 69 },
    { date: 'Jan 7', accuracy: 68 },
    { date: 'Jan 9', accuracy: 71 },
    { date: 'Jan 11', accuracy: 73 },
    { date: 'Jan 13', accuracy: 75 },
    { date: 'Jan 15', accuracy: 74 },
    { date: 'Jan 17', accuracy: 76 },
    { date: 'Jan 19', accuracy: 78 },
    { date: 'Jan 21', accuracy: 80 },
    { date: 'Jan 23', accuracy: 79 },
    { date: 'Jan 25', accuracy: 81 },
    { date: 'Jan 27', accuracy: 83 },
    { date: 'Jan 29', accuracy: 82 },
    { date: 'Jan 31', accuracy: 84 }
  ];

  const mockWeakTopics = [
    { topic: 'Organic Chemistry', accuracy: 45 },
    { topic: 'Calculus', accuracy: 52 },
    { topic: 'Thermodynamics', accuracy: 58 },
    { topic: 'Probability', accuracy: 61 },
    { topic: 'Mechanics', accuracy: 67 }
  ];

  const mockStudyProgress = [
    { name: 'Completed', value: 23, fill: '#10b981' },
    { name: 'In Progress', value: 8, fill: '#f59e0b' },
    { name: 'Not Started', value: 14, fill: '#ef4444' }
  ];

  const mockDailyStudy = [
    { day: 'Mon', minutes: 120 },
    { day: 'Tue', minutes: 90 },
    { day: 'Wed', minutes: 150 },
    { day: 'Thu', minutes: 105 },
    { day: 'Fri', minutes: 135 },
    { day: 'Sat', minutes: 180 },
    { day: 'Sun', minutes: 75 }
  ];

  const mockSubjectPerformance = [
    { subject: 'Physics', accuracy: 82, completion: 75 },
    { subject: 'Chemistry', accuracy: 68, completion: 60 },
    { subject: 'Mathematics', accuracy: 85, completion: 80 }
  ];

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const subjects = ['all', 'Physics', 'Chemistry', 'Mathematics'];

  const exportData = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting progress data...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Progress Analytics
            </h1>
            <p className="text-gray-600">
              Track your learning journey and identify areas for improvement
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Overall Accuracy"
            value="78%"
            icon={Target}
            trend="positive"
            change="+5% from last month"
          />
          <StatsCard
            title="Topics Completed"
            value="23/45"
            icon={BookOpen}
            trend="positive"
            change="3 completed this week"
          />
          <StatsCard
            title="Study Streak"
            value="5 days"
            icon={Award}
            trend="positive"
            change="Personal best!"
          />
          <StatsCard
            title="Study Time"
            value="42.5h"
            icon={Clock}
            trend="neutral"
            change="This month"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Over Time */}
          <ProgressLineChart 
            data={data.progressOverTime}
            title="Progress Over Time"
          />

          {/* Accuracy Trend */}
          <AccuracyAreaChart 
            data={data.accuracyTrend}
            title="Accuracy Trend"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Study Progress Pie */}
          <StudyProgressPie 
            data={data.studyProgress}
            title="Topic Progress"
          />

          {/* Daily Study Time */}
          <div className="lg:col-span-2">
            <DailyStudyChart 
              data={data.dailyStudy}
              title="Daily Study Time (This Week)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weak Topics */}
          <WeakTopicsChart 
            data={data.weakTopics}
            title="Topics Needing Attention"
          />

          {/* Subject Performance */}
          <PerformanceComparisonChart 
            data={data.subjectPerformance}
            title="Performance by Subject"
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Study Habits */}
          <Card title="Study Habits" icon={BarChart3}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average session length</span>
                <span className="text-sm font-medium text-gray-900">45 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Most productive time</span>
                <span className="text-sm font-medium text-gray-900">2:00 PM - 4:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Favorite subject</span>
                <span className="text-sm font-medium text-gray-900">Mathematics</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quiz attempts</span>
                <span className="text-sm font-medium text-gray-900">47 total</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Best quiz score</span>
                <span className="text-sm font-medium text-gray-900">95% (Physics)</span>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card title="Recent Achievements" icon={Award}>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    5-Day Study Streak
                  </p>
                  <p className="text-xs text-gray-500">
                    Achieved 2 days ago
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Quiz Master
                  </p>
                  <p className="text-xs text-gray-500">
                    Scored 90%+ on 5 quizzes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Chapter Champion
                  </p>
                  <p className="text-xs text-gray-500">
                    Completed entire Physics chapter
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Improvement Star
                  </p>
                  <p className="text-xs text-gray-500">
                    Improved accuracy by 15%
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Time Keeper
                  </p>
                  <p className="text-xs text-gray-500">
                    Studied for 40+ hours this month
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommendations */}
        <Card title="Personalized Recommendations" icon={TrendingUp} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">
                Focus on Weak Areas
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Spend more time on Organic Chemistry and Calculus to improve overall performance.
              </p>
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-200">
                View Topics
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">
                Maintain Study Streak
              </h4>
              <p className="text-sm text-green-700 mb-3">
                You're doing great! Keep up your daily study habit to reach 7 days.
              </p>
              <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                Today's Tasks
              </Button>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">
                Practice More Quizzes
              </h4>
              <p className="text-sm text-purple-700 mb-3">
                Take more practice quizzes to improve your test-taking skills and speed.
              </p>
              <Button size="sm" variant="outline" className="text-purple-600 border-purple-200">
                Take Quiz
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Progress;

