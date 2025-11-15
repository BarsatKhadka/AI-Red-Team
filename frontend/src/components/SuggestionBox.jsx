import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8000';

function SuggestionBox() {
  const [requestText, setRequestText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const suggestions = [
    { id: 'weekly-schedule', label: 'Generate Weekly Schedule', endpoint: '/agent/suggestions/weekly-schedule' },
    { id: 'progress-summary', label: 'Summarize All Progress Updates', endpoint: '/agent/suggestions/progress-summary' },
    { id: 'announcement', label: 'Draft Team Announcement', endpoint: '/agent/suggestions/announcement' },
    { id: 'availability-report', label: 'Create Availability Report', endpoint: '/agent/suggestions/availability-report' },
    { id: 'blocker-escalation', label: 'Draft Blocker Escalation Note', endpoint: '/agent/suggestions/blocker-escalation' },
  ];

  const handleSuggestionClick = async (endpoint) => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error calling suggestion:', error);
      setResult({
        type: 'error',
        text: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFreeformSubmit = async (e) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/agent/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: requestText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setRequestText('');
    } catch (error) {
      console.error('Error submitting request:', error);
      setResult({
        type: 'error',
        text: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="text-sm font-bold text-gray-800">Suggestion Box / Agent Request Panel</h3>
          <p className="text-xs text-gray-500 mt-0.5">Design → Discover → Automate</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Smart Suggestions */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Smart Suggestions</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.endpoint)}
                disabled={loading}
                className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-medium text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>

        {/* Freeform Request Input */}
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Ask the agent to perform, analyze</h4>
          <form onSubmit={handleFreeformSubmit} className="space-y-2">
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="Ask the agent…"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !requestText.trim()}
              className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            {result.type === 'pdf' ? (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">PDF Generated:</p>
                <a
                  href={`${API_BASE_URL}${result.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View PDF
                </a>
              </div>
            ) : result.type === 'error' ? (
              <p className="text-xs text-red-600">{result.text}</p>
            ) : (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Response:</p>
                <p className="text-xs text-gray-600 whitespace-pre-wrap">{result.text}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuggestionBox;

