import { useState } from 'react';

function formatDate(isoStr) {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function ScoreBadge({ score }) {
    const color = score >= 80 ? 'text-green-400 bg-green-900/30 border-green-700/40'
        : score >= 60 ? 'text-yellow-400 bg-yellow-900/30 border-yellow-700/40'
            : 'text-red-400 bg-red-900/30 border-red-700/40';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
            {score}/100
        </span>
    );
}

export default function HistoryList({ history, onSelect }) {
    const [expanded, setExpanded] = useState(null);

    if (!history || history.length === 0) {
        return (
            <div className="card p-8 text-center">
                <div className="w-12 h-12 bg-dark-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-slate-500 text-sm">No optimizations yet. Submit your first resume above!</p>
            </div>
        );
    }

    return (
        <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-300">Optimization History</h3>
                <span className="ml-auto text-xs text-slate-500">{history.length} entries</span>
            </div>

            <div className="divide-y divide-slate-700/30 max-h-80 overflow-y-auto">
                {history.map((item, i) => (
                    <div key={item.id || i} className="hover:bg-dark-800/50 transition-colors">
                        <button
                            id={`history-item-${i}`}
                            className="w-full px-6 py-4 text-left flex items-center gap-3"
                            onClick={() => {
                                setExpanded(expanded === i ? null : i);
                                if (onSelect) onSelect(item);
                            }}
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200 truncate">
                                    {item.job_description?.slice(0, 60)}...
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-500">{formatDate(item.created_at)}</span>
                                    <span className="text-slate-700">·</span>
                                    <span className="text-xs text-slate-500">{item.experience_level}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <ScoreBadge score={item.keyword_match_score || 0} />
                                <svg
                                    className={`w-4 h-4 text-slate-500 transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {expanded === i && (
                            <div className="px-6 pb-4 animate-fade-in">
                                <div className="bg-dark-900 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-700/30">
                                    {item.professional_summary || 'No summary available.'}
                                </div>
                                <button
                                    className="btn-primary text-xs mt-3 py-1.5"
                                    onClick={() => onSelect && onSelect(item)}
                                >
                                    Load Full Results
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
