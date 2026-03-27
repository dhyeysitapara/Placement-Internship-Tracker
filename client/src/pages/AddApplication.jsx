import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import Dropdown from '../components/Dropdown';
import DatePicker from '../components/DatePicker';
import { useToast } from '../components/Toast';

const B   = '#8B0020';
const BL  = '#b5002a';
const BOR = 'rgba(139,0,32,0.3)';

const inp = { width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:'11px 14px', color:'#e8e8e8', fontSize:14, fontFamily:'Inter,sans-serif', outline:'none', transition:'border-color 0.2s' };
const label = { display:'block', marginBottom:7, fontSize:11, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:'0.08em' };

const STATUS_OPTIONS = ['Applied','Shortlisted','Interview','Offer','Rejected'];
const ROUND_TYPES = ['Online Assessment','Technical Round','Coding Round','HR Round','Managerial Round','Group Discussion','Case Study','System Design','Culture Fit'];

const AddApplication = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    company:'', role:'', status:'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    jobLink:'', notes:'',
    interviewRounds: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // Round handlers
  const addRound = () => {
    setForm({ ...form, interviewRounds: [...form.interviewRounds, { roundType: 'Technical Round', date: '', notes: '' }] });
  };

  const removeRound = (idx) => {
    setForm({ ...form, interviewRounds: form.interviewRounds.filter((_, i) => i !== idx) });
  };

  const updateRound = (idx, field, val) => {
    const rounds = [...form.interviewRounds];
    rounds[idx] = { ...rounds[idx], [field]: val };
    setForm({ ...form, interviewRounds: rounds });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.company.trim()) newErrors.company = 'Company name is required';
    if (!form.role.trim()) newErrors.role = 'Job role is required';
    form.interviewRounds.forEach((r, i) => {
      if (!r.date) newErrors[`round_${i}`] = 'Date is required for each round';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form };
      await axios.post('/api/applications', payload);
      showToast('Application added successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      showToast('Error saving application', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding:'32px 40px', animation:'fadeIn 0.35s ease', maxWidth:860, margin:'0 auto' }}>
      <div style={{ marginBottom:28 }}>
        <p style={{ fontSize:11, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:5 }}>Applications</p>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:26, fontWeight:700, color:'#fff' }}>Add New Application</h1>
      </div>

      <div style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden' }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${B},${BL})` }} />
        <form onSubmit={handleSubmit} style={{ padding:'32px 36px' }}>

          {/* Company & Role */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px 28px', marginBottom:18 }}>
            <div>
              <label style={label}>Company Name *</label>
              <input name="company" value={form.company} onChange={onChange} placeholder="e.g. Google, Infosys"
                style={{ ...inp, borderColor: errors.company ? B : 'rgba(255,255,255,0.07)' }}
                onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor=errors.company ? B : 'rgba(255,255,255,0.07)'} />
              {errors.company && <p style={{ color:B, fontSize:10, marginTop:5, fontWeight:600 }}>{errors.company}</p>}
            </div>
            <div>
              <label style={label}>Job Role *</label>
              <input name="role" value={form.role} onChange={onChange} placeholder="e.g. SDE Intern, Data Analyst"
                style={{ ...inp, borderColor: errors.role ? B : 'rgba(255,255,255,0.07)' }}
                onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor=errors.role ? B : 'rgba(255,255,255,0.07)'} />
              {errors.role && <p style={{ color:B, fontSize:10, marginTop:5, fontWeight:600 }}>{errors.role}</p>}
            </div>
          </div>

          {/* Status & Date Applied */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px 28px', marginBottom:18 }}>
            <div>
              <label style={label}>Status</label>
              <Dropdown options={STATUS_OPTIONS} value={form.status} onChange={val => setForm({ ...form, status: val })} />
            </div>
            <div>
              <label style={label}>Date Applied</label>
              <DatePicker value={form.dateApplied} onChange={val => setForm({ ...form, dateApplied: val })} />
            </div>
          </div>

          {/* Job Link */}
          <div style={{ marginBottom:18 }}>
            <label style={label}>Job Link <span style={{ color:'#333', fontWeight:400 }}>(Optional)</span></label>
            <input name="jobLink" type="url" value={form.jobLink} onChange={onChange} placeholder="https://..."
              style={inp} onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
          </div>

          {/* Interview Rounds */}
          <div style={{ marginBottom:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <label style={{ ...label, margin:0 }}>Interview Rounds <span style={{ color:'#333', fontWeight:400, textTransform:'none' }}>(Optional)</span></label>
              <button type="button" onClick={addRound} style={{ padding:'6px 16px', borderRadius:7, fontSize:12, fontWeight:600, background:`rgba(139,0,32,0.15)`, color:'#d06070', border:`1px solid ${BOR}`, cursor:'pointer' }}>
                + Add Round
              </button>
            </div>

            {form.interviewRounds.length === 0 ? (
              <div style={{ border:'1px dashed rgba(255,255,255,0.07)', borderRadius:9, padding:'18px', textAlign:'center', color:'#333', fontSize:13 }}>
                No rounds added. Click "+ Add Round" to track interview stages.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {form.interviewRounds.map((round, idx) => (
                  <div key={idx} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:'16px' }}>
                    <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:10 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:26, height:26, borderRadius:'50%', background:`linear-gradient(135deg,${B},${BL})`, fontSize:11, fontWeight:700, color:'#fff', flexShrink:0, marginTop:11 }}>{idx + 1}</div>
                      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
                        <div>
                          <label style={label}>Round Type</label>
                          <Dropdown options={ROUND_TYPES} value={round.roundType} onChange={val => updateRound(idx, 'roundType', val)} />
                        </div>
                        <div>
                          <label style={label}>Date *</label>
                          <DatePicker value={round.date} onChange={val => { updateRound(idx, 'date', val); if (errors[`round_${idx}`]) setErrors({ ...errors, [`round_${idx}`]: '' }); }}
                            style={{ borderColor: errors[`round_${idx}`] ? B : 'rgba(255,255,255,0.07)' }} />
                          {errors[`round_${idx}`] && <p style={{ color:B, fontSize:10, marginTop:5, fontWeight:600 }}>{errors[`round_${idx}`]}</p>}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeRound(idx)} style={{ background:'transparent', border:'none', color:'#444', cursor:'pointer', fontSize:16, marginTop:22, flexShrink:0 }}>✕</button>
                    </div>
                    <div style={{ paddingLeft:38 }}>
                      <label style={label}>Notes <span style={{ color:'#333', fontWeight:400, textTransform:'none' }}>(Optional)</span></label>
                      <input value={round.notes} onChange={e => updateRound(idx, 'notes', e.target.value)} placeholder="e.g. Leetcode medium, 2 DSA questions..."
                        style={inp} onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div style={{ marginBottom:28 }}>
            <label style={label}>General Notes</label>
            <textarea name="notes" value={form.notes} onChange={onChange} rows={3}
              placeholder="Recruiter contacts, preparation notes, follow-up reminders..."
              style={{ ...inp, resize:'vertical', lineHeight:1.65 }}
              onFocus={e=>e.target.style.borderColor=B} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.07)'} />
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'flex-end', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:22 }}>
            <button type="button" onClick={() => navigate('/')} style={{ padding:'10px 24px', borderRadius:8, fontSize:14, fontWeight:500, color:'#555', background:'transparent', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ padding:'10px 28px', borderRadius:8, fontSize:14, fontWeight:600, color:'#fff', background:loading? '#555' : `linear-gradient(135deg,${B},${BL})`, border:'none', cursor:loading?'not-allowed':'pointer', boxShadow:`0 4px 14px rgba(139,0,32,0.4)` }}>
              {loading ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplication;
