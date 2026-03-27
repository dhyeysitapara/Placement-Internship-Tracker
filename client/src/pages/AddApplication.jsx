import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const B   = '#8B0020';
const BL  = '#b5002a';

const inp = { width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:'11px 14px', color:'#e8e8e8', fontSize:14, fontFamily:'Inter,sans-serif', outline:'none', transition:'border-color 0.2s' };
const label = { display:'block', marginBottom:7, fontSize:11, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.08em' };
const STATUS_OPTIONS = ['Applied','Shortlisted','Interview','Offer','Rejected'];

const AddApplication = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ company:'', role:'', status:'Applied', dateApplied: new Date().toISOString().split('T')[0], interviewDate:'', jobLink:'', notes:'' });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={{ padding:'32px 40px', animation:'fadeIn 0.35s ease', maxWidth:860, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Applications</p>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:26, fontWeight:700, color:'#fff' }}>Add New Application</h1>
      </div>

      <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden' }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${B},${BL})` }} />
        <form onSubmit={e=>{ e.preventDefault(); alert('API connecting in Checkpoint 2!\n'+JSON.stringify(form,null,2)); }} style={{ padding:'32px 36px' }}>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px 28px', marginBottom:18 }}>
            <div>
              <label style={label}>Company Name *</label>
              <input name="company" value={form.company} onChange={onChange} placeholder="e.g. Google, Infosys" style={inp} required
                onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
            </div>
            <div>
              <label style={label}>Job Role *</label>
              <input name="role" value={form.role} onChange={onChange} placeholder="e.g. SDE Intern, Data Analyst" style={inp} required
                onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'18px 28px', marginBottom:18 }}>
            <div>
              <label style={label}>Status</label>
              <select name="status" value={form.status} onChange={onChange} style={{ ...inp, cursor:'pointer' }}>
                {STATUS_OPTIONS.map(s=><option key={s} value={s} style={{ background:'#0f0f0f' }}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Date Applied</label>
              <input name="dateApplied" type="date" value={form.dateApplied} onChange={onChange} style={{ ...inp, colorScheme:'dark' }}
                onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
            </div>
            <div>
              <label style={label}>Interview Date <span style={{ color:'#333', fontWeight:400 }}>(Optional)</span></label>
              <input name="interviewDate" type="date" value={form.interviewDate} onChange={onChange} style={{ ...inp, colorScheme:'dark' }}
                onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
            </div>
          </div>

          <div style={{ marginBottom:18 }}>
            <label style={label}>Job Link</label>
            <input name="jobLink" type="url" value={form.jobLink} onChange={onChange} placeholder="https://..." style={inp}
              onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
          </div>

          <div style={{ marginBottom:28 }}>
            <label style={label}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={onChange} rows={4}
              placeholder="Recruiter contacts, prep notes, follow-up reminders..."
              style={{ ...inp, resize:'vertical', lineHeight:1.65 }}
              onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'flex-end', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:22 }}>
            <button type="button" onClick={()=>navigate('/')} style={{ padding:'10px 24px', borderRadius:8, fontSize:14, fontWeight:500, color:'#555', background:'transparent', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding:'10px 28px', borderRadius:8, fontSize:14, fontWeight:600, color:'#fff', background:`linear-gradient(135deg,${B},${BL})`, border:'none', cursor:'pointer', boxShadow:`0 4px 14px rgba(139,0,32,0.4)` }}>
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplication;
