import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [signingOut, setSigningOut] = useState(false);

    const handleLogout = async () => {
        setSigningOut(true);
        try {
            await signOut();
            navigate('/login');
        } finally {
            setSigningOut(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-lg font-bold text-white tracking-tight">ResumeMatch</span>
                            <span className="text-lg font-bold text-primary-400 ml-1">AI</span>
                        </div>
                    </div>

                    {/* User info + logout */}
                    {user && (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                                <div className="w-7 h-7 rounded-full bg-primary-800 flex items-center justify-center text-primary-300 font-semibold text-xs uppercase">
                                    {user.email?.[0]}
                                </div>
                                <span className="max-w-[180px] truncate">{user.email}</span>
                            </div>
                            <button
                                id="logout-btn"
                                onClick={handleLogout}
                                disabled={signingOut}
                                className="btn-secondary text-sm py-1.5 px-3"
                            >
                                {signingOut ? 'Signing out...' : 'Logout'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
