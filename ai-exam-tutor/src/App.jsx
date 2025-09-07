import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/supabase';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import StudyPlan from './pages/StudyPlan';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Admin from './pages/Admin';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, user, requireAuth = true }) => {
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Admin Route Component
const AdminRoute = ({ children, user }) => {
  // In a real app, you'd check if user has admin role
  const isAdmin = user?.email?.includes('admin') || user?.user_metadata?.role === 'admin';
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    auth.getCurrentSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute user={user} requireAuth={false}>
                <Landing />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute user={user} requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute user={user} requireAuth={false}>
                <Signup />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute user={user}>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/study-plan" 
            element={
              <ProtectedRoute user={user}>
                <StudyPlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lesson/:id" 
            element={
              <ProtectedRoute user={user}>
                <Lesson />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz/:id" 
            element={
              <ProtectedRoute user={user}>
                <Quiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute user={user}>
                <Progress />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute user={user}>
                <Admin />
              </AdminRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

