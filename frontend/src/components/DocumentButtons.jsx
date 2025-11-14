import { useState } from 'react';

function DocumentButtons({ onDocumentsChange }) {
  const [documents, setDocuments] = useState({
    productDesignDocument: '',
    projectOverview: '',
    technicalDesignDocument: '',
    requirements: '',
  });

  const handleFileInput = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const newDocuments = { ...documents, [field]: content };
        setDocuments(newDocuments);
        onDocumentsChange(newDocuments);
      };
      reader.readAsText(file);
    }
  };

  const handleTextInput = (field) => {
    const text = prompt(`Enter ${field.replace(/([A-Z])/g, ' $1').trim()}:`);
    if (text !== null) {
      const newDocuments = { ...documents, [field]: text };
      setDocuments(newDocuments);
      onDocumentsChange(newDocuments);
    }
  };

  return (
    <div className="flex flex-row items-center justify-end gap-2">
      <input
        type="file"
        id="pdd-upload"
        className="hidden"
        onChange={(e) => handleFileInput('productDesignDocument', e)}
        accept=".txt,.md,.pdf"
      />
      <button
        onClick={() => document.getElementById('pdd-upload').click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Upload PDD
      </button>

      <input
        type="file"
        id="overview-upload"
        className="hidden"
        onChange={(e) => handleFileInput('projectOverview', e)}
        accept=".txt,.md,.pdf"
      />
      <button
        onClick={() => document.getElementById('overview-upload').click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Upload Overview
      </button>

      <input
        type="file"
        id="tdd-upload"
        className="hidden"
        onChange={(e) => handleFileInput('technicalDesignDocument', e)}
        accept=".txt,.md,.pdf"
      />
      <button
        onClick={() => document.getElementById('tdd-upload').click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Upload TDD
      </button>

      <input
        type="file"
        id="requirements-upload"
        className="hidden"
        onChange={(e) => handleFileInput('requirements', e)}
        accept=".txt,.md,.pdf"
      />
      <button
        onClick={() => document.getElementById('requirements-upload').click()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Upload Requirements
      </button>
    </div>
  );
}

export default DocumentButtons;

