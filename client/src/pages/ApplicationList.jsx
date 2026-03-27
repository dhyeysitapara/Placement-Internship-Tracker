import { Link } from 'react-router-dom';

const B   = '#8B0020';
const BL  = '#b5002a';
const BOR = 'rgba(139,0,32,0.3)';

const APPS = [
  { id:1, company:'Google',    role:'SDE Intern',        status:'Offer',       date:'2026-03-24' },
  { id:2, company:'Microsoft', role:'Frontend Engineer', status:'Interview',   date:'2026-03-20' },
  { id:3, company:'Amazon',    role:'Data Analyst',      status:'Shortlisted', date:'2026-03-26' },
  { id:4, company:'Meta',      role:'Product Designer',  status:'Rejected',    date:'2026-03-15' },
  { id:5, company:'Netflix',   role:'Backend Developer', status:'Applied',     date:'2026-03-27' },
];

const SS = {
  Applied:     { bg:'rgba(139,0,32,0.15)',   color:'#e05a77', border:'rgba(139,0,32,0.4)' },
  Shortlisted: { bg:'rgba(255,255,255,0.07)', color:'#ccc',   border:'rgba(255,255,255,0.18)' },
  Interview:   { bg:'rgba(200,140,0,0.12)',  color:'#d4a843', border:'rgba(200,140,0,0.3)' },
  Offer:       { bg:'rgba(22,120,60,0.15)',  color:'#4ade80', border:'rgba(22,120,60,0.3)' },
  Rejected:    { bg:'rgba(60,60,60,0.2)',    color:'#666',    border:'rgba(100,100,100,0.25)' },
};

const ApplicationList = () => (
  <div style={{ padding:'32px 40px', animation:'fadeIn 0.35s ease' }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
      <div>
        <p style={{ fontSize:11, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Pipeline</p>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:26, fontWeight:700, color:'#fff' }}>All Applications</h1>
      </div>
      <Link to="/add" style={{ padding:'9px 22px', borderRadius:8, fontSize:13.5, fontWeight:600, color:'#fff', textDecoration:'none', background:`linear-gradient(135deg,${B},${BL})`, boxShadow:'0 3px 12px rgba(139,0,32,0.4)' }}>
        + Add Application
      </Link>
    </div>

    <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, overflow:'hidden' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            {['Company','Role','Status','Date Applied','Actions'].map(h=>(
              <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:10.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', color:'#333' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {APPS.map((app,i)=>{
            const s = SS[app.status]||{};
            return (
              <tr key={app.id}
                style={{ borderBottom: i<APPS.length-1 ? '1px solid rgba(255,255,255,0.04)':'none', transition:'background 0.1s' }}
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
                  {new Date(app.date).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}
                </td>
                <td style={{ padding:'14px 20px' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    <Link to={`/applications/${app.id}`} style={{ padding:'5px 13px', borderRadius:7, fontSize:12, fontWeight:500, background:'rgba(139,0,32,0.12)', color:'#d06070', border:`1px solid ${BOR}`, textDecoration:'none' }}>View</Link>
                    <button style={{ padding:'5px 13px', borderRadius:7, fontSize:12, fontWeight:500, background:'rgba(255,255,255,0.04)', color:'#555', border:'1px solid rgba(255,255,255,0.07)', cursor:'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default ApplicationList;
