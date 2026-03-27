const Dashboard = () => {
  // Summary cards data (will be dynamic in Checkpoint 2+)
  const stats = [
    { label: 'Total Applied', value: 0, color: '#6c63ff', icon: '📨' },
    { label: 'Shortlisted', value: 0, color: '#f59e0b', icon: '✅' },
    { label: 'Interviews', value: 0, color: '#10b981', icon: '📅' },
    { label: 'Offers', value: 0, color: '#3b82f6', icon: '🎉' },
    { label: 'Rejected', value: 0, color: '#ef4444', icon: '❌' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Overview of your placement journey</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <span className="stat-icon">{stat.icon}</span>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-note">
        <p>📌 Add your first application to get started!</p>
      </div>
    </div>
  );
};

export default Dashboard;
