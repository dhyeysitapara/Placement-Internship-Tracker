import { useState } from 'react';
import { Link } from 'react-router-dom';

const B   = '#8B0020';
const BL  = '#b5002a';
const BG  = 'rgba(139,0,32,0.12)';
const BOR = 'rgba(139,0,32,0.28)';

const APPS = [
  { id:1, company:'Google',    role:'SDE Intern',        status:'Offer',       date:'2026-03-24' },
  { id:2, company:'Microsoft', role:'Frontend Engineer', status:'Interview',   date:'2026-03-20' },
  { id:3, company:'Amazon',    role:'Data Analyst',      status:'Shortlisted', date:'2026-03-26' },
  { id:4, company:'Meta',      role:'Product Designer',  status:'Rejected',    date:'2026-03-15' },
  { id:5, company:'Netflix',   role:'Backend Developer', status:'Applied',     date:'2026-03-27' },
];

const SS = {
  Applied:     { bg:'rgba(139,0,32,0.15)',   color:'#e05a77', border:'rgba(139,0,32,0.4)' },
  Shortlisted: { bg:'rgba(255,255,255,0.08)', color:'#e0e0e0', border:'rgba(255,255,255,0.2)' },
  Interview:   { bg:'rgba(200,140,0,0.12)',  color:'#d4a843', border:'rgba(200,140,0,0.3)' },
  Offer:       { bg:'rgba(22,120,60,0.15)',  color:'#4ade80', border:'rgba(22,120,60,0.3)' },
  Rejected:    { bg:'rgba(60,60,60,0.2)',    color:'#888',    border:'rgba(100,100,100,0.3)' },
};

const STATS = [
  { label:'Total Applied', value:5, accent:B },
  { label:'Shortlisted',   value:1, accent:'#888' },
  { label:'Interviews',    value:1, accent:'#b8860b' },
  { label:'Offers',        value:1, accent:'#166534' },
  { label:'Rejected',      value:1, accent:'#333' },
];

const card = { background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12 };
const inp  = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'9px 14px', color:'#e8e8e8', fontSize:13.5, fontFamily:'Inter,sans-serif', outline:'none', width:'100%' };

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = APPS.filter(a =>
    (filter === 'All' || a.status === filter) &&
    a.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding:'32px 40px', animation:'fadeIn 0.35s ease' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:28 }}>
        <div>
          <p style={{ fontSize:11, color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Overview</p>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:26, fontWeight:700, color:'#fff' }}>Placement Dashboard</h1>
        </div>
        <Link to="/add" style={{
          padding:'9px 22px', borderRadius:8, fontSize:13.5, fontWeight:600,
          color:'#fff', textDecoration:'none',
          background:`linear-gradient(135deg,${B},${BL})`,
          boxShadow:`0 3px 12px rgba(139,0,32,0.4)`,
        }}>+ Add Application</Link>
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
        <select style={{ ...inp, maxWidth:165, cursor:'pointer' }} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="All" style={{ background:'#0f0f0f' }}>All Statuses</option>
          {Object.keys(SS).map(k=><option key={k} value={k} style={{ background:'#0f0f0f' }}>{k}</option>)}
        </select>
        <input type="date" style={{ ...inp, maxWidth:165, colorScheme:'dark' }} />
        <span style={{ marginLeft:'auto', fontSize:12, color:'#444' }}>{filtered.length} result{filtered.length!==1?'s':''}</span>
      </div>

      {/* Table */}
      <div style={{ ...card, overflow:'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'56px 24px', color:'#444' }}>
            <div style={{ fontSize:32, marginBottom:12, color:'#2a2a2a' }}>—</div>
            <p style={{ marginBottom:16 }}>No applications match your filter.</p>
            <Link to="/add" style={{ display:'inline-block', padding:'8px 20px', borderRadius:8, background:`linear-gradient(135deg,${B},${BL})`, color:'#fff', textDecoration:'none', fontSize:13, fontWeight:600 }}>Add Application</Link>
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
                  <tr key={app.id}
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
                      {new Date(app.date).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', gap:8 }}>
                        <Link to={`/applications/${app.id}`} style={{ padding:'5px 13px', borderRadius:7, fontSize:12, fontWeight:500, background:BG, color:'#d06070', border:`1px solid ${BOR}`, textDecoration:'none' }}>View</Link>
                        <button style={{ padding:'5px 13px', borderRadius:7, fontSize:12, fontWeight:500, background:'rgba(255,255,255,0.04)', color:'#555', border:'1px solid rgba(255,255,255,0.07)', cursor:'pointer' }}>Delete</button>
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

export default Dashboard;
