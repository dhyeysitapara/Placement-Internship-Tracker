import { useState, useRef, useEffect } from 'react';

const B = '#8B0020';
const ChevronDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

const inp = { width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:'11px 14px', color:'#e8e8e8', fontSize:14, fontFamily:'Inter,sans-serif', outline:'none', transition:'border-color 0.2s', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', userSelect:'none' };

const Dropdown = ({ options, value, onChange, placeholder = "Select...", style = {} }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position:'relative', width:'100%', ...style }}>
      <div 
        onClick={() => setOpen(!open)}
        style={{ ...inp, borderColor: open ? B : 'rgba(255,255,255,0.07)' }}
      >
        <span style={{ color: value && value !== 'All' ? '#fff' : '#aaa' }}>{value === 'All' ? placeholder : value}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s ease', display:'flex', color:'#888' }}><ChevronDown /></span>
      </div>
      {open && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, marginTop:6, background:'#0f0f0f', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, overflow:'hidden', zIndex:10, boxShadow:'0 10px 25px rgba(0,0,0,0.5)', animation:'fadeIn 0.2s ease' }}>
          {options.map(opt => {
            const label = typeof opt === 'object' ? opt.label : opt;
            const val = typeof opt === 'object' ? opt.value : opt;
            const isSelected = value === val;
            return (
              <div key={val}
                onClick={() => { onChange(val); setOpen(false); }}
                style={{ padding:'10px 14px', fontSize:13.5, color:isSelected ? '#fff' : '#aaa', background:isSelected ? 'rgba(255,255,255,0.05)' : 'transparent', cursor:'pointer', transition:'background 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                onMouseLeave={e=>e.currentTarget.style.background=isSelected ? 'rgba(255,255,255,0.05)' : 'transparent'}
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
