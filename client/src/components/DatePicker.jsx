import { useState, useRef, useEffect } from 'react';

const B = '#8B0020';
const BL = '#b5002a';
const ChevronLeft = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const ChevronRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
const CalendarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;

const inp = { width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:'11px 14px', color:'#e8e8e8', fontSize:14, fontFamily:'Inter,sans-serif', outline:'none', transition:'border-color 0.2s', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', userSelect:'none' };

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DatePicker = ({ value, onChange, placeholder = "Select date...", style = {}, clearable = false }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split('T')[0];
  };

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(formatDate(selectedDate));
    setOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear());
  const firstDay = getFirstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear());
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();
  };

  const isSelected = (day) => {
    if (!value) return false;
    const d = new Date(value);
    return d.getDate() === day && d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
  };

  return (
    <div ref={ref} style={{ position:'relative', width:'100%', ...style }}>
      <div 
        onClick={() => setOpen(!open)}
        style={{ ...inp, borderColor: open ? B : 'rgba(255,255,255,0.07)' }}
      >
        <span style={{ color: value ? '#fff' : '#aaa' }}>{value ? value : placeholder}</span>
        <span style={{ display:'flex', color:'#888' }}><CalendarIcon /></span>
      </div>
      {open && (
        <div style={{ position:'absolute', top:'100%', left:0, marginTop:6, background:'#0f0f0f', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, overflow:'hidden', zIndex:50, boxShadow:'0 15px 35px rgba(0,0,0,0.6)', width:280, padding:12, animation:'fadeIn 0.2s ease' }}>
          
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <div style={{ display:'flex', gap:4 }}>
              <button type="button" onClick={handlePrevMonth} style={{ background:'transparent', border:'none', color:'#888', cursor:'pointer', padding:4 }}><ChevronLeft /></button>
              <button type="button" onClick={handleNextMonth} style={{ background:'transparent', border:'none', color:'#888', cursor:'pointer', padding:4 }}><ChevronRight /></button>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:2, marginBottom:4 }}>
            {days.map(d => <div key={d} style={{ fontSize:10, color:'#444', fontWeight:700, textAlign:'center', textTransform:'uppercase' }}>{d}</div>)}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:2 }}>
            {calendarDays.map((d, i) => (
              <div key={i} 
                onClick={() => d && handleDateClick(d)}
                style={{ 
                  height:32, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, borderRadius:6, cursor: d ? 'pointer' : 'default',
                  color: isSelected(d) ? '#fff' : (d ? '#bbb' : 'transparent'),
                  background: isSelected(d) ? B : (isToday(d) ? 'rgba(255,255,255,0.05)' : 'transparent'),
                  border: isToday(d) ? `1px solid ${B}` : '1px solid transparent',
                  transition:'all 0.15s'
                }}
                onMouseEnter={e => d && !isSelected(d) && (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => d && !isSelected(d) && (e.currentTarget.style.background = isToday(d) ? 'rgba(255,255,255,0.05)' : 'transparent')}
              >
                {d}
              </div>
            ))}
          </div>

          {clearable && value && (
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', marginTop:12, paddingTop:8 }}>
              <button type="button" onClick={() => { onChange(''); setOpen(false); }} style={{ width:'100%', background:'transparent', border:'none', color:'#444', fontSize:11, fontWeight:700, cursor:'pointer', textAlign:'center', textTransform:'uppercase', letterSpacing:'0.05em' }}>Clear Date</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
