import { useState, useEffect } from 'react';
import AnimatedTag from './AnimatedTag';
import AILoadingIndicator from './AILoadingIndicator';
import AIContextIndicator from './AIContextIndicator';

/**
 * CategorizingMessage Component
 * Shows the AI categorization process with animated tags
 */
function CategorizingMessage({ 
  originalText, 
  categorizedVersions, 
  onCategorizationComplete,
  onVersionClick 
}) {
  const [currentStep, setCurrentStep] = useState('analyzing');
  const [visibleTags, setVisibleTags] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!categorizedVersions || categorizedVersions.length === 0) {
      return;
    }

    // Step 1: Analyzing
    const analyzingTimer = setTimeout(() => {
      setCurrentStep('categorizing');
    }, 800);

    // Step 2: Show tags one by one
    const tagTimers = categorizedVersions.map((version, index) => {
      return setTimeout(() => {
        setVisibleTags(prev => [...prev, index]);
        if (index === categorizedVersions.length - 1) {
          setTimeout(() => {
            setCurrentStep('complete');
            setIsComplete(true);
            if (onCategorizationComplete) {
              onCategorizationComplete();
            }
          }, 500);
        }
      }, 1200 + (index * 400));
    });

    return () => {
      clearTimeout(analyzingTimer);
      tagTimers.forEach(timer => clearTimeout(timer));
    };
  }, [categorizedVersions, onCategorizationComplete]);

  const getMessageTypeColor = (type) => {
    switch (type) {
      case '@clarify':
        return 'bg-[#DBEAFE] text-[#1E40AF]';
      case '@availability':
        return 'bg-[#D1FAE5] text-[#065F46]';
      case '@progress_update':
        return 'bg-[#FEF3C7] text-[#92400E]';
      default:
        return 'bg-border-light text-text-primary';
    }
  };

  if (isComplete) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-xs font-semibold text-success">AI Categorized</span>
          <span className="text-xs text-text-tertiary">
            {categorizedVersions.length} version{categorizedVersions.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categorizedVersions.map((version, index) => (
            <AnimatedTag
              key={index}
              label={version.type}
              colorClass={getMessageTypeColor(version.type)}
              delay={index * 100}
            />
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-primary/10">
          <AIContextIndicator
            analysisType="complete"
            references={[
              { icon: '💬', label: 'Past Messages' },
              { icon: '🧠', label: 'Member Memory' },
              { icon: '📁', label: 'Project Files' }
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/20 ai-processing">
      {currentStep === 'analyzing' && (
        <div className="space-y-3">
          <AILoadingIndicator message="AI analyzing message..." size="sm" />
          <AIContextIndicator
            analysisType="analyzing"
            references={[]}
          />
          <p className="text-xs text-text-secondary italic animate-pulse">
            AI is cross-referencing with past messages and project context...
          </p>
        </div>
      )}

      {currentStep === 'categorizing' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AILoadingIndicator message="AI categorizing..." size="sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categorizedVersions.map((version, index) => (
              <AnimatedTag
                key={index}
                label={visibleTags.includes(index) ? version.type : '...'}
                colorClass={visibleTags.includes(index) ? getMessageTypeColor(version.type) : 'bg-gray-200 text-gray-500'}
                delay={index * 100}
              />
            ))}
          </div>
          <div className="bg-primary/5 rounded p-2 border border-primary/10">
            <p className="text-xs text-text-secondary italic mb-1">
              AI identified {categorizedVersions.length} distinct message type{categorizedVersions.length !== 1 ? 's' : ''} by analyzing patterns from:
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">💬 Past Messages</span>
              <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">🧠 Member Memory</span>
              <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">📁 Project Files</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategorizingMessage;

