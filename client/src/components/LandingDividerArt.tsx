import React from 'react'

/** Section divider — subtle wave with animated stroke dash */
export const LandingDividerArt: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 1200 56"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <defs>
      <linearGradient id="landing-div-grad" x1="0" y1="0" x2="1200" y2="0">
        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#0d9488" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      d="M0 36 Q 300 20 600 36 T 1200 32 L 1200 56 L 0 56 Z"
      fill="currentColor"
      className="text-stone-100"
    />
    <path
      d="M0 40 Q 400 26 800 38 T 1200 34"
      stroke="url(#landing-div-grad)"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeDasharray="8 12"
    >
      <animate attributeName="stroke-dashoffset" from="0" to="40" dur="3s" repeatCount="indefinite" />
    </path>
  </svg>
)
