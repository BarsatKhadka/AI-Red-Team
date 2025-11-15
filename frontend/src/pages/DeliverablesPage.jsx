import React, { useState } from 'react';
import { deliverables as initialDeliverables, teamMembers } from '../mockData';
import { 
  generateSummaryPlaceholder, 
  generateReviewPlaceholder 
} from '../mockData';
import { projectPlan } from '../mockData';
import DeliverableCard from '../components/DeliverableCard';
import Pagination from '../components/Pagination';

/**
 * DeliverablesPage Component
 * Displays and manages deliverables with AI placeholders
 */
const DeliverablesPage = () => {
  const [deliverables, setDeliverables] = useState(initialDeliverables);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    fileName: '',
    uploadedBy: teamMembers[0]?.name || 'Unknown',
    description: ''
  });

  // Filter deliverables by status
  const filteredDeliverables = filterStatus === 'all' 
    ? deliverables 
    : deliverables.filter(d => d.status === filterStatus);

  // Calculate pagination
  const totalItems = filteredDeliverables.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeliverables = filteredDeliverables.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle status change
  const handleStatusChange = (deliverableId, newStatus) => {
    setDeliverables(prevDeliverables =>
      prevDeliverables.map(d =>
        d.id === deliverableId ? { ...d, status: newStatus } : d
      )
    );
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    
    // Create new deliverable
    const newDeliverable = {
      id: `deliv-${Date.now()}`,
      title: uploadForm.title,
      fileName: uploadForm.fileName,
      uploadedBy: uploadForm.uploadedBy,
      uploadDate: new Date().toISOString(),
      status: 'Pending Review',
      aiSummaryPlaceholder: generateSummaryPlaceholder({ 
        title: uploadForm.title,
        description: uploadForm.description 
      }),
      aiReviewPlaceholder: generateReviewPlaceholder({ 
        title: uploadForm.title,
        description: uploadForm.description 
      }, projectPlan),
      comments: []
    };
    
    // Add to deliverables list
    setDeliverables(prev => [newDeliverable, ...prev]);
    
    // Reset form
    setUploadForm({
      title: '',
      fileName: '',
      uploadedBy: teamMembers[0]?.name || 'Unknown',
      description: ''
    });
    setShowUploadForm(false);
    setFilterStatus('all');
    setCurrentPage(1);
    
    // Show success message
    alert('✅ Deliverable uploaded successfully!');
  };

  // Get status counts
  const statusCounts = {
    all: deliverables.length,
    'Approved': deliverables.filter(d => d.status === 'Approved').length,
    'Pending Review': deliverables.filter(d => d.status === 'Pending Review').length,
    'Needs Revision': deliverables.filter(d => d.status === 'Needs Revision').length
  };

  return (
    <div className="deliverables-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">📦 Deliverables</h1>
          <p className="page-description">
            Manage project deliverables with AI-powered summaries and reviews
          </p>
        </div>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="upload-btn"
        >
          {showUploadForm ? '✖ Cancel Upload' : '➕ Upload Deliverable'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="upload-form-container">
          <h2 className="form-title">Upload New Deliverable</h2>
          <form onSubmit={handleUploadSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="title">Deliverable Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={uploadForm.title}
                onChange={handleInputChange}
                placeholder="e.g., Sprint 2 Frontend Implementation"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fileName">File Name *</label>
              <input
                type="text"
                id="fileName"
                name="fileName"
                value={uploadForm.fileName}
                onChange={handleInputChange}
                placeholder="e.g., sprint2_frontend.zip"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="uploadedBy">Uploaded By *</label>
              <select
                id="uploadedBy"
                name="uploadedBy"
                value={uploadForm.uploadedBy}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                {teamMembers.map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                name="description"
                value={uploadForm.description}
                onChange={handleInputChange}
                placeholder="Brief description of the deliverable..."
                rows="4"
                className="form-textarea"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                📤 Upload & Generate AI Analysis
              </button>
              <button 
                type="button" 
                onClick={() => setShowUploadForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Section */}
      <div className="deliverables-controls">
        <div className="filter-section">
          <label className="filter-label">Filter by Status:</label>
          <div className="filter-buttons">
            <button
              onClick={() => { setFilterStatus('all'); setCurrentPage(1); }}
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => { setFilterStatus('Approved'); setCurrentPage(1); }}
              className={`filter-btn ${filterStatus === 'Approved' ? 'active' : ''}`}
            >
              ✅ Approved ({statusCounts['Approved']})
            </button>
            <button
              onClick={() => { setFilterStatus('Pending Review'); setCurrentPage(1); }}
              className={`filter-btn ${filterStatus === 'Pending Review' ? 'active' : ''}`}
            >
              ⏳ Pending ({statusCounts['Pending Review']})
            </button>
            <button
              onClick={() => { setFilterStatus('Needs Revision'); setCurrentPage(1); }}
              className={`filter-btn ${filterStatus === 'Needs Revision' ? 'active' : ''}`}
            >
              🔄 Revision ({statusCounts['Needs Revision']})
            </button>
          </div>
        </div>

        <div className="items-per-page">
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select 
            id="itemsPerPage"
            value={itemsPerPage} 
            onChange={(e) => { 
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="items-select"
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="deliverables-stats">
        <div className="stat-item">
          <span className="stat-label">Total Deliverables:</span>
          <span className="stat-value">{totalItems}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Current Page:</span>
          <span className="stat-value">{currentPage} of {totalPages}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Showing:</span>
          <span className="stat-value">{currentDeliverables.length} items</span>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="deliverables-list">
        {currentDeliverables.length > 0 ? (
          currentDeliverables.map(deliverable => (
            <DeliverableCard
              key={deliverable.id}
              deliverable={deliverable}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <div className="no-deliverables-message">
            <p>No deliverables found matching the selected filter.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};

export default DeliverablesPage;
