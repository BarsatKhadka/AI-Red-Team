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
    <div className="relative bg-white">
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-gray-800">Project Files</span>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-semibold">
            Total files: {fileCount}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New File</span>
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-2 transition-colors"
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
        <div className="border-t border-gray-200 bg-white max-h-96 overflow-y-auto">
          <div className="p-3 space-y-2">
            {staticProjectFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-xl">{getFileIcon(file.fileType)}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800 block">{file.fileName}</span>
                  <span className="text-xs text-gray-500 capitalize">{file.fileType}</span>
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

