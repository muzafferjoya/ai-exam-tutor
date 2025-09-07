import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Target, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Card from '../components/Card';
import { onboardingAPI } from '../services/api';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    exam: '',
    targetDate: '',
    dailyStudyHours: 2,
    currentLevel: 'beginner',
    subjects: [],
    goals: []
  });

  const exams = [
    { 
      id: 'jee', 
      name: 'JEE Main & Advanced', 
      subjects: ['Physics', 'Chemistry', 'Mathematics'],
      description: 'Joint Entrance Examination for Engineering'
    },
    { 
      id: 'neet', 
      name: 'NEET', 
      subjects: ['Physics', 'Chemistry', 'Biology'],
      description: 'National Eligibility cum Entrance Test for Medical'
    },
    { 
      id: 'cat', 
      name: 'CAT', 
      subjects: ['Quantitative Aptitude', 'Verbal Ability', 'Data Interpretation'],
      description: 'Common Admission Test for MBA'
    },
    { 
      id: 'gate', 
      name: 'GATE', 
      subjects: ['Engineering Mathematics', 'Core Engineering', 'General Aptitude'],
      description: 'Graduate Aptitude Test in Engineering'
    },
    { 
      id: 'upsc', 
      name: 'UPSC Civil Services', 
      subjects: ['General Studies', 'Optional Subject', 'Essay'],
      description: 'Civil Services Examination'
    },
    { 
      id: 'ssc', 
      name: 'SSC CGL', 
      subjects: ['General Intelligence', 'General Awareness', 'Quantitative Aptitude'],
      description: 'Staff Selection Commission Combined Graduate Level'
    },
  ];

  const studyHours = [
    { value: 1, label: '1 hour/day', description: 'Light preparation' },
    { value: 2, label: '2 hours/day', description: 'Moderate preparation' },
    { value: 3, label: '3 hours/day', description: 'Intensive preparation' },
    { value: 4, label: '4 hours/day', description: 'Very intensive preparation' },
    { value: 5, label: '5+ hours/day', description: 'Maximum preparation' },
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner', description: 'Just starting preparation' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some preparation done' },
    { value: 'advanced', label: 'Advanced', description: 'Well-prepared, need fine-tuning' },
  ];

  const goals = [
    { id: 'improve_accuracy', label: 'Improve accuracy' },
    { id: 'increase_speed', label: 'Increase solving speed' },
    { id: 'cover_syllabus', label: 'Complete syllabus coverage' },
    { id: 'practice_more', label: 'More practice questions' },
    { id: 'weak_topics', label: 'Focus on weak topics' },
    { id: 'time_management', label: 'Better time management' },
  ];

  useEffect(() => {
    // Check if exam was pre-selected from landing page
    const selectedExam = localStorage.getItem('selectedExam');
    if (selectedExam) {
      setFormData(prev => ({ ...prev, exam: selectedExam }));
      localStorage.removeItem('selectedExam');
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleGoalToggle = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.exam !== '';
      case 2:
        return formData.targetDate !== '';
      case 3:
        return formData.dailyStudyHours > 0;
      case 4:
        return formData.subjects.length > 0;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      setError('');
    } else {
      setError('Please complete all required fields before continuing.');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onboardingAPI.saveOnboarding(formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save your preferences. Please try again.');
    }

    setLoading(false);
  };

  const selectedExam = exams.find(exam => exam.id === formData.exam);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Target Exam
              </h2>
              <p className="text-gray-600">
                Select the exam you're preparing for
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.exam === exam.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => handleInputChange('exam', exam.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.exam === exam.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.exam === exam.id && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{exam.description}</p>
                  <p className="text-xs text-gray-500">
                    Subjects: {exam.subjects.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Set Your Target Date
              </h2>
              <p className="text-gray-600">
                When is your {selectedExam?.name} exam?
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Label htmlFor="targetDate">Exam Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
              {formData.targetDate && (
                <p className="mt-2 text-sm text-gray-600">
                  That's {Math.ceil((new Date(formData.targetDate) - new Date()) / (1000 * 60 * 60 * 24))} days from today
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Daily Study Time
              </h2>
              <p className="text-gray-600">
                How many hours can you study per day?
              </p>
            </div>

            <div className="space-y-3">
              {studyHours.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.dailyStudyHours === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => handleInputChange('dailyStudyHours', option.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.dailyStudyHours === option.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.dailyStudyHours === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Subjects
              </h2>
              <p className="text-gray-600">
                Which subjects do you want to focus on?
              </p>
            </div>

            <div className="space-y-3">
              {selectedExam?.subjects.map((subject) => (
                <div
                  key={subject}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.subjects.includes(subject)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => handleSubjectToggle(subject)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{subject}</h3>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      formData.subjects.includes(subject)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.subjects.includes(subject) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Goals
              </h2>
              <p className="text-gray-600">
                What do you want to achieve? (Optional)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.goals.includes(goal.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      formData.goals.includes(goal.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.goals.includes(goal.id) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{goal.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="currentLevel">Current Preparation Level</Label>
                <div className="mt-2 space-y-2">
                  {levels.map((level) => (
                    <div
                      key={level.value}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.currentLevel === level.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('currentLevel', level.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{level.label}</h4>
                          <p className="text-sm text-gray-600">{level.description}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formData.currentLevel === level.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.currentLevel === level.value && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of 5
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / 5) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-8">
          {renderStep()}

          {/* Error message */}
          {error && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < 5 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Setting up...' : 'Complete Setup'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;

