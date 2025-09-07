import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Target, TrendingUp, Users, CheckCircle, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import Card from '../components/Card';

const Landing = () => {
  const [selectedExam, setSelectedExam] = useState('');

  const exams = [
    { id: 'jee', name: 'JEE Main & Advanced', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    { id: 'neet', name: 'NEET', subjects: ['Physics', 'Chemistry', 'Biology'] },
    { id: 'cat', name: 'CAT', subjects: ['Quantitative Aptitude', 'Verbal Ability', 'Data Interpretation'] },
    { id: 'gate', name: 'GATE', subjects: ['Engineering Mathematics', 'Core Engineering', 'General Aptitude'] },
    { id: 'upsc', name: 'UPSC Civil Services', subjects: ['General Studies', 'Optional Subject', 'Essay'] },
    { id: 'ssc', name: 'SSC CGL', subjects: ['General Intelligence', 'General Awareness', 'Quantitative Aptitude'] },
  ];

  const features = [
    {
      icon: Target,
      title: 'Personalized Study Plans',
      description: 'AI-powered study plans tailored to your exam, target date, and available study time.'
    },
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Comprehensive lessons with notes and practice questions for better understanding.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Detailed analytics to track your progress and identify areas for improvement.'
    },
    {
      icon: Users,
      title: 'Expert Content',
      description: 'Content created and reviewed by subject matter experts and successful candidates.'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      exam: 'JEE Advanced',
      rating: 5,
      text: 'AI Exam Tutor helped me identify my weak areas and focus my preparation. Cleared JEE Advanced with AIR 247!'
    },
    {
      name: 'Rahul Kumar',
      exam: 'NEET',
      rating: 5,
      text: 'The personalized study plan was a game-changer. Got into my dream medical college!'
    },
    {
      name: 'Anita Patel',
      exam: 'CAT',
      rating: 5,
      text: 'Excellent question bank and progress tracking. Scored 99.2 percentile in CAT!'
    }
  ];

  const handleGetStarted = () => {
    if (selectedExam) {
      localStorage.setItem('selectedExam', selectedExam);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your AI-Powered
              <span className="text-blue-600 block">Exam Success Partner</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Get personalized study plans, track your progress, and ace your competitive exams 
              with our intelligent tutoring system.
            </p>
            
            {/* Exam Selection */}
            <div className="max-w-2xl mx-auto mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Choose your target exam:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedExam === exam.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => setSelectedExam(exam.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">{exam.name}</h4>
                        <p className="text-sm text-gray-600">
                          {exam.subjects.join(', ')}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedExam === exam.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedExam === exam.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" onClick={handleGetStarted}>
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AI Exam Tutor?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent platform adapts to your learning style and helps you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of students who achieved their dreams with AI Exam Tutor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.exam} Candidate</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Success Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful candidates who trusted AI Exam Tutor for their preparation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" onClick={handleGetStarted}>
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;

