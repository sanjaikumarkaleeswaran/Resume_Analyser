import { useState, useRef } from 'react';

const EXPERIENCE_LEVELS = ['Fresher', '1-3 Years', '3-7 Years', '7+ Years'];

export default function ResumeForm({ onResult, isLoading, setIsLoading }) {
    const [resumeMode, setResumeMode] = useState('paste'); // 'paste' | 'upload'
    const [resumeText, setResumeText] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [error, setError] = useState('');
    const fileRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are accepted.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('File must be under 5MB.');
            return;
        }
        setResumeFile(file);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!experienceLevel) return setError('Please select an experience level.');
        if (jobDescription.trim().length < 30) return setError('Job description must be at least 30 characters.');
        if (resumeMode === 'paste' && resumeText.trim().length < 50) return setError('Resume text must be at least 50 characters.');
        if (resumeMode === 'upload' && !resumeFile) return setError('Please upload a PDF resume.');

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('job_description', jobDescription);
            formData.append('experience_level', experienceLevel);
            if (resumeMode === 'upload' && resumeFile) {
                formData.append('resume_file', resumeFile);
            } else {
                formData.append('resume_text', resumeText);
            }

            const { optimizeResume } = await import('../services/api');
            const result = await optimizeResume(formData);
            onResult(result);
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Failed to optimize. Try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form id="optimize-form" onSubmit={handleSubmit} className="card p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary-900/50 border border-primary-700/50 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">Optimize Your Resume</h2>
            </div>

            {/* Resume Input Toggle */}
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Resume</label>
                <div className="flex rounded-lg border border-slate-600 p-1 bg-dark-900 mb-3 w-fit">
                    {['paste', 'upload'].map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => { setResumeMode(mode); setError(''); }}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${resumeMode === mode
                                    ? 'bg-primary-600 text-white shadow'
                                    : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {mode === 'paste' ? '📋 Paste Text' : '📄 Upload PDF'}
                        </button>
                    ))}
                </div>

                {resumeMode === 'paste' ? (
                    <textarea
                        id="resume-text"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="input-field resize-none"
                        rows={8}
                        placeholder="Paste your resume text here..."
                    />
                ) : (
                    <div
                        className="border-2 border-dashed border-slate-600 hover:border-primary-500 rounded-xl p-8 text-center cursor-pointer transition-colors group"
                        onClick={() => fileRef.current?.click()}
                    >
                        <input
                            ref={fileRef}
                            id="resume-file"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <svg className="w-10 h-10 text-slate-500 group-hover:text-primary-400 mx-auto mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {resumeFile ? (
                            <p className="text-primary-400 font-medium text-sm">{resumeFile.name}</p>
                        ) : (
                            <>
                                <p className="text-slate-400 text-sm">Click to upload or drag a PDF here</p>
                                <p className="text-slate-600 text-xs mt-1">Max 5MB · PDF only</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Job Description */}
            <div>
                <label htmlFor="job-desc" className="block text-sm font-medium text-slate-300 mb-2">
                    Job Description
                </label>
                <textarea
                    id="job-desc"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="input-field resize-none"
                    rows={6}
                    placeholder="Paste the full job description here..."
                />
            </div>

            {/* Experience Level */}
            <div>
                <label htmlFor="exp-level" className="block text-sm font-medium text-slate-300 mb-2">
                    Experience Level
                </label>
                <select
                    id="exp-level"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="input-field"
                >
                    <option value="">Select experience level...</option>
                    {EXPERIENCE_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                </select>
            </div>

            {error && (
                <div className="bg-red-950/50 border border-red-700/50 rounded-lg px-4 py-3 text-red-300 text-sm">
                    {error}
                </div>
            )}

            <button
                id="optimize-btn"
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-base"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-3">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing with AI... (may take 15–30s)
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Optimize Resume
                    </span>
                )}
            </button>
        </form>
    );
}
