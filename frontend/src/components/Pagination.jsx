import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Pagination Component
 * Handles page navigation with previous/next and page numbers
 */
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  totalItems 
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Calculate start and end item numbers for display
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
      
      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        
        {pages.map(page => {
          // Show first, last, current, and nearby pages
          if (
            page === 1 || 
            page === totalPages || 
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return <span key={page} className="pagination-ellipsis">...</span>;
          }
          return null;
        })}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired
};

export default Pagination;
