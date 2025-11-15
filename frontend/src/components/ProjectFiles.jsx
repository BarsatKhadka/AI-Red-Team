import { useState } from 'react';
import { staticProjectFiles } from '../mockData/staticProjectFiles';

function ProjectFiles() {
  const [isOpen, setIsOpen] = useState(false);
  const fileCount = staticProjectFiles.length;

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'word':
        return '📝';
      case 'image':
        return '🖼️';
      default:
        return '📎';
    }
  };

  return (
    <div className="relative bg-bg-card">
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-light">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary">Project Files</span>
          <span className="text-xs text-text-secondary mt-0.5">
            Total files: {fileCount}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New File</span>
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-2 border border-border-medium text-text-secondary rounded font-medium text-sm hover:bg-bg flex items-center gap-2 transition-colors"
          >
            <span>View All Files</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* File Dropdown */}
      {isOpen && (
        <div className="border-t border-border-light bg-bg-card max-h-96 overflow-y-auto">
          <div className="p-3 space-y-2">
            {staticProjectFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 hover:bg-bg rounded-md transition-colors"
              >
                <span className="text-xl">{getFileIcon(file.fileType)}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-text-primary block">{file.fileName}</span>
                  <span className="text-xs text-text-secondary capitalize">{file.fileType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectFiles;

