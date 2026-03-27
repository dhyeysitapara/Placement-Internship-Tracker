import { useParams, useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  Applied: '#6c63ff',
  Shortlisted: '#f59e0b',
  Interview: '#10b981',
  Offer: '#3b82f6',
  Rejected: '#ef4444',
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Will fetch from API in Checkpoint 2
  const application = null;

  if (!application) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>Application Detail</h3>
          <p>Application ID: <strong>{id}</strong></p>
          <p>Full details will be available in Checkpoint 2 with API integration.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/applications')}>
            ← Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{application.company}</h1>
          <p className="page-subtitle">{application.role}</p>
        </div>
        <span
          className="badge badge-lg"
          style={{ backgroundColor: STATUS_COLORS[application.status] }}
        >
          {application.status}
        </span>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <span className="detail-label">Date Applied</span>
          <span>{new Date(application.dateApplied).toLocaleDateString()}</span>
        </div>
        {application.interviewDate && (
          <div className="detail-row">
            <span className="detail-label">Interview Date</span>
            <span>{new Date(application.interviewDate).toLocaleDateString()}</span>
          </div>
        )}
        {application.jobLink && (
          <div className="detail-row">
            <span className="detail-label">Job Link</span>
            <a href={application.jobLink} target="_blank" rel="noreferrer">View Posting ↗</a>
          </div>
        )}
        {application.notes && (
          <div className="detail-row">
            <span className="detail-label">Notes</span>
            <span>{application.notes}</span>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/applications')}>
          ← Back
        </button>
        <button className="btn btn-primary">Edit Application</button>
        <button className="btn btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default ApplicationDetail;
