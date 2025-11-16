import { useState } from 'react';
import StreamingText from './StreamingText';
import AILoadingIndicator from './AILoadingIndicator';

const API_BASE_URL = 'http://localhost:8000';

function SuggestionBox() {
  const [requestText, setRequestText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamComplete, setStreamComplete] = useState(false);

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
    setIsStreaming(false);
    setStreamComplete(false);
    
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
      setIsStreaming(true);
      setStreamComplete(false);
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
    setIsStreaming(false);
    setStreamComplete(false);

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
      setIsStreaming(true);
      setStreamComplete(false);
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
        {loading && !result && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
            <AILoadingIndicator message="AI is processing..." size="sm" />
            <div className="mt-3 space-y-2">
              <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ width: '70%' }} />
              <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ width: '50%' }} />
            </div>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-gradient-to-br from-primary-light to-primary/5 border border-primary/20 rounded-lg shadow-sm animate-in">
            {result.type === 'pdf' ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <p className="text-xs font-semibold text-text-primary">PDF Generated:</p>
                </div>
                <a
                  href={`${API_BASE_URL}${result.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>View PDF</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ) : result.type === 'error' ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-error rounded-full" />
                <p className="text-xs text-error">{result.text}</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {isStreaming && !streamComplete ? (
                    <>
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <p className="text-xs font-semibold text-primary">AI is generating...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <p className="text-xs font-semibold text-success">AI Response Complete</p>
                    </>
                  )}
                </div>
                {isStreaming && !streamComplete && result.text ? (
                  <StreamingText
                    text={result.text}
                    speed={12}
                    onComplete={() => {
                      setIsStreaming(false);
                      setStreamComplete(true);
                    }}
                    className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">{result.text}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuggestionBox;

