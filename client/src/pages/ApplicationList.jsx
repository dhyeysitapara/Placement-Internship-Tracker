import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api';
import Dropdown from '../components/Dropdown';
import { useToast } from '../components/Toast';

const B   = '#8B0020';
const BL  = '#b5002a';
const BOR = 'rgba(139,0,32,0.3)';

const SS = {
  Applied:     { bg:'rgba(139,0,32,0.15)',   color:'#e05a77', border:'rgba(139,0,32,0.4)' },
  Shortlisted: { bg:'rgba(255,255,255,0.07)', color:'#ccc',   border:'rgba(255,255,255,0.18)' },
  Interview:   { bg:'rgba(200,140,0,0.12)',  color:'#d4a843', border:'rgba(200,140,0,0.3)' },
  Offer:       { bg:'rgba(22,120,60,0.15)',  color:'#4ade80', border:'rgba(22,120,60,0.3)' },
  Rejected:    { bg:'rgba(60,60,60,0.2)',    color:'#666',    border:'rgba(100,100,100,0.25)' },
};

const ApplicationList = () => {
  const { showToast } = useToast();
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await axios.get('/api/applications');
        setApps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filtered = apps.filter(a => filter === 'All' || a.status === filter);

  const statusOptions = ['All', ...Object.keys(SS)];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`/api/applications/${id}`);
        setApps(apps.filter(app => app._id !== id));
        showToast('Application deleted');
      } catch (err) {
        console.error(err);
        showToast('Error deleting application', 'error');
      }
    }
  };

  return (
  <div style={{ padding:'32px 40px', animation:'fadeIn 0.35s ease' }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
      <div>
        <p style={{ fontSize:11, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Pipeline</p>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:26, fontWeight:700, color:'#fff' }}>All Applications</h1>
      </div>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:160 }}>
          <Dropdown options={statusOptions} value={filter} onChange={setFilter} placeholder="Filter Status" />
        </div>
        <Link to="/add" style={{ padding:'9px 22px', borderRadius:8, fontSize:13.5, fontWeight:600, color:'#fff', textDecoration:'none', background:`linear-gradient(135deg,${B},${BL})`, boxShadow:'0 3px 12px rgba(139,0,32,0.4)' }}>
          + Add Application
        </Link>
      </div>
    </div>

    <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, overflow:'hidden', position:'relative', minHeight: loading ? 200 : 'auto' }}>
      {loading ? (
        <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#888' }}>
          <div style={{ width:24, height:24, borderRadius:'50%', border:'2px solid rgba(139,0,32,0.2)', borderTopColor:B, animation:'spin 0.8s linear infinite' }} />
        </div>
      ) : apps.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 24px', color:'#444' }}>
          <div style={{ fontSize:32, marginBottom:12, color:'#2a2a2a' }}>—</div>
          <p style={{ marginBottom:16 }}>You haven't added any applications yet.</p>
          <Link to="/add" style={{ display:'inline-block', padding:'8px 20px', borderRadius:8, background:`linear-gradient(135deg,${B},${BL})`, color:'#fff', textDecoration:'none', fontSize:13, fontWeight:600 }}>Add Application</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 24px', color:'#444' }}>
          <div style={{ fontSize:32, marginBottom:12, color:'#2a2a2a' }}>—</div>
          <p style={{ marginBottom:16 }}>No applications match your status filter.</p>
          <button onClick={() => setFilter('All')} style={{ display:'inline-block', padding:'8px 20px', borderRadius:8, background:'rgba(255,255,255,0.05)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:13, fontWeight:600 }}>Clear Filter</button>
        </div>
      ) : (
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            {['Company','Role','Status','Date Applied','Actions'].map(h=>(
              <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:10.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color:'#333' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((app,i)=>{
            const s = SS[app.status]||{};
            return (
              <tr key={app._id}
                style={{ borderBottom: i<filtered.length-1 ? '1px solid rgba(255,255,255,0.04)':'none', transition:'background 0.1s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <td style={{ padding:'14px 20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                    <div style={{ width:32, height:32, borderRadius:7, background:'rgba(139,0,32,0.15)', border:`1px solid ${BOR}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, color:'#c0405a' }}>
                      {app.company[0]}
                    </div>
                    <span style={{ fontWeight:600, color:'#e8e8e8', fontSize:14 }}>{app.company}</span>
                  </div>
                </td>
                <td style={{ padding:'14px 20px', color:'#555', fontSize:13.5 }}>{app.role}</td>
                <td style={{ padding:'14px 20px' }}>
                  <span style={{ display:'inline-block', padding:'3px 11px', borderRadius:99, fontSize:11, fontWeight:700, background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>{app.status}</span>
                </td>
                <td style={{ padding:'14px 20px', color:'#444', fontSize:13 }}>
                  {new Date(app.dateApplied).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}
                </td>
                <td style={{ padding:'14px 20px' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    <Link to={`/applications/${app._id}`} style={{ padding:'5px 13px', borderRadius:7, fontSize:12, fontWeight:500, background:'rgba(139,0,32,0.12)', color:'#d06070', border:`1px solid ${BOR}`, textDecoration:'none' }}>View</Link>
                    <button onClick={() => handleDelete(app._id)} style={{ padding:'5px 13px', borderRadius:7, fontSize:12, fontWeight:500, background:'rgba(255,255,255,0.04)', color:'#555', border:'1px solid rgba(255,255,255,0.07)', cursor:'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      )}
    </div>
  </div>
  );
};

export default ApplicationList;
