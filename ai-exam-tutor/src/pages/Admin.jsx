import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users,
  BookOpen,
  Target,
  AlertTriangle,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Card, { StatsCard } from '../components/Card';
import { adminAPI } from '../services/api';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [contentToReview, setContentToReview] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.reviewContent();
      setContentToReview(response.data || mockContentToReview);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setContentToReview(mockContentToReview);
    } finally {
      setLoading(false);
    }
  };

  const handleSyllabusUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      alert('Please upload a JSON file');
      return;
    }

    setSyllabusFile(file);
    setUploadLoading(true);

    try {
      const fileContent = await file.text();
      const syllabusData = JSON.parse(fileContent);
      
      await adminAPI.uploadSyllabus(syllabusData);
      alert('Syllabus uploaded successfully!');
      setSyllabusFile(null);
    } catch (error) {
      console.error('Failed to upload syllabus:', error);
      alert('Failed to upload syllabus. Please check the file format.');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleContentAction = async (contentId, action, reason = '') => {
    try {
      if (action === 'approve') {
        await adminAPI.approveContent(contentId);
      } else {
        await adminAPI.rejectContent(contentId, reason);
      }
      
      // Update local state
      setContentToReview(prev => 
        prev.map(content => 
          content.id === contentId 
            ? { ...content, status: action === 'approve' ? 'approved' : 'rejected' }
            : content
        )
      );
      
      setSelectedContent(null);
    } catch (error) {
      console.error('Failed to update content:', error);
      alert('Failed to update content status');
    }
  };

  // Mock data
  const mockContentToReview = [
    {
      id: 1,
      type: 'lesson',
      title: 'Quantum Mechanics Basics',
      subject: 'Physics',
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      aiGenerated: true,
      content: 'Quantum mechanics is a fundamental theory in physics that describes the behavior of matter and energy at the atomic and subatomic level...',
      metadata: {
        difficulty: 'hard',
        estimatedTime: 60,
        objectives: ['Understand wave-particle duality', 'Learn Heisenberg uncertainty principle']
      }
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Organic Chemistry Quiz',
      subject: 'Chemistry',
      status: 'pending',
      createdAt: '2024-01-14T15:45:00Z',
      aiGenerated: true,
      content: 'Quiz with 10 questions about organic chemistry fundamentals',
      metadata: {
        difficulty: 'medium',
        questionCount: 10,
        timeLimit: 30
      }
    },
    {
      id: 3,
      type: 'lesson',
      title: 'Calculus Integration',
      subject: 'Mathematics',
      status: 'approved',
      createdAt: '2024-01-13T09:15:00Z',
      aiGenerated: true,
      content: 'Integration is one of the two main operations of calculus...',
      metadata: {
        difficulty: 'medium',
        estimatedTime: 45,
        objectives: ['Master basic integration techniques', 'Solve definite integrals']
      }
    },
    {
      id: 4,
      type: 'quiz',
      title: 'Thermodynamics Practice',
      subject: 'Physics',
      status: 'rejected',
      createdAt: '2024-01-12T14:20:00Z',
      aiGenerated: true,
      content: 'Practice quiz on thermodynamics laws and applications',
      metadata: {
        difficulty: 'hard',
        questionCount: 15,
        timeLimit: 45
      }
    }
  ];

  const adminStats = [
    { label: 'Total Users', value: '1,247' },
    { label: 'Active Today', value: '89' },
    { label: 'Content Pending', value: contentToReview.filter(c => c.status === 'pending').length.toString() },
    { label: 'Lessons Created', value: '156' }
  ];

  const filteredContent = contentToReview.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage content, users, and system settings
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'syllabus' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('syllabus')}
          >
            Syllabus Management
          </Button>
          <Button
            variant={activeTab === 'content' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('content')}
          >
            Content Review
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Users"
                value="1,247"
                icon={Users}
                trend="positive"
                change="+12% this month"
              />
              <StatsCard
                title="Active Today"
                value="89"
                icon={Target}
                trend="positive"
                change="+5 from yesterday"
              />
              <StatsCard
                title="Content Pending"
                value={contentToReview.filter(c => c.status === 'pending').length.toString()}
                icon={Clock}
                trend="neutral"
              />
              <StatsCard
                title="Lessons Created"
                value="156"
                icon={BookOpen}
                trend="positive"
                change="+8 this week"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="Recent Content Submissions">
                <div className="space-y-4">
                  {contentToReview.slice(0, 5).map((content) => {
                    const StatusIcon = getStatusIcon(content.status);
                    return (
                      <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={`h-5 w-5 ${
                            content.status === 'approved' ? 'text-green-600' :
                            content.status === 'rejected' ? 'text-red-600' :
                            'text-yellow-600'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {content.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {content.subject} • {formatDate(content.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                          {content.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card title="System Health">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Response Time</span>
                    <span className="text-sm font-medium text-green-600">142ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Status</span>
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Service</span>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage Usage</span>
                    <span className="text-sm font-medium text-yellow-600">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <span className="text-sm font-medium text-blue-600">89</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Syllabus Management Tab */}
        {activeTab === 'syllabus' && (
          <div className="space-y-8">
            <Card title="Upload Syllabus" icon={Upload}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="syllabus-upload">
                    Select JSON file containing syllabus data
                  </Label>
                  <Input
                    id="syllabus-upload"
                    type="file"
                    accept=".json"
                    onChange={handleSyllabusUpload}
                    disabled={uploadLoading}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a JSON file with exam syllabus, topics, and learning objectives
                  </p>
                </div>

                {syllabusFile && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Selected: {syllabusFile.name}
                    </p>
                  </div>
                )}

                {uploadLoading && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Processing syllabus...</span>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Syllabus Format Example">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`{
  "exam": "JEE Main",
  "subjects": [
    {
      "name": "Physics",
      "chapters": [
        {
          "title": "Mechanics",
          "topics": [
            "Newton's Laws of Motion",
            "Work, Energy and Power",
            "Rotational Motion"
          ],
          "difficulty": "medium",
          "weightage": 15
        }
      ]
    }
  ]
}`}
                </pre>
              </div>
            </Card>

            <Card title="Current Syllabi">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">JEE Main & Advanced</p>
                    <p className="text-sm text-gray-600">Last updated: Jan 10, 2024</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">NEET</p>
                    <p className="text-sm text-gray-600">Last updated: Jan 8, 2024</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Content Review Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-600">
                  {filteredContent.length} items found
                </div>
              </div>
            </Card>

            {/* Content List */}
            <div className="space-y-4">
              {filteredContent.map((content) => {
                const StatusIcon = getStatusIcon(content.status);
                return (
                  <Card key={content.id} className="hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            content.type === 'lesson' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {content.type === 'lesson' ? (
                              <BookOpen className={`h-5 w-5 ${
                                content.type === 'lesson' ? 'text-blue-600' : 'text-green-600'
                              }`} />
                            ) : (
                              <Target className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {content.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status)}`}>
                              {content.status}
                            </span>
                            {content.aiGenerated && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                AI Generated
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>{content.subject}</span>
                            <span>•</span>
                            <span>{content.type}</span>
                            <span>•</span>
                            <span>{formatDate(content.createdAt)}</span>
                          </div>
                          
                          <p className="text-gray-700 text-sm mb-3">
                            {content.content.substring(0, 150)}...
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Difficulty: {content.metadata.difficulty}</span>
                            {content.metadata.estimatedTime && (
                              <span>Duration: {content.metadata.estimatedTime} min</span>
                            )}
                            {content.metadata.questionCount && (
                              <span>Questions: {content.metadata.questionCount}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedContent(content)}
                        >
                          Review
                        </Button>
                        {content.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleContentAction(content.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContentAction(content.id, 'reject', 'Needs revision')}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredContent.length === 0 && (
              <Card className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No content found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Content Review Modal */}
        {selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Review Content
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedContent(null)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {selectedContent.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{selectedContent.subject}</span>
                      <span>•</span>
                      <span>{selectedContent.type}</span>
                      <span>•</span>
                      <span>{formatDate(selectedContent.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Content</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedContent.content}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                    <pre className="text-sm text-gray-700">
                      {JSON.stringify(selectedContent.metadata, null, 2)}
                    </pre>
                  </div>
                  
                  {selectedContent.status === 'pending' && (
                    <div className="flex space-x-4 pt-4 border-t">
                      <Button
                        onClick={() => handleContentAction(selectedContent.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleContentAction(selectedContent.id, 'reject', 'Needs revision')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

