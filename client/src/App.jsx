import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ApplicationList from './pages/ApplicationList';
import AddApplication from './pages/AddApplication';
import ApplicationDetail from './pages/ApplicationDetail';
import EditApplication from './pages/EditApplication';
import Reminders from './pages/Reminders';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: '#0b0b0b' }}>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <ApplicationList />
              </ProtectedRoute>
            } />
            <Route path="/applications/:id" element={
              <ProtectedRoute>
                <ApplicationDetail />
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <AddApplication />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <EditApplication />
              </ProtectedRoute>
            } />
            <Route path="/reminders" element={
              <ProtectedRoute>
                <Reminders />
              </ProtectedRoute>
            } />

            {/* Catch-all redirect to dash or login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;
