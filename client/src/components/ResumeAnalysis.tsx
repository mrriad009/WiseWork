import React, { useState, useEffect } from 'react';
import {
    Upload, Loader2, ArrowLeft, Plus, Trash2, User,
    Search, Zap, Scale, Trophy, AlertTriangle, Sparkles, ChevronDown, TrendingUp, LayoutList,
} from 'lucide-react';
import { BrandMark, BrandWordmark, PageBackground } from './PageChrome';

interface CandidateEntry {
    id: string;
    file: File | null;
    linkedinUrl: string;
    name: string;
}

type AnalysisResult = Record<string, unknown> & {
    error?: string;
    /** From form (e.g. "Candidate 1") — fallback only */
    candidateName?: string;
    /** Full name parsed from CV / profile by the model */
    cv_candidate_name?: string;
    fileName?: string;
    score?: number;
    executive_summary?: string;
    recommendation?: { decision?: string; justification?: string };
    detailed_scores?: Record<string, number>;
    experience?: { seniority_level?: string };
    skills?: { technical?: string[]; soft?: string[] };
    strengths?: string[];
    weaknesses?: string[];
};

type SavedAnalysisRun = {
    id: string;
    created_at: string;
    candidate_name: string | null;
    linkedin_url: string | null;
    file_name: string | null;
    result: AnalysisResult | null;
    error: string | null;
};

const DIM_KEYS = ['technical_depth', 'leadership', 'domain_expertise', 'communication'] as const;
const DIM_LABELS: Record<string, string> = {
    technical_depth: 'Technical',
    leadership: 'Leadership',
    domain_expertise: 'Domain',
    communication: 'Communication',
};

/** Prefer name from parsed CV; then form label; then file; then generic. */
function displayNameForResult(r: AnalysisResult, rank: number) {
    const fromCv = typeof r.cv_candidate_name === 'string' ? r.cv_candidate_name.trim() : '';
    if (fromCv) return fromCv;
    return (r.candidateName || r.fileName || `Candidate ${rank}`) as string;
}

function displayNameForSavedRun(run: SavedAnalysisRun) {
    const res = run.result;
    if (res && typeof res.cv_candidate_name === 'string' && res.cv_candidate_name.trim()) {
        return res.cv_candidate_name.trim();
    }
    if (run.candidate_name?.trim()) return run.candidate_name.trim();
    if (run.file_name?.trim()) return run.file_name.trim();
    return 'Unknown candidate';
}

function okResults(results: AnalysisResult[]) {
    return results
        .map((r, i) => ({ r, rank: i + 1 }))
        .filter(({ r }) => !r.error && typeof r.score === 'number');
}

const ResumeAnalysis = ({ onBack }: { onBack: () => void }) => {
    const [mainTab, setMainTab] = useState<'review' | 'saved'>('review');
    const [savedRuns, setSavedRuns] = useState<SavedAnalysisRun[]>([]);
    const [savedLoading, setSavedLoading] = useState(false);
    const [savedError, setSavedError] = useState('');
    const [dbConfigured, setDbConfigured] = useState<boolean | null>(null);

    const [entries, setEntries] = useState<CandidateEntry[]>([
        { id: Math.random().toString(36).substr(2, 9), file: null, linkedinUrl: '', name: 'Candidate 1' }
    ]);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mainTab !== 'saved') return;
        let cancelled = false;
        (async () => {
            setSavedLoading(true);
            setSavedError('');
            try {
                const r = await fetch('/api/analyses?limit=100');
                const data = (await r.json()) as {
                    runs?: SavedAnalysisRun[];
                    databaseConfigured?: boolean;
                    error?: string;
                };
                if (cancelled) return;
                setDbConfigured(data.databaseConfigured ?? false);
                if (data.runs) setSavedRuns(data.runs);
                if (!r.ok && data.error) setSavedError(data.error);
            } catch {
                if (!cancelled) setSavedError('Could not load saved candidates.');
            } finally {
                if (!cancelled) setSavedLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [mainTab]);

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
            setError('Add at least one CV file or LinkedIn URL.');
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
                    return data.results[0] as AnalysisResult;
                } else {
                    return { fileName: entry.file?.name || entry.name, error: data.error || 'Failed' } as AnalysisResult;
                }
            }));

            const sortedResults = allResults.sort((a, b) => {
                const scoreA = typeof a.score === 'number' ? a.score : 0;
                const scoreB = typeof b.score === 'number' ? b.score : 0;
                return scoreB - scoreA;
            });

            setResults(sortedResults);
        } catch {
            setError('Could not reach the server. Try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const comparable = okResults(results);
    const multiCompare = comparable.length >= 2;

    return (
        <div className="relative min-h-screen text-stone-900">
            <PageBackground />

            <header className="sticky top-0 z-50 border-b border-stone-200/90 bg-[#f6f5f1]/85 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/90 px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm ring-1 ring-stone-200/50 transition hover:border-stone-300 hover:bg-white"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        <span className="hidden sm:inline">Back to site</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <BrandMark size="sm" />
                        <BrandWordmark />
                    </div>
                    <span className="w-[4.5rem] sm:w-28" aria-hidden />
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
                <header className="mb-8 border-b border-stone-200/80 pb-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Analyzer</p>
                    <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
                        Candidate review
                    </h1>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-600">
                        {mainTab === 'review'
                            ? 'Results use names parsed from each CV when available. Compare scores side by side, then open a card for full detail.'
                            : 'All analysis runs stored in your database (Neon), newest first.'}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setMainTab('review')}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                mainTab === 'review'
                                    ? 'bg-stone-900 text-white shadow-md shadow-stone-900/15'
                                    : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                            }`}
                        >
                            <Zap className="h-4 w-4" aria-hidden />
                            Current analysis
                        </button>
                        <button
                            type="button"
                            onClick={() => setMainTab('saved')}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                                mainTab === 'saved'
                                    ? 'bg-stone-900 text-white shadow-md shadow-stone-900/15'
                                    : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                            }`}
                        >
                            <LayoutList className="h-4 w-4" aria-hidden />
                            Candidate list
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="mb-8 rounded-2xl border border-red-200/90 bg-red-50 px-5 py-4 text-sm text-red-900 shadow-sm ring-1 ring-red-100" role="alert">
                        {error}
                    </div>
                )}

                {mainTab === 'saved' && (
                    <SavedCandidatesPanel
                        runs={savedRuns}
                        loading={savedLoading}
                        error={savedError}
                        dbConfigured={dbConfigured}
                    />
                )}

                {mainTab === 'review' && (
                <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12">
                    <aside>
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-lg shadow-stone-900/[0.04] ring-1 ring-stone-200/60 lg:sticky lg:top-24">
                            <h2 className="font-semibold text-stone-900">Candidates</h2>
                            <p className="mt-1 text-xs leading-relaxed text-stone-500">
                                Each block is one applicant. At least one of CV file or LinkedIn URL is required.
                            </p>

                            <div className="mt-6 space-y-4">
                                {entries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="rounded-2xl border border-stone-100 bg-stone-50/90 p-4 ring-1 ring-stone-200/50"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <input
                                                className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400"
                                                value={entry.name}
                                                onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                                                placeholder="Display name"
                                            />
                                            {entries.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeEntry(entry.id)}
                                                    className="shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-white hover:text-red-600"
                                                    aria-label="Remove candidate"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-3 space-y-2">
                                            <label className="relative flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white px-3 py-2.5 text-center text-xs font-medium text-stone-600 transition hover:border-teal-400/50">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 cursor-pointer opacity-0"
                                                    onChange={(e) => updateEntry(entry.id, { file: e.target.files?.[0] || null })}
                                                />
                                                <Upload className="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
                                                <span className="truncate">{entry.file ? entry.file.name : 'Upload CV'}</span>
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="LinkedIn URL (optional)"
                                                value={entry.linkedinUrl}
                                                onChange={(e) => updateEntry(entry.id, { linkedinUrl: e.target.value })}
                                                className="w-full min-h-[44px] rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-900 outline-none placeholder:text-stone-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-2">
                                <button
                                    type="button"
                                    onClick={addEntry}
                                    className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add candidate
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={analyzing}
                                    className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800 disabled:opacity-50"
                                >
                                    {analyzing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Analyzing…
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4" />
                                            Run analysis
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </aside>

                    <div className="min-h-[320px] custom-scrollbar lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-1">
                        {analyzing && (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white py-24 shadow-sm">
                                <div className="relative">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-teal-400/20" />
                                    <Loader2 className="relative h-10 w-10 animate-spin text-teal-700" aria-hidden />
                                </div>
                                <p className="mt-6 text-sm font-semibold text-stone-700">Processing candidates…</p>
                                <p className="mt-1 text-xs text-stone-500">This may take a moment per resume.</p>
                            </div>
                        )}

                        {!analyzing && results.length === 0 && (
                            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200/90 bg-white/70 py-20 text-center md:py-28">
                                <div className="rounded-2xl bg-stone-100 p-4 text-stone-400">
                                    <Search className="h-10 w-10" strokeWidth={1.25} aria-hidden />
                                </div>
                                <p className="mt-6 font-display text-lg font-semibold text-stone-800">No results yet</p>
                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
                                    Add candidates on the left and run analysis. Ranked cards with scores will appear here.
                                </p>
                            </div>
                        )}

                        {!analyzing && results.length > 0 && (
                            <div className="space-y-10">
                                {multiCompare && (
                                    <ComparisonSection results={results} comparable={comparable} />
                                )}
                                <div
                                    className={
                                        multiCompare
                                            ? 'grid gap-8 sm:grid-cols-1 lg:grid-cols-2 lg:items-start'
                                            : 'space-y-8'
                                    }
                                >
                                    {results.map((res, i) => (
                                        <ResultCard key={i} result={res} rank={i + 1} compactHeader={multiCompare} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                )}
            </main>
        </div>
    );
};

/** Side-by-side leaderboard + dimension matrix for quick scanning */
function ComparisonSection({
    results,
    comparable,
}: {
    results: AnalysisResult[];
    comparable: { r: AnalysisResult; rank: number }[];
}) {
    const maxScore = Math.max(...comparable.map(({ r }) => (typeof r.score === 'number' ? r.score : 0)), 1);

    return (
        <section
            className="overflow-hidden rounded-3xl border border-teal-200/80 bg-gradient-to-b from-teal-50/40 to-white shadow-md ring-1 ring-teal-100/60"
            aria-labelledby="compare-heading"
        >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-100/80 bg-white/60 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-teal-700" aria-hidden />
                    <h2 id="compare-heading" className="font-display text-base font-semibold text-stone-900">
                        Compare at a glance
                    </h2>
                </div>
                <p className="text-xs text-stone-500">Higher score ranks first · Same row = same metric</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-stone-200 bg-stone-50/90">
                            <th className="sticky left-0 z-10 bg-stone-50/95 px-3 py-3 pl-4 font-semibold text-stone-700 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.06)]">
                                Rank
                            </th>
                            <th className="px-3 py-3 font-semibold text-stone-700">Candidate</th>
                            <th className="px-3 py-3 font-semibold text-stone-700">Score</th>
                            <th className="px-3 py-3 font-semibold text-stone-700">Call</th>
                            {DIM_KEYS.map((k) => (
                                <th key={k} className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
                                    {DIM_LABELS[k] ?? k}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {comparable.map(({ r, rank }) => {
                            const label = displayNameForResult(r, rank);
                            const decision = r.recommendation?.decision ?? '—';
                            const ds = r.detailed_scores || {};
                            const isTop = rank === 1;
                            return (
                                <tr
                                    key={rank + label}
                                    className={`border-b border-stone-100 last:border-0 ${isTop ? 'bg-teal-50/50' : 'bg-white'}`}
                                >
                                    <td className="sticky left-0 z-10 whitespace-nowrap bg-inherit px-3 py-3 pl-4 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.04)]">
                                        <span
                                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold tabular-nums ${
                                                rank === 1
                                                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300/80'
                                                    : rank === 2
                                                      ? 'bg-stone-200 text-stone-800'
                                                      : 'bg-stone-100 text-stone-600'
                                            }`}
                                        >
                                            {rank}
                                        </span>
                                    </td>
                                    <td className="max-w-[180px] px-3 py-3">
                                        <span className="font-semibold text-stone-900">{label}</span>
                                        {r.experience?.seniority_level && (
                                            <span className="mt-0.5 block text-xs text-stone-500">{r.experience.seniority_level}</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-display text-xl font-bold tabular-nums text-teal-800">{r.score ?? '—'}</span>
                                            <div className="h-2 w-16 overflow-hidden rounded-full bg-stone-200">
                                                <div
                                                    className="h-full rounded-full bg-teal-600"
                                                    style={{
                                                        width: `${Math.min(100, ((r.score as number) / maxScore) * 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <DecisionPill decision={decision} />
                                    </td>
                                    {DIM_KEYS.map((k) => {
                                        const v = typeof ds[k] === 'number' ? ds[k] : null;
                                        return (
                                            <td key={k} className="px-2 py-2 align-middle">
                                                {v != null ? (
                                                    <div className="mx-auto max-w-[72px]">
                                                        <div className="text-center text-xs font-semibold tabular-nums text-stone-800">
                                                            {v}%
                                                        </div>
                                                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                                                            <div
                                                                className="h-full rounded-full bg-teal-500"
                                                                style={{ width: `${Math.min(100, v)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-center text-stone-400">—</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {results.some((r) => r.error) && (
                <p className="border-t border-amber-200/80 bg-amber-50/80 px-4 py-2 text-xs text-amber-900">
                    Some rows failed analysis — see error cards below.
                </p>
            )}
        </section>
    );
}

function DecisionPill({ decision }: { decision: string }) {
    const d = decision?.toLowerCase() || '';
    const cls =
        d === 'hire'
            ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200'
            : d === 'reject'
              ? 'bg-red-100 text-red-900 ring-1 ring-red-200'
              : 'bg-amber-100 text-amber-950 ring-1 ring-amber-200';
    return (
        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{decision}</span>
    );
}

function SavedCandidatesPanel({
    runs,
    loading,
    error,
    dbConfigured,
}: {
    runs: SavedAnalysisRun[];
    loading: boolean;
    error: string;
    dbConfigured: boolean | null;
}) {
    if (dbConfigured === false) {
        return (
            <div className="rounded-3xl border border-amber-200/80 bg-amber-50/90 px-6 py-10 text-center shadow-sm ring-1 ring-amber-100/80">
                <p className="font-display text-lg font-semibold text-amber-950">Database not connected</p>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-amber-900/90">
                    Add your Neon connection string as{' '}
                    <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-amber-950">DATABASE_URL</code> in{' '}
                    <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">server/.env</code>, run{' '}
                    <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs">npm run db:push</code> in the server folder, then restart the API.
                    Saved analyses will show here automatically.
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white py-24">
                <Loader2 className="h-10 w-10 animate-spin text-teal-700" aria-hidden />
                <p className="mt-4 text-sm font-medium text-stone-600">Loading saved candidates…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900" role="alert">
                {error}
            </div>
        );
    }

    if (runs.length === 0) {
        return (
            <div className="rounded-3xl border-2 border-dashed border-stone-200/90 bg-white/80 py-16 text-center md:py-20">
                <LayoutList className="mx-auto h-10 w-10 text-stone-300" strokeWidth={1.25} aria-hidden />
                <p className="mt-6 font-display text-lg font-semibold text-stone-800">No saved candidates yet</p>
                <p className="mt-2 text-sm text-stone-500">
                    Run an analysis on the &quot;Current analysis&quot; tab — each completed run is stored when Neon is configured.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-md shadow-stone-900/[0.04] ring-1 ring-stone-200/60">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/95">
                        <th className="px-4 py-3.5 font-semibold text-stone-800">Candidate</th>
                        <th className="px-4 py-3.5 font-semibold text-stone-800">Score</th>
                        <th className="px-4 py-3.5 font-semibold text-stone-800">Call</th>
                        <th className="whitespace-nowrap px-4 py-3.5 font-semibold text-stone-800">Saved</th>
                        <th className="min-w-[240px] px-4 py-3.5 font-semibold text-stone-800">Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {runs.map((run) => {
                        const name = displayNameForSavedRun(run);
                        const res = run.result;
                        const score = res && typeof res.score === 'number' ? res.score : null;
                        const decision = run.error ? 'Error' : (res?.recommendation?.decision ?? '—');
                        const summary =
                            run.error ||
                            (typeof res?.executive_summary === 'string' ? res.executive_summary : null) ||
                            '—';
                        return (
                            <tr key={run.id} className="border-b border-stone-100 align-top last:border-0">
                                <td className="px-4 py-3.5">
                                    <span className="font-semibold text-stone-900">{name}</span>
                                    {run.file_name && (
                                        <span className="mt-0.5 block truncate text-xs text-stone-500" title={run.file_name}>
                                            {run.file_name}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3.5 font-display text-lg font-bold tabular-nums text-teal-800">
                                    {score ?? '—'}
                                </td>
                                <td className="px-4 py-3.5">
                                    <DecisionPill decision={decision} />
                                </td>
                                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-stone-500">
                                    {new Date(run.created_at).toLocaleString()}
                                </td>
                                <td className="max-w-md px-4 py-3.5 text-xs leading-relaxed text-stone-600">
                                    {summary.length > 220 ? `${summary.slice(0, 220)}…` : summary}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const ResultCard = ({
    result,
    rank,
    compactHeader,
}: {
    result: AnalysisResult;
    rank: number;
    compactHeader?: boolean;
}) => {
    const [expanded, setExpanded] = useState(true);

    if (result.error) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50/90 px-6 py-5 text-sm text-red-900 shadow-sm ring-1 ring-red-100">
                <span className="font-semibold">{displayNameForResult(result, rank)}</span>
                <span className="text-red-800"> — {result.error}</span>
            </div>
        );
    }

    const { recommendation, detailed_scores, experience, skills } = result;
    const topRank = rank === 1;
    const topStrength = result.strengths?.[0];
    const topGap = result.weaknesses?.[0];
    const summary = result.executive_summary;

    return (
        <article
            id={`candidate-${rank}`}
            className={`overflow-hidden rounded-3xl border bg-white shadow-lg shadow-stone-900/[0.04] ring-1 ${
                topRank ? 'border-teal-200/90 ring-teal-100/80' : 'border-stone-200/90 ring-stone-200/50'
            }`}
        >
            <div
                className={`flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between ${
                    topRank ? 'border-teal-100 bg-gradient-to-r from-teal-50/60 to-white' : 'border-stone-100 bg-stone-50/40'
                }`}
            >
                <div className="flex min-w-0 flex-1 gap-3">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                            topRank ? 'bg-teal-700 text-white' : 'bg-stone-200 text-stone-700'
                        }`}
                    >
                        {topRank ? <Trophy className="h-6 w-6" strokeWidth={1.5} /> : <User className="h-6 w-6" strokeWidth={1.5} />}
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display truncate text-lg font-semibold text-stone-900 sm:text-xl">
                                {displayNameForResult(result, rank)}
                            </h3>
                            <span
                                className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                    topRank ? 'bg-teal-700 text-white' : 'bg-stone-700 text-white'
                                }`}
                            >
                                Rank {rank}
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <DecisionPill decision={recommendation?.decision ?? '—'} />
                            {experience?.seniority_level && (
                                <span className="rounded-lg bg-white px-2.5 py-0.5 text-xs font-medium text-stone-700 ring-1 ring-stone-200">
                                    {experience.seniority_level}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex shrink-0 items-start gap-4 sm:text-right">
                    <div>
                        <div className="font-display text-4xl font-bold tabular-nums leading-none text-teal-800">
                            {result.score ?? '—'}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">Overall</div>
                    </div>
                    {compactHeader && (
                        <button
                            type="button"
                            onClick={() => setExpanded((e) => !e)}
                            className="rounded-lg p-1.5 text-stone-500 hover:bg-white hover:text-stone-800"
                            aria-expanded={expanded}
                            aria-label={expanded ? 'Collapse details' : 'Expand details'}
                        >
                            <ChevronDown className={`h-5 w-5 transition ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            {/* Key points — always visible */}
            <div className="space-y-3 border-b border-stone-100 bg-white px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800">Main points</p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {summary && (
                        <div className="rounded-2xl border border-stone-100 bg-stone-50/80 p-3 sm:col-span-2">
                            <div className="flex items-start gap-2">
                                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
                                <p className="text-sm leading-relaxed text-stone-700">
                                    <span className="font-semibold text-stone-900">Summary · </span>
                                    {summary}
                                </p>
                            </div>
                        </div>
                    )}
                    {topStrength && (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
                                <TrendingUp className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
                                Top strength
                            </div>
                            <p className="mt-1.5 text-sm font-medium leading-snug text-emerald-950">{topStrength}</p>
                        </div>
                    )}
                    {topGap && (
                        <div className="rounded-2xl border border-red-100 bg-red-50/40 p-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-red-800">
                                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                                Main gap / risk
                            </div>
                            <p className="mt-1.5 text-sm font-medium leading-snug text-red-950">{topGap}</p>
                        </div>
                    )}
                </div>
            </div>

            {expanded && (
                <>
                    <div className="grid gap-6 p-5 md:grid-cols-2 md:gap-8 md:p-6">
                        <div className="space-y-5">
                            <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">Score breakdown</h4>
                                <div className="mt-3 space-y-2.5">
                                    {detailed_scores &&
                                        Object.entries(detailed_scores).map(([key, value]) => (
                                            <div key={key}>
                                                <div className="mb-1 flex justify-between text-xs font-medium text-stone-600">
                                                    <span className="capitalize">{String(key).replace(/_/g, ' ')}</span>
                                                    <span className="tabular-nums text-stone-900">{value as number}%</span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-500"
                                                        style={{ width: `${value}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {recommendation?.justification && (
                                <blockquote className="rounded-2xl border border-stone-100 bg-stone-50/90 p-4 text-sm leading-relaxed text-stone-700">
                                    <span className="font-semibold text-stone-800">Why this call · </span>
                                    {recommendation.justification}
                                </blockquote>
                            )}
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <SkillList title="Technical" items={skills?.technical ?? []} highlight />
                                <SkillList title="Soft skills" items={skills?.soft ?? []} />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <BulletList title="All strengths" items={result.strengths ?? []} tone="positive" />
                                <BulletList title="All gaps / risks" items={result.weaknesses ?? []} tone="negative" />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </article>
    );
};

const SkillList = ({ title, items, highlight }: { title: string; items?: string[]; highlight?: boolean }) => (
    <div>
        <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">{title}</h4>
        <div className="mt-2 flex flex-wrap gap-1.5">
            {items?.slice(0, 10).map((item, idx) => (
                <span
                    key={idx}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-medium ${
                        highlight && idx < 3
                            ? 'border-teal-200 bg-teal-50 text-teal-900'
                            : 'border-stone-200 bg-white text-stone-800'
                    }`}
                >
                    {item}
                </span>
            ))}
        </div>
    </div>
);

const BulletList = ({
    title,
    items,
    tone,
}: {
    title: string;
    items?: string[];
    tone: 'positive' | 'negative';
}) => (
    <div>
        <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">{title}</h4>
        <ul className="mt-2 space-y-1.5">
            {items?.map((item, idx) => (
                <li key={idx} className="flex gap-2 text-sm leading-snug text-stone-700">
                    <span
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                            tone === 'positive' ? 'bg-emerald-500' : 'bg-red-400'
                        }`}
                        aria-hidden
                    />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default ResumeAnalysis;
