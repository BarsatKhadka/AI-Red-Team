import React from 'react';
import PropTypes from 'prop-types';

/**
 * FileCard Component
 * Displays individual file information in a card format
 */
const FileCard = ({ file }) => {
  // Get file icon based on type
  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📄',
      word: '📝',
      image: '🖼️',
      sql: '🗄️'
    };
    return icons[fileType] || '📁';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="file-card">
      <div className="file-card-header">
        <span className="file-icon">{getFileIcon(file.fileType)}</span>
        <div className="file-info">
          <h3 className="file-name">{file.fileName}</h3>
          <span className={`file-type-badge file-type-${file.fileType}`}>
            {file.fileType.toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="file-card-body">
        <p className="file-summary">{file.summary}</p>
      </div>
      
      <div className="file-card-footer">
        <div className="file-meta">
          <span className="file-uploader">
            👤 {file.uploadedBy}
          </span>
          <span className="file-date">
            📅 {formatDate(file.uploadDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

FileCard.propTypes = {
  file: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    fileType: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    uploadDate: PropTypes.string.isRequired,
    uploadedBy: PropTypes.string.isRequired
  }).isRequired
};

export default FileCard;
