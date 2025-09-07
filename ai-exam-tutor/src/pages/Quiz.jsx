import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Target, 
  Clock, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Trophy
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import Card from '../components/Card';
import QuizQuestion from '../components/QuizQuestion';
import { quizAPI } from '../services/api';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            handleSubmit();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuiz(id);
      const quizData = response.data || mockQuiz;
      setQuiz(quizData);
      setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
    } catch (error) {
      console.error('Failed to fetch quiz:', error);
      setQuiz(mockQuiz);
      setTimeLeft(mockQuiz.timeLimit * 60);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    
    setIsActive(false);
    setIsSubmitted(true);

    try {
      const response = await quizAPI.submitQuizAttempt(id, answers);
      setResults(response.data);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      // Mock results for development
      const score = Object.keys(answers).reduce((total, qIndex) => {
        return total + (answers[qIndex] === quiz.questions[qIndex].correctAnswer ? 1 : 0);
      }, 0);
      
      setResults({
        score,
        totalQuestions: quiz.questions.length,
        percentage: Math.round((score / quiz.questions.length) * 100),
        passed: score >= quiz.passingScore,
        timeSpent: quiz.timeLimit * 60 - timeLeft,
        correctAnswers: quiz.questions.map((q, index) => ({
          questionIndex: index,
          correct: answers[index] === q.correctAnswer,
          selectedAnswer: answers[index],
          correctAnswer: q.correctAnswer
        }))
      });
    }
  };

  const startQuiz = () => {
    setIsActive(true);
  };

  const pauseQuiz = () => {
    setIsActive(false);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(quiz.timeLimit * 60);
    setIsActive(false);
    setIsSubmitted(false);
    setResults(null);
    setShowReview(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / (quiz?.timeLimit * 60)) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Mock quiz data
  const mockQuiz = {
    id: 1,
    title: 'Physics - Mechanics Quiz',
    description: 'Test your understanding of Newton\'s laws and motion',
    subject: 'Physics',
    difficulty: 'medium',
    timeLimit: 30, // minutes
    passingScore: 7, // out of 10
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        question: 'What is Newton\'s First Law of Motion also known as?',
        options: [
          'Law of Acceleration',
          'Law of Inertia',
          'Law of Action-Reaction',
          'Law of Gravity'
        ],
        correctAnswer: 1,
        explanation: 'Newton\'s First Law is also known as the Law of Inertia, which states that objects at rest stay at rest and objects in motion stay in motion unless acted upon by an external force.'
      },
      {
        id: 2,
        question: 'If a 5 kg object accelerates at 2 m/s², what is the net force acting on it?',
        options: [
          '2.5 N',
          '7 N',
          '10 N',
          '3 N'
        ],
        correctAnswer: 2,
        explanation: 'Using Newton\'s Second Law: F = ma = 5 kg × 2 m/s² = 10 N'
      },
      {
        id: 3,
        question: 'According to Newton\'s Third Law, if you push a wall with 50 N of force, how much force does the wall exert back on you?',
        options: [
          '25 N',
          '50 N',
          '100 N',
          '0 N'
        ],
        correctAnswer: 1,
        explanation: 'Newton\'s Third Law states that for every action, there is an equal and opposite reaction. So the wall pushes back with exactly 50 N of force.'
      },
      {
        id: 4,
        question: 'What happens to an object\'s acceleration if the net force doubles while mass remains constant?',
        options: [
          'Acceleration halves',
          'Acceleration remains the same',
          'Acceleration doubles',
          'Acceleration quadruples'
        ],
        correctAnswer: 2,
        explanation: 'From F = ma, if force doubles and mass stays constant, acceleration must double to maintain the equation.'
      },
      {
        id: 5,
        question: 'Which of the following is an example of Newton\'s First Law?',
        options: [
          'A rocket launching into space',
          'A book sliding across a table eventually stops',
          'A passenger lurching forward when a car brakes suddenly',
          'A heavier object falling faster than a lighter one'
        ],
        correctAnswer: 2,
        explanation: 'A passenger lurching forward when a car brakes demonstrates inertia - the passenger\'s body continues moving forward due to Newton\'s First Law.'
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz not found</h2>
          <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Quiz not started yet
  if (!isActive && !isSubmitted && Object.keys(answers).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="text-center p-8">
            <Target className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {quiz.title}
            </h1>
            <p className="text-gray-600 mb-6">
              {quiz.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {quiz.totalQuestions}
                </div>
                <div className="text-sm text-blue-700">Questions</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {quiz.timeLimit}
                </div>
                <div className="text-sm text-green-700">Minutes</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {quiz.passingScore}
                </div>
                <div className="text-sm text-purple-700">Passing Score</div>
              </div>
            </div>

            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Read each question carefully</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">You can navigate between questions</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Timer will start when you begin</span>
              </div>
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-700">Quiz will auto-submit when time expires</span>
              </div>
            </div>

            <Button onClick={startQuiz} size="lg">
              <Play className="mr-2 h-5 w-5" />
              Start Quiz
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz results
  if (isSubmitted && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center p-8">
            <div className="mb-6">
              {results.passed ? (
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              ) : (
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              )}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Quiz Complete!
              </h1>
              <p className="text-gray-600">
                {results.passed ? 'Congratulations! You passed the quiz.' : 'Keep studying and try again.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {results.score}/{results.totalQuestions}
                </div>
                <div className="text-sm text-blue-700">Score</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {results.percentage}%
                </div>
                <div className="text-sm text-green-700">Accuracy</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatTime(results.timeSpent)}
                </div>
                <div className="text-sm text-purple-700">Time Spent</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => setShowReview(true)}
              >
                Review Answers
              </Button>
              <Button
                variant="outline"
                onClick={resetQuiz}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                Continue Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz review mode
  if (showReview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowReview(false)}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Results
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Quiz Review
            </h1>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <QuizQuestion
                key={index}
                question={question.question}
                options={question.options}
                correctAnswer={question.correctAnswer}
                selectedAnswer={answers[index]}
                showResult={true}
                explanation={question.explanation}
                questionNumber={index + 1}
                totalQuestions={quiz.questions.length}
                disabled={true}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active quiz
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Quiz
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {quiz.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`text-right ${getTimeColor()}`}>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="text-lg font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={isActive ? pauseQuiz : startQuiz}
            >
              {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Question */}
        <QuizQuestion
          question={currentQ.question}
          options={currentQ.options}
          selectedAnswer={answers[currentQuestion]}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestion + 1}
          totalQuestions={quiz.questions.length}
          disabled={!isActive}
        />

        {/* Navigation */}
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {Object.keys(answers).length} of {quiz.questions.length} answered
              </span>
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length === 0}
              >
                Submit Quiz
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Question Navigator */}
        <Card className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Question Navigator
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[index] !== undefined
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;

