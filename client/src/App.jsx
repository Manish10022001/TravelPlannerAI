import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ItineraryPage from './pages/ItineraryPage';
import SharePage from './pages/SharePage';
import Layout from './components/layout/Layout';

//if not loggedin then redirect to login page
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

// If already logged in redirect to /dashboard
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>

          {/* dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* login and register routes*/}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Share page */}
          <Route path="/share/:token" element={<SharePage />} />

          {/* protected pages */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="itinerary/:id" element={<ItineraryPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}