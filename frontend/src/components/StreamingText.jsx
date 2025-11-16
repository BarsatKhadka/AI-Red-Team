import { useState, useEffect } from 'react';

/**
 * StreamingText Component
 * Simulates AI streaming text generation with typing effect
 */
function StreamingText({ text, speed = 20, onComplete, className = '' }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={className}>
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {!isComplete && (
        <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
      )}
    </div>
  );
}

export default StreamingText;

