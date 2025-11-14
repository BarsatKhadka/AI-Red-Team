import { useState } from 'react';

function DocumentInputs({ onDocumentsChange }) {
  const [documents, setDocuments] = useState({
    productDesignDocument: '',
    projectOverview: '',
    technicalDesignDocument: '',
    requirements: '',
  });

  const handleChange = (field, value) => {
    const newDocuments = { ...documents, [field]: value };
    setDocuments(newDocuments);
    onDocumentsChange(newDocuments);
  };

  return (
    <div className="bg-white border-b border-gray-300 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3">Project Documents</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Design Document (PDD)
          </label>
          <textarea
            value={documents.productDesignDocument}
            onChange={(e) => handleChange('productDesignDocument', e.target.value)}
            placeholder="Enter Product Design Document content..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Overview
          </label>
          <textarea
            value={documents.projectOverview}
            onChange={(e) => handleChange('projectOverview', e.target.value)}
            placeholder="Enter Project Overview..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technical Design Document (TDD)
          </label>
          <textarea
            value={documents.technicalDesignDocument}
            onChange={(e) => handleChange('technicalDesignDocument', e.target.value)}
            placeholder="Enter Technical Design Document content..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requirements
          </label>
          <textarea
            value={documents.requirements}
            onChange={(e) => handleChange('requirements', e.target.value)}
            placeholder="Enter Requirements..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows="4"
          />
        </div>
      </div>
    </div>
  );
}

export default DocumentInputs;

