import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const B   = '#8B0020';
const BL  = '#b5002a';
const BOR = 'rgba(255,255,255,0.1)';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.03)',
  border: `1px solid ${BOR}`,
  borderRadius: '10px',
  color: '#fff',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'all 0.2s',
  marginBottom: '16px'
};

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (response) => {
    try {
      const res = await axios.post('/api/auth/google', { credential: response.credential });
      login(res.data.user, res.data.token);
      showToast('Successfully signed up!', 'success');
      navigate('/');
    } catch (err) {
      console.error('Signup Error:', err.response?.data);
      if (err.response?.data?.details) {
        showToast('Google API Error: ' + err.response.data.details, 'error');
      } else {
        showToast('Google Sign-Up was unsuccessful.', 'error');
      }
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return showToast('Please fill all fields', 'error');
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', formData);
      login(res.data.user, res.data.token);
      showToast('Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', background: 'radial-gradient(circle at center, #121212 0%, #0b0b0b 100%)'
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 24, padding: '40px', textAlign: 'center',
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)', animation: 'fadeIn 0.6s ease-out'
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: `linear-gradient(135deg, ${B}, ${BL})`, margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: '#fff', fontWeight: 800, boxShadow: `0 8px 16px rgba(139,0,32,0.3)`
        }}>P</div>

        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>
          Create an Account
        </h1>
        <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>
          Start tracking your placement journey today.
        </p>

        <form onSubmit={handleManualSubmit} style={{ textAlign: 'left' }}>
          <input type="text" placeholder="Full Name" style={inputStyle}
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" style={inputStyle}
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" style={inputStyle}
            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: `linear-gradient(135deg, ${B}, ${BL})`,
            color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            boxShadow: `0 4px 12px rgba(139,0,32,0.2)`, transition: 'all 0.2s', marginBottom: '24px'
          }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          <span style={{ margin: '0 12px', fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, padding: '8px', background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
          <GoogleLogin onSuccess={handleSuccess} onError={() => showToast('Google Sign-In failed', 'error')} theme="filled_black" shape="pill" text="signup_with" width="300" />
        </div>

        <p style={{ fontSize: 14, color: '#888', marginTop: 10 }}>
          Already have an account? <Link to="/login" style={{ color: BL, textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
