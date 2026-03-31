import React, { useId } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Animated SVG for the landing “How it works” section — horizontal pipeline with
 * color-coded stages. No CSS transform scale (avoids overflow clipping).
 */
export function LandingWorkflowAnimation({ className = '' }: { className?: string }) {
  const rawId = useId().replace(/:/g, '')
  const gid = `wwflow-${rawId}`
  const reduce = useReducedMotion()

  return (
    <div className={`relative ${className}`}>
      <p className="mx-auto mb-5 max-w-2xl px-2 text-center text-base font-medium leading-snug text-stone-600 md:mb-6 md:text-lg">
        Your candidates move <span className="font-semibold text-teal-800">left to right</span> — from files to a sorted shortlist.
      </p>

      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 lg:max-w-7xl">
        {/* Avoid overflow-x-auto here: paired with overflow-y it clips tall SVGs in some browsers. */}
        <div className="mx-auto w-full max-w-[920px]">
          <div className="overflow-visible rounded-3xl border border-stone-200/90 bg-white/95 px-3 py-5 shadow-md ring-1 ring-stone-200/50 sm:px-5 sm:py-7 md:px-7 md:py-8">
            <svg
              viewBox="0 0 920 258"
              className="block h-auto w-full overflow-visible"
              style={{ overflow: 'visible' }}
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby={`${gid}-title`}
            >
                <title id={`${gid}-title`}>
                  Workflow diagram: upload CVs or LinkedIn, AI parses and scores, you review a ranked list
                </title>

                <defs>
                  <linearGradient id={`${gid}-line`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
                    <stop offset="33%" stopColor="#0d9488" stopOpacity="0.95" />
                    <stop offset="66%" stopColor="#7c3aed" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
                  </linearGradient>
                  <filter id={`${gid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M 122 118 L 310 118 L 498 118 L 686 118"
                  stroke={`url(#${gid}-line)`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10 12"
                  fill="none"
                  opacity="0.92"
                >
                  {!reduce && (
                    <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="2.6s" repeatCount="indefinite" />
                  )}
                </path>

                <g transform="translate(40, 36)">
                  <rect width="164" height="148" rx="16" fill="#eff6ff" stroke="#93c5fd" strokeWidth="2" />
                  {!reduce && (
                    <rect width="164" height="148" rx="16" fill="none" stroke="#2563eb" strokeWidth="2.5" opacity="0">
                      <animate
                        attributeName="opacity"
                        values="0;0.65;0;0;0"
                        keyTimes="0;0.12;0.22;0.5;1"
                        dur="7s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  )}
                  <circle cx="32" cy="32" r="16" fill="#2563eb" />
                  <text x="32" y="37" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">
                    1
                  </text>
                  <text x="58" y="30" fill="#1e3a8a" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.12em">
                    INPUT
                  </text>
                  <path
                    d="M82 58 L82 94 M68 72 L82 58 L96 72"
                    stroke="#1d4ed8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="54" y="100" width="56" height="64" rx="8" fill="white" stroke="#bfdbfe" strokeWidth="1.5" />
                  <rect x="62" y="110" width="40" height="5" rx="1.5" fill="#dbeafe" />
                  <rect x="62" y="120" width="32" height="4" rx="1" fill="#e0e7ff" />
                  <text x="82" y="186" textAnchor="middle" fill="#1e3a8a" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">
                    Add CVs / links
                  </text>
                  <text x="82" y="204" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui, sans-serif">
                    PDF, DOC, or LinkedIn
                  </text>
                </g>

                <g transform="translate(228, 36)">
                  <rect width="164" height="148" rx="16" fill="#f0fdfa" stroke="#5eead4" strokeWidth="2" />
                  {!reduce && (
                    <rect width="164" height="148" rx="16" fill="none" stroke="#0d9488" strokeWidth="2.5" opacity="0">
                      <animate
                        attributeName="opacity"
                        values="0;0;0;0.65;0;0"
                        keyTimes="0;0.2;0.25;0.37;0.47;1"
                        dur="7s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  )}
                  <circle cx="32" cy="32" r="16" fill="#0d9488" />
                  <text x="32" y="37" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">
                    2
                  </text>
                  <text x="58" y="30" fill="#134e4a" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.12em">
                    AI
                  </text>
                  <circle cx="82" cy="88" r="28" fill="white" stroke="#99f6e4" strokeWidth="2" />
                  <path
                    d="M64 88 L74 98 L100 72"
                    stroke="#0f766e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <text x="82" y="138" textAnchor="middle" fill="#0f766e" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.06em">
                    LLM
                  </text>
                  <text x="82" y="186" textAnchor="middle" fill="#134e4a" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">
                    Parse &amp; analyze
                  </text>
                  <text x="82" y="204" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui, sans-serif">
                    Text + optional LinkedIn
                  </text>
                </g>

                <g transform="translate(416, 36)">
                  <rect width="164" height="148" rx="16" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2" />
                  {!reduce && (
                    <rect width="164" height="148" rx="16" fill="none" stroke="#7c3aed" strokeWidth="2.5" opacity="0">
                      <animate
                        attributeName="opacity"
                        values="0;0;0;0;0.65;0;0"
                        keyTimes="0;0.4;0.45;0.5;0.62;0.72;1"
                        dur="7s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  )}
                  <circle cx="32" cy="32" r="16" fill="#7c3aed" />
                  <text x="32" y="37" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">
                    3
                  </text>
                  <text x="58" y="30" fill="#4c1d95" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.12em">
                    SCORES
                  </text>
                  <rect x="38" y="68" width="88" height="7" rx="3.5" fill="#ede9fe" />
                  <rect x="38" y="68" width="64" height="7" rx="3.5" fill="#7c3aed" opacity="0.92">
                    {!reduce && (
                      <animate attributeName="width" values="28;78;78;28" dur="3.5s" repeatCount="indefinite" />
                    )}
                  </rect>
                  <rect x="38" y="86" width="88" height="7" rx="3.5" fill="#ede9fe" />
                  <rect x="38" y="86" width="52" height="7" rx="3.5" fill="#8b5cf6" opacity="0.9">
                    {!reduce && (
                      <animate attributeName="width" values="24;72;72;24" dur="3.5s" begin="0.25s" repeatCount="indefinite" />
                    )}
                  </rect>
                  <rect x="38" y="104" width="88" height="7" rx="3.5" fill="#ede9fe" />
                  <rect x="38" y="104" width="70" height="7" rx="3.5" fill="#a78bfa" opacity="0.88">
                    {!reduce && (
                      <animate attributeName="width" values="30;88;88;30" dur="3.5s" begin="0.5s" repeatCount="indefinite" />
                    )}
                  </rect>
                  <text x="82" y="186" textAnchor="middle" fill="#4c1d95" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">
                    Skills &amp; fit bars
                  </text>
                  <text x="82" y="204" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui, sans-serif">
                    Explainable dimensions
                  </text>
                </g>

                <g transform="translate(604, 36)">
                  <rect width="164" height="148" rx="16" fill="#fffbeb" stroke="#fcd34d" strokeWidth="2" />
                  {!reduce && (
                    <rect width="164" height="148" rx="16" fill="none" stroke="#d97706" strokeWidth="2.5" opacity="0">
                      <animate
                        attributeName="opacity"
                        values="0;0;0;0;0;0.65;0"
                        keyTimes="0;0.55;0.6;0.65;0.7;0.82;1"
                        dur="7s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  )}
                  <circle cx="32" cy="32" r="16" fill="#d97706" />
                  <text x="32" y="37" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui, sans-serif">
                    4
                  </text>
                  <text x="58" y="30" fill="#92400e" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.12em">
                    RANK
                  </text>
                  <text x="82" y="78" textAnchor="middle" fill="#d97706" fontSize="28" fontWeight="800" fontFamily="system-ui, sans-serif">
                    1st
                  </text>
                  <text x="52" y="108" fill="#78716c" fontSize="15" fontWeight="700" fontFamily="system-ui, sans-serif">
                    2
                  </text>
                  <text x="108" y="114" fill="#a8a29e" fontSize="13" fontWeight="600" fontFamily="system-ui, sans-serif">
                    3
                  </text>
                  <text x="82" y="186" textAnchor="middle" fill="#92400e" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif">
                    Sorted shortlist
                  </text>
                  <text x="82" y="204" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui, sans-serif">
                    Best match on top
                  </text>
                </g>

                {!reduce && (
                  <circle r="6" fill="#0f766e" stroke="white" strokeWidth="2" filter={`url(#${gid}-glow)`} opacity="0.98">
                    <animateMotion dur="7s" repeatCount="indefinite" path="M 122 118 L 310 118 L 498 118 L 686 118" />
                  </circle>
                )}
              </svg>

              <div
                className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-stone-200/90 pt-4 text-xs text-stone-600 sm:gap-x-7 md:text-sm"
                aria-label="Stage color key"
              >
                <span className="font-semibold text-stone-800">Stage key</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
                  Input
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" aria-hidden />
                  Model
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-violet-600" aria-hidden />
                  Metrics
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-600" aria-hidden />
                  Output
                </span>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
