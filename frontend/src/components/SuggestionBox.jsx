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
    <div className="h-full flex flex-col bg-bg-card border-l border-border-light">
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-light bg-bg">
        <div>
          <h3 className="text-sm font-bold text-text-primary">Smart Suggestions</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Smart Suggestions */}
        <div>
          <h4 className="text-xs font-semibold text-text-primary mb-2">Smart Suggestions</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.endpoint)}
                disabled={loading}
                className="w-full text-left px-3 py-2 bg-primary-light hover:bg-primary-light/80 border border-primary/20 rounded-lg text-xs font-medium text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>

        {/* Freeform Request Input */}
        <div>
          <h4 className="text-xs font-semibold text-text-primary mb-2">Ask the agent to perform, analyze</h4>
          <form onSubmit={handleFreeformSubmit} className="space-y-2">
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="Ask the agent…"
              className="w-full px-3 py-2 border border-border-medium rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !requestText.trim()}
              className="w-full px-3 py-2 bg-success text-white rounded-lg hover:bg-success-hover font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-4 p-3 bg-bg border border-border-light rounded-lg">
            {result.type === 'pdf' ? (
              <div>
                <p className="text-xs font-semibold text-text-primary mb-2">PDF Generated:</p>
                <a
                  href={`${API_BASE_URL}${result.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View PDF
                </a>
              </div>
            ) : result.type === 'error' ? (
              <p className="text-xs text-error">{result.text}</p>
            ) : (
              <div>
                <p className="text-xs font-semibold text-text-primary mb-2">Response:</p>
                <p className="text-xs text-text-secondary whitespace-pre-wrap">{result.text}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuggestionBox;

