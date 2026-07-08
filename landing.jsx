import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ---------- Small inline icon set (no external icon libs) ----------
const IconRadar = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="5.4" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        <path d="M12 12 L19 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12 3 A9 9 0 0 1 19.8 7.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
);

const IconChart = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 20V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M11 20V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M18 20V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M3 20H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

const IconBulb = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M9 18h6M10 21h4M8.5 14.5C6.6 13.1 5.5 11 5.5 9a6.5 6.5 0 1 1 13 0c0 2-1.1 4.1-3 5.5-.6.5-1 1.2-1 2v.3h-5v-.3c0-.8-.4-1.5-1-2Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
        />
    </svg>
);

const IconTrend = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M3 16 L9.5 9.5 L13.5 13.5 L21 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 6H21V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconChat = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M4 5.5h16v10.5H9.5L5 20v-4H4Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
        />
        <path d="M8 9.5h8M8 12.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
);

const IconArrow = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconLinkedIn = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6.94 8.5H3.56V20H6.94V8.5ZM5.25 7.02A1.96 1.96 0 1 0 5.25 3.1a1.96 1.96 0 0 0 0 3.92ZM20.44 20H17.06V14.02c0-1.42-.03-3.25-1.98-3.25-1.98 0-2.29 1.55-2.29 3.15V20H9.4V8.5h3.24v1.57h.05c.45-.85 1.56-1.75 3.2-1.75 3.42 0 4.55 2.25 4.55 5.18V20Z" />
    </svg>
);

const IconX = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.9 3H21.7L15.6 10.1L22.8 20H17.2L12.8 14.1L7.8 20H5L11.5 12.4L4.6 3H10.3L14.3 8.4L18.9 3ZM17.9 18.3H19.5L9.6 4.6H7.9L17.9 18.3Z" />
    </svg>
);

const IconInstagram = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
);

const IconYouTube = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10.5 9.2 15 12 10.5 14.8Z" fill="currentColor" />
    </svg>
);

const IconStar = ({ className = "" }) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10 1.5 12.47 6.8 18.3 7.6 14.1 11.5 15.2 17.3 10 14.4 4.8 17.3 5.9 11.5 1.7 7.6 7.53 6.8Z" />
    </svg>
);

const IconCheck = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ---------- Data ----------
const FEATURES = [
    {
        icon: IconRadar,
        title: "Competitor Tracking Agent",
        desc: "Continuously monitor pricing, positioning, and channel activity across every competitor you care about, in one live view.",
    },
    {
        icon: IconChat,
        title: "Data Intelligence Agent",
        desc: "Ask plain-language questions about your market and get sourced, agent-researched answers in seconds.",
    },
    {
        icon: IconBulb,
        title: "Strategic Analysis Agent",
        desc: "Turn raw competitive signal into concrete next moves, ranked by expected impact on your category position.",
    },
    {
        icon: IconChart,
        title: "Recommendation Agent",
        desc: "Break down competitor campaigns automatically — messaging angles, spend patterns, and creative shifts, surfaced as they happen.",
    },
    {
        icon: IconTrend,
        title: "Market Prediction Agent",
        desc: "Forecast where the market is heading before it gets there, using pattern shifts detected across your entire category.",
    },
];

const STEPS = [
    { label: "Track", desc: "Competitor Tracking Agent continuously scans competitor sites, ads, and pricing pages." },
    { label: "Interrogate", desc: "Data Intelligence Agent answers plain-language questions about competitor operations." },
    { label: "Strategize", desc: "Strategic Analysis Agent generates priority defensive actions and roadmaps." },
    { label: "Recommend", desc: "Recommendation Agent audits active campaign creatives and ad positioning." },
    { label: "Predict", desc: "Market Prediction Agent forecasts customer growth and trend volatility." },
];

const REVIEWS = [
    {
        name: "Priya Nathan",
        role: "Marketing Director",
        company: "Verdant & Co.",
        initials: "PN",
        quote:
            "Aetheris cut our competitive research time from two days a week to about twenty minutes. Our positioning decks are sharper because of it.",
    },
    {
        name: "Marcus Webb",
        role: "Head of Growth",
        company: "Northfield Supply",
        initials: "MW",
        quote:
            "We caught a competitor's pricing shift within hours instead of finding out a quarter late. That alone paid for the subscription.",
    },
    {
        name: "Alina Torres",
        role: "Brand Strategy Lead",
        company: "Solace Goods",
        initials: "AT",
        quote:
            "The recommendation engine found a gap in our category nobody on the team had noticed. We launched around it within a month.",
    },
    {
        name: "Devon Okafor",
        role: "VP Marketing",
        company: "Kestrel Home",
        initials: "DO",
        quote:
            "It's the first tool that actually tells us what to do next, not just what happened. Our strategy meetings are shorter and better.",
    },
];

// ---------- Reusable bits ----------
function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold]);
    return [ref, inView];
}

function GetStartedButton({ className = "", children = "Get Started" }) {
    const navigate = useNavigate();
    return (
        <button
            type="button"
            onClick={() => navigate("/login")}
            className={
                "inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-all duration-300 hover:scale-105 hover:bg-teal-500 hover:shadow-xl hover:shadow-teal-600/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 " +
                className
            }
        >
            {children}
            <IconArrow className="h-4 w-4" />
        </button>
    );
}

function HeroGraphic() {
    // Chart dimensions
    const W = 480, H = 420;
    const padL = 52, padR = 24, padT = 32, padB = 56;
    const cW = W - padL - padR;
    const cH = H - padT - padB;

    // X positions for 9 months
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
    const xPos = months.map((_, i) => padL + (i / (months.length - 1)) * cW);

    // Data series (0–100 scale)
    const series = [
        {
            label: "You",
            color: "#0D9488",
            fill: "#14B8A6",
            vals: [38, 44, 52, 49, 61, 68, 74, 79, 88],
        },
        {
            label: "Rival A",
            color: "#6366F1",
            fill: "#818CF8",
            vals: [55, 58, 54, 60, 57, 62, 59, 63, 61],
        },
        {
            label: "Rival B",
            color: "#F59E0B",
            fill: "#FCD34D",
            vals: [70, 66, 63, 58, 55, 50, 47, 43, 40],
        },
    ];

    const yMin = 20, yMax = 100;
    const toY = (v) => padT + cH - ((v - yMin) / (yMax - yMin)) * cH;

    const toPath = (vals) =>
        vals.map((v, i) => `${i === 0 ? "M" : "L"}${xPos[i].toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

    const toArea = (vals) =>
        toPath(vals) +
        ` L${xPos[vals.length - 1].toFixed(1)},${(padT + cH).toFixed(1)} L${padL},${(padT + cH).toFixed(1)} Z`;

    const gridLines = [30, 50, 70, 90];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden="true">
            <defs>
                {series.map((s) => (
                    <linearGradient key={s.label} id={`fill-${s.label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={s.fill} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={s.fill} stopOpacity="0.02" />
                    </linearGradient>
                ))}
                <style>{`
                    .line-draw { stroke-dasharray: 900; stroke-dashoffset: 900; animation: drawLine 1.8s ease forwards; }
                    .line-draw-1 { animation-delay: 0.1s; }
                    .line-draw-2 { animation-delay: 0.4s; }
                    .line-draw-3 { animation-delay: 0.7s; }
                    .area-fade { opacity: 0; animation: areaFade 0.9s ease forwards; }
                    .area-fade-1 { animation-delay: 0.6s; }
                    .area-fade-2 { animation-delay: 0.9s; }
                    .area-fade-3 { animation-delay: 1.2s; }
                    .dot-pop { transform: scale(0); transform-box: fill-box; transform-origin: center; animation: dotPop 0.35s ease forwards; }
                    @keyframes drawLine { to { stroke-dashoffset: 0; } }
                    @keyframes areaFade { to { opacity: 1; } }
                    @keyframes dotPop { to { transform: scale(1); } }
                `}</style>
            </defs>

            {/* Background card */}
            <rect x="8" y="8" width={W - 16} height={H - 16} rx="18" fill="white"
                stroke="#E2E8F0" strokeWidth="1.5" />

            {/* Grid lines */}
            {gridLines.map((v) => (
                <g key={v}>
                    <line
                        x1={padL} y1={toY(v)} x2={padL + cW} y2={toY(v)}
                        stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4"
                    />
                    <text x={padL - 8} y={toY(v)} textAnchor="end" dominantBaseline="middle"
                        fontSize="11" fill="#94A3B8">{v}</text>
                </g>
            ))}

            {/* X-axis baseline */}
            <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH}
                stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Month labels */}
            {months.map((m, i) => (
                <text key={m} x={xPos[i]} y={padT + cH + 18} textAnchor="middle"
                    fontSize="11" fill="#94A3B8">{m}</text>
            ))}

            {/* Area fills */}
            {series.map((s, si) => (
                <path key={s.label + "-area"}
                    d={toArea(s.vals)}
                    fill={`url(#fill-${s.label})`}
                    className={`area-fade area-fade-${si + 1}`}
                />
            ))}

            {/* Lines */}
            {series.map((s, si) => (
                <path key={s.label + "-line"}
                    d={toPath(s.vals)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={si === 0 ? 2.8 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`line-draw line-draw-${si + 1}`}
                />
            ))}

            {/* Dots on "You" series */}
            {series[0].vals.map((v, i) => (
                <circle key={i}
                    cx={xPos[i]} cy={toY(v)} r="4.5"
                    fill="#F0FDFA" stroke={series[0].color} strokeWidth="2.2"
                    className="dot-pop"
                    style={{ animationDelay: `${1.2 + i * 0.07}s` }}
                />
            ))}

            {/* "You" last-point callout */}
            <g style={{ animationDelay: "2s" }} className="area-fade area-fade-1">
                <rect
                    x={xPos[8] - 30} y={toY(88) - 30}
                    width="62" height="24" rx="7"
                    fill="#0D9488"
                />
                <text x={xPos[8] + 1} y={toY(88) - 14}
                    textAnchor="middle" fontSize="11.5" fontWeight="700" fill="white">
                    +88%
                </text>
            </g>

            {/* Legend */}
            {series.map((s, i) => (
                <g key={s.label + "-legend"} transform={`translate(${padL + i * 110}, ${H - 18})`}>
                    <rect x="0" y="-6" width="14" height="4" rx="2" fill={s.color} />
                    <text x="19" y="0" fontSize="11" fill="#475569" dominantBaseline="middle"
                        fontWeight={i === 0 ? "700" : "400"}>
                        {s.label}
                    </text>
                </g>
            ))}

            {/* Title */}
            <text x={padL} y="20" fontSize="12" fontWeight="700" fill="#475569">
                Market Share Trend
            </text>
        </svg>
    );
}

// ---------- Feature card ----------
function FeatureCard({ feature, index }) {
    const [ref, inView] = useInView();
    const Icon = feature.icon;
    return (
        <div
            ref={ref}
            style={{ transitionDelay: inView ? `${index * 90}ms` : "0ms" }}
            className={
                "group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-teal-500 hover:shadow-lg hover:shadow-slate-200/70 " +
                (inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")
            }
        >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-teal-600 transition-colors duration-300 group-hover:bg-teal-50">
                <Icon className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-slate-900">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
        </div>
    );
}

// ---------- Timeline step ----------
function TimelineStep({ step, index, total }) {
    const [ref, inView] = useInView();
    return (
        <div ref={ref} className="relative flex flex-1 flex-col items-center text-center">
            {index < total - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-[2px] w-full md:block">
                    <div
                        className={
                            "h-full bg-gradient-to-r from-teal-400 to-slate-200 transition-all duration-700 " +
                            (inView ? "opacity-100" : "opacity-0")
                        }
                        style={{
                            backgroundImage: "repeating-linear-gradient(90deg, #14B8A6 0 8px, transparent 8px 16px)",
                            transitionDelay: `${index * 150}ms`,
                        }}
                    />
                </div>
            )}
            <div
                className={
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-500 bg-white text-sm font-semibold text-teal-700 transition-transform duration-500 " +
                    (inView ? "scale-100" : "scale-75 opacity-0")
                }
                style={{ transitionDelay: `${index * 150}ms` }}
            >
                <span className="absolute h-full w-full animate-ping-slow rounded-full bg-teal-400/30" />
                {index + 1}
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">{step.label}</p>
            <p className="mt-1 max-w-[10rem] text-xs leading-relaxed text-slate-500">{step.desc}</p>
        </div>
    );
}

// ---------- Review card ----------
function ReviewCard({ review }) {
    return (
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/70">
            <div className="mb-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar key={i} className="h-4 w-4" />
                ))}
            </div>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{review.quote}&rdquo;</p>
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                    {review.initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                    <p className="text-xs text-slate-500">
                        {review.role}, {review.company}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ---------- Main component ----------
export default function AetherisLanding() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 60);
        return () => clearTimeout(t);
    }, []);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email) return;
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <div className="min-h-screen scroll-smooth bg-white font-sans text-slate-900">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .font-sans { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
        .font-display { font-family: 'Manrope', system-ui, sans-serif; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-up { animation: fadeSlideUp 0.8s ease-out forwards; }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(13,148,136,0.35), 0 10px 25px -5px rgba(13,148,136,0.25); }
          50% { box-shadow: 0 0 0 8px rgba(13,148,136,0), 0 10px 25px -5px rgba(13,148,136,0.35); }
        }
        .animate-pulse-glow { animation: pulseGlow 2.6s ease-in-out infinite; }

        @keyframes pulseNode {
          0%, 100% { opacity: 0.55; r: 5; }
          50% { opacity: 1; r: 6.5; }
        }
        .animate-pulse-node { animation: pulseNode 2.4s ease-in-out infinite; transform-origin: center; }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spinSlow 10s linear infinite; }

        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 0.6; }
          75%, 100% { transform: scale(1.9); opacity: 0; }
        }
        .animate-ping-slow { animation: pingSlow 2.2s cubic-bezier(0,0,0.2,1) infinite; }

        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-check-pop { animation: checkPop 0.4s ease-out forwards; }
      `}</style>

            {/* HEADER */}
            <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                            <IconRadar className="h-4.5 w-4.5 text-teal-400" />
                        </span>
                        <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">Aetheris</span>
                    </div>
                    <GetStartedButton className="animate-pulse-glow px-5 py-2.5" />
                </div>
            </header>

            {/* HERO */}
            <section className="relative overflow-hidden bg-slate-50 pt-32 pb-20 md:pt-40 md:pb-28">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
                    <div
                        className={heroVisible ? "animate-fade-slide-up" : "opacity-0"}
                    >
                        <span className="mb-5 inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                            Agentic competitive intelligence
                        </span>
                        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
                            Track every competitor. Predict every market shift. Automatically.
                        </h1>
                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
                            Aetheris runs a team of specialized AI agents that watch your category around the clock, turning scattered competitor activity into ranked, actionable strategy for your marketing team.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <GetStartedButton className="animate-pulse-glow px-7 py-3.5 text-base" />
                            <button className="text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-teal-600">
                                See how it works
                            </button>
                        </div>
                    </div>
                    <div className={"relative mx-auto w-full max-w-[520px] md:max-w-[540px] " + (heroVisible ? "animate-fade-slide-up" : "opacity-0")} style={{ animationDelay: "150ms" }}>
                        <HeroGraphic />
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="mx-auto max-w-7xl px-6 py-24">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
                        Five agents. One competitive edge.
                    </h2>
                    <p className="mt-3 text-slate-500">
                        Every part of the competitive analysis workflow, handled by a dedicated AI agent built for the job.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <FeatureCard key={f.title} feature={f} index={i} />
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="border-y border-slate-200 bg-slate-50 py-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">How it works</h2>
                        <p className="mt-3 text-slate-500">A continuous five-stage loop that never stops watching your market.</p>
                    </div>
                    <div className="flex flex-col gap-10 md:flex-row md:gap-4">
                        {STEPS.map((s, i) => (
                            <TimelineStep key={s.label} step={s} index={i} total={STEPS.length} />
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="mx-auto max-w-7xl px-6 py-24">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">
                        Trusted by Marketing Teams
                    </h2>
                    <p className="mt-3 text-slate-500">D2C and consumer brands use Aetheris to move faster than their category.</p>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {REVIEWS.map((r) => (
                        <ReviewCard key={r.name} review={r} />
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
                <div className="mx-auto max-w-7xl px-6 pt-14">
                    <div className="mb-12 flex justify-center gap-5 sm:justify-start">
                        {[IconLinkedIn, IconX, IconInstagram, IconYouTube].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                aria-label="Social link"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-all duration-300 hover:scale-110 hover:border-teal-500 hover:text-teal-400"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="mb-3 flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800">
                                    <IconRadar className="h-4.5 w-4.5 text-teal-400" />
                                </span>
                                <span className="font-display text-lg font-extrabold tracking-tight text-white">Aetheris</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-400">
                                Agentic competitor intelligence for teams who refuse to be surprised.
                            </p>
                        </div>

                        <div>
                            <h4 className="mb-4 text-sm font-semibold text-white">Quick Links</h4>
                            <ul className="space-y-2.5 text-sm text-slate-400">
                                {["Features", "Pricing", "About", "Contact", "FAQ"].map((l) => (
                                    <li key={l}>
                                        <a href="#" className="transition-colors hover:text-teal-400">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-sm font-semibold text-white">Information</h4>
                            <ul className="space-y-2.5 text-sm text-slate-400">
                                {["Privacy Policy", "Terms of Service", "Documentation", "Support"].map((l) => (
                                    <li key={l}>
                                        <a href="#" className="transition-colors hover:text-teal-400">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-sm font-semibold text-white">Subscribe</h4>
                            <p className="mb-3 text-sm text-slate-400">Monthly competitive insight, no fluff.</p>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-teal-500"
                                />
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-teal-500"
                                >
                                    {subscribed ? (
                                        <>
                                            <IconCheck className="h-4 w-4 animate-check-pop" />
                                            Subscribed
                                        </>
                                    ) : (
                                        "Subscribe"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
                        © 2026 Aetheris. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}