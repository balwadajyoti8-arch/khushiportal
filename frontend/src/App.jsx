import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      <p className="text-sm text-slate-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// Lazy loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CodingQuestions = lazy(() => import('./pages/CodingQuestions'));
const MCQTests = lazy(() => import('./pages/MCQTests'));
const MockInterviews = lazy(() => import('./pages/MockInterviews'));
const CompanyBank = lazy(() => import('./pages/CompanyBank'));
const CompanyDetail = lazy(() => import('./pages/CompanyDetail'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));
const Notes = lazy(() => import('./pages/Notes'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Protected Route Component for Student
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 3000,
              style: {
                background: '#161e2e',
                color: '#f3f4f6',
                border: '1px solid #243048',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f3f4f6',
                },
              },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={<PageLoader />}><Register /></Suspense>} />
            <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
            <Route path="/reset-password/:token" element={<Suspense fallback={<PageLoader />}><ResetPassword /></Suspense>} />

            {/* Protected Student routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Dashboard /></Suspense></ProtectedRoute>} />
            <Route path="/questions" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><CodingQuestions /></Suspense></ProtectedRoute>} />
            <Route path="/mcqs" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><MCQTests /></Suspense></ProtectedRoute>} />
            <Route path="/mock-interviews" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><MockInterviews /></Suspense></ProtectedRoute>} />
            <Route path="/companies" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><CompanyBank /></Suspense></ProtectedRoute>} />
            <Route path="/companies/:name" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><CompanyDetail /></Suspense></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Bookmarks /></Suspense></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Notes /></Suspense></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Profile /></Suspense></ProtectedRoute>} />

            {/* Protected Admin routes */}
            <Route path="/admin" element={<AdminRoute><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></AdminRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
