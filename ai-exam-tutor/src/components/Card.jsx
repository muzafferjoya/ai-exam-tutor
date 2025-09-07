import { cn } from '../lib/utils';

const Card = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  icon: Icon, 
  onClick,
  hover = false,
  ...props 
}) => {
  const cardClasses = cn(
    'bg-white rounded-lg border border-gray-200 shadow-sm',
    hover && 'hover:shadow-md transition-shadow duration-200',
    onClick && 'cursor-pointer',
    className
  );

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {(title || subtitle || Icon) && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// Card variants for specific use cases
export const StatsCard = ({ title, value, change, icon: Icon, trend = 'neutral' }) => {
  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-2 ${trendColors[trend]}`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
    </Card>
  );
};

export const TaskCard = ({ 
  title, 
  description, 
  status = 'pending', 
  dueDate, 
  onClick,
  progress 
}) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  };

  return (
    <Card hover onClick={onClick} className="cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 mb-2">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-gray-600 mb-3">
              {description}
            </p>
          )}
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            {dueDate && (
              <span className="text-xs text-gray-500">
                Due: {dueDate}
              </span>
            )}
          </div>
          {progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const LessonCard = ({ 
  title, 
  description, 
  duration, 
  difficulty, 
  completed = false,
  onClick 
}) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  return (
    <Card hover onClick={onClick} className="cursor-pointer">
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          completed ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          {completed ? (
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <span className="text-sm font-medium text-gray-600">
              {title.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-base font-semibold text-gray-900 mb-1">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-gray-600 mb-3">
              {description}
            </p>
          )}
          <div className="flex items-center space-x-4">
            {duration && (
              <span className="text-xs text-gray-500">
                {duration} min
              </span>
            )}
            {difficulty && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
                {difficulty}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Card;

