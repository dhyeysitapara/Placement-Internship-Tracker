import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ApplicationList from './pages/ApplicationList';
import AddApplication from './pages/AddApplication';
import ApplicationDetail from './pages/ApplicationDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<ApplicationList />} />
          <Route path="/add" element={<AddApplication />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
