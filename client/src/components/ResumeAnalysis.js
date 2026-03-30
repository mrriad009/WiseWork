import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Upload, Loader2, ArrowLeft, Plus, Trash2, User, Search, Zap, Scale, Trophy, AlertTriangle, Sparkles, ChevronDown, TrendingUp } from 'lucide-react';
import { BrandMark, BrandWordmark, PageBackground } from './PageChrome';
const DIM_KEYS = ['technical_depth', 'leadership', 'domain_expertise', 'communication'];
const DIM_LABELS = {
    technical_depth: 'Technical',
    leadership: 'Leadership',
    domain_expertise: 'Domain',
    communication: 'Communication',
};
function labelForResult(r, rank) {
    return (r.candidateName || r.fileName || `Candidate ${rank}`);
}
function okResults(results) {
    return results
        .map((r, i) => ({ r, rank: i + 1 }))
        .filter(({ r }) => !r.error && typeof r.score === 'number');
}
const ResumeAnalysis = ({ onBack }) => {
    const [entries, setEntries] = useState([
        { id: Math.random().toString(36).substr(2, 9), file: null, linkedinUrl: '', name: 'Candidate 1' }
    ]);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const addEntry = () => {
        setEntries([...entries, {
                id: Math.random().toString(36).substr(2, 9),
                file: null,
                linkedinUrl: '',
                name: `Candidate ${entries.length + 1}`
            }]);
    };
    const removeEntry = (id) => {
        if (entries.length > 1) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };
    const updateEntry = (id, updates) => {
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
                if (entry.file)
                    formData.append('resumes', entry.file);
                formData.append('linkedinUrl', entry.linkedinUrl);
                formData.append('candidateName', entry.name);
                const response = await fetch('/api/resume', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                if (response.ok) {
                    return data.results[0];
                }
                else {
                    return { fileName: entry.file?.name || entry.name, error: data.error || 'Failed' };
                }
            }));
            const sortedResults = allResults.sort((a, b) => {
                const scoreA = typeof a.score === 'number' ? a.score : 0;
                const scoreB = typeof b.score === 'number' ? b.score : 0;
                return scoreB - scoreA;
            });
            setResults(sortedResults);
        }
        catch {
            setError('Could not reach the server. Try again.');
        }
        finally {
            setAnalyzing(false);
        }
    };
    const comparable = okResults(results);
    const multiCompare = comparable.length >= 2;
    return (_jsxs("div", { className: "relative min-h-screen text-stone-900", children: [_jsx(PageBackground, {}), _jsx("header", { className: "sticky top-0 z-50 border-b border-stone-200/90 bg-[#f6f5f1]/85 backdrop-blur-xl", children: _jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8", children: [_jsxs("button", { type: "button", onClick: onBack, className: "inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/90 px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm ring-1 ring-stone-200/50 transition hover:border-stone-300 hover:bg-white", children: [_jsx(ArrowLeft, { className: "h-4 w-4", "aria-hidden": true }), _jsx("span", { className: "hidden sm:inline", children: "Back to site" }), _jsx("span", { className: "sm:hidden", children: "Back" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(BrandMark, { size: "sm" }), _jsx(BrandWordmark, {})] }), _jsx("span", { className: "w-[4.5rem] sm:w-28", "aria-hidden": true })] }) }), _jsxs("main", { className: "mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14", children: [_jsxs("header", { className: "mb-10 border-b border-stone-200/80 pb-8", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-teal-700", children: "Analyzer" }), _jsx("h1", { className: "font-display mt-2 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl", children: "Candidate review" }), _jsx("p", { className: "mt-3 max-w-2xl text-[15px] leading-relaxed text-stone-600", children: "Results are sorted by overall score. With multiple candidates, use the comparison table to scan differences, then open each card for full detail." })] }), error && (_jsx("div", { className: "mb-8 rounded-2xl border border-red-200/90 bg-red-50 px-5 py-4 text-sm text-red-900 shadow-sm ring-1 ring-red-100", role: "alert", children: error })), _jsxs("div", { className: "grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12", children: [_jsx("aside", { children: _jsxs("div", { className: "rounded-3xl border border-stone-200 bg-white p-6 shadow-lg shadow-stone-900/[0.04] ring-1 ring-stone-200/60 lg:sticky lg:top-24", children: [_jsx("h2", { className: "font-semibold text-stone-900", children: "Candidates" }), _jsx("p", { className: "mt-1 text-xs leading-relaxed text-stone-500", children: "Each block is one applicant. At least one of CV file or LinkedIn URL is required." }), _jsx("div", { className: "mt-6 space-y-4", children: entries.map((entry) => (_jsxs("div", { className: "rounded-2xl border border-stone-100 bg-stone-50/90 p-4 ring-1 ring-stone-200/50", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("input", { className: "min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400", value: entry.name, onChange: (e) => updateEntry(entry.id, { name: e.target.value }), placeholder: "Display name" }), entries.length > 1 && (_jsx("button", { type: "button", onClick: () => removeEntry(entry.id), className: "shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-white hover:text-red-600", "aria-label": "Remove candidate", children: _jsx(Trash2, { className: "h-4 w-4" }) }))] }), _jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("label", { className: "relative flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white px-3 py-2.5 text-center text-xs font-medium text-stone-600 transition hover:border-teal-400/50", children: [_jsx("input", { type: "file", className: "absolute inset-0 cursor-pointer opacity-0", onChange: (e) => updateEntry(entry.id, { file: e.target.files?.[0] || null }) }), _jsx(Upload, { className: "mr-2 h-4 w-4 shrink-0 opacity-50", "aria-hidden": true }), _jsx("span", { className: "truncate", children: entry.file ? entry.file.name : 'Upload CV' })] }), _jsx("input", { type: "url", placeholder: "LinkedIn URL (optional)", value: entry.linkedinUrl, onChange: (e) => updateEntry(entry.id, { linkedinUrl: e.target.value }), className: "w-full min-h-[44px] rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-900 outline-none placeholder:text-stone-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20" })] })] }, entry.id))) }), _jsxs("div", { className: "mt-6 space-y-2", children: [_jsxs("button", { type: "button", onClick: addEntry, className: "flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white py-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-50", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add candidate"] }), _jsx("button", { type: "button", onClick: handleUpload, disabled: analyzing, className: "flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800 disabled:opacity-50", children: analyzing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Analyzing\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(Zap, { className: "h-4 w-4" }), "Run analysis"] })) })] })] }) }), _jsxs("div", { className: "min-h-[320px] custom-scrollbar lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-1", children: [analyzing && (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white py-24 shadow-sm", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 animate-ping rounded-full bg-teal-400/20" }), _jsx(Loader2, { className: "relative h-10 w-10 animate-spin text-teal-700", "aria-hidden": true })] }), _jsx("p", { className: "mt-6 text-sm font-semibold text-stone-700", children: "Processing candidates\u2026" }), _jsx("p", { className: "mt-1 text-xs text-stone-500", children: "This may take a moment per resume." })] })), !analyzing && results.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200/90 bg-white/70 py-20 text-center md:py-28", children: [_jsx("div", { className: "rounded-2xl bg-stone-100 p-4 text-stone-400", children: _jsx(Search, { className: "h-10 w-10", strokeWidth: 1.25, "aria-hidden": true }) }), _jsx("p", { className: "mt-6 font-display text-lg font-semibold text-stone-800", children: "No results yet" }), _jsx("p", { className: "mt-2 max-w-sm text-sm leading-relaxed text-stone-500", children: "Add candidates on the left and run analysis. Ranked cards with scores will appear here." })] })), !analyzing && results.length > 0 && (_jsxs("div", { className: "space-y-10", children: [multiCompare && (_jsx(ComparisonSection, { results: results, comparable: comparable })), _jsx("div", { className: multiCompare
                                                    ? 'grid gap-8 sm:grid-cols-1 lg:grid-cols-2 lg:items-start'
                                                    : 'space-y-8', children: results.map((res, i) => (_jsx(ResultCard, { result: res, rank: i + 1, compactHeader: multiCompare }, i))) })] }))] })] })] })] }));
};
/** Side-by-side leaderboard + dimension matrix for quick scanning */
function ComparisonSection({ results, comparable, }) {
    const maxScore = Math.max(...comparable.map(({ r }) => (typeof r.score === 'number' ? r.score : 0)), 1);
    return (_jsxs("section", { className: "overflow-hidden rounded-3xl border border-teal-200/80 bg-gradient-to-b from-teal-50/40 to-white shadow-md ring-1 ring-teal-100/60", "aria-labelledby": "compare-heading", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-teal-100/80 bg-white/60 px-4 py-3 sm:px-5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Scale, { className: "h-4 w-4 text-teal-700", "aria-hidden": true }), _jsx("h2", { id: "compare-heading", className: "font-display text-base font-semibold text-stone-900", children: "Compare at a glance" })] }), _jsx("p", { className: "text-xs text-stone-500", children: "Higher score ranks first \u00B7 Same row = same metric" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[640px] border-collapse text-left text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-stone-200 bg-stone-50/90", children: [_jsx("th", { className: "sticky left-0 z-10 bg-stone-50/95 px-3 py-3 pl-4 font-semibold text-stone-700 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.06)]", children: "Rank" }), _jsx("th", { className: "px-3 py-3 font-semibold text-stone-700", children: "Candidate" }), _jsx("th", { className: "px-3 py-3 font-semibold text-stone-700", children: "Score" }), _jsx("th", { className: "px-3 py-3 font-semibold text-stone-700", children: "Call" }), DIM_KEYS.map((k) => (_jsx("th", { className: "px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-500", children: DIM_LABELS[k] ?? k }, k)))] }) }), _jsx("tbody", { children: comparable.map(({ r, rank }) => {
                                const label = labelForResult(r, rank);
                                const decision = r.recommendation?.decision ?? '—';
                                const ds = r.detailed_scores || {};
                                const isTop = rank === 1;
                                return (_jsxs("tr", { className: `border-b border-stone-100 last:border-0 ${isTop ? 'bg-teal-50/50' : 'bg-white'}`, children: [_jsx("td", { className: "sticky left-0 z-10 whitespace-nowrap bg-inherit px-3 py-3 pl-4 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.04)]", children: _jsx("span", { className: `inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold tabular-nums ${rank === 1
                                                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300/80'
                                                    : rank === 2
                                                        ? 'bg-stone-200 text-stone-800'
                                                        : 'bg-stone-100 text-stone-600'}`, children: rank }) }), _jsxs("td", { className: "max-w-[180px] px-3 py-3", children: [_jsx("span", { className: "font-semibold text-stone-900", children: label }), r.experience?.seniority_level && (_jsx("span", { className: "mt-0.5 block text-xs text-stone-500", children: r.experience.seniority_level }))] }), _jsx("td", { className: "px-3 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-display text-xl font-bold tabular-nums text-teal-800", children: r.score ?? '—' }), _jsx("div", { className: "h-2 w-16 overflow-hidden rounded-full bg-stone-200", children: _jsx("div", { className: "h-full rounded-full bg-teal-600", style: {
                                                                width: `${Math.min(100, (r.score / maxScore) * 100)}%`,
                                                            } }) })] }) }), _jsx("td", { className: "px-3 py-3", children: _jsx(DecisionPill, { decision: decision }) }), DIM_KEYS.map((k) => {
                                            const v = typeof ds[k] === 'number' ? ds[k] : null;
                                            return (_jsx("td", { className: "px-2 py-2 align-middle", children: v != null ? (_jsxs("div", { className: "mx-auto max-w-[72px]", children: [_jsxs("div", { className: "text-center text-xs font-semibold tabular-nums text-stone-800", children: [v, "%"] }), _jsx("div", { className: "mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-200", children: _jsx("div", { className: "h-full rounded-full bg-teal-500", style: { width: `${Math.min(100, v)}%` } }) })] })) : (_jsx("span", { className: "text-center text-stone-400", children: "\u2014" })) }, k));
                                        })] }, rank + label));
                            }) })] }) }), results.some((r) => r.error) && (_jsx("p", { className: "border-t border-amber-200/80 bg-amber-50/80 px-4 py-2 text-xs text-amber-900", children: "Some rows failed analysis \u2014 see error cards below." }))] }));
}
function DecisionPill({ decision }) {
    const d = decision?.toLowerCase() || '';
    const cls = d === 'hire'
        ? 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200'
        : d === 'reject'
            ? 'bg-red-100 text-red-900 ring-1 ring-red-200'
            : 'bg-amber-100 text-amber-950 ring-1 ring-amber-200';
    return (_jsx("span", { className: `inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`, children: decision }));
}
const ResultCard = ({ result, rank, compactHeader, }) => {
    const [expanded, setExpanded] = useState(true);
    if (result.error) {
        return (_jsxs("div", { className: "rounded-3xl border border-red-200 bg-red-50/90 px-6 py-5 text-sm text-red-900 shadow-sm ring-1 ring-red-100", children: [_jsx("span", { className: "font-semibold", children: result.candidateName || result.fileName }), _jsxs("span", { className: "text-red-800", children: [" \u2014 ", result.error] })] }));
    }
    const { recommendation, detailed_scores, experience, skills } = result;
    const topRank = rank === 1;
    const topStrength = result.strengths?.[0];
    const topGap = result.weaknesses?.[0];
    const summary = result.executive_summary;
    return (_jsxs("article", { id: `candidate-${rank}`, className: `overflow-hidden rounded-3xl border bg-white shadow-lg shadow-stone-900/[0.04] ring-1 ${topRank ? 'border-teal-200/90 ring-teal-100/80' : 'border-stone-200/90 ring-stone-200/50'}`, children: [_jsxs("div", { className: `flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between ${topRank ? 'border-teal-100 bg-gradient-to-r from-teal-50/60 to-white' : 'border-stone-100 bg-stone-50/40'}`, children: [_jsxs("div", { className: "flex min-w-0 flex-1 gap-3", children: [_jsx("div", { className: `flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${topRank ? 'bg-teal-700 text-white' : 'bg-stone-200 text-stone-700'}`, children: topRank ? _jsx(Trophy, { className: "h-6 w-6", strokeWidth: 1.5 }) : _jsx(User, { className: "h-6 w-6", strokeWidth: 1.5 }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("h3", { className: "font-display truncate text-lg font-semibold text-stone-900 sm:text-xl", children: result.candidateName || result.fileName }), _jsxs("span", { className: `shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${topRank ? 'bg-teal-700 text-white' : 'bg-stone-700 text-white'}`, children: ["Rank ", rank] })] }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [_jsx(DecisionPill, { decision: recommendation?.decision ?? '—' }), experience?.seniority_level && (_jsx("span", { className: "rounded-lg bg-white px-2.5 py-0.5 text-xs font-medium text-stone-700 ring-1 ring-stone-200", children: experience.seniority_level }))] })] })] }), _jsxs("div", { className: "flex shrink-0 items-start gap-4 sm:text-right", children: [_jsxs("div", { children: [_jsx("div", { className: "font-display text-4xl font-bold tabular-nums leading-none text-teal-800", children: result.score ?? '—' }), _jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500", children: "Overall" })] }), compactHeader && (_jsx("button", { type: "button", onClick: () => setExpanded((e) => !e), className: "rounded-lg p-1.5 text-stone-500 hover:bg-white hover:text-stone-800", "aria-expanded": expanded, "aria-label": expanded ? 'Collapse details' : 'Expand details', children: _jsx(ChevronDown, { className: `h-5 w-5 transition ${expanded ? 'rotate-180' : ''}` }) }))] })] }), _jsxs("div", { className: "space-y-3 border-b border-stone-100 bg-white px-5 py-4", children: [_jsx("p", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-teal-800", children: "Main points" }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [summary && (_jsx("div", { className: "rounded-2xl border border-stone-100 bg-stone-50/80 p-3 sm:col-span-2", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Sparkles, { className: "mt-0.5 h-4 w-4 shrink-0 text-teal-600", "aria-hidden": true }), _jsxs("p", { className: "text-sm leading-relaxed text-stone-700", children: [_jsx("span", { className: "font-semibold text-stone-900", children: "Summary \u00B7 " }), summary] })] }) })), topStrength && (_jsxs("div", { className: "rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800", children: [_jsx(TrendingUp, { className: "h-3.5 w-3.5 text-emerald-700", "aria-hidden": true }), "Top strength"] }), _jsx("p", { className: "mt-1.5 text-sm font-medium leading-snug text-emerald-950", children: topStrength })] })), topGap && (_jsxs("div", { className: "rounded-2xl border border-red-100 bg-red-50/40 p-3", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-red-800", children: [_jsx(AlertTriangle, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Main gap / risk"] }), _jsx("p", { className: "mt-1.5 text-sm font-medium leading-snug text-red-950", children: topGap })] }))] })] }), expanded && (_jsx(_Fragment, { children: _jsxs("div", { className: "grid gap-6 p-5 md:grid-cols-2 md:gap-8 md:p-6", children: [_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500", children: "Score breakdown" }), _jsx("div", { className: "mt-3 space-y-2.5", children: detailed_scores &&
                                                Object.entries(detailed_scores).map(([key, value]) => (_jsxs("div", { children: [_jsxs("div", { className: "mb-1 flex justify-between text-xs font-medium text-stone-600", children: [_jsx("span", { className: "capitalize", children: String(key).replace(/_/g, ' ') }), _jsxs("span", { className: "tabular-nums text-stone-900", children: [value, "%"] })] }), _jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-stone-100", children: _jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-500", style: { width: `${value}%` } }) })] }, key))) })] }), recommendation?.justification && (_jsxs("blockquote", { className: "rounded-2xl border border-stone-100 bg-stone-50/90 p-4 text-sm leading-relaxed text-stone-700", children: [_jsx("span", { className: "font-semibold text-stone-800", children: "Why this call \u00B7 " }), recommendation.justification] }))] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [_jsx(SkillList, { title: "Technical", items: skills?.technical ?? [], highlight: true }), _jsx(SkillList, { title: "Soft skills", items: skills?.soft ?? [] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [_jsx(BulletList, { title: "All strengths", items: result.strengths ?? [], tone: "positive" }), _jsx(BulletList, { title: "All gaps / risks", items: result.weaknesses ?? [], tone: "negative" })] })] })] }) }))] }));
};
const SkillList = ({ title, items, highlight }) => (_jsxs("div", { children: [_jsx("h4", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500", children: title }), _jsx("div", { className: "mt-2 flex flex-wrap gap-1.5", children: items?.slice(0, 10).map((item, idx) => (_jsx("span", { className: `rounded-lg border px-2 py-1 text-[11px] font-medium ${highlight && idx < 3
                    ? 'border-teal-200 bg-teal-50 text-teal-900'
                    : 'border-stone-200 bg-white text-stone-800'}`, children: item }, idx))) })] }));
const BulletList = ({ title, items, tone, }) => (_jsxs("div", { children: [_jsx("h4", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500", children: title }), _jsx("ul", { className: "mt-2 space-y-1.5", children: items?.map((item, idx) => (_jsxs("li", { className: "flex gap-2 text-sm leading-snug text-stone-700", children: [_jsx("span", { className: `mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'positive' ? 'bg-emerald-500' : 'bg-red-400'}`, "aria-hidden": true }), _jsx("span", { children: item })] }, idx))) })] }));
export default ResumeAnalysis;
//# sourceMappingURL=ResumeAnalysis.js.map