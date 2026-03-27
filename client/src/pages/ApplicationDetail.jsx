import { useParams, useNavigate } from 'react-router-dom';

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

const STEPS = ['Applied','Shortlisted','Interview','Offer'];
const STEP_NUM = { Applied:1, Shortlisted:2, Interview:3, Offer:4, Rejected:4 };

const MOCK = {
  _id:'1', company:'Microsoft', role:'Frontend Engineer', status:'Interview',
  dateApplied:'2026-03-20', interviewDate:'2026-03-29',
  jobLink:'https://careers.microsoft.com',
  notes:'Recruiter mentioned focus on React hooks and system design. Prepare performance optimization and lazy loading.',
};

const FMT = d => new Date(d).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'});
const card = { background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14 };

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = MOCK;
  const s = SS[app.status] || {};
  const step = STEP_NUM[app.status] || 1;

  return (
    <div style={{ padding:'32px 40px', animation:'fadeIn 0.35s ease', maxWidth:840, margin:'0 auto' }}>

      {/* Actions Row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <button onClick={()=>navigate('/')} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:13.5, fontWeight:500 }}>
          ← Back
        </button>
        <div style={{ display:'flex', gap:10 }}>
          <button style={{ padding:'7px 18px', borderRadius:8, fontSize:13, fontWeight:500, background:`rgba(139,0,32,0.15)`, color:'#d06070', border:`1px solid ${BOR}`, cursor:'pointer' }}>Edit</button>
          <button style={{ padding:'7px 18px', borderRadius:8, fontSize:13, fontWeight:500, background:'rgba(255,255,255,0.03)', color:'#555', border:'1px solid rgba(255,255,255,0.07)', cursor:'pointer' }}>Delete</button>
        </div>
      </div>

      {/* Main Card */}
      <div style={{ ...card, overflow:'hidden', marginBottom:14 }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${B},${BL})` }} />
        <div style={{ padding:'28px 32px' }}>

          {/* Company header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:50, height:50, borderRadius:11, background:`rgba(139,0,32,0.15)`, border:`1px solid ${BOR}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:20, color:'#c0405a' }}>
                {app.company[0]}
              </div>
              <div>
                <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:22, fontWeight:700, color:'#fff', marginBottom:4 }}>{app.company}</h1>
                <p style={{ color:'#555', fontSize:14 }}>{app.role}</p>
              </div>
            </div>
            <span style={{ padding:'5px 15px', borderRadius:99, fontSize:11.5, fontWeight:700, textTransform:'uppercase', background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
              {app.status}
            </span>
          </div>

          {/* Timeline */}
          <div style={{ marginBottom:28, paddingBottom:26, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#333', marginBottom:18 }}>Progress</p>
            <div style={{ display:'flex', alignItems:'center', position:'relative' }}>
              <div style={{ position:'absolute', top:18, left:18, right:18, height:2, background:'rgba(255,255,255,0.06)', zIndex:0 }} />
              <div style={{ position:'absolute', top:18, left:18, width:`${(step-1)*33.33}%`, height:2, background:`linear-gradient(90deg,${B},${BL})`, zIndex:1 }} />
              {STEPS.map((name,i)=>{
                const n=i+1, done=step>=n, cur=step===n;
                return (
                  <div key={name} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:2 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background: done ? `linear-gradient(135deg,${B},${BL})` : 'rgba(255,255,255,0.04)', border: done ? 'none' : '2px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color: done ? '#fff' : '#333', boxShadow: cur ? `0 0 0 5px rgba(139,0,32,0.2)` : 'none' }}>
                      {done ? '✓' : n}
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color: done ? '#888' : '#333', marginTop:8 }}>{name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info rows */}
          {[
            { label:'Date Applied',   val: FMT(app.dateApplied), col:'#e0e0e0' },
            app.interviewDate && { label:'Interview Date', val: FMT(app.interviewDate), col:'#d4a843' },
          ].filter(Boolean).map(r=>(
            <div key={r.label} style={{ display:'flex', alignItems:'center', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ width:150, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#333' }}>{r.label}</span>
              <span style={{ fontSize:14, color: r.col }}>{r.val}</span>
            </div>
          ))}
          {app.jobLink && (
            <div style={{ display:'flex', alignItems:'center', padding:'12px 0' }}>
              <span style={{ width:150, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#333' }}>Job Link</span>
              <a href={app.jobLink} target="_blank" rel="noreferrer" style={{ fontSize:14, color:BL, textDecoration:'none' }}>View Posting →</a>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {app.notes && (
        <div style={{ ...card, padding:'24px 32px' }}>
          <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#333', marginBottom:14 }}>Notes</p>
          <p style={{ color:'#666', lineHeight:1.8, fontSize:14 }}>{app.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;
