import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import {
  Upload, Link as LinkIcon, Brain, Search, Users, Shield, Sparkles,
  ChevronRight, CheckCircle2, Zap, Award, MessageSquare, BarChart,
  Globe, Lock, Monitor, ArrowRight, Play, Star, Quote, Menu, X
} from 'lucide-react'

// --- Reusable Motion Components ---

const FloatingElement: React.FC<{ children: React.ReactNode, delay?: number, duration?: number, className?: string }> = ({ children, delay = 0, duration = 6, className }) => (
  <motion.div
    animate={{ y: [0, -20, 0] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
)

const FadeIn: React.FC<{ children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' }> = ({ children, delay = 0, direction = 'up' }) => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

const TypewriterEffect: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
  const words = text.split(" ")
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  }
  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 12, stiffness: 100 } }
  }

  return (
    <motion.div className={className} variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="inline-block mr-3 md:mr-4">
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

import ResumeAnalysis from './components/ResumeAnalysis';

// --- Sections ---

const App: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showApp, setShowApp] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // Parallax effects
  const bgY = useTransform(smoothProgress, [0, 1], ['0%', '15%'])
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9])

  if (showApp) {
    return <ResumeAnalysis onBack={() => setShowApp(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-violet-500/30 font-sans overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 origin-left z-[100]" style={{ scaleX }} />

      {/* Active Background Decorative Elements */}
      <motion.div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ y: bgY }}>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-violet-600/10 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], x: [0, 50, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-fuchsia-600/10 blur-[130px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      </motion.div>

      {/* Navbar */}
      <nav className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out ${isScrolled ? 'top-4 w-[90%] max-w-6xl' : 'top-6 w-[95%] max-w-7xl'}`}>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className={`
            px-6 md:px-8 py-4 flex items-center justify-between rounded-3xl transition-all duration-500
            ${isScrolled
              ? 'bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              : 'bg-white/[0.02] backdrop-blur-md border border-white/5 shadow-lg'
            }
          `}
        >
          <motion.div className="flex items-center gap-3 cursor-pointer group" whileHover={{ scale: 1.02 }}>
            <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20 group-hover:rotate-12 transition-transform duration-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">WISE<span className="text-violet-500 italic">WORK</span></span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2 bg-white/5 rounded-full px-2 py-1.5 border border-white/5">
            {['features', 'ecosystem', 'pricing', 'about'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="px-5 py-2 rounded-full text-sm font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all capitalize relative group"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <motion.button className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Sign In</motion.button>
            <motion.button
              onClick={() => setShowApp(true)}
              className="bg-white text-slate-950 px-6 py-3 rounded-2xl transition-all shadow-xl shadow-white/5 font-black hover:bg-violet-500 hover:text-white active:scale-95 text-xs md:text-sm"
              whileHover={{ scale: 1.05 }}
            >
              Get Started Free
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-3xl pt-32 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {['features', 'ecosystem', 'pricing', 'about'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-black text-white capitalize py-4 border-b border-white/5"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-4 mt-8">
                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold">Sign In</button>
                <button className="w-full py-4 rounded-2xl bg-violet-600 text-white font-black shadow-xl shadow-violet-600/20">Get Started Free</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-48 pb-32 max-w-7xl mx-auto px-6 lg:px-12">
        {/* --- Hero Section --- */}
        <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative mb-40">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <FadeIn>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Empowering 500+ Top Tech Teams
                </div>
              </FadeIn>

              <TypewriterEffect
                text="The Future of Recruitment is Artificial Intelligence."
                className="text-5xl md:text-7xl lg:text-8xl font-[1000] leading-[1.05] tracking-tight text-white drop-shadow-2xl"
              />

              <FadeIn delay={0.4}>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  WiseWork is an elite AI engine that parses, scores, and ranks candidates with 99.4% accuracy. Turn weeks of manual screening into seconds of automated precision.
                </p>
              </FadeIn>

              <FadeIn delay={0.6}>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6">
                  <button
                    onClick={() => setShowApp(true)}
                    className="group relative bg-violet-600 hover:bg-violet-500 px-10 py-5 rounded-2xl font-black text-white transition-all flex items-center gap-3 shadow-[0_20px_40px_rgba(139,92,246,0.3)] ring-1 ring-violet-400 overflow-hidden">
                    <span className="relative z-10">Start Analyzing Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                  <button className="flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md group">
                    <div className="p-2 bg-indigo-500 rounded-full group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                    Watch Overview
                  </button>
                </div>
              </FadeIn>
            </div>

            <div className="relative hidden lg:block">
              <FloatingElement delay={0.5} className="z-20 relative">
                <div className="p-1 rounded-[3rem] bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30 backdrop-blur-3xl shadow-2xl">
                  <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[2.9rem] p-10 border border-white/10 space-y-10 group overflow-hidden relative">
                    {/* Inner Decorative Blur */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/20 blur-[60px] pointer-events-none group-hover:bg-violet-500/40 transition-all duration-700" />

                    <div className="flex items-center justify-between border-b border-white/10 pb-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/20">
                          <Users className="text-white w-8 h-8" />
                        </div>
                        <div>
                          <p className="font-black text-xl text-white tracking-tight">Lead AI Engineer</p>
                          <p className="text-sm font-bold text-slate-500">Batch Analysis #WRK-2026</p>
                        </div>
                      </div>
                      <div className="px-5 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black border border-emerald-500/20">
                        Top 1% Match
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-400">Contextual Relevancy</span>
                        <span className="text-3xl font-black text-violet-400">98.2%</span>
                      </div>
                      <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "98.2%" }}
                          transition={{ duration: 2, ease: "anticipate" }}
                          className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-4">
                      {[
                        { label: 'Technical Depth', val: 'Exemplary', color: 'text-cyan-400' },
                        { label: 'Soft Skills', val: 'Advanced', color: 'text-fuchsia-400' }
                      ].map((item, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-default group/card">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{item.label}</p>
                          <p className={`text-xl font-black ${item.color} group-hover/card:scale-105 transition-transform`}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Orbital Mini Cards */}
              <FloatingElement delay={1} duration={5} className="absolute -top-10 -left-20 z-30">
                <div className="px-6 py-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-white">Live Parsing Active</span>
                </div>
              </FloatingElement>

              <FloatingElement delay={2} duration={7} className="absolute -bottom-10 -right-10 z-30">
                <div className="px-8 py-5 rounded-[2rem] bg-gradient-to-tr from-slate-900 to-indigo-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-2">
                  <p className="text-[10px] font-black text-indigo-300 uppercase">Weekly Throughput</p>
                  <p className="text-3xl font-black text-white">12,480+</p>
                </div>
              </FloatingElement>
            </div>
          </div>
        </motion.section>

        {/* --- Stats Section --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-40 border-y border-white/5 py-12 px-8 bg-white/[0.01]">
          {[
            { label: 'Resumes Parsed', val: '2.5M+', icon: <BarChart className="w-5 h-5" /> },
            { label: 'Average Time saved', val: '94%', icon: <Zap className="w-5 h-5" /> },
            { label: 'Global Clients', val: '500+', icon: <Globe className="w-5 h-5" /> },
            { label: 'Data Security', val: 'AES-256', icon: <Lock className="w-5 h-5" /> }
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="text-center group">
                <div className="mx-auto w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  {stat.icon}
                </div>
                <p className="text-4xl font-black text-white mb-1">{stat.val}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* --- Features Grid --- */}
        <section id="features" className="mb-40 space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-[1000] tracking-tight text-white leading-tight">
                Engineered for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">Extreme Productivity.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium pt-4">
                We've combined the power of Gemini 1.5 Pro with custom recruitment heuristics to build a dashboard that feels like magic.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BigFeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Instant Batch Processing"
              desc="Drop 500+ resumes and watch as our engine taxonomizes them in real-time. No more manual data entry."
              delay={0.1}
            />
            <BigFeatureCard
              icon={<Brain className="w-8 h-8 text-violet-400" />}
              title="Conceptual Scoring"
              desc="Go beyond keywords. We analyze candidate intent, potential, and underlying skills with deep semantic search."
              delay={0.2}
            />
            <BigFeatureCard
              icon={<Monitor className="w-8 h-8 text-cyan-400" />}
              title="Live Candidate Previews"
              desc="Interactive summaries that let you drill down into specific experiences without opening every PDF."
              delay={0.3}
            />
            <BigFeatureCard
              icon={<Globe className="w-8 h-8 text-indigo-400" />}
              title="LinkedIn 360 Synergy"
              desc="Automatically cross-reference resume data with live professional profiles for a cohesive history."
              delay={0.1}
            />
            <BigFeatureCard
              icon={<Shield className="w-8 h-8 text-emerald-400" />}
              title="Zero Bias Algorithm"
              desc="Our models are tuned for diversity and inclusion, focusing purely on skill and cultural contribution."
              delay={0.2}
            />
            <BigFeatureCard
              icon={<Award className="w-8 h-8 text-fuchsia-400" />}
              title="Predictive Talent Path"
              desc="AI forecasts where a candidate's career is headed, helping you hire for tomorrow, not just today."
              delay={0.3}
            />
          </div>
        </section>

        {/* --- Interactive Workflow Section --- */}
        <section id="ecosystem" className="mb-40">
          <div className="p-12 md:p-24 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 blur-[150px] group-hover:bg-cyan-500/20 transition-all duration-1000" />

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <FadeIn>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1]">
                    The Intelligent <br />
                    <span className="text-violet-400">Recruitment Cycle.</span>
                  </h2>
                </FadeIn>
                <div className="space-y-10 relative">
                  <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-violet-500 via-fuchsia-500 to-transparent opacity-30" />

                  {[
                    { step: '01', title: 'Deep Ingestion', desc: 'Securely upload multi-format resumes via encrypted gateway.' },
                    { step: '02', title: 'Contextual Analysis', desc: 'AI maps skills against your specific job requirements and company culture.' },
                    { step: '03', title: 'Dynamic Ranking', desc: 'Get a real-time leaderboard of the most qualified candidates.' }
                  ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.2}>
                      <div className="flex gap-10 items-start relative group/step cursor-default">
                        <div className="relative z-10 w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center font-black text-violet-400 shadow-xl group-hover/step:bg-violet-600 group-hover/step:text-white transition-all duration-300 ring-4 ring-slate-950">
                          {item.step}
                        </div>
                        <div className="space-y-2 pt-1">
                          <h4 className="text-xl font-black text-white group-hover/step:text-violet-200 transition-colors uppercase tracking-tight">{item.title}</h4>
                          <p className="text-slate-500 font-medium leading-relaxed group-hover/step:text-slate-400 transition-colors">{item.desc}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>

              <div className="relative">
                <FadeIn direction="left">
                  <div className="p-16 rounded-[4rem] bg-slate-900/50 border border-white/10 backdrop-blur-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 via-transparent to-cyan-500/5" />
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Brain className="w-40 h-40 text-violet-500 mx-auto mb-10 filter drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]" />
                    </motion.div>
                    <div className="space-y-4">
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 0.8, 0.2] }}
                            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                            className="w-1.5 h-12 rounded-full bg-violet-500/40"
                          />
                        ))}
                      </div>
                      <p className="text-center text-xs font-black text-violet-300 uppercase tracking-[0.3em] pt-4">Neural Engine Processing...</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* --- Testimonials --- */}
        <section className="mb-40 space-y-20">
          <div className="text-center">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-black text-white">Loved by <span className="text-indigo-400">Pioneers.</span></h2>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="WiseWork cut our screening time by 90%. We hired our last 3 senior roles within 4 days."
              author="Sarah Chen"
              role="Head of HR, Nebula Systems"
              delay={0.1}
            />
            <TestimonialCard
              quote="The depth of skill extraction is unparalleled. It sees things we missed in manual reviews."
              author="Marcus Wright"
              role="Founder, HyperScale AI"
              delay={0.2}
            />
            <TestimonialCard
              quote="Finally a recruitment tool that actually understands engineering quality, not just buzzwords."
              author="Elena Rossi"
              role="CTO, Quantify Labs"
              delay={0.3}
            />
          </div>
        </section>

        {/* --- Pricing Section --- */}
        <section id="pricing" className="mb-40">
          <div className="text-center mb-16 space-y-4">
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-black text-white italic">Elite Pricing.</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Choose the engine that fits your growth.</p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              title="Starter"
              price="0"
              features={['15 Resumes / Month', 'Standard AI Analysis', 'Basic Ranking', 'Email Support']}
              delay={0.1}
            />
            <PricingCard
              title="Pro"
              price="99"
              features={['Unlimited Batching', 'Gemini Ultra Parsing', 'LinkedIn Synergy', 'Priority Queue']}
              isRecommended={true}
              delay={0.2}
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              features={['Custom Model Training', 'Full API Access', 'SSO & Audit Logs', '24/7 Dedicated Support']}
              delay={0.3}
            />
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className="relative text-center py-20 rounded-[4rem] bg-gradient-to-t from-violet-600/20 to-transparent border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent opacity-50" />
          <FadeIn>
            <div className="space-y-10 relative z-10 px-6">
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">Ready to Build Your <br /> Dream Team?</h2>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-white text-slate-950 px-12 py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-violet-500 hover:text-white transition-all scale-110 active:scale-100">
                  Deploy WiseWork Locally
                </button>
                <button className="px-12 py-6 rounded-2xl font-black text-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                  Contact Sales Specialist
                </button>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-white/5 py-20 px-6 md:px-12 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-600 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-2xl text-white tracking-tighter">WISEWORK</span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Decentralizing and automating the future of professional matching. Built with precision for the modern age.
            </p>
            <div className="flex gap-4">
              {[Globe, Monitor, MessageSquare].map((Icon, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 hover:text-violet-400 hover:bg-white/10 transition-all cursor-pointer">
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          {[
            { title: 'Product', links: ['Neural Engine', 'Sync Core', 'Security', 'Roadmap'] },
            { title: 'Resources', links: ['Documentation', 'Status', 'API Reference', 'Integrations'] },
            { title: 'Company', links: ['Philosophy', 'Legal', 'Privacy', 'Contact'] }
          ].map((col, i) => (
            <div key={i} className="space-y-8">
              <h4 className="text-white font-black uppercase tracking-widest text-xs">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-500 hover:text-violet-400 transition-colors text-sm font-bold">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-600 font-bold text-xs uppercase tracking-widest">© 2026 WiseWork AI. All Rights Reserved.</p>
          <div className="flex gap-8 text-[10px] text-slate-600 font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// --- Sub-components ---

const BigFeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, delay: number }> = ({ icon, title, desc, delay }) => (
  <FadeIn delay={delay}>
    <motion.div
      whileHover={{ y: -10 }}
      className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-violet-500/30 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-violet-500" />
      </div>
      <div className="mb-8 p-6 bg-slate-900/50 rounded-2xl w-fit group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 ring-1 ring-white/10 group-hover:ring-violet-400 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-white group-hover:text-violet-200 transition-colors tracking-tight">{title}</h3>
      <p className="text-slate-500 text-sm font-bold leading-relaxed group-hover:text-slate-400 transition-colors">{desc}</p>
    </motion.div>
  </FadeIn>
)

const TestimonialCard: React.FC<{ quote: string, author: string, role: string, delay: number }> = ({ quote, author, role, delay }) => (
  <FadeIn delay={delay}>
    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative group hover:bg-white/[0.04] transition-all">
      <Quote className="w-12 h-12 text-violet-500/20 absolute top-8 right-8" />
      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
      </div>
      <p className="text-lg font-bold text-slate-300 italic mb-8 relative z-10 leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4 border-t border-white/5 pt-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600" />
        <div>
          <p className="font-black text-white text-sm uppercase tracking-tight">{author}</p>
          <p className="text-xs font-bold text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  </FadeIn>
)

const PricingCard: React.FC<{ title: string, price: string, features: string[], isRecommended?: boolean, delay: number }> = ({ title, price, features, isRecommended, delay }) => (
  <FadeIn delay={delay}>
    <div className={`
      relative p-10 rounded-[3rem] border transition-all duration-500 group
      ${isRecommended
        ? 'bg-violet-600 border-violet-400 shadow-[0_32px_64px_rgba(139,92,246,0.3)] scale-105 z-10'
        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
      }
    `}>
      {isRecommended && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-white text-violet-600 font-black text-[10px] uppercase tracking-widest shadow-xl">
          Most Popular
        </div>
      )}
      <div className="space-y-6 mb-10 text-center">
        <h3 className={`text-2xl font-black uppercase tracking-tighter ${isRecommended ? 'text-white' : 'text-slate-200'}`}>{title}</h3>
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-black opacity-50">$</span>
          <span className="text-6xl font-black tracking-tighter">{price}</span>
          {price !== 'Custom' && <span className="text-xs font-black opacity-50 uppercase tracking-widest">/mo</span>}
        </div>
      </div>
      <ul className="space-y-6 mb-12">
        {features.map((f, i) => (
          <li key={i} className="flex gap-4 items-center text-sm font-bold">
            <CheckCircle2 className={`w-5 h-5 ${isRecommended ? 'text-white' : 'text-violet-500'} shrink-0`} />
            <span className={isRecommended ? 'text-white/90' : 'text-slate-400'}>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`
        w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all
        ${isRecommended
          ? 'bg-white text-violet-600 hover:scale-105 shadow-xl'
          : 'bg-white/5 border border-white/10 text-white hover:bg-violet-600 hover:border-transparent'
        }
      `}>
        Start Experimenting
      </button>
    </div>
  </FadeIn>
)

export default App
