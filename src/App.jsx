import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load pages for performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const RegistrationsPage = lazy(() => import('./pages/RegistrationsPage'));

/**
 * Loading Fallback
 */
const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[var(--color-background)]">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
      <p className="text-sm font-medium text-[var(--color-text-secondary)]">Loading workspace...</p>
    </div>
  </div>
);

/**
 * App Component
 * Main application with routing and lazy loading
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="registrations" element={<RegistrationsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
