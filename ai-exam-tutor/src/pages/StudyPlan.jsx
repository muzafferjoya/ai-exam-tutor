import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Target,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Card, { TaskCard } from '../components/Card';
import { studyPlanAPI } from '../services/api';

const StudyPlan = () => {
  const [loading, setLoading] = useState(true);
  const [studyPlan, setStudyPlan] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchStudyPlan();
  }, []);

  const fetchStudyPlan = async () => {
    try {
      setLoading(true);
      const response = await studyPlanAPI.getStudyPlan();
      setStudyPlan(response.data || mockStudyPlan);
    } catch (error) {
      console.error('Failed to fetch study plan:', error);
      setStudyPlan(mockStudyPlan);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicComplete = async (topicId, completed) => {
    try {
      await studyPlanAPI.updateProgress(topicId, completed);
      setStudyPlan(prev => 
        prev.map(week => ({
          ...week,
          days: week.days.map(day => ({
            ...day,
            topics: day.topics.map(topic => 
              topic.id === topicId ? { ...topic, completed } : topic
            )
          }))
        }))
      );
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  // Mock data for development
  const mockStudyPlan = [
    {
      week: 1,
      startDate: '2024-01-15',
      endDate: '2024-01-21',
      days: [
        {
          date: '2024-01-15',
          dayName: 'Monday',
          topics: [
            {
              id: 1,
              title: 'Newton\'s Laws of Motion',
              subject: 'Physics',
              type: 'lesson',
              duration: 45,
              difficulty: 'medium',
              completed: true,
              description: 'Understanding the three fundamental laws of motion'
            },
            {
              id: 2,
              title: 'Kinematics Practice',
              subject: 'Physics',
              type: 'quiz',
              duration: 30,
              difficulty: 'easy',
              completed: false,
              description: '15 practice questions on motion in one dimension'
            }
          ]
        },
        {
          date: '2024-01-16',
          dayName: 'Tuesday',
          topics: [
            {
              id: 3,
              title: 'Organic Chemistry Basics',
              subject: 'Chemistry',
              type: 'lesson',
              duration: 50,
              difficulty: 'hard',
              completed: false,
              description: 'Introduction to organic compounds and nomenclature'
            },
            {
              id: 4,
              title: 'Algebra Review',
              subject: 'Mathematics',
              type: 'review',
              duration: 25,
              difficulty: 'easy',
              completed: false,
              description: 'Quick review of algebraic expressions and equations'
            }
          ]
        },
        // Add more days...
      ]
    },
    {
      week: 2,
      startDate: '2024-01-22',
      endDate: '2024-01-28',
      days: [
        {
          date: '2024-01-22',
          dayName: 'Monday',
          topics: [
            {
              id: 5,
              title: 'Thermodynamics',
              subject: 'Physics',
              type: 'lesson',
              duration: 60,
              difficulty: 'hard',
              completed: false,
              description: 'Laws of thermodynamics and heat engines'
            }
          ]
        }
        // Add more days...
      ]
    }
  ];

  const subjects = ['all', 'Physics', 'Chemistry', 'Mathematics'];
  const statuses = ['all', 'completed', 'pending'];

  const filteredStudyPlan = studyPlan.map(week => ({
    ...week,
    days: week.days.map(day => ({
      ...day,
      topics: day.topics.filter(topic => {
        const subjectMatch = filterSubject === 'all' || topic.subject === filterSubject;
        const statusMatch = filterStatus === 'all' || 
          (filterStatus === 'completed' && topic.completed) ||
          (filterStatus === 'pending' && !topic.completed);
        return subjectMatch && statusMatch;
      })
    }))
  }));

  const currentWeek = filteredStudyPlan[selectedWeek];

  const getTopicIcon = (type) => {
    switch (type) {
      case 'lesson': return BookOpen;
      case 'quiz': return Target;
      case 'review': return Clock;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Physics': return 'text-blue-600 bg-blue-100';
      case 'Chemistry': return 'text-green-600 bg-green-100';
      case 'Mathematics': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (dateString) => {
    const today = new Date().toDateString();
    const date = new Date(dateString).toDateString();
    return today === date;
  };

  const getTotalTopics = () => {
    return studyPlan.reduce((total, week) => 
      total + week.days.reduce((dayTotal, day) => dayTotal + day.topics.length, 0), 0
    );
  };

  const getCompletedTopics = () => {
    return studyPlan.reduce((total, week) => 
      total + week.days.reduce((dayTotal, day) => 
        dayTotal + day.topics.filter(topic => topic.completed).length, 0
      ), 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your study plan...</p>
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
              Study Plan
            </h1>
            <p className="text-gray-600">
              Your personalized day-by-day learning schedule
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Overall Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {Math.round((getCompletedTopics() / getTotalTopics()) * 100)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {getCompletedTopics()} of {getTotalTopics()} topics
                </p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(getCompletedTopics() / getTotalTopics()) * 100}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  This Week
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  Week {selectedWeek + 1}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentWeek && formatDate(currentWeek.startDate)} - {currentWeek && formatDate(currentWeek.endDate)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Today's Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {currentWeek?.days.find(day => isToday(day.date))?.topics.length || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Topics to complete
                </p>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Filters and Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
                disabled={selectedWeek === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700">
                Week {selectedWeek + 1} of {studyPlan.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(Math.min(studyPlan.length - 1, selectedWeek + 1))}
                disabled={selectedWeek === studyPlan.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterSubject} onValueChange={setFilterSubject}>
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
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? 'All Status' : 
                     status === 'completed' ? 'Completed' : 'Pending'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Study Plan Content */}
        {currentWeek && (
          <div className="space-y-6">
            {currentWeek.days.map((day) => (
              <Card key={day.date} className="overflow-hidden">
                <div className={`p-4 border-b ${isToday(day.date) ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isToday(day.date) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <span className="text-sm font-semibold">
                          {new Date(day.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {day.dayName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(day.date)}
                          {isToday(day.date) && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Today
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {day.topics.filter(t => t.completed).length} of {day.topics.length} completed
                      </p>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${day.topics.length > 0 ? (day.topics.filter(t => t.completed).length / day.topics.length) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {day.topics.length > 0 ? (
                    <div className="space-y-4">
                      {day.topics.map((topic) => {
                        const Icon = getTopicIcon(topic.type);
                        return (
                          <div
                            key={topic.id}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              topic.completed
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 hover:border-blue-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className={`p-2 rounded-lg ${
                                  topic.completed ? 'bg-green-100' : 'bg-blue-100'
                                }`}>
                                  <Icon className={`h-5 w-5 ${
                                    topic.completed ? 'text-green-600' : 'text-blue-600'
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">
                                    {topic.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-3">
                                    {topic.description}
                                  </p>
                                  <div className="flex items-center space-x-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(topic.subject)}`}>
                                      {topic.subject}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                                      {topic.difficulty}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {topic.duration} min
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                {topic.completed ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTopicComplete(topic.id, false)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                    Completed
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleTopicComplete(topic.id, true)}
                                    >
                                      Mark Complete
                                    </Button>
                                    <Link to={`/${topic.type}/${topic.id}`}>
                                      <Button size="sm">
                                        Start
                                      </Button>
                                    </Link>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-600">No topics scheduled for this day</p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlan;

