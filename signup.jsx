import React, { useState } from "react";
import { Link } from "react-router-dom";

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

const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconBuilding = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 21V9h6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
        <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PERKS = [
    "Free 14-day trial, no card required",
    "5 AI agents tracking your category",
    "Daily strategy recommendations",
    "Cancel anytime",
];

export default function SignupPage() {
    const [form, setForm] = useState({ name: "", company: "", email: "", password: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setDone(true);
        }, 1400);
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
                .success-pop { animation: successPop 0.5s cubic-bezier(.22,.68,0,1.4) both; }
                @keyframes successPop { from { opacity:0; transform: scale(0.85); } to { opacity:1; transform: scale(1); } }
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
                        Have an account?{" "}
                        <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="auth-card w-full max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">

                        {/* Left panel — perks */}
                        <div className="relative hidden md:flex flex-col justify-between bg-slate-900 p-10 overflow-hidden">
                            {/* Background glow */}
                            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

                            <div className="relative z-10">
                                <span className="mb-8 inline-flex items-center rounded-full border border-teal-700 bg-teal-900/50 px-3 py-1 text-xs font-semibold text-teal-400">
                                    Start free today
                                </span>
                                <h2 className="font-display text-2xl font-extrabold leading-snug text-white mb-4">
                                    Intelligence that moves as fast as your market.
                                </h2>
                                <p className="text-sm text-slate-400 leading-relaxed mb-10">
                                    Join marketing teams who stopped guessing and started knowing. Aetheris watches your entire competitive landscape — automatically.
                                </p>

                                <ul className="space-y-4">
                                    {PERKS.map((p) => (
                                        <li key={p} className="flex items-start gap-3">
                                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-400">
                                                <IconCheck />
                                            </span>
                                            <span className="text-sm text-slate-300">{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Mini testimonial */}
                            <div className="relative z-10 mt-12 rounded-xl border border-slate-700 bg-slate-800/60 p-5">
                                <p className="text-sm text-slate-300 italic leading-relaxed mb-4">
                                    "We caught a competitor pricing shift hours after it happened — not a quarter later. Aetheris changed how we operate."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                                        MW
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-white">Marcus Webb</p>
                                        <p className="text-xs text-slate-500">Head of Growth, Northfield Supply</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right panel — form */}
                        <div className="p-8 md:p-10">
                            {done ? (
                                /* Success state */
                                <div className="success-pop flex flex-col items-center justify-center h-full text-center py-12">
                                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 border-2 border-teal-500">
                                        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-teal-600">
                                            <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h2 className="font-display text-2xl font-extrabold text-slate-900 mb-2">You're in!</h2>
                                    <p className="text-sm text-slate-500 mb-8 max-w-xs">
                                        Your account is ready. Check your email to verify and activate your free trial.
                                    </p>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all hover:scale-105 hover:bg-teal-500"
                                    >
                                        Go to Sign in →
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <span className="mb-6 inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                                        Free 14-day trial
                                    </span>
                                    <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 mb-1">
                                        Create your account
                                    </h1>
                                    <p className="text-sm text-slate-500 mb-7">
                                        Set up in under 2 minutes. No credit card needed.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name + Company row */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                    Full name
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                        <IconUser />
                                                    </span>
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        required
                                                        value={form.name}
                                                        onChange={set("name")}
                                                        placeholder="Jane Smith"
                                                        className="auth-input w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                    Company
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                        <IconBuilding />
                                                    </span>
                                                    <input
                                                        id="company"
                                                        type="text"
                                                        required
                                                        value={form.company}
                                                        onChange={set("company")}
                                                        placeholder="Acme Corp"
                                                        className="auth-input w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="su-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Work email
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                    <IconMail />
                                                </span>
                                                <input
                                                    id="su-email"
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    value={form.email}
                                                    onChange={set("email")}
                                                    placeholder="you@company.com"
                                                    className="auth-input w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200"
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label htmlFor="su-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                                    <IconLock />
                                                </span>
                                                <input
                                                    id="su-password"
                                                    type={showPwd ? "text" : "password"}
                                                    required
                                                    minLength={8}
                                                    value={form.password}
                                                    onChange={set("password")}
                                                    placeholder="Min. 8 characters"
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
                                            {/* Password strength bar */}
                                            {form.password.length > 0 && (
                                                <div className="mt-2 flex gap-1">
                                                    {[1, 2, 3, 4].map((n) => (
                                                        <div
                                                            key={n}
                                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                                form.password.length >= n * 3
                                                                    ? n <= 1 ? "bg-red-400" : n <= 2 ? "bg-amber-400" : n <= 3 ? "bg-teal-400" : "bg-teal-600"
                                                                    : "bg-slate-200"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Terms */}
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            By signing up, you agree to our{" "}
                                            <a href="#" className="font-semibold text-teal-600 hover:underline">Terms of Service</a> and{" "}
                                            <a href="#" className="font-semibold text-teal-600 hover:underline">Privacy Policy</a>.
                                        </p>

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
                                                    Creating account…
                                                </>
                                            ) : (
                                                "Create free account →"
                                            )}
                                        </button>
                                    </form>

                                    {/* Divider */}
                                    <div className="my-5 flex items-center gap-3">
                                        <div className="h-px flex-1 bg-slate-200" />
                                        <span className="text-xs text-slate-400 font-medium">or sign up with</span>
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
                                </>
                            )}
                        </div>
                    </div>

                    <p className="mt-5 text-center text-xs text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                            Sign in →
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
