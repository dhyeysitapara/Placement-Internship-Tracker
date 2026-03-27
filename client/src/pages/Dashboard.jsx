import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api';
import Dropdown from '../components/Dropdown';
import DatePicker from '../components/DatePicker';
import { useToast } from '../components/Toast';

const B   = '#8B0020';
const BL  = '#b5002a';
const BG  = 'rgba(139,0,32,0.12)';
const BOR = 'rgba(139,0,32,0.28)';

const SS = {
  Applied:     { bg:'rgba(139,0,32,0.15)',   color:'#e05a77', border:'rgba(139,0,32,0.4)' },
  Shortlisted: { bg:'rgba(255,255,255,0.08)', color:'#e0e0e0', border:'rgba(255,255,255,0.2)' },
  Interview:   { bg:'rgba(200,140,0,0.12)',  color:'#d4a843', border:'rgba(200,140,0,0.3)' },
  Offer:       { bg:'rgba(22,120,60,0.15)',  color:'#4ade80', border:'rgba(22,120,60,0.3)' },
  Rejected:    { bg:'rgba(60,60,60,0.2)',    color:'#888',    border:'rgba(100,100,100,0.3)' },
};

const card = { background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 };
const inp  = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'9px 14px', color:'#e8e8e8', fontSize:13.5, fontFamily:'Inter,sans-serif', outline:'none', width:'100%' };

const Dashboard = () => {
  const { showToast } = useToast();
  const [apps, setApps] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const [appsRes, upcomingRes] = await Promise.all([
          axios.get('/api/applications'),
          axios.get('/api/applications/upcoming'),
        ]);
        setApps(appsRes.data);
        setUpcoming(upcomingRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

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

  const exportCSV = () => {
    if (apps.length === 0) return showToast('No applications to export', 'error');
    
    const headers = ['Company', 'Job Role', 'Status', 'Date Applied', 'Interview Rounds', 'Next Interview Date', 'Notes', 'Job Link'];
    const rows = apps.map(a => {
      const now = new Date();
      let nextInterview = '';
      if (a.interviewRounds && a.interviewRounds.length > 0) {
        const upc = a.interviewRounds.filter(r => new Date(r.date) >= now).sort((x, y) => new Date(x.date) - new Date(y.date));
        if (upc.length > 0) nextInterview = new Date(upc[0].date).toLocaleString();
      }

      const escape = (str) => {
        if (!str) return '';
        const s = String(str);
        return (s.includes(',') || s.includes('"') || s.includes('\n')) ? `"${s.replace(/"/g, '""')}"` : s;
      };

      return [
        escape(a.company), escape(a.jobRole), escape(a.status), escape(new Date(a.dateApplied).toLocaleDateString()),
        escape(a.interviewRounds ? a.interviewRounds.length : 0), escape(nextInterview), escape(a.notes), escape(a.jobLink)
      ].join(',');
    });

    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `PlacementTracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported to CSV!', 'success');
  };

  const filtered = apps.filter(a => {
    const matchStatus = filter === 'All' || a.status === filter;
    const matchSearch = a.company.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateFilter ? new Date(a.dateApplied).toISOString().split('T')[0] === dateFilter : true;
    return matchStatus && matchSearch && matchDate;
  });

  const STATS = [
    { label:'Total Applied', value:apps.length, accent:B },
    { label:'Shortlisted',   value:apps.filter(a=>a.status==='Shortlisted').length, accent:'#888' },
    { label:'Interviews',    value:apps.filter(a=>a.status==='Interview').length, accent:'#b8860b' },
    { label:'Offers',        value:apps.filter(a=>a.status==='Offer').length, accent:'#166534' },
    { label:'Rejected',      value:apps.filter(a=>a.status==='Rejected').length, accent:'#333' },
  ];

  const statusOptions = ['All', ...Object.keys(SS)];

  return (
    <div style={{ padding:'32px 40px', animation:'fadeIn 0.35s ease' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
        <div>
          <p style={{ fontSize:11, color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Overview</p>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:26, fontWeight:700, color:'#fff' }}>Placement Dashboard</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={exportCSV} style={{
            padding:'9px 18px', borderRadius:8, fontSize:13.5, fontWeight:600, cursor:'pointer',
            border:`1px solid ${BOR}`, background:'rgba(255,255,255,0.03)', color:'#fff',
            display:'flex', alignItems:'center', gap:'6px', transition:'all 0.2s'
          }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
            Export CSV
          </button>
          <Link to="/add" style={{
            padding:'9px 22px', borderRadius:8, fontSize:13.5, fontWeight:600,
            color:'#fff', textDecoration:'none',
            background:`linear-gradient(135deg,${B},${BL})`,
            boxShadow:`0 3px 12px rgba(139,0,32,0.4)`,
          }}>+ Add Application</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:24 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ ...card, padding:'18px 20px', borderLeft:`3px solid ${s.accent}`, transition:'background 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.045)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.025)'}
          >
            <div style={{ fontSize:30, fontWeight:800, color:'#fff', fontFamily:'Poppins,sans-serif' }}>{s.value}</div>
            <div style={{ fontSize:11, color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ ...card, padding:'13px 16px', marginBottom:18, display:'flex', gap:12, alignItems:'center' }}>
        <input style={{ ...inp, maxWidth:260 }} placeholder="Search company..." value={search} onChange={e=>setSearch(e.target.value)} />
        
        <div style={{ maxWidth: 180, width:'100%' }}>
          <Dropdown options={statusOptions} value={filter} onChange={setFilter} placeholder="All Statuses" />
        </div>

        <div style={{ maxWidth: 165, width:'100%' }}>
          <DatePicker value={dateFilter} onChange={setDateFilter} placeholder="Applied Date" clearable />
        </div>
        <span style={{ marginLeft:'auto', fontSize:12, color:'#444' }}>{filtered.length} result{filtered.length!==1?'s':''}</span>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow:'hidden', position:'relative', minHeight: loading ? 200 : 'auto' }}>
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
            <p style={{ marginBottom:16 }}>No applications match your filters.</p>
            <button onClick={() => { setSearch(''); setFilter('All'); setDateFilter(''); }} style={{ display:'inline-block', padding:'8px 20px', borderRadius:8, background:'rgba(255,255,255,0.05)', color:'#fff', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', fontSize:13, fontWeight:600 }}>Clear Filters</button>
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
              {filtered.map((app,i) => {
                const s = SS[app.status] || {};
                return (
                  <tr key={app._id}
                    style={{ borderBottom: i<filtered.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                        <div style={{ width:32, height:32, borderRadius:7, background:`rgba(139,0,32,0.15)`, border:`1px solid ${BOR}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13, color:'#c0405a' }}>
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
                        <Link to={`/applications/${app._id}`} style={{ padding:'5px 13px', borderRadius:7, fontSize:12, fontWeight:500, background:BG, color:'#d06070', border:`1px solid ${BOR}`, textDecoration:'none' }}>View</Link>
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

      {/* Upcoming Interviews Widget */}
      {upcoming.length > 0 && (
        <div style={{ marginTop:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#333' }}>Upcoming This Week</p>
            <Link to="/reminders" style={{ fontSize:11, color:BL, textDecoration:'none', fontWeight:600 }}>See All →</Link>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {upcoming.slice(0,3).map((item, idx) => {
              const daysLeft = Math.round((new Date(item.date) - new Date()) / 86400000);
              const urgentColor = daysLeft <= 1 ? '#e05a77' : daysLeft <= 3 ? '#d4a843' : '#555';
              return (
                <div key={idx} style={{ ...card, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:14, fontWeight:800, color: urgentColor, fontFamily:'Poppins,sans-serif', lineHeight:1 }}>{new Date(item.date).getDate()}</span>
                    <span style={{ fontSize:9, color:'#333', fontWeight:600, textTransform:'uppercase' }}>{new Date(item.date).toLocaleDateString('en-US',{month:'short'})}</span>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontWeight:600, color:'#ccc', fontSize:13, margin:0 }}>{item.roundType}</p>
                    <p style={{ color:'#444', fontSize:12, margin:0 }}>{item.company} – {item.role}</p>
                  </div>
                  <span style={{ fontSize:11, color: urgentColor, fontWeight:700, flexShrink:0 }}>{daysLeft === 0 ? 'Today!' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
