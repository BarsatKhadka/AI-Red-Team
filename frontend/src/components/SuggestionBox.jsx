import { useState } from 'react';
import StreamingText from './StreamingText';
import AILoadingIndicator from './AILoadingIndicator';
import AIContextIndicator from './AIContextIndicator';

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
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-light bg-gradient-to-r from-bg to-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Smart Suggestions</h3>
            <p className="text-xs text-text-tertiary">AI-powered recommendations</p>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Smart Suggestions - AI Generated Cards */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <h4 className="text-xs font-semibold text-text-primary">AI Suggestions</h4>
            <div className="flex gap-1 ml-auto">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            </div>
          </div>
          <div className="space-y-2.5">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion.endpoint)}
                disabled={loading}
                className="w-full text-left group relative overflow-hidden bg-gradient-to-br from-bg-card to-primary/5 border border-primary/20 rounded-lg p-3.5 hover:border-primary/40 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/20 disabled:hover:shadow-none"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* AI Indicator */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary mb-0.5 group-hover:text-primary transition-colors">
                      {suggestion.label}
                    </p>
                    <p className="text-xs text-text-tertiary leading-relaxed">
                      AI-generated suggestion based on your project context
                    </p>
                  </div>
                </div>
                
                {/* Hover effect gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
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
            <AILoadingIndicator message="AI is analyzing context..." size="sm" />
            <div className="mt-3 space-y-3">
              <AIContextIndicator
                analysisType="analyzing"
                references={[]}
              />
              <div className="pt-2 border-t border-primary/10 space-y-2">
                <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ width: '70%' }} />
                <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ width: '50%' }} />
              </div>
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
                {/* Context References */}
                <div className="mt-3 pt-3 border-t border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-primary">AI Context Used</span>
                    <a href="/memory" className="text-xs text-primary hover:underline ml-auto">
                      View Memory →
                    </a>
                  </div>
                  <AIContextIndicator
                    analysisType="complete"
                    references={[
                      { icon: '💬', label: 'Past Messages' },
                      { icon: '📁', label: 'Project Files' },
                      { icon: '🧠', label: 'Team Memory' },
                      { icon: '📊', label: 'Task History' }
                    ]}
                  />
                  <p className="text-xs text-text-tertiary italic mt-2">
                    Generated using AI memory and context analysis.
                    <a href="/memory" className="text-primary hover:underline ml-1">See full context →</a>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuggestionBox;

