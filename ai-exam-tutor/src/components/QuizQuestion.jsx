import { useState } from 'react';
import { CheckCircle, XCircle, Circle } from 'lucide-react';
import { Button } from './ui/button';
import Card from './Card';

const QuizQuestion = ({ 
  question, 
  options, 
  correctAnswer, 
  selectedAnswer, 
  onAnswerSelect, 
  showResult = false,
  explanation,
  questionNumber,
  totalQuestions,
  disabled = false
}) => {
  const [localSelected, setLocalSelected] = useState(selectedAnswer);

  const handleOptionSelect = (optionIndex) => {
    if (disabled || showResult) return;
    
    setLocalSelected(optionIndex);
    if (onAnswerSelect) {
      onAnswerSelect(optionIndex);
    }
  };

  const getOptionIcon = (optionIndex) => {
    if (!showResult) {
      return localSelected === optionIndex ? CheckCircle : Circle;
    }

    if (optionIndex === correctAnswer) {
      return CheckCircle;
    } else if (optionIndex === localSelected && optionIndex !== correctAnswer) {
      return XCircle;
    }
    return Circle;
  };

  const getOptionClasses = (optionIndex) => {
    const baseClasses = "flex items-start space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer";
    
    if (disabled && !showResult) {
      return `${baseClasses} border-gray-200 bg-gray-50 cursor-not-allowed opacity-60`;
    }

    if (!showResult) {
      if (localSelected === optionIndex) {
        return `${baseClasses} border-blue-500 bg-blue-50 hover:bg-blue-100`;
      }
      return `${baseClasses} border-gray-200 hover:border-gray-300 hover:bg-gray-50`;
    }

    // Show result state
    if (optionIndex === correctAnswer) {
      return `${baseClasses} border-green-500 bg-green-50`;
    } else if (optionIndex === localSelected && optionIndex !== correctAnswer) {
      return `${baseClasses} border-red-500 bg-red-50`;
    }
    return `${baseClasses} border-gray-200 bg-gray-50`;
  };

  const getIconColor = (optionIndex) => {
    if (!showResult) {
      return localSelected === optionIndex ? 'text-blue-600' : 'text-gray-400';
    }

    if (optionIndex === correctAnswer) {
      return 'text-green-600';
    } else if (optionIndex === localSelected && optionIndex !== correctAnswer) {
      return 'text-red-600';
    }
    return 'text-gray-400';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {/* Question Header */}
      <div className="mb-6">
        {questionNumber && totalQuestions && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">
              Question {questionNumber} of {totalQuestions}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < questionNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
          {question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const Icon = getOptionIcon(index);
          return (
            <div
              key={index}
              className={getOptionClasses(index)}
              onClick={() => handleOptionSelect(index)}
            >
              <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${getIconColor(index)}`} />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-gray-900">
                  {option}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && explanation && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Explanation:
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {explanation}
          </p>
        </div>
      )}

      {/* Result Summary */}
      {showResult && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center space-x-2">
            {localSelected === correctAnswer ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Correct! Well done.
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  Incorrect. The correct answer is {String.fromCharCode(65 + correctAnswer)}.
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

// Simplified version for quick quizzes
export const SimpleQuizQuestion = ({ 
  question, 
  options, 
  selectedAnswer, 
  onAnswerSelect,
  disabled = false 
}) => {
  return (
    <div className="space-y-4">
      <h4 className="text-base font-medium text-gray-900">
        {question}
      </h4>
      <div className="space-y-2">
        {options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name={`question-${question}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => !disabled && onAnswerSelect(index)}
              disabled={disabled}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-300'
            }`}>
              {selectedAnswer === index && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <span className="text-sm text-gray-900">
              {String.fromCharCode(65 + index)}. {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;

