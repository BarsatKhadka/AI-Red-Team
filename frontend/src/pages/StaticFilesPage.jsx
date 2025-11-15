import React, { useState } from 'react';
import { staticProjectFiles } from '../mockData';
import FileCard from '../components/FileCard';
import Pagination from '../components/Pagination';

/**
 * StaticFilesPage Component
 * Displays all static project files with pagination and filtering
 */
const StaticFilesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Filter files by type
  const filteredFiles = filterType === 'all' 
    ? staticProjectFiles 
    : staticProjectFiles.filter(file => file.fileType === filterType);

  // Calculate pagination
  const totalItems = filteredFiles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = showAll ? filteredFiles : filteredFiles.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle view all toggle
  const handleViewAllToggle = () => {
    setShowAll(!showAll);
    setCurrentPage(1);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
    setShowAll(false);
  };

  // Get unique file types for filter
  const fileTypes = ['all', ...new Set(staticProjectFiles.map(f => f.fileType))];
  const getFileTypeCount = (type) => {
    if (type === 'all') return staticProjectFiles.length;
    return staticProjectFiles.filter(f => f.fileType === type).length;
  };

  return (
    <div className="static-files-page">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">📁 Project Files</h1>
        <p className="page-description">
          Browse all static files related to the project including documents, images, and diagrams.
        </p>
      </div>

      {/* Controls Section */}
      <div className="files-controls">
        {/* Filter by Type */}
        <div className="filter-section">
          <label className="filter-label">Filter by Type:</label>
          <div className="filter-buttons">
            {fileTypes.map(type => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`filter-btn ${filterType === type ? 'active' : ''}`}
              >
                {type === 'all' ? 'All Files' : type.toUpperCase()} ({getFileTypeCount(type)})
              </button>
            ))}
          </div>
        </div>

        {/* Items per page and View All */}
        <div className="display-controls">
          {!showAll && (
            <div className="items-per-page">
              <label htmlFor="itemsPerPage">Items per page:</label>
              <select 
                id="itemsPerPage"
                value={itemsPerPage} 
                onChange={handleItemsPerPageChange}
                className="items-select"
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          )}
          
          <button 
            onClick={handleViewAllToggle}
            className="view-all-btn"
          >
            {showAll ? '📋 Show Paginated' : '📜 View All Files'}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="files-stats">
        <div className="stat-item">
          <span className="stat-label">Total Files:</span>
          <span className="stat-value">{totalItems}</span>
        </div>
        {!showAll && (
          <>
            <div className="stat-item">
              <span className="stat-label">Current Page:</span>
              <span className="stat-value">{currentPage} of {totalPages}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Showing:</span>
              <span className="stat-value">{currentFiles.length} files</span>
            </div>
          </>
        )}
      </div>

      {/* Files Grid */}
      <div className="files-grid">
        {currentFiles.length > 0 ? (
          currentFiles.map(file => (
            <FileCard key={file.id} file={file} />
          ))
        ) : (
          <div className="no-files-message">
            <p>No files found matching the selected filter.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!showAll && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}

      {/* Footer Info */}
      {showAll && (
        <div className="view-all-footer">
          <p>Showing all {totalItems} files</p>
        </div>
      )}
    </div>
  );
};

export default StaticFilesPage;
