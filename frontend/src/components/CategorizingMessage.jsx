import { useState, useEffect } from 'react';
import AnimatedTag from './AnimatedTag';
import AILoadingIndicator from './AILoadingIndicator';

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
          <span className="text-xs font-semibold text-success">✓ Categorized</span>
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
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg border border-primary/20 ai-processing">
      {currentStep === 'analyzing' && (
        <div className="space-y-3">
          <AILoadingIndicator message="Analyzing message..." size="sm" />
          <div className="space-y-1.5">
            <div className="h-1.5 bg-primary/20 rounded-full animate-pulse" style={{ width: '60%' }} />
            <div className="h-1.5 bg-primary/20 rounded-full animate-pulse" style={{ width: '80%' }} />
          </div>
          <p className="text-xs text-text-secondary italic animate-pulse">
            Detecting message intent and context...
          </p>
        </div>
      )}

      {currentStep === 'categorizing' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AILoadingIndicator message="Categorizing..." size="sm" />
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
          <p className="text-xs text-text-secondary italic">
            Identifying {categorizedVersions.length} distinct message type{categorizedVersions.length !== 1 ? 's' : ''}...
          </p>
        </div>
      )}
    </div>
  );
}

export default CategorizingMessage;

