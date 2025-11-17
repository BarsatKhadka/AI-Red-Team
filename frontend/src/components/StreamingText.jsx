import { useState, useEffect } from 'react';

async function fetchStreamingTextFromMCP(text, setDisplayedText, setIsComplete) {
  try {
    const response = await fetch('http://localhost:8000/streaming-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (response.ok) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          accumulatedText += decoder.decode(value);
          setDisplayedText(accumulatedText);
        }
      }

      setIsComplete(true);
    } else {
      console.error('Failed to fetch streaming text:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching streaming text:', error);
  }
}

/**
 * StreamingText Component
 * Simulates AI streaming text generation with typing effect
 */
function StreamingText({ text, className = '' }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (text) {
      fetchStreamingTextFromMCP(text, setDisplayedText, setIsComplete);
    }
  }, [text]);

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

