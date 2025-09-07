import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai-exam-tutor.vercel.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name) => api.post('/auth/register', { email, password, name }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// User onboarding
export const onboardingAPI = {
  saveOnboarding: (data) => api.post('/onboarding', data),
  getOnboarding: () => api.get('/onboarding'),
};

// Study plan endpoints
export const studyPlanAPI = {
  getStudyPlan: () => api.get('/study-plan'),
  updateProgress: (topicId, completed) => api.patch(`/study-plan/${topicId}`, { completed }),
};

// Lessons endpoints
export const lessonsAPI = {
  getLesson: (id) => api.get(`/lessons/${id}`),
  getAllLessons: () => api.get('/lessons'),
  submitQuizAnswer: (lessonId, answers) => api.post(`/lessons/${lessonId}/quiz`, { answers }),
};

// Quiz endpoints
export const quizAPI = {
  getQuiz: (id) => api.get(`/quiz/${id}`),
  submitQuizAttempt: (quizId, answers) => api.post(`/quiz/${quizId}/attempt`, { answers }),
  getQuizHistory: () => api.get('/quiz/history'),
};

// Progress endpoints
export const progressAPI = {
  getProgress: () => api.get('/progress'),
  getStats: () => api.get('/progress/stats'),
  getWeakTopics: () => api.get('/progress/weak-topics'),
};

// Admin endpoints
export const adminAPI = {
  uploadSyllabus: (syllabusData) => api.post('/admin/syllabus', syllabusData),
  reviewContent: () => api.get('/admin/content/review'),
  approveContent: (contentId) => api.patch(`/admin/content/${contentId}/approve`),
  rejectContent: (contentId, reason) => api.patch(`/admin/content/${contentId}/reject`, { reason }),
};

// Dashboard endpoints
export const dashboardAPI = {
  getTodaysTasks: () => api.get('/dashboard/tasks'),
  getStreak: () => api.get('/dashboard/streak'),
  getWeakTopicsChart: () => api.get('/dashboard/weak-topics-chart'),
};

export default api;

