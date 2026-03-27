import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api';

const B  = '#8B0020';
const BL = '#b5002a';
const BOR = 'rgba(139,0,32,0.3)';

const SS = {
  Applied:     { bg:'rgba(139,0,32,0.15)',   color:'#e05a77', border:'rgba(139,0,32,0.4)' },
  Shortlisted: { bg:'rgba(255,255,255,0.07)', color:'#ccc',   border:'rgba(255,255,255,0.18)' },
  Interview:   { bg:'rgba(200,140,0,0.12)',  color:'#d4a843', border:'rgba(200,140,0,0.3)' },
  Offer:       { bg:'rgba(22,120,60,0.15)',  color:'#4ade80', border:'rgba(22,120,60,0.3)' },
  Rejected:    { bg:'rgba(60,60,60,0.2)',    color:'#666',    border:'rgba(100,100,100,0.25)' },
};

const ROUND_ICONS = {
  'Online Assessment': '💻',
  'Technical Round': '⚙️',
  'Coding Round': '🖥️',
  'HR Round': '👤',
  'Managerial Round': '📋',
  'Group Discussion': '💬',
  'Case Study': '📊',
  'System Design': '🏗️',
  'Culture Fit': '🤝',
};

const getDaysLeft = (date) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const d = new Date(date);
  d.setHours(0,0,0,0);
  const diff = Math.round((d - today) / 86400000);
  return diff;
};

const Reminders = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/applications/upcoming')
      .then(res => setUpcoming(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const card = { background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 };

  return (
    <div style={{ padding:'32px 40px', animation:'fadeIn 0.35s ease', maxWidth:860, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Schedule</p>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:26, fontWeight:700, color:'#fff' }}>Upcoming Interviews</h1>
        <p style={{ fontSize:13, color:'#444', marginTop:6 }}>Interview rounds scheduled in the next 7 days.</p>
      </div>

      <div style={{ ...card, overflow:'hidden', position:'relative', minHeight: loading ? 200 : 'auto' }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${B},${BL})` }} />

        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:80 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', border:'2px solid rgba(139,0,32,0.2)', borderTopColor:B, animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : upcoming.length === 0 ? (
          <div style={{ textAlign:'center', padding:'56px 24px', color:'#444' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🗓️</div>
            <p style={{ fontSize:15, fontWeight:500, marginBottom:8 }}>No upcoming interviews in the next 7 days.</p>
            <p style={{ fontSize:13, color:'#333', marginBottom:20 }}>Add interview rounds to your applications to track them here.</p>
            <Link to="/add" style={{ display:'inline-block', padding:'9px 22px', borderRadius:8, background:`linear-gradient(135deg,${B},${BL})`, color:'#fff', textDecoration:'none', fontSize:13, fontWeight:600 }}>+ Add Application</Link>
          </div>
        ) : (
          <div style={{ padding:'8px 0' }}>
            {upcoming.map((item, idx) => {
              const daysLeft = getDaysLeft(item.date);
              const s = SS[item.status] || {};
              const urgency = daysLeft === 0 ? { color:'#e05a77', label:'Today!' } :
                              daysLeft === 1 ? { color:'#d4a843', label:'Tomorrow' } :
                              { color:'#888', label:`${daysLeft} days` };
              const icon = ROUND_ICONS[item.roundType] || '📌';

              return (
                <div key={idx} style={{ padding:'18px 24px', borderBottom: idx < upcoming.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display:'flex', gap:16, alignItems:'center', transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                >
                  {/* Date bubble */}
                  <div style={{ textAlign:'center', width:52, flexShrink:0 }}>
                    <div style={{ fontSize:20, fontWeight:800, color: urgency.color, fontFamily:'Poppins,sans-serif', lineHeight:1 }}>
                      {new Date(item.date).getDate()}
                    </div>
                    <div style={{ fontSize:10, color:'#444', fontWeight:600, textTransform:'uppercase', marginTop:2 }}>
                      {new Date(item.date).toLocaleDateString('en-US',{ month:'short' })}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width:1, height:44, background:'rgba(255,255,255,0.05)', flexShrink:0 }} />

                  {/* Round Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:15 }}>{icon}</span>
                      <span style={{ fontWeight:600, color:'#e8e8e8', fontSize:14 }}>{item.roundType}</span>
                      <span style={{ display:'inline-block', padding:'2px 9px', borderRadius:99, fontSize:10.5, fontWeight:700, background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                        {item.status}
                      </span>
                    </div>
                    <p style={{ fontSize:13, color:'#555', margin:0 }}>{item.company} – {item.role}</p>
                    {item.notes && <p style={{ fontSize:12, color:'#333', margin:'4px 0 0', fontStyle:'italic' }}>{item.notes}</p>}
                  </div>

                  {/* Days left + View link */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color: urgency.color, marginBottom:8 }}>{urgency.label}</div>
                    <Link to={`/applications/${item.appId}`} style={{ padding:'5px 14px', borderRadius:7, fontSize:12, fontWeight:500, background:`rgba(139,0,32,0.12)`, color:'#d06070', border:`1px solid ${BOR}`, textDecoration:'none' }}>View</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reminders;
