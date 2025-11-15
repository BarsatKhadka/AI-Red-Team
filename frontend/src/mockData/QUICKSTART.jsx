/**
 * QUICK START GUIDE
 * Copy-paste these examples to get started immediately
 */

// ============================================================================
// 1. BASIC IMPORT - Copy this to your component
// ============================================================================

import { 
  staticProjectFiles, 
  deliverables, 
  projectPlan, 
  teamMembers,
  generateSummaryPlaceholder,
  generateReviewPlaceholder,
  notifyTeamPlaceholder
} from './mockData';


// ============================================================================
// 2. DISPLAY DELIVERABLES - Ready-to-use React component
// ============================================================================

function DeliverablesDisplay() {
  return (
    <div className="deliverables-container">
      <h2>Project Deliverables</h2>
      {deliverables.map(deliverable => (
        <div key={deliverable.id} className="deliverable-card">
          <h3>{deliverable.title}</h3>
          
          {/* Status badge */}
          <span className={`status-badge status-${deliverable.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {deliverable.status}
          </span>
          
          {/* Metadata */}
          <p>Uploaded by: {deliverable.uploadedBy}</p>
          <p>Date: {new Date(deliverable.uploadDate).toLocaleDateString()}</p>
          
          {/* AI Summary (placeholder) */}
          <div className="ai-summary">
            <strong>Summary:</strong>
            <p>{deliverable.aiSummaryPlaceholder}</p>
          </div>
          
          {/* AI Review (placeholder) */}
          <div className="ai-review">
            <strong>Review:</strong>
            <p>{deliverable.aiReviewPlaceholder}</p>
          </div>
        </div>
      ))}
    </div>
  );
}


// ============================================================================
// 3. TEAM MEMBERS LIST - Ready-to-use React component
// ============================================================================

function TeamMembersList() {
  return (
    <div className="team-container">
      <h2>Team Members</h2>
      <div className="team-grid">
        {teamMembers.map(member => (
          <div key={member.id} className="team-card">
            <img src={member.avatar} alt={member.name} className="avatar" />
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p className="email">{member.email}</p>
            <p className="department">{member.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================================================
// 4. PROJECT MILESTONES - Ready-to-use React component
// ============================================================================

function MilestonesTimeline() {
  return (
    <div className="milestones-container">
      <h2>Project Milestones</h2>
      {projectPlan.milestones.map(milestone => (
        <div key={milestone.id} className={`milestone milestone-${milestone.status}`}>
          <h3>{milestone.name}</h3>
          <p className="due-date">Due: {milestone.dueDate}</p>
          <p className="description">{milestone.description}</p>
          <div className="deliverables-list">
            <strong>Expected Deliverables:</strong>
            <ul>
              {milestone.deliverables.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}


// ============================================================================
// 5. FILE BROWSER - Ready-to-use React component
// ============================================================================

function FileBrowser() {
  return (
    <div className="file-browser">
      <h2>Project Files</h2>
      <table className="file-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>File Name</th>
            <th>Summary</th>
            <th>Uploaded By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {staticProjectFiles.map(file => (
            <tr key={file.id}>
              <td>
                <span className={`file-icon file-${file.fileType}`}>
                  {file.fileType}
                </span>
              </td>
              <td>{file.fileName}</td>
              <td>{file.summary}</td>
              <td>{file.uploadedBy}</td>
              <td>{new Date(file.uploadDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// ============================================================================
// 6. USE PLACEHOLDER FUNCTIONS - Example usage
// ============================================================================

function DeliverableDetailView({ deliverableId }) {
  // Find the deliverable
  const deliverable = deliverables.find(d => d.id === deliverableId);
  
  if (!deliverable) return <div>Deliverable not found</div>;
  
  // Generate AI summary (placeholder)
  const summary = generateSummaryPlaceholder(deliverable);
  
  // Generate AI review (placeholder)
  const review = generateReviewPlaceholder(deliverable, projectPlan);
  
  // Handle notification
  const handleNotify = () => {
    const result = notifyTeamPlaceholder(summary);
    console.log('Notification sent:', result);
    alert('Notification sent to team members (placeholder)');
  };
  
  return (
    <div className="deliverable-detail">
      <h2>{deliverable.title}</h2>
      <p>Status: {deliverable.status}</p>
      
      <div className="ai-sections">
        <section className="ai-summary-section">
          <h3>AI-Generated Summary</h3>
          <p>{summary}</p>
        </section>
        
        <section className="ai-review-section">
          <h3>AI Review vs Project Plan</h3>
          <p>{review}</p>
        </section>
      </div>
      
      <button onClick={handleNotify}>
        Notify Team Members
      </button>
    </div>
  );
}


// ============================================================================
// 7. STATISTICS DASHBOARD - Ready-to-use React component
// ============================================================================

import { getProjectStatistics } from './mockData';

function ProjectStatsDashboard() {
  const stats = getProjectStatistics();
  
  return (
    <div className="stats-dashboard">
      <h2>Project Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalFiles}</h3>
          <p>Total Files</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats.totalDeliverables}</h3>
          <p>Deliverables</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats.totalMilestones}</h3>
          <p>Milestones</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats.totalTeamMembers}</h3>
          <p>Team Members</p>
        </div>
      </div>
      
      <div className="progress-section">
        <h3>Deliverables Progress</h3>
        <div className="progress-bar">
          <div className="approved" style={{width: `${(stats.deliverablesByStatus.approved / stats.totalDeliverables) * 100}%`}}>
            {stats.deliverablesByStatus.approved} Approved
          </div>
          <div className="pending" style={{width: `${(stats.deliverablesByStatus.pending / stats.totalDeliverables) * 100}%`}}>
            {stats.deliverablesByStatus.pending} Pending
          </div>
          <div className="revision" style={{width: `${(stats.deliverablesByStatus.needsRevision / stats.totalDeliverables) * 100}%`}}>
            {stats.deliverablesByStatus.needsRevision} Needs Revision
          </div>
        </div>
      </div>
      
      <div className="milestones-section">
        <h3>Milestones Progress</h3>
        <p>✅ Completed: {stats.milestonesByStatus.completed}</p>
        <p>🚧 In Progress: {stats.milestonesByStatus.inProgress}</p>
        <p>📅 Planned: {stats.milestonesByStatus.planned}</p>
      </div>
    </div>
  );
}


// ============================================================================
// 8. FILTER DELIVERABLES - Example with helper functions
// ============================================================================

import { getDeliverablesByStatus } from './mockData';

function FilteredDeliverables() {
  const [filter, setFilter] = React.useState('all');
  
  const getFilteredDeliverables = () => {
    if (filter === 'all') return deliverables;
    return getDeliverablesByStatus(filter);
  };
  
  const filtered = getFilteredDeliverables();
  
  return (
    <div>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All ({deliverables.length})</button>
        <button onClick={() => setFilter('Approved')}>Approved</button>
        <button onClick={() => setFilter('Pending Review')}>Pending</button>
        <button onClick={() => setFilter('Needs Revision')}>Needs Revision</button>
      </div>
      
      <div className="deliverables-list">
        {filtered.map(d => (
          <div key={d.id}>{d.title} - {d.status}</div>
        ))}
      </div>
    </div>
  );
}


// ============================================================================
// 9. SUGGESTED CSS STYLES - Copy to your CSS file
// ============================================================================

/*
.deliverable-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: white;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-approved {
  background: #d1fae5;
  color: #065f46;
}

.status-pending-review {
  background: #fef3c7;
  color: #92400e;
}

.status-needs-revision {
  background: #fee2e2;
  color: #991b1b;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.team-card {
  text-align: center;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}
*/


// ============================================================================
// 10. COPY-PASTE STARTER - Minimal example to get started NOW
// ============================================================================

// Just copy this entire component and paste it into your App.jsx or Dashboard.jsx

import { deliverables, teamMembers, projectPlan } from './mockData';

export function QuickStartComponent() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>AI Red Team Platform - Mock Data Demo</h1>
      
      {/* Deliverables */}
      <section style={{ marginBottom: '40px' }}>
        <h2>📦 Deliverables ({deliverables.length})</h2>
        {deliverables.map(d => (
          <div key={d.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <h3>{d.title}</h3>
            <p><strong>Status:</strong> {d.status}</p>
            <p><strong>Uploaded by:</strong> {d.uploadedBy}</p>
            <p><em>{d.aiSummaryPlaceholder}</em></p>
          </div>
        ))}
      </section>
      
      {/* Team Members */}
      <section style={{ marginBottom: '40px' }}>
        <h2>👥 Team ({teamMembers.length})</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          {teamMembers.map(m => (
            <div key={m.id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center',
              minWidth: '150px'
            }}>
              <img src={m.avatar} alt={m.name} style={{ width: '60px', borderRadius: '50%' }} />
              <h4>{m.name}</h4>
              <p>{m.role}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Milestones */}
      <section>
        <h2>🎯 Milestones ({projectPlan.milestones.length})</h2>
        {projectPlan.milestones.map(m => (
          <div key={m.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <h3>{m.name}</h3>
            <p><strong>Status:</strong> {m.status}</p>
            <p><strong>Due:</strong> {m.dueDate}</p>
            <p>{m.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

// Export everything for easy access
export {
  DeliverablesDisplay,
  TeamMembersList,
  MilestonesTimeline,
  FileBrowser,
  DeliverableDetailView,
  ProjectStatsDashboard,
  FilteredDeliverables,
  QuickStartComponent
};
