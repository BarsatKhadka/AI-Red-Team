function Logo({ className = "", size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle with Gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      
      {/* Main Circle */}
      <circle cx="60" cy="60" r="55" fill="url(#logoGradient)" opacity="0.1" />
      <circle cx="60" cy="60" r="50" fill="url(#logoGradient)" />
      
      {/* Inner Geometric Shapes - Representing Projects/Operations */}
      {/* Central Hub */}
      <circle cx="60" cy="60" r="12" fill="white" opacity="0.95" />
      
      {/* Connecting Nodes - Representing Team/Operations */}
      {/* Top Node */}
      <circle cx="60" cy="30" r="8" fill="url(#logoGradient2)" />
      <line x1="60" y1="48" x2="60" y2="38" stroke="white" strokeWidth="2" opacity="0.8" />
      
      {/* Right Node */}
      <circle cx="90" cy="60" r="8" fill="url(#logoGradient2)" />
      <line x1="72" y1="60" x2="82" y2="60" stroke="white" strokeWidth="2" opacity="0.8" />
      
      {/* Bottom Right Node */}
      <circle cx="85" cy="85" r="8" fill="url(#logoGradient2)" />
      <line x1="70" y1="70" x2="77" y2="77" stroke="white" strokeWidth="2" opacity="0.8" />
      
      {/* Bottom Node */}
      <circle cx="60" cy="90" r="8" fill="url(#logoGradient2)" />
      <line x1="60" y1="72" x2="60" y2="82" stroke="white" strokeWidth="2" opacity="0.8" />
      
      {/* Bottom Left Node */}
      <circle cx="35" cy="85" r="8" fill="url(#logoGradient2)" />
      <line x1="50" y1="70" x2="43" y2="77" stroke="white" strokeWidth="2" opacity="0.8" />
      
      {/* Left Node */}
      <circle cx="30" cy="60" r="8" fill="url(#logoGradient2)" />
      <line x1="48" y1="60" x2="38" y2="60" stroke="white" strokeWidth="2" opacity="0.8" />
      
      {/* Top Left Node */}
      <circle cx="35" cy="35" r="8" fill="url(#logoGradient2)" />
      <line x1="50" y1="50" x2="43" y2="43" stroke="white" strokeWidth="2" opacity="0.8" />
      
      {/* Top Right Node */}
      <circle cx="85" cy="35" r="8" fill="url(#logoGradient2)" />
      <line x1="70" y1="50" x2="77" y2="43" stroke="white" strokeWidth="2" opacity="0.8" />
      
      {/* AI Sparkle Effect - Small decorative elements */}
      <circle cx="25" cy="25" r="2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="95" cy="25" r="2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="95" cy="95" r="2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy="95" r="2" fill="white" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default Logo;

