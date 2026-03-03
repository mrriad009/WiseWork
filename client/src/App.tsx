import React, { useState, useEffect } from 'react'
import {
  Upload, Link as LinkIcon, Brain, Search, Users, Shield, Sparkles,
  ChevronRight, CheckCircle2, Zap, Award, MessageSquare, BarChart,
  Globe, Lock, Monitor, ArrowRight, Play, Star, Quote, Menu, X
} from 'lucide-react'
import ResumeAnalysis from './components/ResumeAnalysis';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showApp, setShowApp] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (showApp) {
    return <ResumeAnalysis onBack={() => setShowApp(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-violet-500/30">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-1.5 bg-violet-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">WISEWORK</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['features', 'ecosystem', 'about'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors capitalize"
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => setShowApp(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            >
              Launch App
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950 pt-24 px-6 md:hidden">
          <div className="flex flex-col gap-6 text-center">
            {['features', 'ecosystem', 'about'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xl font-bold text-white capitalize py-4 border-b border-white/5"
              >
                {item}
              </a>
            ))}
            <button
              onClick={() => setShowApp(true)}
              className="w-full py-4 rounded-xl bg-violet-600 text-white font-bold mt-4"
            >
              Launch App
            </button>
          </div>
        </div>
      )}

      <main className="pt-32">
        {/* --- Hero Section --- */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen AI Recruitment
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 max-w-4xl mx-auto leading-tight">
            The Future of Recruitment is <span className="text-violet-500">Artificial Intelligence.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            WiseWork is an elite AI engine that parses, scores, and ranks candidates with 99.4% accuracy. Turn weeks of manual screening into seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowApp(true)}
              className="bg-violet-600 hover:bg-violet-500 px-8 py-4 rounded-xl font-bold text-white transition-all flex items-center gap-2"
            >
              Start Analyzing Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </div>
        </section>

        {/* --- Stats Section --- */}
        <section className="bg-white/[0.02] border-y border-white/5 py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Resumes Parsed', val: '2.5M+' },
              { label: 'Time Saved', val: '94%' },
              { label: 'Global Clients', val: '500+' },
              { label: 'Accuracy Rate', val: '99.4%' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.val}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Features Grid --- */}
        <section id="features" className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Extreme Productivity.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We've combined Gemini 1.5 Pro with custom recruitment heuristics to build a dashboard that delivers results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-violet-400" />}
              title="Instant Batch Processing"
              desc="Drop 500+ resumes and watch as our engine taxonomizes them in real-time."
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-violet-400" />}
              title="Conceptual Scoring"
              desc="Go beyond keywords. Analyze candidate intent and potential with semantic search."
            />
            <FeatureCard
              icon={<Monitor className="w-6 h-6 text-violet-400" />}
              title="Live Previews"
              desc="Interactive summaries that let you drill down into experiences without opening PDFs."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-violet-400" />}
              title="LinkedIn Synergy"
              desc="Automatically cross-reference resume data with live professional profiles."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-violet-400" />}
              title="Zero Bias Algorithm"
              desc="Tuned for diversity and inclusion, focusing purely on skill and contribution."
            />
            <FeatureCard
              icon={<Award className="w-6 h-6 text-violet-400" />}
              title="Predictive Path"
              desc="AI forecasts where a candidate's career is headed based on historical data."
            />
          </div>
        </section>

        {/* --- Simple Testimonials --- */}
        <section className="bg-white/[0.02] py-32 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-20">Loved by Pioneers.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="WiseWork cut our screening time by 90%. We hired our last roles within days."
                author="Sarah Chen"
                role="Head of HR, Nebula"
              />
              <TestimonialCard
                quote="The depth of skill extraction is unparalleled. It sees things we missed."
                author="Marcus Wright"
                role="Founder, HyperScale"
              />
              <TestimonialCard
                quote="Finally a tool that actually understands engineering quality, not just buzzwords."
                author="Elena Rossi"
                role="CTO, Quantify"
              />
            </div>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="max-w-5xl mx-auto px-6 py-32 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 tracking-tight">Ready to Build Your Dream Team?</h2>
          <button
            onClick={() => setShowApp(true)}
            className="bg-white text-slate-950 px-10 py-5 rounded-xl font-bold text-lg hover:bg-violet-500 hover:text-white transition-all"
          >
            Launch App Now
          </button>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-600 rounded-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">WISEWORK</span>
          </div>

          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">Ecosystem</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>

          <button
            onClick={() => setShowApp(true)}
            className="text-sm font-bold text-violet-400 hover:text-violet-300"
          >
            Launch App
          </button>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© 2026 WiseWork AI. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all">
    <div className="mb-6 p-3 bg-slate-900 rounded-xl w-fit border border-white/10">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
)

const TestimonialCard: React.FC<{ quote: string, author: string, role: string }> = ({ quote, author, role }) => (
  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
    <p className="text-lg text-slate-300 italic mb-6 leading-relaxed">"{quote}"</p>
    <div>
      <p className="font-bold text-white text-sm">{author}</p>
      <p className="text-xs text-slate-500 uppercase font-medium">{role}</p>
    </div>
  </div>
)

export default App
