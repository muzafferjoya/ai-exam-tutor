import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from './Card';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.name.includes('Accuracy') && '%'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Progress Line Chart
export const ProgressLineChart = ({ data, title = "Progress Over Time" }) => {
  return (
    <Card title={title}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              name="Accuracy"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              name="Completed Topics"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Accuracy Area Chart
export const AccuracyAreaChart = ({ data, title = "Accuracy Trend" }) => {
  return (
    <Card title={title}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Accuracy"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Weak Topics Bar Chart
export const WeakTopicsChart = ({ data, title = "Topics Needing Attention" }) => {
  return (
    <Card title={title}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
            />
            <YAxis 
              type="category" 
              dataKey="topic" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="accuracy"
              fill="#ef4444"
              radius={[0, 4, 4, 0]}
              name="Accuracy"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Study Progress Pie Chart
export const StudyProgressPie = ({ data, title = "Study Progress" }) => {
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  return (
    <Card title={title}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Daily Study Time Chart
export const DailyStudyChart = ({ data, title = "Daily Study Time" }) => {
  return (
    <Card title={title}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="minutes"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Study Time (minutes)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Performance Comparison Chart
export const PerformanceComparisonChart = ({ data, title = "Performance by Subject" }) => {
  return (
    <Card title={title}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="subject" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="accuracy"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Accuracy"
            />
            <Bar
              dataKey="completion"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Completion"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// Simple stats display
export const StatsDisplay = ({ stats, title = "Quick Stats" }) => {
  return (
    <Card title={title}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Main ProgressChart component that can render different chart types
const ProgressChart = ({ type = 'line', data, title, ...props }) => {
  switch (type) {
    case 'line':
      return <ProgressLineChart data={data} title={title} {...props} />;
    case 'area':
      return <AccuracyAreaChart data={data} title={title} {...props} />;
    case 'bar':
      return <WeakTopicsChart data={data} title={title} {...props} />;
    case 'pie':
      return <StudyProgressPie data={data} title={title} {...props} />;
    case 'daily':
      return <DailyStudyChart data={data} title={title} {...props} />;
    case 'comparison':
      return <PerformanceComparisonChart data={data} title={title} {...props} />;
    case 'stats':
      return <StatsDisplay stats={data} title={title} {...props} />;
    default:
      return <ProgressLineChart data={data} title={title} {...props} />;
  }
};

export default ProgressChart;

