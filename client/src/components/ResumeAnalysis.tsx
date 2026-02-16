
import React, { useState } from 'react';
import {
    Upload, FileText, Loader2, CheckCircle, AlertCircle, ArrowLeft,
    Linkedin, Award, Briefcase, Zap, Star, Shield, Search, Plus, Trash2, User,
    BarChart3, Target, HardHat, Coffee, Layers, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CandidateEntry {
    id: string;
    file: File | null;
    linkedinUrl: string;
    name: string;
}

const ResumeAnalysis = ({ onBack }: { onBack: () => void }) => {
    const [entries, setEntries] = useState<CandidateEntry[]>([
        { id: Math.random().toString(36).substr(2, 9), file: null, linkedinUrl: '', name: 'Candidate 1' }
    ]);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState('');

    const addEntry = () => {
        setEntries([...entries, {
            id: Math.random().toString(36).substr(2, 9),
            file: null,
            linkedinUrl: '',
            name: `Candidate ${entries.length + 1}`
        }]);
    };

    const removeEntry = (id: string) => {
        if (entries.length > 1) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const updateEntry = (id: string, updates: Partial<CandidateEntry>) => {
        setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    const handleUpload = async () => {
        const validEntries = entries.filter(e => e.file || e.linkedinUrl);
        if (validEntries.length === 0) {
            setError('Please add at least one candidate with a CV or LinkedIn URL.');
            return;
        }

        setAnalyzing(true);
        setResults([]);
        setError('');

        try {
            const allResults = await Promise.all(validEntries.map(async (entry) => {
                const formData = new FormData();
                if (entry.file) formData.append('resumes', entry.file);
                formData.append('linkedinUrl', entry.linkedinUrl);
                formData.append('candidateName', entry.name);

                const response = await fetch('/api/resume', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (response.ok) {
                    return data.results[0];
                } else {
                    return { fileName: entry.file?.name || entry.name, error: data.error || 'Failed' };
                }
            }));

            setResults(allResults);
        } catch (err) {
            setError('Network error or server unavailable');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-violet-500/30 font-sans pb-40 overflow-x-hidden">
            {/* Background Kinetic Blurs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-600/5 blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/5 blur-[140px]" />
            </div>

            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 py-5 px-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Exit Hub
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                            <Zap className="w-5 h-5 text-violet-500" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase">Wise<span className="text-violet-500">Work</span></span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-36 px-8 max-w-[1500px] mx-auto grid xl:grid-cols-[420px_1fr] gap-16">
                {/* Entry Manager Column */}
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter leading-tight italic">Intelligence Flow</h1>
                        <p className="text-slate-500 font-bold text-sm">Batch process multiple vectors for precision hire Decisions.</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-4 backdrop-blur-3xl">
                        <div className="max-h-[500px] overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
                            <AnimatePresence>
                                {entries.map((entry, idx) => (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-slate-900 border border-white/5 rounded-[2rem] p-5 space-y-4 hover:border-violet-500/30 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <input
                                                className="bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest text-violet-400 w-full"
                                                value={entry.name}
                                                onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                                            />
                                            {entries.length > 1 && (
                                                <button onClick={() => removeEntry(entry.id)} className="text-slate-700 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="relative group/file rounded-xl bg-slate-950 border border-white/5 p-4 text-center cursor-pointer hover:border-violet-500/20 transition-all">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => updateEntry(entry.id, { file: e.target.files?.[0] || null })}
                                                />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate block">
                                                    {entry.file ? entry.file.name : 'Upload Resume'}
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="LinkedIn URL"
                                                    value={entry.linkedinUrl}
                                                    onChange={(e) => updateEntry(entry.id, { linkedinUrl: e.target.value })}
                                                    className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold outline-none focus:border-blue-500/40 transition-all"
                                                />
                                                <Linkedin className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-700" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="p-4 space-y-3">
                            <button
                                onClick={addEntry}
                                className="w-full py-4 border border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white/5 hover:text-white transition-all shadow-lg"
                            >
                                <Plus className="w-4 h-4" /> Add Slot
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={analyzing}
                                className="w-full py-5 bg-white text-slate-950 rounded-2.5xl font-black text-xs uppercase tracking-[0.2em] hover:bg-violet-600 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-3"
                            >
                                {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
                                {analyzing ? 'Processing...' : 'Execute Analysis'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Column */}
                <div className="space-y-12">
                    {analyzing && (
                        <div className="space-y-8">
                            {[1, 2].map(i => (
                                <div key={i} className="h-96 rounded-[3.5rem] bg-white/[0.02] border border-white/5 animate-pulse flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 text-slate-800 animate-spin" />
                                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Calibrating Neural Synthesis...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!analyzing && results.length === 0 && (
                        <div className="h-[700px] rounded-[4.5rem] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center px-12">
                            <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center mb-10 border border-white/10">
                                <BarChart3 className="w-12 h-12 text-slate-700" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-700 uppercase tracking-tighter mb-4">Awaiting Signal</h3>
                            <p className="text-slate-600 font-bold text-sm max-w-sm">Stage candidate vectors on the flow panel to generate professional intelligence.</p>
                        </div>
                    )}

                    <div className="space-y-10">
                        <AnimatePresence mode="popLayout">
                            {results.map((res, i) => (
                                <ComprehensiveResult key={i} result={res} index={i} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

const ComprehensiveResult = ({ result, index }: { result: any, index: number }) => {
    if (result.error) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 rounded-[3rem] border border-red-500/20 bg-red-500/5 text-red-500 font-black uppercase text-xs tracking-[0.2em] text-center">
                System Error for Node: {result.candidateName || result.fileName}
            </motion.div>
        );
    }

    const { recommendation, detailed_scores, experience, skills, linkedin_insights } = result;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 80 }}
            className="group relative"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/10 via-cyan-500/10 to-transparent rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 overflow-hidden shadow-3xl">

                {/* 1. Header & Primary Stats */}
                <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-start mb-16 border-b border-white/5 pb-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-3.5xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shadow-inner">
                                <User className="w-12 h-12 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="text-5xl font-black tracking-tighter mb-2 italic bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                    {result.candidateName || result.fileName}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${recommendation.decision === 'Hire' ? 'bg-emerald-500 text-white' :
                                        recommendation.decision === 'Reject' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-slate-950'
                                        }`}>
                                        {recommendation.decision}
                                    </span>
                                    <span className="px-5 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Layers className="w-3.5 h-3.5" /> {experience.seniority_level}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xl font-bold text-slate-400 leading-relaxed pr-10">
                            "{result.executive_summary || result.summary}"
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-slate-950/50 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-indigo-500 leading-none">
                            {result.score}
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-3 italic">Final Rank</span>
                    </div>
                </div>

                <div className="grid xl:grid-cols-[1fr_1.5fr] gap-16">
                    {/* 2. Analytical Metrics */}
                    <div className="space-y-12">
                        {/* Dimensional Scoring */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-violet-500" /> Neural Metrics
                            </h4>
                            <div className="space-y-4">
                                {Object.entries(detailed_scores || {}).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>{key.replace('_', ' ')}</span>
                                            <span>{value as number}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${value}%` }}
                                                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Experience Vector */}
                        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 grid grid-cols-2 gap-6">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Total Tenure</p>
                                <p className="text-3xl font-black text-white italic">{experience.total_years || result.experience_years}Y</p>
                            </div>
                            <div className="text-center italic text-sm font-black text-slate-400 border-l border-white/5 pl-6 flex items-center justify-center">
                                {experience.key_industries?.[0] || "Generalist"}
                            </div>
                        </div>

                        {/* Recommendation Justification */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Shield className="w-4 h-4 text-cyan-400" /> Evaluator Note
                            </h4>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed italic border-l-2 border-violet-500/30 pl-6">
                                {recommendation.justification}
                            </p>
                        </div>
                    </div>

                    {/* 3. Competitive Taxonomy & Graph */}
                    <div className="space-y-12">
                        {/* Skills Taxonomy */}
                        <div className="grid md:grid-cols-2 gap-12">
                            <SkillSection icon={<HardHat className="w-4 h-4 text-emerald-400" />} title="Technical Core" items={skills.technical} color="emerald" />
                            <SkillSection icon={<Coffee className="w-4 h-4 text-violet-400" />} title="Soft Vectors" items={skills.soft} color="violet" />
                        </div>

                        {/* Strengths & Weaknesses (Growth) */}
                        <div className="grid md:grid-cols-2 gap-12">
                            <BulletSection icon={<Star className="w-4 h-4 text-yellow-400" fill="currentColor" />} title="Tactical Assets" items={result.strengths} color="yellow" />
                            <BulletSection icon={<Target className="w-4 h-4 text-red-400" />} title="Growth Gaps" items={result.weaknesses} color="red" />
                        </div>

                        {/* Social Graph Insight */}
                        <div className="p-10 rounded-[3rem] bg-blue-600/[0.03] border border-blue-500/10 group/linkedin hover:bg-blue-600/[0.05] transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Linkedin className="w-4 h-4 fill-blue-500" /> Digital Presence
                                </h4>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${linkedin_insights?.profile_quality === 'High' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    {linkedin_insights?.profile_quality || "Unknown"} Grade
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-400 leading-relaxed pr-6 group-hover/linkedin:text-slate-300 transition-colors italic">
                                "{linkedin_insights?.synergy_report || result.linkedin_synergy || "Extended profile metadata not found. Analysis based on primary CV data only."}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const SkillSection = ({ icon, title, items, color }: any) => (
    <div className="space-y-5">
        <h4 className={`text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2`}>
            {icon} {title}
        </h4>
        <div className="flex flex-wrap gap-2">
            {items?.map((item: string, idx: number) => (
                <span key={idx} className="px-3.5 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:border-violet-500/40 transition-all">
                    {item}
                </span>
            ))}
        </div>
    </div>
);

const BulletSection = ({ icon, title, items, color }: any) => (
    <div className="space-y-5">
        <h4 className={`text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2`}>
            {icon} {title}
        </h4>
        <ul className="space-y-3">
            {items?.map((item: string, idx: number) => (
                <li key={idx} className="flex gap-4 group/item">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500/30 mt-1.5 group-hover/item:bg-${color}-400 transition-colors`} />
                    <span className="text-xs font-bold text-slate-400 group-hover/item:text-slate-200 transition-colors">
                        {item}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

export default ResumeAnalysis;
