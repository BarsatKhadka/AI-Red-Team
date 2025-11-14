import { useState, useEffect } from 'react';

function AIReplyViewer({ reply, loading, messageData, onReplyEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState('');
  const [showSendOptions, setShowSendOptions] = useState(false);

  useEffect(() => {
    if (reply) {
      setEditedReply(reply.reply || '');
    }
  }, [reply]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onReplyEdit) {
      onReplyEdit({
        ...reply,
        reply: editedReply
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedReply(reply?.reply || '');
    setIsEditing(false);
  };

  const getMemberEmail = (memberName) => {
    return `${memberName.toLowerCase()}@outlook.com`;
  };

  const handleSendEmail = async () => {
    if (!messageData) return;
    const email = getMemberEmail(messageData.memberName);
    // Mock send - in real app, this would call backend API
    alert(`Reply sent to ${messageData.memberName} at ${email}`);
    setShowSendOptions(false);
  };

  const handleSendSlack = async () => {
    if (!messageData) return;
    // Mock send - in real app, this would call backend API
    alert(`Reply sent to ${messageData.memberName} via Slack`);
    setShowSendOptions(false);
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">AI Assistant Reply</h3>
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
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {reply.reply}
              </p>
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
      
      {/* Action Buttons - Fixed at bottom right */}
      {!isEditing && reply && messageData && (
        <div className="flex-shrink-0 border-t border-gray-300 bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-end gap-3">
            {/* Send Options */}
            <div className="relative">
              <button
                onClick={() => setShowSendOptions(!showSendOptions)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Send to {messageData.memberName}
              </button>
              
              {showSendOptions && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 min-w-[200px]">
                  <button
                    onClick={handleSendEmail}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
                  >
                    📧 Email ({getMemberEmail(messageData.memberName)})
                  </button>
                  <button
                    onClick={handleSendSlack}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm"
                  >
                    💬 Slack
                  </button>
                </div>
              )}
            </div>
            
            {/* Big Edit Button */}
            <button
              onClick={handleEdit}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-lg"
            >
              Edit
            </button>
          </div>
        </div>
      )}
      
      {/* Edit Mode Save/Cancel */}
      {isEditing && (
        <div className="flex-shrink-0 border-t border-gray-300 bg-gray-50 p-4">
          <div className="max-w-4xl mx-auto flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIReplyViewer;

