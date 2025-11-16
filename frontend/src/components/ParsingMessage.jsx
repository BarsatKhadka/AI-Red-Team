import { useState, useEffect } from 'react';
import AIContextIndicator from './AIContextIndicator';

/**
 * ParsingMessage Component
 * Shows original message being parsed line by line with animation
 */
function ParsingMessage({ text, onComplete, className = '', showContextAnalysis = false }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [contextReferences, setContextReferences] = useState([]);
  const [showContext, setShowContext] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedLines([]);
      setCurrentLineIndex(0);
      setIsComplete(false);
      return;
    }

    // Split text into lines (by newline or by sentence for better effect)
    // Also split long sentences into smaller chunks for more dynamic parsing
    const sentences = text.split(/(?<=[.!?])\s+|(?<=\n)/).filter(s => s.trim().length > 0);
    const lines = [];
    
    sentences.forEach(sentence => {
      // If sentence is too long, split it further
      if (sentence.length > 80) {
        const words = sentence.split(' ');
        let currentLine = '';
        words.forEach(word => {
          if ((currentLine + ' ' + word).length > 80 && currentLine) {
            lines.push(currentLine.trim());
            currentLine = word;
          } else {
            currentLine = currentLine ? currentLine + ' ' + word : word;
          }
        });
        if (currentLine) lines.push(currentLine.trim());
      } else {
        lines.push(sentence.trim());
      }
    });
    
    if (lines.length === 0) {
      setIsComplete(true);
      if (onComplete) onComplete();
      return;
    }

    setDisplayedLines([]);
    setCurrentLineIndex(0);
    setIsComplete(false);

    // Show lines one by one with varying speeds for more natural feel
    let lineIndex = 0;
    const showNextLine = () => {
      if (lineIndex < lines.length) {
        setDisplayedLines(prevLines => [...prevLines, {
          text: lines[lineIndex],
          index: lineIndex,
          timestamp: Date.now()
        }]);
        lineIndex++;
        
        // Vary the delay slightly for more natural parsing
        const delay = 120 + Math.random() * 80; // Between 120-200ms
        setTimeout(showNextLine, delay);
      } else {
        setIsComplete(true);
        
        // Generate context references after parsing
        if (showContextAnalysis) {
          const refs = [];
          const textLower = text.toLowerCase();
          
          if (textLower.includes('api') || textLower.includes('endpoint')) {
            refs.push({ icon: '🔌', label: 'API Documentation' });
          }
          if (textLower.includes('design') || textLower.includes('ui') || textLower.includes('figma')) {
            refs.push({ icon: '🎨', label: 'Design Files' });
          }
          if (textLower.includes('deadline') || textLower.includes('timeline') || textLower.includes('schedule')) {
            refs.push({ icon: '📅', label: 'Project Timeline' });
          }
          if (textLower.includes('blocked') || textLower.includes('issue') || textLower.includes('problem')) {
            refs.push({ icon: '⚠️', label: 'Past Blockers' });
          }
          if (textLower.includes('clarify') || textLower.includes('question')) {
            refs.push({ icon: '❓', label: 'Similar Questions' });
          }
          
          // Always add some default references
          if (refs.length === 0) {
            refs.push({ icon: '📁', label: 'Project Files' });
            refs.push({ icon: '💬', label: 'Past Messages' });
          } else {
            refs.push({ icon: '💬', label: 'Past Interactions' });
          }
          
          setContextReferences(refs);
          setShowContext(true);
        }
        
        if (onComplete) {
          setTimeout(() => onComplete(), 500);
        }
      }
    };

    // Start parsing after a short delay
    const timeout = setTimeout(showNextLine, 100);

    return () => clearTimeout(timeout);
  }, [text, onComplete, showContextAnalysis]);

  if (!text) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {displayedLines.map((line, idx) => (
        <div
          key={`${line.index}-${line.timestamp}`}
          className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2"
          style={{ 
            animationDelay: `${idx * 30}ms`,
            animationDuration: '0.5s'
          }}
        >
          {/* Parsing indicator - animated dot */}
          <div className="flex-shrink-0 mt-1 relative">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-primary rounded-full animate-ping opacity-75" />
          </div>
          {/* Line text with smooth appearance */}
          <div className="flex-1">
            <p className="text-sm text-text-primary leading-relaxed">
              {line.text}
            </p>
          </div>
        </div>
      ))}
      
      {/* Parsing indicator when not complete */}
      {!isComplete && displayedLines.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border-light">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }} />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1s' }} />
          </div>
          <span className="text-xs text-text-tertiary italic">Analyzing next segment...</span>
        </div>
      )}

      {/* Context Analysis */}
      {isComplete && showContext && showContextAnalysis && contextReferences.length > 0 && (
        <div className="mt-3 pt-3 border-t border-primary/20 bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-3">
          <AIContextIndicator
            analysisType="complete"
            references={contextReferences}
          />
        </div>
      )}
    </div>
  );
}

export default ParsingMessage;

