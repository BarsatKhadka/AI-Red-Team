import React, { useState, useEffect } from 'react';
import { projectFiles } from '../mockData/comprehensiveMockData';

/**
 * DocumentExplorer Component
 * Search and explore project documents with highlighted key phrases
 */
const DocumentExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedDocuments, setMatchedDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setMatchedDocuments(projectFiles);
      setSelectedDocument(null);
    } else {
      performSearch(searchQuery);
    }
  }, [searchQuery]);

  const performSearch = (query) => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const queryLower = query.toLowerCase();
      const results = projectFiles.filter((file) => {
        const nameMatch = file.name.toLowerCase().includes(queryLower);
        const summaryMatch = file.summary.toLowerCase().includes(queryLower);
        const typeMatch = file.type.toLowerCase().includes(queryLower);
        const uploaderMatch = file.uploadedBy.toLowerCase().includes(queryLower);
        
        return nameMatch || summaryMatch || typeMatch || uploaderMatch;
      });

      setMatchedDocuments(results);
      setIsSearching(false);
    }, 300);
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 font-semibold px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getFileIcon = (type) => {
    const icons = {
      pdf: '📄',
      word: '📝',
      excel: '📊',
      powerpoint: '📽️',
      image: '🖼️',
      design: '🎨',
      markdown: '📋',
      default: '📁'
    };
    return icons[type] || icons.default;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const extractRelevantSections = (summary, query) => {
    if (!query.trim()) {
      return [summary.substring(0, 200) + '...'];
    }

    const queryLower = query.toLowerCase();
    const sentences = summary.split(/[.!?]+/).filter(s => s.trim());
    
    const relevantSentences = sentences.filter(sentence =>
      sentence.toLowerCase().includes(queryLower)
    );

    if (relevantSentences.length === 0) {
      return [summary.substring(0, 200) + '...'];
    }

    return relevantSentences.slice(0, 3);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Explorer</h1>
        <p className="text-gray-600">Search and explore project documentation</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by name, content, type, or uploader..."
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">×</span>
            </button>
          )}
        </div>
        
        {/* Search Status */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {isSearching ? (
              'Searching...'
            ) : (
              <>
                Found <strong className="text-indigo-600">{matchedDocuments.length}</strong>{' '}
                document{matchedDocuments.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </>
            )}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Document List */}
        <div className="space-y-4">
          {matchedDocuments.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-gray-600 text-lg">No documents found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View All Documents
              </button>
            </div>
          ) : (
            matchedDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocument(doc)}
                className={`bg-white rounded-lg shadow-md border-2 p-5 cursor-pointer transition-all hover:shadow-lg ${
                  selectedDocument?.id === doc.id
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl flex-shrink-0">{getFileIcon(doc.type)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {highlightText(doc.name, searchQuery)}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {highlightText(doc.summary, searchQuery)}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Type:</span> {doc.type.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">By:</span> {highlightText(doc.uploadedBy, searchQuery)}
                      </span>
                      <span>•</span>
                      <span>{formatDate(doc.uploadDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Document Details Panel */}
        <div className="lg:sticky lg:top-6 self-start">
          {selectedDocument ? (
            <div className="bg-white rounded-lg shadow-lg border-2 border-indigo-500 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getFileIcon(selectedDocument.type)}</span>
                    <div>
                      <h2 className="text-xl font-bold">{selectedDocument.name}</h2>
                      <p className="text-indigo-100 text-sm mt-1">
                        {selectedDocument.type.toUpperCase()} Document
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="text-white hover:text-indigo-200 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block mb-1">Uploaded By</span>
                    <span className="font-semibold text-gray-900">{selectedDocument.uploadedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">Upload Date</span>
                    <span className="font-semibold text-gray-900">
                      {formatDate(selectedDocument.uploadDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Summary */}
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Full Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {highlightText(selectedDocument.summary, searchQuery)}
                </p>
              </div>

              {/* Relevant Sections */}
              <div className="px-6 py-5 bg-yellow-50">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span>💡</span> Relevant Sections
                  {searchQuery && <span className="text-xs text-gray-500 normal-case">(matching "{searchQuery}")</span>}
                </h3>
                <div className="space-y-3">
                  {extractRelevantSections(selectedDocument.summary, searchQuery).map(
                    (section, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm"
                      >
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {highlightText(section, searchQuery)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-gray-50 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
                  📥 Download
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold">
                  🔗 Share
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
              <span className="text-6xl mb-4 block">👈</span>
              <p className="text-gray-600 text-lg">
                Select a document from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentExplorer;
