import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const IconRadar = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="5.4" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        <path d="M12 12 L19 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12 3 A9 9 0 0 1 19.8 7.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
);

const IconEye = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
        {open ? (
            <>
                <path d="M2 12C2 12 5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
            </>
        ) : (
            <>
                <path d="M2 12C2 12 5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
        )}
    </svg>
);

const IconMail = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconLock = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/dashboard");
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
                .font-sans { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
                .font-display { font-family: 'Manrope', system-ui, sans-serif; }
                .auth-input:focus { outline: none; border-color: #0D9488; box-shadow: 0 0 0 3px rgba(13,148,136,0.12); }
                .auth-card { animation: cardUp 0.5s cubic-bezier(.22,.68,0,1.2) both; }
                @keyframes cardUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
                .btn-spin { animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .social-btn:hover { border-color: #0D9488; color: #0D9488; background: #F0FDFA; }
            `}</style>

            {/* Header */}
            <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm px-6 py-4">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-teal-400">
                            <IconRadar />
                        </span>
                        <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">Aetheris</span>
                    </Link>
                    <p className="text-sm text-slate-500">
                        No account?{" "}
                        <Link to="/signup" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </header>

            {/* Main */}
            <main className="flex flex-1 items-center justify-center px-4 py-16">
                <div className="auth-card w-full max-w-md">
                    {/* Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-8">
                        {/* Badge */}
                        <span className="mb-6 inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                            Welcome back
                        </span>

                        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
                            Sign in to Aetheris
                        </h1>
                        <p className="text-sm text-slate-500 mb-8">
                            Your competitive intelligence dashboard awaits.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Work email
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <IconMail />
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@company.com"
                                        className="auth-input w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        <IconLock />
                                    </span>
                                    <input
                                        id="password"
                                        type={showPwd ? "text" : "password"}
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="auth-input w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPwd(!showPwd)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                                    >
                                        <IconEye open={showPwd} />
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all duration-300 hover:scale-[1.02] hover:bg-teal-500 hover:shadow-xl hover:shadow-teal-600/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <>
                                        <svg className="btn-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                        </svg>
                                        Signing in…
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-3">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs text-slate-400 font-medium">or continue with</span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Social */}
                        <div className="grid grid-cols-2 gap-3">
                            {["Google", "Microsoft"].map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    className="social-btn flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200"
                                >
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                                        {name === "Google" ? (
                                            <path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.7 3-4.3 3-7.1Z M12 22c2.7 0 5-0.9 6.6-2.4l-3.2-2.4c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.5C4.7 19.9 8.1 22 12 22Z M6.4 14.1c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.6H3.1A9.9 9.9 0 0 0 2 12c0 1.6.4 3.1 1.1 4.4l3.3-2.3Z M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.9 14.6 2 12 2 8.1 2 4.7 4.1 3.1 7.6l3.3 2.5C7.2 7.7 9.4 5.9 12 5.9Z" />
                                        ) : (
                                            <path d="M11.5 2H2v9.5h9.5V2Zm1 0v9.5H22V2h-9.5Zm-1 10.5H2V22h9.5v-9.5Zm1 0V22H22v-9.5h-9.5Z" />
                                        )}
                                    </svg>
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer note */}
                    <p className="mt-6 text-center text-xs text-slate-500">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                            Sign up free →
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
