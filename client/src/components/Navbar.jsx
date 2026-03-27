import { Link, useLocation } from 'react-router-dom';

/* ── Color tokens ─────────────────────────────── */
const B  = '#8B0020';   // burgundy
const BL = '#b5002a';   // light burgundy
const BOR = 'rgba(139,0,32,0.3)'; // burgundy border

const Navbar = () => {
  const location = useLocation();
  const links = [
    { path: '/', label: 'Dashboard' },
    { path: '/applications', label: 'Applications' },
    { path: '/add', label: 'Add New' },
  ];

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,6,6,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${BOR}`,
    }}>
      <div style={{ padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-0.3px' }}>
            Placement<span style={{ color: BL }}>Tracker</span>
          </span>
        </Link>

        <div style={{ display: 'flex', gap: 2 }}>
          {links.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{
                padding: '7px 18px', borderRadius: 8, fontSize: 13.5, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.15s',
                color: active ? '#fff' : '#666',
                background: active ? `rgba(139,0,32,0.2)` : 'transparent',
                borderBottom: active ? `2px solid ${B}` : '2px solid transparent',
              }}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
