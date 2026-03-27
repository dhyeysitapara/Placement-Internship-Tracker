import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from '../api';
import { useAuth } from '../context/AuthContext';

const B  = '#8B0020';
const BL = '#b5002a';
const BOR = 'rgba(139,0,32,0.3)';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [upcomingCount, setUpcomingCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get('/api/applications/upcoming')
        .then(res => setUpcomingCount(res.data.length))
        .catch(() => {});
    }
  }, [location.pathname, isAuthenticated]);

  const links = [
    { path: '/', label: 'Dashboard' },
    { path: '/applications', label: 'Applications' },
    { path: '/reminders', label: 'Reminders', badge: upcomingCount },
    { path: '/add', label: 'Add New' },
  ];

  if (!isAuthenticated && location.pathname === '/login') {
    return (
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,6,6,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${BOR}`,
      }}>
        <div style={{ padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60 }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.3px' }}>
            Placement<span style={{ color: BL }}>Tracker</span>
          </span>
        </div>
      </nav>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,6,6,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${BOR}`,
    }}>
      <div style={{ padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-0.3px' }}>
            Placement<span style={{ color: BL }}>Tracker</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 2, marginRight: 20 }}>
            {links.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} style={{
                  position: 'relative',
                  padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.15s',
                  color: active ? '#fff' : '#666',
                  background: active ? `rgba(139,0,32,0.15)` : 'transparent',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {link.label}
                  {link.badge > 0 && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 16, height: 16, borderRadius: '50%',
                      background: B, color: '#fff', fontSize: 9, fontWeight: 700,
                    }}>
                      {link.badge > 9 ? '9+' : link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)', marginRight: 10 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#fff' }}>{user?.name}</p>
              <button 
                onClick={logout} 
                style={{ background: 'none', border: 'none', padding: 0, color: '#444', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', textAlign: 'right', display: 'block', width: '100%' }}
              >
                Logout
              </button>
            </div>
            <img 
              src={user?.picture} 
              alt={user?.name} 
              style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${BOR}`, background: '#111' }} 
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=8B0020&color=fff`; }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
