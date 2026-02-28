import { useState } from 'react';

const TABS = [
    { id: 'summary', label: '📝 Summary' },
    { id: 'experience', label: '💼 Experience' },
    { id: 'skills', label: '🛠 Skills' },
    { id: 'keywords', label: '🔍 Missing Keywords' },
    { id: 'suggestions', label: '💡 Suggestions' },
];

export default function ResultsPanel({ result }) {
    const [activeTab, setActiveTab] = useState('summary');
    const [copied, setCopied] = useState(false);

    const score = result?.keyword_match_score || 0;
    const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
    const scoreBarColor = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';

    const tabContent = {
        summary: result?.professional_summary,
        experience: result?.optimized_experience,
        skills: result?.skills_section,
        keywords: null,
        suggestions: result?.suggestions,
    };

    const handleCopy = async () => {
        const content = activeTab === 'keywords'
            ? (result?.missing_keywords || []).join(', ')
            : tabContent[activeTab] || '';
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadPDF = async () => {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById('pdf-content');
        html2pdf()
            .set({
                margin: 10,
                filename: 'optimized-resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            })
            .from(element)
            .save();
    };

    return (
        <div className="card animate-slide-up">
            {/* Score Header */}
            <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white">ATS Analysis Complete</h3>
                        <p className="text-slate-400 text-sm mt-0.5">Your resume has been optimized</p>
                    </div>
                    <div className="text-right">
                        <div className={`text-4xl font-black ${scoreColor}`}>{score}</div>
                        <div className="text-slate-500 text-xs">/ 100 ATS Score</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${scoreBarColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0 — Low</span>
                    <span>50 — Medium</span>
                    <span>100 — Excellent</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4 flex gap-1.5 flex-wrap">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        id={`tab-${tab.id}`}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6" id="pdf-content">
                {activeTab === 'keywords' ? (
                    <div className="space-y-3">
                        <p className="text-slate-400 text-sm mb-3">
                            These keywords from the job description are missing from your resume:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {(result?.missing_keywords || []).length === 0 ? (
                                <p className="text-green-400 text-sm">🎉 No missing keywords! Great job.</p>
                            ) : (
                                (result?.missing_keywords || []).map((kw, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-primary-900/40 border border-primary-700/40 text-primary-300 text-sm rounded-full"
                                    >
                                        {kw}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                        {tabContent[activeTab] || <span className="text-slate-600">No content available.</span>}
                    </pre>
                )}
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 flex gap-3 flex-wrap">
                <button
                    id="copy-btn"
                    onClick={handleCopy}
                    className="btn-secondary text-sm flex items-center gap-2"
                >
                    {copied ? (
                        <>
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Tab
                        </>
                    )}
                </button>

                <button
                    id="download-pdf-btn"
                    onClick={handleDownloadPDF}
                    className="btn-secondary text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                </button>
            </div>
        </div>
    );
}
