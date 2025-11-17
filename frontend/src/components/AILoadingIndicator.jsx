/**
 * AILoadingIndicator Component
 * Modern loading indicator for AI processing
 */
function AILoadingIndicator({ message = 'Agentic AI is processing...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className={`${sizeClasses[size]} border-2 border-primary/20 rounded-full`} />
        <div className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0`} />
        
        {/* Inner pulsing dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`${size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'} bg-primary rounded-full animate-pulse`} />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-primary">{message}</span>
        <span className="text-xs text-text-tertiary">Processing your request...</span>
      </div>
    </div>
  );
}

export default AILoadingIndicator;

