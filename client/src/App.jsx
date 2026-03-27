import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ApplicationList from './pages/ApplicationList';
import AddApplication from './pages/AddApplication';
import ApplicationDetail from './pages/ApplicationDetail';
import EditApplication from './pages/EditApplication';
import './index.css';

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <div style={{ minHeight: '100vh', background: '#0b0b0b' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<ApplicationList />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            <Route path="/add" element={<AddApplication />} />
            <Route path="/edit/:id" element={<EditApplication />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;
