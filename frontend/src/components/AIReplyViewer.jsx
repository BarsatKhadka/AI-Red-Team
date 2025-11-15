import { useState, useEffect } from 'react';
import PDFSectionViewer from './PDFSectionViewer';

function AIReplyViewer({ reply, loading, messageData, onReplyEdit, onEditChange, externalIsEditing, onEditRequest, onSaveRequest, onCancelRequest }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState('');
  const [sectionViewer, setSectionViewer] = useState({ isVisible: false, documentType: '', section: '' });
  
  // Sync with external editing state
  useEffect(() => {
    if (externalIsEditing !== undefined) {
      setIsEditing(externalIsEditing);
    }
  }, [externalIsEditing]);

  useEffect(() => {
    if (reply) {
      setEditedReply(reply.reply || '');
    }
  }, [reply]);

  const handleEdit = () => {
    setIsEditing(true);
    if (onEditChange) {
      onEditChange(true);
    }
  };
  
  // Handle external edit request
  useEffect(() => {
    if (onEditRequest && onEditRequest > 0) {
      setIsEditing(true);
      if (onEditChange) {
        onEditChange(true);
      }
    }
  }, [onEditRequest, onEditChange]);
  
  // Handle external save request
  useEffect(() => {
    if (onSaveRequest && onSaveRequest > 0 && isEditing) {
      if (onReplyEdit) {
        onReplyEdit({
          ...reply,
          reply: editedReply
        });
      }
      setIsEditing(false);
      if (onEditChange) {
        onEditChange(false);
      }
    }
  }, [onSaveRequest, isEditing, reply, editedReply, onReplyEdit, onEditChange]);
  
  // Handle external cancel request
  useEffect(() => {
    if (onCancelRequest && onCancelRequest > 0 && isEditing) {
      setEditedReply(reply?.reply || '');
      setIsEditing(false);
      if (onEditChange) {
        onEditChange(false);
      }
    }
  }, [onCancelRequest, isEditing, reply, onEditChange]);

  const handleSave = () => {
    if (onReplyEdit) {
      onReplyEdit({
        ...reply,
        reply: editedReply
      });
    }
    setIsEditing(false);
    if (onEditChange) {
      onEditChange(false);
    }
  };

  const handleCancel = () => {
    setEditedReply(reply?.reply || '');
    setIsEditing(false);
    if (onEditChange) {
      onEditChange(false);
    }
  };

  // Parse reply text and add View buttons for section references
  const renderReplyWithViewButtons = (text) => {
    if (!text) return text;
    
    // Pattern to match: "Section X.Y of the Document Name" or "Section X.Y"
    const sectionPattern = /Section\s+(\d+\.\d+|\w+)\s+(?:of\s+the\s+)?(?:Technical\s+Design\s+Document|Product\s+Design\s+Document|Project\s+Overview|Requirements\s+Document)?/gi;
    
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = sectionPattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Extract section number and document type
      const sectionNum = match[1];
      const fullMatch = match[0];
      let documentType = 'Technical Design Document'; // default
      
      if (fullMatch.includes('Product Design Document') || fullMatch.includes('PDD')) {
        documentType = 'Product Design Document';
      } else if (fullMatch.includes('Technical Design Document') || fullMatch.includes('TDD')) {
        documentType = 'Technical Design Document';
      } else if (fullMatch.includes('Project Overview')) {
        documentType = 'Project Overview';
      } else if (fullMatch.includes('Requirements')) {
        documentType = 'Requirements Document';
      }
      
      // Add the matched text and View button
      parts.push(
        <span key={match.index} className="inline-flex items-center gap-1">
          {fullMatch}{' '}
          <button
            onClick={() => setSectionViewer({ isVisible: true, documentType, section: sectionNum })}
            className="ml-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-md shadow-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transition-all duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating AI reply...</p>
        </div>
      </div>
    );
  }

  if (!reply && !messageData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <p className="text-lg">Click on a @clarify message to see AI-generated reply</p>
        </div>
      </div>
    );
  }

  if (!reply) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <p className="text-lg">No reply available</p>
        </div>
      </div>
    );
  }

  // If section viewer is open, show PDF instead of AI reply
  if (sectionViewer.isVisible) {
    return (
      <div className="h-full flex flex-col bg-white">
        <PDFSectionViewer
          isVisible={true}
          onClose={() => setSectionViewer({ isVisible: false, documentType: '', section: '' })}
          documentType={sectionViewer.documentType}
          section={sectionViewer.section}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Original Message */}
          {messageData && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-blue-800 bg-blue-200 px-2 py-1 rounded">
                  {messageData.messageType}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {messageData.memberName} - {messageData.teamName}
                </span>
              </div>
              <p className="text-gray-800">{messageData.messageText}</p>
            </div>
          )}

          {/* AI Reply */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">AI Assistant Reply</h3>
              </div>
              
              {/* Action Buttons - Right side end */}
              {!isEditing && reply && messageData && (
                <div className="flex items-center gap-2">
                  {/* Send Button */}
                  <button
                    onClick={() => {
                      const email = `${messageData.memberName.toLowerCase()}@outlook.com`;
                      alert(`Reply sent to ${messageData.memberName} at ${email}`);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm"
                  >
                    Send to {messageData.memberName}
                  </button>
                  
                  {/* Edit Button */}
                  <button
                    onClick={handleEdit}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editedReply}
                onChange={(e) => setEditedReply(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows="10"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {renderReplyWithViewButtons(reply.reply)}
              </div>
            </div>
          )}

          {/* Source Documents */}
          {reply.sourceDocuments && reply.sourceDocuments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-300">
              <p className="text-sm font-semibold text-gray-600 mb-2">Based on:</p>
              <ul className="list-disc list-inside space-y-1">
                {reply.sourceDocuments.map((doc, index) => (
                  <li key={index} className="text-sm text-gray-600">{doc}</li>
                ))}
              </ul>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIReplyViewer;

