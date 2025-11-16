import { useState, useEffect } from 'react';

/**
 * AIContextIndicator Component
 * Shows AI is analyzing and cross-referencing context
 */
function AIContextIndicator({ 
  analysisType = 'analyzing',
  references = [],
  onComplete 
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const analysisSteps = [
    { text: 'Analyzing message content...', icon: '🔍' },
    { text: 'Cross-referencing with past interactions...', icon: '🔗' },
    { text: 'Reviewing project files...', icon: '📁' },
    { text: 'Checking team member memory...', icon: '🧠' },
    { text: 'Building context-aware response...', icon: '✨' }
  ];

  useEffect(() => {
    if (isComplete || analysisType === 'complete') {
      setIsComplete(true);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          if (onComplete) {
            setTimeout(() => onComplete(), 300);
          }
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isComplete, onComplete, analysisType]);

  if (isComplete && references.length > 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-xs font-semibold text-success">Context Analyzed</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {references.map((ref, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs animate-in fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <span>{ref.icon}</span>
              <span>{ref.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (analysisType === 'complete') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-xs font-semibold text-success">Context Analyzed</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {references.map((ref, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs animate-in fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <span>{ref.icon}</span>
              <span>{ref.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {analysisSteps.slice(0, currentStep + 1).map((step, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 text-xs animate-in fade-in"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${
            idx === currentStep ? 'bg-primary animate-pulse' : 'bg-success'
          }`} />
          <span className="text-text-secondary">{step.icon} {step.text}</span>
        </div>
      ))}
    </div>
  );
}

export default AIContextIndicator;

