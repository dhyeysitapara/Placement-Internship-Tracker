import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  Applied: '#6c63ff',
  Shortlisted: '#f59e0b',
  Interview: '#10b981',
  Offer: '#3b82f6',
  Rejected: '#ef4444',
};

const ApplicationList = () => {
  // Will fetch from API in Checkpoint 2
  const applications = [];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Applications</h1>
        <Link to="/add" className="btn btn-primary">+ Add Application</Link>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No applications yet</h3>
          <p>Start by adding your first internship or job application.</p>
          <Link to="/add" className="btn btn-primary">Add Application</Link>
        </div>
      ) : (
        <div className="applications-table">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.company}</td>
                  <td>{app.role}</td>
                  <td>
                    <span
                      className="badge"
                      style={{ backgroundColor: STATUS_COLORS[app.status] }}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/applications/${app._id}`} className="btn btn-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
