import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import Card from '../components/Card';
import QuizQuestion from '../components/QuizQuestion';
import { lessonsAPI } from '../services/api';

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [currentSection, setCurrentSection] = useState('notes');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [readingTime, setReadingTime] = useState(0);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [id]);

  useEffect(() => {
    let interval;
    if (isReading) {
      interval = setInterval(() => {
        setReadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isReading]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await lessonsAPI.getLesson(id);
      setLesson(response.data || mockLesson);
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
      setLesson(mockLesson);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleQuizSubmit = async () => {
    try {
      const response = await lessonsAPI.submitQuizAnswer(id, quizAnswers);
      setQuizResults(response.data);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      // Mock results for development
      const mockResults = {
        score: Object.keys(quizAnswers).reduce((score, qIndex) => {
          return score + (quizAnswers[qIndex] === lesson.quiz[qIndex].correctAnswer ? 1 : 0);
        }, 0),
        totalQuestions: lesson.quiz.length,
        passed: true
      };
      setQuizResults(mockResults);
      setQuizSubmitted(true);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock lesson data
  const mockLesson = {
    id: 1,
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    difficulty: 'medium',
    estimatedTime: 45,
    description: 'Understanding the three fundamental laws that govern motion',
    objectives: [
      'Understand Newton\'s First Law (Law of Inertia)',
      'Apply Newton\'s Second Law (F = ma)',
      'Analyze Newton\'s Third Law (Action-Reaction)',
      'Solve problems using Newton\'s laws'
    ],
    content: {
      introduction: `Newton's laws of motion are three fundamental principles that describe the relationship between the motion of an object and the forces acting on it. These laws form the foundation of classical mechanics and are essential for understanding how objects move in our everyday world.`,
      
      sections: [
        {
          title: 'Newton\'s First Law - Law of Inertia',
          content: `Newton's first law states that an object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.

This law introduces the concept of inertia - the tendency of objects to resist changes in their state of motion. The more massive an object is, the greater its inertia.

**Key Points:**
- Objects naturally resist changes in motion
- A net force is required to change an object's velocity
- Inertia depends on mass

**Examples:**
- A book on a table remains at rest until pushed
- A hockey puck sliding on ice continues moving until friction stops it
- Passengers in a car lurch forward when the car suddenly stops`
        },
        {
          title: 'Newton\'s Second Law - F = ma',
          content: `Newton's second law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

Mathematically: **F = ma**

Where:
- F = Net force (Newtons)
- m = Mass (kilograms)  
- a = Acceleration (m/s²)

**Key Points:**
- Force and acceleration are directly proportional
- Mass and acceleration are inversely proportional
- The direction of acceleration is the same as the direction of net force

**Applications:**
- Calculating the force needed to accelerate a car
- Determining how much force is needed to lift an object
- Understanding why heavier objects are harder to accelerate`
        },
        {
          title: 'Newton\'s Third Law - Action-Reaction',
          content: `Newton's third law states that for every action, there is an equal and opposite reaction.

When object A exerts a force on object B, object B simultaneously exerts a force equal in magnitude and opposite in direction on object A.

**Key Points:**
- Forces always occur in pairs
- Action and reaction forces act on different objects
- The forces are equal in magnitude but opposite in direction

**Examples:**
- Walking: You push backward on the ground, the ground pushes forward on you
- Swimming: You push water backward, water pushes you forward
- Rocket propulsion: Hot gases are expelled downward, rocket is pushed upward`
        }
      ],
      
      summary: `Newton's three laws of motion provide a complete framework for understanding how forces affect motion:

1. **First Law (Inertia)**: Objects resist changes in motion
2. **Second Law (F=ma)**: Force equals mass times acceleration  
3. **Third Law (Action-Reaction)**: Forces occur in equal and opposite pairs

These laws apply to everything from atoms to planets and form the basis for engineering, sports science, and space exploration.`
    },
    
    quiz: [
      {
        question: 'According to Newton\'s First Law, what happens to an object in motion when no net force acts on it?',
        options: [
          'It gradually slows down and stops',
          'It continues moving at constant velocity',
          'It accelerates in the direction of motion',
          'It changes direction randomly'
        ],
        correctAnswer: 1,
        explanation: 'Newton\'s First Law states that an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.'
      },
      {
        question: 'If a 10 kg object experiences a net force of 50 N, what is its acceleration?',
        options: [
          '5 m/s²',
          '10 m/s²',
          '50 m/s²',
          '500 m/s²'
        ],
        correctAnswer: 0,
        explanation: 'Using Newton\'s Second Law: F = ma, so a = F/m = 50 N / 10 kg = 5 m/s²'
      },
      {
        question: 'When you walk forward, what force propels you according to Newton\'s Third Law?',
        options: [
          'The force of your muscles pushing your body forward',
          'The force of gravity pulling you down',
          'The force of the ground pushing back on your feet',
          'The force of air resistance'
        ],
        correctAnswer: 2,
        explanation: 'According to Newton\'s Third Law, when you push backward on the ground with your feet, the ground pushes forward on you with equal force, propelling you forward.'
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lesson not found</h2>
          <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/study-plan')}>
            Back to Study Plan
          </Button>
        </div>
      </div>
    );
  }

  const progress = currentSection === 'notes' ? 
    (isReading ? Math.min(100, (readingTime / (lesson.estimatedTime * 60)) * 100) : 0) :
    (quizSubmitted ? 100 : (Object.keys(quizAnswers).length / lesson.quiz.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/study-plan')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Study Plan
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Reading Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatTime(readingTime)}
              </p>
            </div>
            {currentSection === 'notes' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReading(!isReading)}
              >
                {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* Lesson Info */}
        <Card className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {lesson.subject}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  lesson.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  lesson.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {lesson.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              <p className="text-gray-600 mb-4">
                {lesson.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {lesson.estimatedTime} min
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  {lesson.objectives.length} objectives
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentSection === 'notes' ? 'Reading Progress' : 'Quiz Progress'}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={currentSection === 'notes' ? 'default' : 'ghost'}
            onClick={() => setCurrentSection('notes')}
            className="flex-1"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Lesson Notes
          </Button>
          <Button
            variant={currentSection === 'quiz' ? 'default' : 'ghost'}
            onClick={() => setCurrentSection('quiz')}
            className="flex-1"
          >
            <Target className="mr-2 h-4 w-4" />
            Practice Quiz
          </Button>
        </div>

        {/* Content */}
        {currentSection === 'notes' ? (
          <div className="space-y-6">
            {/* Learning Objectives */}
            <Card title="Learning Objectives">
              <ul className="space-y-2">
                {lesson.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Introduction */}
            <Card title="Introduction">
              <p className="text-gray-700 leading-relaxed">
                {lesson.content.introduction}
              </p>
            </Card>

            {/* Content Sections */}
            {lesson.content.sections.map((section, index) => (
              <Card key={index} title={section.title}>
                <div className="prose prose-gray max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                      {paragraph.split('\n').map((line, lIndex) => (
                        <span key={lIndex}>
                          {line.startsWith('**') && line.endsWith('**') ? (
                            <strong className="font-semibold text-gray-900">
                              {line.slice(2, -2)}
                            </strong>
                          ) : line.startsWith('- ') ? (
                            <span className="block ml-4 relative">
                              <span className="absolute -ml-4">•</span>
                              {line.slice(2)}
                            </span>
                          ) : (
                            line
                          )}
                          {lIndex < paragraph.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </Card>
            ))}

            {/* Summary */}
            <Card title="Summary">
              <div className="prose prose-gray max-w-none">
                {lesson.content.summary.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                    {paragraph.split('\n').map((line, lIndex) => (
                      <span key={lIndex}>
                        {line.startsWith('**') && line.endsWith('**') ? (
                          <strong className="font-semibold text-gray-900">
                            {line.slice(2, -2)}
                          </strong>
                        ) : line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') ? (
                          <span className="block ml-4">
                            {line}
                          </span>
                        ) : (
                          line
                        )}
                        {lIndex < paragraph.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </Card>

            {/* Next Steps */}
            <Card>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Great job reading the lesson!
                </h3>
                <p className="text-gray-600 mb-4">
                  Now test your understanding with the practice quiz.
                </p>
                <Button onClick={() => setCurrentSection('quiz')}>
                  Take Practice Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quiz Header */}
            <Card>
              <div className="text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Practice Quiz
                </h2>
                <p className="text-gray-600">
                  Test your understanding of {lesson.title}
                </p>
                {quizSubmitted && quizResults && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-lg font-semibold text-blue-900">
                      Score: {quizResults.score}/{quizResults.totalQuestions}
                    </p>
                    <p className="text-sm text-blue-700">
                      {Math.round((quizResults.score / quizResults.totalQuestions) * 100)}% Correct
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Quiz Questions */}
            {lesson.quiz.map((question, index) => (
              <QuizQuestion
                key={index}
                question={question.question}
                options={question.options}
                correctAnswer={question.correctAnswer}
                selectedAnswer={quizAnswers[index]}
                onAnswerSelect={(answerIndex) => handleQuizAnswer(index, answerIndex)}
                showResult={quizSubmitted}
                explanation={question.explanation}
                questionNumber={index + 1}
                totalQuestions={lesson.quiz.length}
                disabled={quizSubmitted}
              />
            ))}

            {/* Quiz Actions */}
            <Card>
              <div className="flex justify-center space-x-4">
                {!quizSubmitted ? (
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length !== lesson.quiz.length}
                    size="lg"
                  >
                    Submit Quiz
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={resetQuiz}
                      size="lg"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Retake Quiz
                    </Button>
                    <Button
                      onClick={() => navigate('/study-plan')}
                      size="lg"
                    >
                      Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lesson;

