import { useState, useEffect, useRef, useMemo } from 'react';

async function fetchStreamingTextFromMCP(text, setDisplayedTextCallback, setIsCompleteCallback, endpoint = 'http://localhost:8000/streaming-text', requestBody = null) {
  try {
    const body = requestBody || { text };
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
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
          setDisplayedTextCallback(accumulatedText);
        }
      }

      setIsCompleteCallback(true);
    } else {
      console.error('Failed to fetch streaming text:', response.statusText);
      setIsCompleteCallback(true);
    }
  } catch (error) {
    console.error('Error fetching streaming text:', error);
    setIsCompleteCallback(true);
  }
}

/**
 * StreamingText Component
 * Simulates AI streaming text generation with typing effect
 */
function StreamingText({ text, className = '', endpoint, requestBody, onComplete, onTextUpdate }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const hasStartedRef = useRef(false);
  const requestKeyRef = useRef(null);
  
  // Create a stable key from requestBody to detect actual changes
  const requestKey = useMemo(() => {
    if (requestBody) {
      return JSON.stringify(requestBody);
    }
    return text || '';
  }, [requestBody, text]);

  useEffect(() => {
    // Only reset if the request actually changed (and it's a different request, not just a re-render)
    if (requestKeyRef.current !== null && requestKeyRef.current !== requestKey) {
      setDisplayedText('');
      setIsComplete(false);
      hasStartedRef.current = false;
    }
    requestKeyRef.current = requestKey;
  }, [requestKey]);

  useEffect(() => {
    if ((text || requestBody) && !hasStartedRef.current && requestKey) {
      hasStartedRef.current = true;
      setDisplayedText(''); // Clear any previous text
      setIsComplete(false);
      
      let lastText = '';
      let isStreamingActive = true;
      
      const handleTextUpdate = (newText) => {
        if (isStreamingActive) {
          lastText = newText;
          setDisplayedText(newText);
          // Call onTextUpdate with a debounce to prevent too many updates
          if (onTextUpdate) {
            onTextUpdate(newText);
          }
        }
      };
      
      const handleComplete = (complete) => {
        if (complete && isStreamingActive) {
          isStreamingActive = false;
          // Ensure final text is set and callbacks are called
          if (lastText) {
            setDisplayedText(lastText);
            // Call onTextUpdate with final text to ensure it's captured
            if (onTextUpdate) {
              onTextUpdate(lastText);
            }
          }
          setIsComplete(true);
          if (onComplete) {
            // Call onComplete after ensuring text is updated
            // Use a slightly longer delay to ensure all state updates are processed
            setTimeout(() => {
              onComplete();
            }, 100);
          }
        }
      };
      
      fetchStreamingTextFromMCP(text, handleTextUpdate, handleComplete, endpoint, requestBody);
    }
  }, [requestKey, endpoint]); // Only depend on requestKey and endpoint

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

