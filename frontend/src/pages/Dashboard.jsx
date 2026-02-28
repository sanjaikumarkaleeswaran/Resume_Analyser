import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import ResumeForm from '../components/ResumeForm';
import ResultsPanel from '../components/ResultsPanel';
import HistoryList from '../components/HistoryList';
import { fetchHistory } from '../services/api';

export default function Dashboard() {
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState('');

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError('');
        try {
            const data = await fetchHistory();
            setHistory(data);
        } catch {
            setHistoryError('Could not load history.');
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleResult = (data) => {
        setResult(data);
        // Refresh history after new optimization
        loadHistory();
        // Scroll to results on mobile
        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleHistorySelect = (item) => {
        setResult({
            professional_summary: item.professional_summary,
            optimized_experience: item.optimized_experience,
            skills_section: item.skills_section,
            keyword_match_score: item.keyword_match_score,
            missing_keywords: item.missing_keywords,
            suggestions: item.suggestions,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-dark-950">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Banner */}
                <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-primary-900/60 via-dark-900/80 to-dark-950 border border-primary-800/30 p-6 lg:p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                        AI Resume Optimizer
                    </h1>
                    <p className="text-slate-400 text-sm lg:text-base max-w-xl">
                        Beat Applicant Tracking Systems. Paste your resume and job description — our AI rewrites it for maximum ATS compatibility.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                        {['ATS Optimized', 'Keyword Matching', 'Free Forever'].map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-900/50 border border-primary-700/40 text-primary-300 text-xs rounded-full">
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Form */}
                    <div>
                        <ResumeForm
                            onResult={handleResult}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    </div>

                    {/* Right: Results */}
                    <div id="results-section">
                        {isLoading ? (
                            <div className="card p-12 flex flex-col items-center justify-center gap-4 text-center">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">AI is analyzing your resume...</p>
                                    <p className="text-slate-500 text-sm mt-1">This can take 15–30 seconds</p>
                                </div>
                            </div>
                        ) : result ? (
                            <ResultsPanel result={result} />
                        ) : (
                            <div className="card p-12 flex flex-col items-center justify-center gap-4 text-center border-dashed">
                                <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-medium">Results will appear here</p>
                                    <p className="text-slate-600 text-sm mt-1">Submit your resume to get started</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Section */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-slate-300">Previous Optimizations</h2>
                        <button
                            id="refresh-history-btn"
                            onClick={loadHistory}
                            disabled={historyLoading}
                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                        >
                            <svg className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {historyLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                    {historyError ? (
                        <div className="bg-red-950/30 border border-red-700/30 rounded-lg px-4 py-3 text-red-300 text-sm">
                            {historyError}
                        </div>
                    ) : (
                        <HistoryList history={history} onSelect={handleHistorySelect} />
                    )}
                </div>
            </main>
        </div>
    );
}
