import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  generateSummaryPlaceholder, 
  generateReviewPlaceholder,
  notifyTeamPlaceholder 
} from '../mockData';
import { projectPlan } from '../mockData';

/**
 * DeliverableCard Component
 * Displays deliverable with AI placeholders and action buttons
 */
const DeliverableCard = ({ deliverable, onStatusChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localStatus, setLocalStatus] = useState(deliverable.status);
  const [showNotification, setShowNotification] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      'Approved': 'status-approved',
      'Pending Review': 'status-pending',
      'Needs Revision': 'status-revision'
    };
    return colors[status] || 'status-default';
  };

  // Handle approve
  const handleApprove = () => {
    const newStatus = 'Approved';
    setLocalStatus(newStatus);
    
    // Generate AI summary for notification
    const summary = generateSummaryPlaceholder(deliverable);
    
    // Show notification
    const result = notifyTeamPlaceholder(summary);
    console.log('Approval notification:', result);
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // Call parent callback
    if (onStatusChange) {
      onStatusChange(deliverable.id, newStatus);
    }
  };

  // Handle needs revision
  const handleNeedsRevision = () => {
    const newStatus = 'Needs Revision';
    setLocalStatus(newStatus);
    
    // Generate AI review for notification
    const review = generateReviewPlaceholder(deliverable, projectPlan);
    
    // Show notification
    const result = notifyTeamPlaceholder(review);
    console.log('Revision notification:', result);
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    
    // Call parent callback
    if (onStatusChange) {
      onStatusChange(deliverable.id, newStatus);
    }
  };

  return (
    <div className={`deliverable-card ${isExpanded ? 'expanded' : ''}`}>
      {/* Notification Toast */}
      {showNotification && (
        <div className="notification-toast">
          ✅ Team members notified successfully!
        </div>
      )}

      {/* Header */}
      <div className="deliverable-header">
        <div className="deliverable-title-section">
          <h3 className="deliverable-title">{deliverable.title}</h3>
          <span className={`status-badge ${getStatusColor(localStatus)}`}>
            {localStatus}
          </span>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="expand-btn"
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Basic Info */}
      <div className="deliverable-meta">
        <div className="meta-item">
          <span className="meta-label">📦 File:</span>
          <span className="meta-value">{deliverable.fileName}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">👤 Uploaded by:</span>
          <span className="meta-value">{deliverable.uploadedBy}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">📅 Date:</span>
          <span className="meta-value">{formatDate(deliverable.uploadDate)}</span>
        </div>
      </div>

      {/* AI Summary (Always visible) */}
      <div className="ai-summary-section">
        <h4 className="section-title">
          <span className="ai-badge">🤖 AI</span> Summary
        </h4>
        <div className="ai-content">
          {deliverable.aiSummaryPlaceholder || generateSummaryPlaceholder(deliverable)}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="deliverable-expanded">
          {/* AI Review */}
          <div className="ai-review-section">
            <h4 className="section-title">
              <span className="ai-badge">🤖 AI</span> Review vs Project Plan
            </h4>
            <div className="ai-content">
              {deliverable.aiReviewPlaceholder || generateReviewPlaceholder(deliverable, projectPlan)}
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h4 className="section-title">💬 Comments</h4>
            {deliverable.comments && deliverable.comments.length > 0 ? (
              <div className="comments-list">
                {deliverable.comments.map((comment, idx) => (
                  <div key={idx} className="comment">
                    {comment}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-comments">No comments yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="deliverable-actions">
        <button 
          onClick={handleApprove}
          className="action-btn approve-btn"
          disabled={localStatus === 'Approved'}
        >
          ✅ Approve Deliverable
        </button>
        <button 
          onClick={handleNeedsRevision}
          className="action-btn revision-btn"
          disabled={localStatus === 'Needs Revision'}
        >
          🔄 Needs Revision
        </button>
      </div>
    </div>
  );
};

DeliverableCard.propTypes = {
  deliverable: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    uploadedBy: PropTypes.string.isRequired,
    uploadDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    aiSummaryPlaceholder: PropTypes.string,
    aiReviewPlaceholder: PropTypes.string,
    comments: PropTypes.array
  }).isRequired,
  onStatusChange: PropTypes.func
};

export default DeliverableCard;
