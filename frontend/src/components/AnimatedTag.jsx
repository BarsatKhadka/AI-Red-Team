import { useState, useEffect } from 'react';

/**
 * AnimatedTag Component
 * Shows tag appearing with animation effect
 */
function AnimatedTag({ 
  label, 
  colorClass, 
  delay = 0, 
  onAnimationComplete,
  className = '' 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsAnimating(false);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 300);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onAnimationComplete]);

  return (
    <span
      className={`
        ${colorClass}
        text-xs font-medium px-2.5 py-1 rounded-sm
        transition-all duration-300 ease-out
        ${isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 translate-y-1'
        }
        ${isAnimating ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {label}
    </span>
  );
}

export default AnimatedTag;

