import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];

const AddApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    interviewDate: '',
    jobLink: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Will call API in Checkpoint 2
    console.log('Form submitted:', formData);
    alert('Feature coming in Checkpoint 2! Data: ' + JSON.stringify(formData, null, 2));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add Application</h1>
        <p className="page-subtitle">Track a new internship or job application</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google, Infosys"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <input
                id="role"
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. SDE Intern, Data Analyst"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dateApplied">Date Applied</label>
              <input
                id="dateApplied"
                type="date"
                name="dateApplied"
                value={formData.dateApplied}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="interviewDate">Interview Date (if any)</label>
              <input
                id="interviewDate"
                type="date"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="jobLink">Job Link</label>
              <input
                id="jobLink"
                type="url"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Any notes, contacts, or reminders..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/applications')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddApplication;
