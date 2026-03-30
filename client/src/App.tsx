import React, { useState } from 'react'
import {
  ArrowRight,
  ChevronRight,
  FileStack,
  Layers,
  Scale,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react'
import ResumeAnalysis from './components/ResumeAnalysis'
import { LandingHeroArt } from './components/LandingHeroArt'
import { LandingDividerArt } from './components/LandingDividerArt'
import { BrandMark, BrandWordmark, PageBackground } from './components/PageChrome'

const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false)

  if (showApp) {
    return <ResumeAnalysis onBack={() => setShowApp(false)} />
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-stone-900 antialiased">
      <PageBackground />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#f6f5f1]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <a href="#" className="flex items-center gap-3 transition opacity-100 hover:opacity-90">
            <BrandMark />
            <BrandWordmark subtitle />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-stone-600 md:flex" aria-label="Primary">
            <a href="#product" className="transition hover:text-stone-900">
              Product
            </a>
            <a href="#workflow" className="transition hover:text-stone-900">
              How it works
            </a>
            <a href="#cta" className="transition hover:text-stone-900">
              Get started
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setShowApp(true)}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-stone-900/10 ring-1 ring-black/5 transition hover:bg-stone-800"
          >
            Open analyzer
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </button>
        </div>
      </header>

      <main id="main">
        <section className="relative mx-auto max-w-6xl px-5 pb-12 pt-10 md:px-8 md:pb-20 md:pt-14">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,420px)] lg:gap-12">
            <div>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-stone-600 shadow-sm ring-1 ring-stone-200/60">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                AI ranking & hiring judgment
              </p>
              <h1 className="font-display text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-stone-900 md:text-5xl lg:text-[3.25rem]">
                Rank CVs with clarity —{' '}
                <span className="text-teal-800">scores your team can trust.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600 md:text-[1.125rem]">
                Upload files or paste LinkedIn links. WiseWork returns ranked candidates, dimension scores, strengths,
                risks, and a clear recommendation — so screening stays fast and explainable.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setShowApp(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 ring-1 ring-teal-800/10 transition hover:bg-teal-800"
                >
                  Start analyzing
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <p className="text-center text-sm text-stone-500 sm:text-left">
                  Runs against your <span className="font-medium text-stone-700">local API</span> when the server is up.
                </p>
              </div>
            </div>
            <LandingHeroArt className="mx-auto w-full justify-items-center lg:mx-0 lg:justify-items-end" />
          </div>

          <ul className="mt-14 grid gap-3 sm:grid-cols-3" aria-label="Highlights">
            {[
              { icon: Layers, label: 'Multi-candidate batch', sub: 'Compare in one run' },
              { icon: Scale, label: 'Explainable scores', sub: 'Bars + rationale' },
              { icon: Zap, label: 'Sorted shortlist', sub: 'Highest fit first' },
            ].map(({ icon: Icon, label, sub }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-stone-200/90 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-stone-200/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 text-teal-800">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{label}</p>
                  <p className="text-xs text-stone-500">{sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="relative w-full text-stone-100">
          <LandingDividerArt className="h-12 w-full md:h-14" />
        </div>

        <section id="product" className="border-t border-stone-200/90 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
                  Everything in one place
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-stone-600 md:text-base">
                  The analyzer mirrors this page: calm surfaces, strong hierarchy, and teal accents for actions and
                  scores — built for long review sessions.
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Product</p>
            </div>

            <ul className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
              <li className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/80 p-7 shadow-sm ring-1 ring-stone-200/50 transition hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-md shadow-stone-900/15">
                  <FileStack className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-stone-900">Batch comparison</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                  Add several candidates, each with a CV and optional LinkedIn URL. One run, one ordered list.
                </p>
              </li>
              <li className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/80 p-7 shadow-sm ring-1 ring-stone-200/50 transition hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-md shadow-teal-700/20">
                  <Scale className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-stone-900">Transparent judgment</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                  See hire / review / reject style signals, seniority, and a written justification — not a black box.
                </p>
              </li>
              <li className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/80 p-7 shadow-sm ring-1 ring-stone-200/50 transition hover:shadow-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-900 ring-1 ring-stone-200">
                  <Sparkles className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-stone-900">Structured insight</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                  Technical and soft skills, strengths and gaps — formatted for handoff to hiring managers.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section id="workflow" className="border-t border-stone-200 bg-[#f0efea]/80">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">How it works</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-stone-600">
                Three steps from files to a ranked shortlist.
              </p>
            </div>
            <ol className="relative mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3 md:gap-6">
              <div
                className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent md:block"
                aria-hidden
              />
              {[
                { step: '1', title: 'Add candidates', desc: 'Name each person and attach a CV or LinkedIn URL.', icon: Upload },
                { step: '2', title: 'Run analysis', desc: 'The server parses content and calls the AI model.', icon: Zap },
                { step: '3', title: 'Review ranks', desc: 'Results sort by score with breakdowns and notes.', icon: Layers },
              ].map(({ step, title, desc, icon: Icon }) => (
                <li key={step} className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-200 bg-white text-teal-800 shadow-md ring-4 ring-[#f0efea]">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <span className="mt-4 font-display text-4xl font-semibold tabular-nums text-stone-200">{step}</span>
                  <h3 className="mt-1 font-semibold text-stone-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="cta" className="border-t border-stone-200 bg-gradient-to-b from-white to-[#f6f5f1] px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-teal-200/70 bg-white p-8 shadow-[0_24px_80px_-32px_rgba(15,118,110,0.35)] ring-1 ring-teal-100/90 md:p-12">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-400/25 blur-3xl"
                aria-hidden
              />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-amber-200/20 blur-3xl" aria-hidden />
              <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Ready</p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">
                    Open the analyzer
                  </p>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-stone-600">
                    Same UI system as this site — optimized for focus and quick scanning.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowApp(true)}
                  className="shrink-0 rounded-full bg-teal-700 px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-teal-700/25 transition hover:bg-teal-800"
                >
                  Launch analyzer
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <BrandMark size="sm" />
                <span className="font-semibold text-stone-900">WiseWork</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-stone-500">
                AI-assisted screening. You stay accountable for hiring decisions.
              </p>
            </div>
            <div className="flex flex-wrap gap-10 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Navigate</p>
                <ul className="mt-3 space-y-2 text-stone-600">
                  <li>
                    <a href="#product" className="hover:text-teal-800">
                      Product
                    </a>
                  </li>
                  <li>
                    <a href="#workflow" className="hover:text-teal-800">
                      How it works
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">App</p>
                <ul className="mt-3 space-y-2 text-stone-600">
                  <li>
                    <button type="button" onClick={() => setShowApp(true)} className="text-left hover:text-teal-800">
                      Analyzer
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone-100 pt-8 text-xs text-stone-400 md:flex-row">
            <span>© {new Date().getFullYear()} WiseWork</span>
            <span className="text-center md:text-right">Built for clear, fair hiring workflows.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
