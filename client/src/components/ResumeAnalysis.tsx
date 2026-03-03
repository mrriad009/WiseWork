import React, { useState } from 'react';
import {
    Upload, FileText, Loader2, CheckCircle, AlertCircle, ArrowLeft,
    Linkedin, Award, Briefcase, Zap, Star, Shield, Search, Plus, Trash2, User,
    BarChart3, Target, HardHat, Coffee, Layers, Globe, Brain
} from 'lucide-react';

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

            // Ranking Logic: Sort candidates by score descending
            const sortedResults = allResults.sort((a, b) => {
                const scoreA = typeof a.score === 'number' ? a.score : 0;
                const scoreB = typeof b.score === 'number' ? b.score : 0;
                return scoreB - scoreA;
            });

            setResults(sortedResults);
        } catch (err) {
            setError('Network error or server unavailable');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans pb-20">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-violet-600 rounded">
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg">WISEWORK</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto pt-32 px-6 grid lg:grid-cols-[350px_1fr] gap-12">
                {/* Entry Manager Column */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Analysis Hub</h1>
                        <p className="text-slate-500 text-sm">Batch process resumes for precision hiring.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="space-y-4 mb-6">
                            {entries.map((entry) => (
                                <div key={entry.id} className="bg-slate-900 border border-white/5 rounded-xl p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <input
                                            className="bg-transparent border-none outline-none font-bold text-xs text-violet-400 w-full"
                                            value={entry.name}
                                            onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                                        />
                                        {entries.length > 1 && (
                                            <button onClick={() => removeEntry(entry.id)} className="text-slate-600 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="relative rounded-lg bg-slate-950 border border-white/5 p-3 text-center cursor-pointer hover:border-violet-500/20">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={(e) => updateEntry(entry.id, { file: e.target.files?.[0] || null })}
                                            />
                                            <span className="text-xs font-bold text-slate-500 truncate block">
                                                {entry.file ? entry.file.name : 'Choose Resume'}
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="LinkedIn Profile URL"
                                            value={entry.linkedinUrl}
                                            onChange={(e) => updateEntry(entry.id, { linkedinUrl: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/5 rounded-lg px-3 py-2 text-xs font-medium outline-none border-transparent focus:border-violet-500/30"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={addEntry}
                                className="w-full py-3 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                <Plus className="w-4 h-4" /> Add Candidate
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={analyzing}
                                className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                {analyzing ? 'Analyzing...' : 'Execute Analysis'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Column */}
                <div className="space-y-8">
                    {analyzing && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-white/10">
                            <Loader2 className="w-10 h-10 text-violet-500 animate-spin mb-4" />
                            <p className="text-sm font-bold text-slate-400">Processing candidates...</p>
                        </div>
                    )}

                    {!analyzing && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                            <Search className="w-12 h-12 text-slate-700 mb-4" />
                            <h3 className="text-xl font-bold text-slate-600 italic">No analysis results yet</h3>
                            <p className="text-xs text-slate-700 mt-2">Upload resumes to see intelligence reports.</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {results.map((res, i) => (
                            <ResultCard key={i} result={res} rank={i + 1} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

const ResultCard = ({ result, rank }: { result: any, rank: number }) => {
    if (result.error) {
        return (
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-bold text-center">
                Error analyzing {result.candidateName || result.fileName}: {result.error}
            </div>
        );
    }

    const { recommendation, detailed_scores, experience, skills } = result;

    return (
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-white/5 pb-8">
                <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center">
                        <User className="w-8 h-8 text-violet-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-3xl font-bold">{result.candidateName || result.fileName}</h3>
                            <span className="bg-violet-600 text-white px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">
                                Rank #{rank}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${recommendation.decision === 'Hire' ? 'bg-emerald-500/20 text-emerald-400' :
                                recommendation.decision === 'Reject' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {recommendation.decision}
                            </span>
                            <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-slate-500 uppercase">
                                {experience.seniority_level}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-center md:text-right">
                    <div className="text-4xl font-bold text-violet-500">{result.score}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Final Score</div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metrics</h4>
                        <div className="space-y-3">
                            {Object.entries(detailed_scores || {}).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                                        <span>{key.replace('_', ' ')}</span>
                                        <span>{value as number}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-violet-600" style={{ width: `${value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl">
                        <p className="text-xs text-slate-400 leading-relaxed italic">"{recommendation.justification}"</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <SkillList title="Technical" items={skills.technical} />
                        <SkillList title="Soft Skills" items={skills.soft} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <BulletList title="Strengths" items={result.strengths} color="text-emerald-400" />
                        <BulletList title="Weaknesses" items={result.weaknesses} color="text-red-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkillList = ({ title, items }: any) => (
    <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</h4>
        <div className="flex flex-wrap gap-1.5">
            {items?.slice(0, 8).map((item: string, idx: number) => (
                <span key={idx} className="px-2 py-1 bg-slate-800 rounded text-[9px] font-medium text-slate-400">
                    {item}
                </span>
            ))}
        </div>
    </div>
);

const BulletList = ({ title, items, color }: any) => (
    <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</h4>
        <ul className="space-y-1.5">
            {items?.slice(0, 3).map((item: string, idx: number) => (
                <li key={idx} className="text-xs text-slate-400 flex gap-2">
                    <span className={`font-bold ${color}`}>•</span>
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

export default ResumeAnalysis;
