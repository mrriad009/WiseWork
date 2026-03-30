import React from 'react'

/**
 * Animated SVG hero — stacked CV cards + score panel (matches app UI).
 */
export const LandingHeroArt: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute -inset-8 rounded-[40%] bg-teal-400/15 blur-3xl animate-landing-shimmer"
        aria-hidden
      />
      <svg
        viewBox="0 0 400 320"
        className="relative z-10 h-auto w-full max-w-[420px] drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="hero-art-title"
      >
        <title id="hero-art-title">Illustration: ranked CVs and score breakdown</title>

        <defs>
          <pattern id="landing-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" stroke="#e7e5e4" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="landing-card-shine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fafaf9" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="landing-teal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>

        <rect x="24" y="28" width="352" height="264" rx="16" fill="url(#landing-grid)" opacity="0.5" />

        {/* Back card */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -5; 0 0"
            dur="6s"
            repeatCount="indefinite"
          />
          <rect x="48" y="72" width="140" height="176" rx="12" fill="white" stroke="#e7e5e4" strokeWidth="1.5" />
          <rect x="58" y="88" width="100" height="8" rx="2" fill="#e7e5e4" />
          <rect x="58" y="104" width="80" height="6" rx="2" fill="#f5f5f4" />
          <rect x="58" y="118" width="112" height="6" rx="2" fill="#f5f5f4" />
          <rect x="58" y="140" width="120" height="72" rx="6" fill="#fafaf9" stroke="#e7e5e4" />
          <text x="118" y="178" textAnchor="middle" fill="#78716c" fontSize="11" fontFamily="system-ui, sans-serif">
            CV
          </text>
        </g>

        {/* Middle card */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -6; 0 0"
            dur="5.5s"
            begin="0.4s"
            repeatCount="indefinite"
          />
          <rect x="72" y="56" width="140" height="176" rx="12" fill="url(#landing-card-shine)" stroke="#d6d3d1" strokeWidth="1.5" />
          <rect x="82" y="72" width="100" height="8" rx="2" fill="#d6d3d1" />
          <rect x="82" y="88" width="72" height="6" rx="2" fill="#e7e5e4" />
          <rect x="82" y="102" width="96" height="6" rx="2" fill="#e7e5e4" />
        </g>

        {/* Front card — rank */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -7; 0 0"
            dur="5s"
            begin="0.2s"
            repeatCount="indefinite"
          />
          <rect x="96" y="40" width="140" height="176" rx="12" fill="white" stroke="#0d9488" strokeWidth="1.5" />
          <rect x="106" y="56" width="100" height="8" rx="2" fill="#ccfbf1" />
          <rect x="106" y="72" width="64" height="6" rx="2" fill="#e7e5e4" />
          <rect x="106" y="86" width="88" height="6" rx="2" fill="#e7e5e4" />
          <rect x="106" y="108" width="120" height="40" rx="6" fill="#f0fdfa" stroke="#99f6e4" />
          <text x="166" y="132" textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">
            Rank #1
          </text>
        </g>

        {/* Score panel */}
        <g transform="translate(248, 48)">
          <rect width="120" height="200" rx="14" fill="white" stroke="#e7e5e4" strokeWidth="1.5" />
          <text x="60" y="28" textAnchor="middle" fill="#57534e" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif" letterSpacing="0.06em">
            SCORE
          </text>
          <text x="60" y="58" textAnchor="middle" fill="#0f766e" fontSize="26" fontWeight="700" fontFamily="system-ui, sans-serif">
            87
          </text>

          <g transform="translate(16, 76)">
            <rect y="0" width="88" height="6" rx="3" fill="#f5f5f4" />
            <rect y="0" height="6" rx="3" fill="url(#landing-teal)">
              <animate attributeName="width" values="28;78;78;28" dur="4s" repeatCount="indefinite" />
            </rect>

            <rect y="18" width="88" height="6" rx="3" fill="#f5f5f4" />
            <rect y="18" height="6" rx="3" fill="#0d9488" opacity="0.88">
              <animate attributeName="width" values="22;64;64;22" dur="4s" begin="0.35s" repeatCount="indefinite" />
            </rect>

            <rect y="36" width="88" height="6" rx="3" fill="#f5f5f4" />
            <rect y="36" height="6" rx="3" fill="#14b8a6" opacity="0.75">
              <animate attributeName="width" values="36;88;88;36" dur="4s" begin="0.65s" repeatCount="indefinite" />
            </rect>
          </g>

          <circle cx="60" cy="178" r="4" fill="#0d9488" opacity="0.7">
            <animate attributeName="opacity" values="0.35;1;0.35" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>

        <path
          d="M 236 130 C 240 120 244 115 252 112"
          stroke="#d6d3d1"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          fill="none"
          opacity="0.85"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  )
}
