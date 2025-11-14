import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000';

function MessageList({ onMessageSelect }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTeamMembers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(`Failed to load messages: ${error.message}. Make sure the backend is running on ${API_BASE_URL}`);
      setLoading(false);
    }
  };

  const handleMessageClick = async (memberName, messageType, messageText) => {
    const messageKey = `${memberName}-${messageType}-${messageText}`;
    setSelectedMessage(messageKey);
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_name: memberName,
          message_type: messageType,
          message_text: messageText,
        }),
      });

      const data = await response.json();
      const fullPdfUrl = `${API_BASE_URL}${data.pdf_url}`;
      onMessageSelect(fullPdfUrl, { memberName, messageType, messageText });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case '@clarify':
        return 'bg-blue-100 text-blue-800';
      case '@availability':
        return 'bg-green-100 text-green-800';
      case '@progress_update':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-4">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchMessages}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Team Messages</h2>
      <div className="space-y-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
            <div className="space-y-2">
              {member.messages.map((message, index) => {
                const messageKey = `${member.name}-${message.type}-${message.text}`;
                const isSelected = selectedMessage === messageKey;
                return (
                  <div
                    key={index}
                    onClick={() => handleMessageClick(member.name, message.type, message.text)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-200 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${getMessageTypeColor(
                        message.type
                      )}`}
                    >
                      {message.type}
                    </span>
                    <p className="text-sm text-gray-700">{message.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageList;

