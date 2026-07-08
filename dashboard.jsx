import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

/* Ic — thin wrapper for Google Material Symbols Outlined */
const Ic = ({ name, size = 18, className = "", style = {} }) => (
  <span
    className={`material-symbols-outlined select-none leading-none ${className}`}
    style={{ fontSize: size, verticalAlign: "middle", ...style }}
  >
    {name}
  </span>
);

const getInitials = (name) => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "C";
const getColor = (id) => {
  const colors = ["#4F46E5", "#0D9488", "#D97706", "#E11D48", "#7C3AED", "#0284C7"];
  let hash = 0;
  if (!id) return colors[0];
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/* ═══════════════════════════════════════════════════════════
   COMPETITORS STATIC DATA & DETAILS DATABASE
   ═══════════════════════════════════════════════════════════ */
const INITIAL_COMPETITORS = [
  { id: "nova", name: "ShoeZone", init: "SZ", color: "#4F46E5", share: 28, growth: "+12.4%", category: "AI Analytics", status: "Fastest Growth", pos: true },
  { id: "apex", name: "Stridexboot", init: "SB", color: "#D97706", share: 22, growth: "-3.2%", category: "Enterprise CRM", status: "Pricing War", pos: false },
  { id: "vortex", name: "Aeropulse", init: "AP", color: "#0D9488", share: 18, growth: "+8.7%", category: "Developer SDKs", status: "Market Disruption", pos: true },
  { id: "pinn", name: "FluxRunner", init: "FR", color: "#E11D48", share: 15, growth: "+2.1%", category: "SMB Platforms", status: "Steady Rise", pos: true },
  { id: "strat", name: "MotionX", init: "MX", color: "#7C3AED", share: 10, growth: "-1.5%", category: "Mobile Analytics", status: "Reliability Risk", pos: false },
  { id: "core", name: "Velocity One", init: "VO", color: "#0284C7", share: 7, growth: "+5.3%", category: "Visual Dashboards", status: "SEO Leader", pos: true },
];

const COMP_DETAILS = {
  nova: {
    customers: "284K", satisfaction: 88, overallScore: 92, revenue: "$148M", growth: "+12.4%",
    employees: "4,200", founded: 2018, hq: "San Francisco, CA",
    products: [
      { name: "Nova X Pro", rev: "$38.4M", units: "192K", growth: "+82%", top: true },
      { name: "Nova Analytics", rev: "$54.2M", units: "98K", growth: "+22%", top: false },
      { name: "Nova Cloud", rev: "$55.4M", units: "94K", growth: "+8%", top: false },
    ],
    monthlyCustomers: [210, 224, 236, 248, 262, 271, 284],
    sentiment: { positive: 72, neutral: 18, negative: 10 },
    insights: [
      { icon: "rocket_launch", text: "AI suite adoption up 34% QoQ — fastest growth in their history" },
      { icon: "payments", text: "IPO rumors circulating — may affect partnerships and pricing strategy" },
      { icon: "warning", text: "Pricing hike to $199/mo opens mid-market gap for competitors" },
    ],
    campaigns: {
      budget: "$420K/mo",
      messaging: "AI-First Enterprise Decisions. Do not get left behind.",
      channels: ["Google Search", "LinkedIn", "YouTube"],
      ctr: "3.4%",
      adText: "Scale your business analysis with Nova X Pro. Deep learning algorithms auto-extract competitor shifts."
    },
    trends: {
      forecastShare: "32%",
      riskFactor: "Low / Stable",
      predictedMoves: "Likely to acquire a smaller data ingestion tool to bolster pipelines."
    }
  },
  apex: {
    customers: "198K", satisfaction: 52, overallScore: 61, revenue: "$124M", growth: "-3.2%",
    employees: "3,100", founded: 2014, hq: "New York, NY",
    products: [
      { name: "Apex Enterprise", rev: "$42.1M", units: "61K", growth: "-8%", top: false },
      { name: "Apex Business", rev: "$48.8M", units: "84K", growth: "-2%", top: false },
      { name: "Apex Core", rev: "$33.1M", units: "53K", growth: "+4%", top: true },
    ],
    monthlyCustomers: [220, 218, 215, 210, 206, 202, 198],
    sentiment: { positive: 38, neutral: 24, negative: 38 },
    insights: [
      { icon: "warning", text: "18% price cut may signal desperation — watch for further margin squeeze" },
      { icon: "trending_down", text: "Customer churn rate up 14% QoQ — competitor migration accelerating" },
      { icon: "search", text: "Apex Core showing signs of life — only product with positive growth" },
    ],
    campaigns: {
      budget: "$250K/mo",
      messaging: "The Stable Choice for Fortune 500 Enterprise workflows.",
      channels: ["Google Search", "Forbes", "LinkedIn"],
      ctr: "1.8%",
      adText: "Apex CRM provides enterprise safety, 99.99% SLA, and predictable pricing. Get 18% off now."
    },
    trends: {
      forecastShare: "19%",
      riskFactor: "Elevated Risk",
      predictedMoves: "Expanding sales outreach in EMEA to counter domestic market losses."
    }
  },
  vortex: {
    customers: "156K", satisfaction: 80, overallScore: 78, revenue: "$89M", growth: "+8.7%",
    employees: "1,800", founded: 2020, hq: "Austin, TX",
    products: [
      { name: "VortexCore SDK", rev: "$21.7M", units: "108K", growth: "+61%", top: true },
      { name: "Aeropulse API", rev: "$38.4M", units: "28K", growth: "+18%", top: false },
      { name: "Vortex Lite", rev: "$28.9M", units: "20K", growth: "+4%", top: false },
    ],
    monthlyCustomers: [118, 126, 132, 140, 148, 152, 156],
    sentiment: { positive: 76, neutral: 14, negative: 10 },
    insights: [
      { icon: "handshake", text: "Salesforce partnership opens 40K+ enterprise accounts for upsell" },
      { icon: "eco", text: "Eco-pledge resonates with Gen Z buyers — fastest growing cohort" },
      { icon: "rocket_launch", text: "Developer community growing 22% MoM — best organic acquisition" },
    ],
    campaigns: {
      budget: "$180K/mo",
      messaging: "Build AI workflows in minutes. Built for developers by developers.",
      channels: ["GitHub Ads", "Twitter/X", "Discord Events"],
      ctr: "4.2%",
      adText: "Stop writing boilerplate integrations. vortex-sdk integrates vector search in 3 lines of code."
    },
    trends: {
      forecastShare: "22%",
      riskFactor: "Stable",
      predictedMoves: "Launching fully-managed serverless hosting options next quarter."
    }
  },
  pinn: {
    customers: "134K", satisfaction: 74, overallScore: 70, revenue: "$62M", growth: "+2.1%",
    employees: "980", founded: 2019, hq: "Chicago, IL",
    products: [
      { name: "FluxRunner Lite", rev: "$14.2M", units: "284K", growth: "+38%", top: true },
      { name: "FluxRunner Pro", rev: "$28.6M", units: "42K", growth: "+5%", top: false },
      { name: "FluxRunner Teams", rev: "$19.2M", units: "8K", growth: "-2%", top: false },
    ],
    monthlyCustomers: [124, 126, 128, 130, 131, 133, 134],
    sentiment: { positive: 62, neutral: 24, negative: 14 },
    insights: [
      { icon: "trophy", text: "FluxRunner Lite viral moment: LinkedIn post hit 2.1M impressions in 24h" },
      { icon: "target", text: "SMB segment growing 34% YoY — FluxRunner best positioned here" },
      { icon: "warning", text: "FluxRunner Teams underperforming — risk if Apex cuts price further" },
    ],
    campaigns: {
      budget: "$95K/mo",
      messaging: "All-in-one platform built for small business growth.",
      channels: ["LinkedIn Organic", "Meta Ads", "Google Search"],
      ctr: "2.5%",
      adText: "Ditch the expensive enterprise bloated tools. FluxRunner Lite starts at just $19/mo for SMBs."
    },
    trends: {
      forecastShare: "16%",
      riskFactor: "Minimal Risk",
      predictedMoves: "Adding native billing integrations to tie customer retainers directly into their dashboard."
    }
  },
  strat: {
    customers: "88K", satisfaction: 38, overallScore: 42, revenue: "$31M", growth: "-1.5%",
    employees: "620", founded: 2016, hq: "Seattle, WA",
    products: [
      { name: "MotionX Mobile", rev: "$5.2M", units: "44K", growth: "-14%", top: false },
      { name: "MotionX Core", rev: "$18.4M", units: "32K", growth: "-4%", top: false },
      { name: "MotionX Lite", rev: "$7.4M", units: "12K", growth: "+6%", top: true },
    ],
    monthlyCustomers: [102, 100, 98, 96, 94, 91, 88],
    sentiment: { positive: 14, neutral: 22, negative: 64 },
    insights: [
      { icon: "error", text: "App outage triggered mass complaint wave — 88K mentions in 48h" },
      { icon: "trending_down", text: "G2 rating dropped to 3.8 — lowest in company history" },
      { icon: "lightbulb", text: "MotionX Lite the only bright spot — consider separating product lines" },
    ],
    campaigns: {
      budget: "$60K/mo",
      messaging: "Fast and lightweight mobile analytics.",
      channels: ["Google Search", "Twitter Ads"],
      ctr: "1.1%",
      adText: "Track app reviews, ratings, and screen timings on MotionX Mobile. Real-time updates."
    },
    trends: {
      forecastShare: "7%",
      riskFactor: "High Risk",
      predictedMoves: "Restructuring leadership; likely seeking an acquisition or emergency funding."
    }
  },
  core: {
    customers: "72K", satisfaction: 70, overallScore: 66, revenue: "$28M", growth: "+5.3%",
    employees: "410", founded: 2021, hq: "Denver, CO",
    products: [
      { name: "CoreDash Pro", rev: "$9.8M", units: "82K", growth: "+29%", top: true },
      { name: "CoreAnalytics", rev: "$10.4M", units: "36K", growth: "+14%", top: false },
      { name: "CoreReports", rev: "$7.8M", units: "28K", growth: "+8%", top: false },
    ],
    monthlyCustomers: [58, 61, 63, 66, 68, 70, 72],
    sentiment: { positive: 68, neutral: 22, negative: 10 },
    insights: [
      { icon: "trophy", text: "#1 SEO ranking for 'competitor analytics' — organic growth exploding" },
      { icon: "payments", text: "Best B2B value proposition in the mid-market segment ($39/mo)" },
      { icon: "rocket_launch", text: "Customer base grew 24% QoQ — fastest in the analysis group" },
    ],
    campaigns: {
      budget: "$50K/mo",
      messaging: "Beautiful reports that align product and marketing teams.",
      channels: ["Organic Content", "LinkedIn Ads"],
      ctr: "2.1%",
      adText: "Generate high-fidelity, client-ready competitive analysis reports in CoreDash Pro. Start free."
    },
    trends: {
      forecastShare: "9%",
      riskFactor: "Low / Stable",
      predictedMoves: "Raising a Series A round (~$8-10M) to expand enterprise sales hire pipeline."
    }
  }
};

const GLOBAL_ALERTS = [
  { company: "ShoeZone", text: "Launched 'Nova X Pro' targeting the enterprise market segment.", type: "Product", time: "2 hours ago", alertType: "info" },
  { company: "Stridexboot", text: "Aggressive pricing shift: Reduced enterprise licensing tier by 18%.", type: "Pricing", time: "4 hours ago", alertType: "warning" },
  { company: "Aeropulse", text: "Partnered with Salesforce CRM ecosystem for native API ingestion.", type: "Partnership", time: "1 day ago", alertType: "success" },
  { company: "MotionX", text: "Experiencing severe platform outages; customer dissatisfaction spikes on G2.", type: "Risk", time: "1 day ago", alertType: "danger" },
];

/* ═══════════════════════════════════════════════════════════
   SVG MATH UTILITIES & CHART COMPONENTS
   ═══════════════════════════════════════════════════════════ */
const polar = (cx, cy, r, deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

const donutPath = (cx, cy, R, ri, s, e) => {
  const [osx, osy] = polar(cx, cy, R, s);
  const [oex, oey] = polar(cx, cy, R, e);
  const [iex, iey] = polar(cx, cy, ri, e);
  const [isx, isy] = polar(cx, cy, ri, s);
  const lg = e - s > 180 ? 1 : 0;
  return `M${osx.toFixed(1)} ${osy.toFixed(1)} A${R} ${R} 0 ${lg} 1 ${oex.toFixed(1)} ${oey.toFixed(1)} L${iex.toFixed(1)} ${iey.toFixed(1)} A${ri} ${ri} 0 ${lg} 0 ${isx.toFixed(1)} ${isy.toFixed(1)} Z`;
};

function DonutChart() {
  const [hov, setHov] = useState(null);
  const cx = 100, cy = 100, R = 80, ri = 50;
  const total = INITIAL_COMPETITORS.reduce((s, c) => s + c.share, 0);
  let angle = -90;
  const slices = INITIAL_COMPETITORS.map(c => {
    const span = (c.share / total) * 360;
    const s = angle, e = angle + span - 0.8;
    angle += span;
    return { ...c, s, e };
  });

  const hovered = hov ? INITIAL_COMPETITORS.find(c => c.id === hov) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
      <div className="relative">
        <svg viewBox="0 0 200 200" width="160" height="160">
          {slices.map(sl => (
            <path key={sl.id}
              d={donutPath(cx, cy, R, ri, sl.s, sl.e)}
              fill={sl.color}
              opacity={!hov || hov === sl.id ? 1 : 0.4}
              className="cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              onMouseEnter={() => setHov(sl.id)}
              onMouseLeave={() => setHov(null)}
            />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="800" fill="#1e293b" className="font-display">
            {hovered ? `${hovered.share}%` : "100%"}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#64748b" className="uppercase tracking-wider">
            {hovered ? hovered.name : "Market Share"}
          </text>
        </svg>
      </div>
      <div className="space-y-2 flex-1 max-w-xs w-full">
        {INITIAL_COMPETITORS.map(c => (
          <div
            key={c.id}
            className={`flex items-center gap-3 px-2 py-1 rounded-lg transition ${hov === c.id ? "bg-slate-100" : ""}`}
            onMouseEnter={() => setHov(c.id)}
            onMouseLeave={() => setHov(null)}
          >
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.color }} />
            <span className="text-xs font-semibold text-slate-700 flex-1">{c.name}</span>
            <span className="text-xs font-bold text-slate-900">{c.share}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const BAR_CATS = ["Enterprise", "SMB Suite", "Developer Tools"];
const CAT_COLORS = ["#4F46E5", "#0D9488", "#D97706"];
const BAR_DATA = [
  { name: "ShoeZone", vals: [92, 45, 70] },
  { name: "Stridexboot", vals: [80, 60, 25] },
  { name: "Aeropulse", vals: [50, 40, 88] },
  { name: "FluxRunner", vals: [55, 84, 33] },
  { name: "MotionX", vals: [35, 30, 55] },
];

function BarChart() {
  const W = 400, H = 190, pL = 30, pR = 10, pT = 10, pB = 30;
  const cW = W - pL - pR, cH = H - pT - pB;
  const gW = cW / BAR_DATA.length;
  const bW = 8;
  const grids = [0, 25, 50, 75, 100];
  const toY = v => pT + cH - (v / 100) * cH;

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {grids.map(v => (
          <g key={v}>
            <line x1={pL} y1={toY(v)} x2={pL + cW} y2={toY(v)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pL - 4} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="8" fontWeight="600" fill="#94a3b8">{v}</text>
          </g>
        ))}
        <line x1={pL} y1={pT + cH} x2={pL + cW} y2={pT + cH} stroke="#e2e8f0" strokeWidth="1" />

        {BAR_DATA.map((comp, gi) => {
          const gx = pL + gi * gW + gW / 2 - ((BAR_CATS.length * bW + (BAR_CATS.length - 1) * 2) / 2);
          return (
            <g key={comp.name}>
              {comp.vals.map((v, bi) => {
                const x = gx + bi * (bW + 2);
                const bh = (v / 100) * cH;
                return (
                  <rect
                    key={bi}
                    x={x}
                    y={toY(v)}
                    width={bW}
                    height={bh}
                    rx="1.5"
                    fill={CAT_COLORS[bi]}
                    opacity="0.85"
                  />
                );
              })}
              <text x={pL + gi * gW + gW / 2} y={pT + cH + 12} textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#64748b">
                {comp.name.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-center gap-4 pt-1">
        {BAR_CATS.map((cat, i) => (
          <div key={cat} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <div className="h-2 w-3 rounded-sm" style={{ background: CAT_COLORS[i] }} />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADVANCED CHART DATA & VISUALIZATION COMPONENTS
   ═══════════════════════════════════════════════════════════ */

const PERF_TREND_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const PERF_TREND_SERIES = [
  { id: "nova", name: "ShoeZone", color: "#4F46E5", scores: [78, 82, 85, 88, 90, 92] },
  { id: "apex", name: "Stridexboot", color: "#D97706", scores: [72, 70, 68, 65, 63, 61] },
  { id: "vortex", name: "Aeropulse", color: "#0D9488", scores: [60, 64, 68, 72, 75, 78] },
  { id: "pinn", name: "FluxRunner", color: "#E11D48", scores: [55, 57, 60, 63, 66, 70] },
  { id: "strat", name: "MotionX", color: "#7C3AED", scores: [48, 46, 44, 43, 43, 42] },
  { id: "core", name: "Velocity One", color: "#0284C7", scores: [40, 44, 48, 54, 60, 66] },
];
const GROWTH_TIMELINE = [
  { name: "ShoeZone", color: "#4F46E5", pct: 12.4, pos: true },
  { name: "Aeropulse", color: "#0D9488", pct: 8.7, pos: true },
  { name: "Velocity One", color: "#0284C7", pct: 5.3, pos: true },
  { name: "FluxRunner", color: "#E11D48", pct: 2.1, pos: true },
  { name: "MotionX", color: "#7C3AED", pct: -1.5, pos: false },
  { name: "Stridexboot", color: "#D97706", pct: -3.2, pos: false },
];
const ENG_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const ENG_LIKES = [42, 58, 65, 70, 78, 85];
const ENG_CMTS = [18, 24, 28, 32, 38, 42];
const ENG_SHARES = [12, 16, 20, 25, 30, 35];
const PRICING_TIERS_DATA = [
  { name: "Nova", starter: 49, pro: 149, enterprise: 499 },
  { name: "Apex", starter: 39, pro: 109, enterprise: 399 },
  { name: "Vortex", starter: 29, pro: 89, enterprise: 299 },
  { name: "FluxRunner", starter: 19, pro: 59, enterprise: 199 },
  { name: "MotionX", starter: 25, pro: 79, enterprise: 249 },
  { name: "Core", starter: 39, pro: 99, enterprise: 349 },
];
const GROWTH_CUST_DATA = [210, 224, 242, 258, 271, 284];
const MARKET_POS = [
  { id: "nova", name: "ShoeZone", color: "#4F46E5", px: 82, py: 92, r: 14 },
  { id: "apex", name: "Stridexboot", color: "#D97706", px: 74, py: 61, r: 12 },
  { id: "vortex", name: "Aeropulse", color: "#0D9488", px: 36, py: 78, r: 11 },
  { id: "pinn", name: "FluxRunner", color: "#E11D48", px: 20, py: 70, r: 10 },
  { id: "strat", name: "MotionX", color: "#7C3AED", px: 44, py: 42, r: 8 },
  { id: "core", name: "Velocity One", color: "#0284C7", px: 60, py: 66, r: 7 },
];

function PerformanceTrendChart() {
  const [hovSeries, setHovSeries] = useState(null);
  const W = 420, H = 175, pL = 34, pR = 12, pT = 10, pB = 28;
  const cW = W - pL - pR, cH = H - pT - pB;
  const MIN_V = 35, MAX_V = 100;
  const toX = (i) => pL + (i / (PERF_TREND_MONTHS.length - 1)) * cW;
  const toY = (v) => pT + cH - ((v - MIN_V) / (MAX_V - MIN_V)) * cH;
  const grids = [40, 55, 70, 85, 100];
  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {grids.map(v => (
          <g key={v}>
            <line x1={pL} y1={toY(v)} x2={pL + cW} y2={toY(v)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pL - 5} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="7.5" fill="#94a3b8" fontWeight="600">{v}</text>
          </g>
        ))}
        {PERF_TREND_MONTHS.map((m, i) => (
          <text key={m} x={toX(i)} y={pT + cH + 14} textAnchor="middle" fontSize="8" fill="#94a3b8" fontWeight="600">{m}</text>
        ))}
        {PERF_TREND_SERIES.map(series => {
          const pts = series.scores.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
          const isHov = hovSeries === series.id;
          const isDim = hovSeries && !isHov;
          return (
            <g key={series.id} onMouseEnter={() => setHovSeries(series.id)} onMouseLeave={() => setHovSeries(null)} style={{ cursor: "pointer" }}>
              <polyline points={pts} fill="none" stroke={series.color} strokeWidth={isHov ? 2.5 : 1.5} strokeLinejoin="round" strokeLinecap="round" opacity={isDim ? 0.15 : 1} style={{ transition: "all 0.2s" }} />
              {isHov && series.scores.map((v, i) => (
                <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={series.color} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
        {PERF_TREND_SERIES.map(s => (
          <div key={s.id} className={`flex items-center gap-1.5 text-[10px] font-semibold cursor-pointer transition ${hovSeries === s.id ? "text-slate-900" : "text-slate-500"}`} onMouseEnter={() => setHovSeries(s.id)} onMouseLeave={() => setHovSeries(null)}>
            <div className="h-2 w-3 rounded-sm" style={{ background: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthTimelineChart() {
  const W = 380, H = 195, pL = 72, pR = 52, pT = 10, pB = 22;
  const cW = W - pL - pR, cH = H - pT - pB;
  const maxAbs = 15;
  const toX = (pct) => pL + ((pct + maxAbs) / (maxAbs * 2)) * cW;
  const rowH = cH / GROWTH_TIMELINE.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={toX(0)} y1={pT} x2={toX(0)} y2={pT + cH} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 2" />
      {[-15, -7, 0, 7, 15].map(v => (
        <text key={v} x={toX(v)} y={pT + cH + 14} textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontWeight="600">{v > 0 ? `+${v}` : v}%</text>
      ))}
      {GROWTH_TIMELINE.map((g, i) => {
        const y = pT + i * rowH + rowH * 0.15;
        const bH = rowH * 0.7;
        const zeroX = toX(0);
        const endX = toX(g.pct);
        const barX = g.pos ? zeroX : endX;
        const barW = Math.abs(endX - zeroX);
        return (
          <g key={g.name}>
            <text x={pL - 6} y={y + bH / 2} textAnchor="end" dominantBaseline="middle" fontSize="8.5" fontWeight="700" fill="#475569">{g.name}</text>
            <rect x={barX} y={y} width={barW < 1 ? 1 : barW} height={bH} rx="2.5" fill={g.pos ? "#0D9488" : "#F43F5E"} opacity="0.85" />
            <text x={g.pos ? endX + 5 : endX - 5} y={y + bH / 2} textAnchor={g.pos ? "start" : "end"} dominantBaseline="middle" fontSize="8" fontWeight="800" fill={g.pos ? "#0D9488" : "#F43F5E"}>{g.pos ? "+" : ""}{g.pct}%</text>
          </g>
        );
      })}
    </svg>
  );
}

function EngagementLineChart() {
  const W = 300, H = 88, pL = 6, pR = 6, pT = 6, pB = 20;
  const cW = W - pL - pR, cH = H - pT - pB;
  const toX = (i) => pL + (i / (ENG_MONTHS.length - 1)) * cW;
  const toY = (v, max) => pT + cH - (v / max) * cH;
  const mkPts = (arr, max) => arr.map((v, i) => `${toX(i).toFixed(1)},${toY(v, max).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ENG_MONTHS.map((m, i) => (
        <text key={m} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="600">{m}</text>
      ))}
      <polyline points={mkPts(ENG_LIKES, 100)} fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={mkPts(ENG_CMTS, 100)} fill="none" stroke="#0D9488" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="3 2" />
      <polyline points={mkPts(ENG_SHARES, 100)} fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3" />
    </svg>
  );
}

function PricingMiniBar() {
  const W = 360, H = 118, pL = 44, pR = 8, pT = 8, pB = 22;
  const cW = W - pL - pR, cH = H - pT - pB;
  const maxV = 520;
  const gW = cW / PRICING_TIERS_DATA.length;
  const bW = 7;
  const toY = (v) => pT + cH - (v / maxV) * cH;
  const TIER_COLORS = ["#4F46E5", "#0D9488", "#D97706"];
  const TIER_LABELS = ["Starter", "Pro", "Enterprise"];
  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 150, 300, 450].map(v => (
          <g key={v}>
            <line x1={pL} y1={toY(v)} x2={pL + cW} y2={toY(v)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pL - 3} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="7" fill="#94a3b8">${v}</text>
          </g>
        ))}
        {PRICING_TIERS_DATA.map((tier, gi) => {
          const vals = [tier.starter, tier.pro, tier.enterprise];
          const totalBW = 3 * bW + 4;
          const gx = pL + gi * gW + gW / 2 - totalBW / 2;
          return (
            <g key={tier.name}>
              {vals.map((v, bi) => (
                <rect key={bi} x={gx + bi * (bW + 2)} y={toY(v)} width={bW} height={(v / maxV) * cH} rx="1.5" fill={TIER_COLORS[bi]} opacity="0.85" />
              ))}
              <text x={pL + gi * gW + gW / 2} y={pT + cH + 12} textAnchor="middle" fontSize="7.5" fontWeight="600" fill="#64748b">{tier.name}</text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-center gap-4">
        {TIER_LABELS.map((l, i) => (
          <div key={l} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500">
            <div className="h-1.5 w-3 rounded-sm" style={{ background: TIER_COLORS[i] }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthAreaChart() {
  const W = 300, H = 88, pL = 6, pR = 6, pT = 6, pB = 20;
  const cW = W - pL - pR, cH = H - pT - pB;
  const maxC = 300;
  const toX = (i) => pL + (i / (ENG_MONTHS.length - 1)) * cW;
  const toY = (v) => pT + cH - (v / maxC) * cH;
  const custPts = GROWTH_CUST_DATA.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const areaPath = `M${toX(0).toFixed(1)},${(pT + cH).toFixed(1)} ${GROWTH_CUST_DATA.map((v, i) => `L${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ")} L${toX(5).toFixed(1)},${(pT + cH).toFixed(1)} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ENG_MONTHS.map((m, i) => (
        <text key={m} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="600">{m}</text>
      ))}
      <path d={areaPath} fill="#4F46E5" opacity="0.08" />
      <polyline points={custPts} fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {GROWTH_CUST_DATA.map((v, i) => (
        <circle key={i} cx={toX(i)} cy={toY(v)} r={2.5} fill="#4F46E5" />
      ))}
    </svg>
  );
}

function MarketPositionScatter() {
  const [hovDot, setHovDot] = useState(null);
  const W = 420, H = 288, pL = 50, pR = 20, pT = 20, pB = 44;
  const cW = W - pL - pR, cH = H - pT - pB;
  const toX = (v) => pL + (v / 100) * cW;
  const toY = (v) => pT + cH - (v / 100) * cH;
  const grids = [0, 25, 50, 75, 100];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {grids.map(v => (
          <g key={v}>
            <line x1={pL} y1={toY(v)} x2={pL + cW} y2={toY(v)} stroke="#f1f5f9" strokeWidth="1" />
            <line x1={toX(v)} y1={pT} x2={toX(v)} y2={pT + cH} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pL - 6} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="7.5" fill="#94a3b8" fontWeight="600">{v}</text>
            <text x={toX(v)} y={pT + cH + 13} textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontWeight="600">{v}</text>
          </g>
        ))}
        <line x1={pL} y1={pT} x2={pL} y2={pT + cH} stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1={pL} y1={pT + cH} x2={pL + cW} y2={pT + cH} stroke="#e2e8f0" strokeWidth="1.5" />
        <text x={pL + cW / 2} y={pT + cH + 32} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="700">Price Level</text>
        <text x={14} y={pT + cH / 2} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="700" transform={`rotate(-90, 14, ${pT + cH / 2})`}>Quality Score</text>
        <text x={pL + cW * 0.22} y={pT + 12} textAnchor="middle" fontSize="7" fill="#cbd5e1" fontStyle="italic">Value Zone</text>
        <text x={pL + cW * 0.78} y={pT + 12} textAnchor="middle" fontSize="7" fill="#cbd5e1" fontStyle="italic">Premium Zone</text>
        <text x={pL + cW * 0.22} y={pT + cH - 7} textAnchor="middle" fontSize="7" fill="#cbd5e1" fontStyle="italic">Budget Zone</text>
        <text x={pL + cW * 0.78} y={pT + cH - 7} textAnchor="middle" fontSize="7" fill="#cbd5e1" fontStyle="italic">Overpriced Zone</text>
        {MARKET_POS.map(d => {
          const isHov = hovDot === d.id;
          const isDim = hovDot && !isHov;
          return (
            <g key={d.id} onMouseEnter={() => setHovDot(d.id)} onMouseLeave={() => setHovDot(null)} style={{ cursor: "pointer" }}>
              <circle cx={toX(d.px)} cy={toY(d.py)} r={isHov ? d.r + 3 : d.r} fill={d.color} opacity={isDim ? 0.2 : 0.85} style={{ transition: "all 0.2s" }} />
              <text x={toX(d.px)} y={toY(d.py) - d.r - 4} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={d.color} opacity={isDim ? 0.2 : 1}>{d.name}</text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-1">
        {MARKET_POS.map(d => (
          <div key={d.id} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 cursor-pointer" onMouseEnter={() => setHovDot(d.id)} onMouseLeave={() => setHovDot(null)}>
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackingChartsPanel({ analysisResult }) {
  const [activeChart, setActiveChart] = useState("trend");
  const CHART_TABS = [
    { id: "trend", label: "Performance Trend" },
    { id: "share", label: "Market Share" },
    { id: "comparison", label: "Comparison" },
    { id: "growth", label: "Growth Timeline" },
  ];
  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <h3 className="font-display font-extrabold text-slate-800 text-sm">Competitor Tracking Stream</h3>
        <p className="text-xs text-slate-400">Interactive visualizations compiled by Competitor Tracking Agent.</p>
      </div>
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {CHART_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveChart(tab.id)} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition whitespace-nowrap ${activeChart === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 min-h-[220px]">
        {activeChart === "trend" && (
          <div>
            <div className="mb-3"><h4 className="text-xs font-bold text-slate-700">Performance Score Trends</h4><p className="text-[10px] text-slate-400">Overall scores over 6 months. Hover a series to isolate.</p></div>
            <PerformanceTrendChart />
          </div>
        )}
        {activeChart === "share" && (
          <div>
            <div className="mb-4"><h4 className="text-xs font-bold text-slate-700">Market Share Distribution</h4><p className="text-[10px] text-slate-400">ARR-based percentages. Hover segments to inspect.</p></div>
            <DonutChart />
          </div>
        )}
        {activeChart === "comparison" && (
          <div>
            <div className="mb-3"><h4 className="text-xs font-bold text-slate-700">Competitor Comparison Scores</h4><p className="text-[10px] text-slate-400">Scored across Enterprise, SMB Suite, and Developer Tools.</p></div>
            <BarChart />
          </div>
        )}
        {activeChart === "growth" && (
          <div>
            <div className="mb-3"><h4 className="text-xs font-bold text-slate-700">Year-over-Year Growth Timeline</h4><p className="text-[10px] text-slate-400">Growth % vs previous year. Teal = positive, Red = declining.</p></div>
            <GrowthTimelineChart />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-xs mb-3">{<Ic name="inventory_2" />} Extracted Products</h4>
          {analysisResult.tracking?.products && analysisResult.tracking.products.length > 0 ? (
            <div className="space-y-2">{analysisResult.tracking.products.map((p, idx) => (<div key={idx} className="bg-white p-3 rounded-xl border border-slate-150 text-xs flex justify-between items-center"><span className="font-semibold text-slate-700">{typeof p === "object" && p !== null ? (p.name || p.title || JSON.stringify(p)) : p}</span>{(p.price || p.revenue || p.rev) && (<span className="font-mono text-slate-500 text-[10px]">{p.price || p.revenue || p.rev}</span>)}</div>))}</div>
          ) : (<p className="text-xs text-slate-400 italic">No products audited.</p>)}
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-xs mb-3">{<Ic name="campaign" />} Active Campaigns</h4>
          {analysisResult.tracking?.campaigns && analysisResult.tracking.campaigns.length > 0 ? (
            <div className="space-y-2">{analysisResult.tracking.campaigns.map((c, idx) => { if (typeof c === "object" && c !== null) { return (<div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-150 text-xs text-slate-600 space-y-1 shadow-sm"><div className="flex justify-between font-bold text-slate-800"><span>{c.title || c.messaging || "Ad Campaign"}</span><span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded uppercase font-mono">{c.platform || "Web"}</span></div>{c.cta && <p className="text-[10px] text-teal-600">CTA: {c.cta}</p>}</div>); } return (<div key={idx} className="bg-white p-3 rounded-xl border border-slate-150 text-xs text-slate-600">{c}</div>); })}</div>
          ) : (<p className="text-xs text-slate-400 italic">No campaigns detected.</p>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <h4 className="font-bold text-slate-800 text-xs mb-3">{<Ic name="chat" />} Social Posts Audit</h4>
          {analysisResult.tracking?.social_posts && analysisResult.tracking.social_posts.length > 0 ? (
            <div className="space-y-2 text-xs">{analysisResult.tracking.social_posts.map((post, idx) => { if (typeof post === "object" && post !== null) { return (<div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-150 text-slate-600 space-y-1.5 shadow-sm"><p className="italic">"{post.text || post.content || JSON.stringify(post)}"</p><div className="flex justify-between text-[9px] text-slate-400 font-mono"><span>{post.platform || "Social"}</span>{post.date && <span>{post.date}</span>}</div></div>); } return (<div key={idx} className="bg-white p-3 rounded-xl border border-slate-150 text-xs text-slate-600">"{post}"</div>); })}</div>
          ) : (<p className="text-xs text-slate-400 italic">No social activity logged.</p>)}
        </div>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3">
          <h4 className="font-bold text-slate-800 text-xs mb-1">{<Ic name="rocket_launch" />} Product Launches &amp; Milestones</h4>
          {analysisResult.tracking?.launch ? (
            <div className="bg-white p-4 rounded-xl border border-slate-150 space-y-2">
              <p><strong>Recent Event:</strong> {analysisResult.tracking.launch.recent || "N/A"}</p>
              <p><strong>Date:</strong> {analysisResult.tracking.launch.date || "N/A"}</p>
              <p className="leading-relaxed"><strong>Details:</strong> {analysisResult.tracking.launch.details || "N/A"}</p>
            </div>
          ) : (<p className="text-slate-400 italic">No major launches parsed recently.</p>)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPARISON VIEW DATA & COMPONENTS
   ═══════════════════════════════════════════════════════════ */

const CMP_IDS = ["nova", "apex", "vortex", "pinn", "strat", "core"];
const CMP_NAMES = { nova: "ShoeZone", apex: "Stridexboot", vortex: "Aeropulse", pinn: "FluxRunner", strat: "MotionX", core: "Velocity One" };
const CMP_COLORS = { nova: "#4F46E5", apex: "#D97706", vortex: "#0D9488", pinn: "#E11D48", strat: "#7C3AED", core: "#0284C7" };
const CMP_INITS = { nova: "SZ", apex: "SB", vortex: "AP", pinn: "FR", strat: "MX", core: "VO" };

const CMP_METRICS = {
  nova: { overallScore: 92, marketShare: 28, revenueGrowth: 12.4, engagement: 85, productCount: 3, startingPrice: 199, rating: 4.8, socialScore: 88, sentiment: 72, lastUpdated: "Jul 08" },
  apex: { overallScore: 61, marketShare: 22, revenueGrowth: -3.2, engagement: 42, productCount: 3, startingPrice: 109, rating: 3.2, socialScore: 44, sentiment: 38, lastUpdated: "Jul 07" },
  vortex: { overallScore: 78, marketShare: 18, revenueGrowth: 8.7, engagement: 78, productCount: 3, startingPrice: 89, rating: 4.5, socialScore: 76, sentiment: 76, lastUpdated: "Jul 08" },
  pinn: { overallScore: 70, marketShare: 15, revenueGrowth: 2.1, engagement: 62, productCount: 3, startingPrice: 19, rating: 4.1, socialScore: 58, sentiment: 62, lastUpdated: "Jul 06" },
  strat: { overallScore: 42, marketShare: 10, revenueGrowth: -1.5, engagement: 28, productCount: 3, startingPrice: 49, rating: 2.9, socialScore: 22, sentiment: 14, lastUpdated: "Jul 05" },
  core: { overallScore: 66, marketShare: 7, revenueGrowth: 5.3, engagement: 58, productCount: 3, startingPrice: 39, rating: 4.2, socialScore: 62, sentiment: 68, lastUpdated: "Jul 08" },
};

const CMP_GROWTH_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const CMP_GROWTH_DATA = {
  nova: [210, 224, 236, 248, 262, 271, 284],
  apex: [220, 218, 215, 210, 206, 202, 198],
  vortex: [118, 126, 132, 140, 148, 152, 156],
  pinn: [124, 126, 128, 130, 131, 133, 134],
  strat: [102, 100, 98, 96, 94, 91, 88],
  core: [58, 61, 63, 66, 68, 70, 72],
};

const RADAR_AXES = [
  { key: "overallScore", label: "Overall Score", max: 100 },
  { key: "engagement", label: "Engagement", max: 100 },
  { key: "sentiment", label: "Sentiment", max: 100 },
  { key: "socialScore", label: "Social Media", max: 100 },
  { key: "marketShare", label: "Market Share", max: 35 },
  { key: "rating", label: "Rating", max: 5 },
];

const METRIC_TABS = [
  { key: "overallScore", label: "Overall Score", unit: "/100", max: 100 },
  { key: "marketShare", label: "Market Share", unit: "%", max: 35 },
  { key: "revenueGrowth", label: "Revenue Growth", unit: "%", max: 15 },
  { key: "engagement", label: "Engagement", unit: "/100", max: 100 },
  { key: "rating", label: "Customer Rating", unit: "/5", max: 5 },
  { key: "socialScore", label: "Social Media", unit: "/100", max: 100 },
];

const CMP_REASONS = {
  nova: "Highest overall score (92), fastest revenue growth (+12.4%), and dominant market share (28%).",
  apex: "Mid-range score despite large market share, dragged by declining revenue and low sentiment.",
  vortex: "Strong growth trajectory and developer adoption with solid engagement and sentiment scores.",
  pinn: "Stable SMB-focused growth, good rating, solid sentiment — but limited scale.",
  strat: "Lowest satisfaction and negative sentiment offset any pricing advantage.",
  core: "Youngest player with strong organic growth and competitive pricing — high upside potential.",
};

const CMP_INSIGHTS = {
  leader: {
    overallScore: "nova",
    marketShare: "nova",
    revenueGrowth: "nova",
    engagement: "nova",
    rating: "nova",
    socialScore: "nova",
    startingPrice: "pinn",
    sentiment: "vortex",
  },
  recommendations: [
    { icon: "target", text: "Prioritize competing with ShoeZone on AI tooling — they lead every key metric and are accelerating." },
    { icon: "lightbulb", text: "Stridexboot's churn and declining sentiment creates a clear opportunity to capture their mid-market customer base." },
    { icon: "handshake", text: "Aeropulse's developer-first model and Salesforce partnership is creating an ecosystem moat — watch for enterprise expansion." },
    { icon: "payments", text: "FluxRunner's low $19 entry price is a proven SMB acquisition lever — consider matching or undercutting for trials." },
    { icon: "warning", text: "MotionX is in free-fall — their customers are actively looking for alternatives. Immediate outreach campaign is advised." },
    { icon: "rocket_launch", text: "Velocity One's SEO advantage and quality positioning is underestimated — their organic growth warrants monitoring." },
  ],
};

function RadarChart({ ids }) {
  const [hovId, setHovId] = useState(null);
  const W = 360, H = 310, cx = W / 2, cy = H / 2 + 10, R = 118;
  const n = RADAR_AXES.length;
  const angle = (i) => ((2 * Math.PI * i) / n) - Math.PI / 2;
  const pt = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const toScore = (id, axisIdx) => {
    const m = CMP_METRICS[id];
    const ax = RADAR_AXES[axisIdx];
    return Math.min((m[ax.key] || 0) / ax.max, 1);
  };
  const polygon = (id) => RADAR_AXES.map((_, i) => { const r = toScore(id, i) * R; return pt(i, r); }).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xs mx-auto">
      {levels.map(lv => (
        <polygon key={lv} points={RADAR_AXES.map((_, i) => { const [x, y] = pt(i, R * lv); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(" ")} fill="none" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {RADAR_AXES.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x.toFixed(1)} y2={y.toFixed(1)} stroke="#e2e8f0" strokeWidth="1" />; })}
      {RADAR_AXES.map((ax, i) => {
        const [x, y] = pt(i, R + 18);
        const anchor = x < cx - 2 ? "end" : x > cx + 2 ? "start" : "middle";
        return <text key={i} x={x.toFixed(1)} y={y.toFixed(1)} textAnchor={anchor} dominantBaseline="middle" fontSize="8.5" fontWeight="700" fill="#94a3b8">{ax.label}</text>;
      })}
      {ids.map(id => {
        const isHov = hovId === id;
        const isDim = hovId && !isHov;
        return (
          <g key={id} onMouseEnter={() => setHovId(id)} onMouseLeave={() => setHovId(null)} style={{ cursor: "pointer" }}>
            <polygon points={polygon(id)} fill={CMP_COLORS[id]} fillOpacity={isHov ? 0.22 : 0.1} stroke={CMP_COLORS[id]} strokeWidth={isHov ? 2.5 : 1.5} opacity={isDim ? 0.2 : 1} style={{ transition: "all 0.2s" }} />
          </g>
        );
      })}
    </svg>
  );
}

function MetricBarChart({ ids, metric, unit, max }) {
  const [hovId, setHovId] = useState(null);
  const sorted = [...ids].sort((a, b) => (CMP_METRICS[b][metric] || 0) - (CMP_METRICS[a][metric] || 0));
  const W = 340, barH = 26, gap = 8, pL = 72, pR = 52, pT = 8;
  const H = pT + sorted.length * (barH + gap);
  const toX = (v) => pL + Math.max(0, (v / max)) * (W - pL - pR);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {sorted.map((id, i) => {
        const v = CMP_METRICS[id][metric] || 0;
        const y = pT + i * (barH + gap);
        const bW = Math.max(3, toX(Math.abs(v)) - pL);
        const isHov = hovId === id;
        const barColor = v < 0 ? "#F43F5E" : CMP_COLORS[id];
        return (
          <g key={id} onMouseEnter={() => setHovId(id)} onMouseLeave={() => setHovId(null)} style={{ cursor: "pointer" }}>
            <text x={pL - 6} y={y + barH / 2} textAnchor="end" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="#475569">{CMP_NAMES[id]}</text>
            <rect x={pL} y={y} width={bW} height={barH} rx="4" fill={barColor} opacity={isHov ? 1 : 0.82} style={{ transition: "all 0.2s" }} />
            <text x={pL + bW + 5} y={y + barH / 2} dominantBaseline="middle" fontSize="9" fontWeight="800" fill={barColor}>{v > 0 ? "+" : ""}{v}{unit}</text>
          </g>
        );
      })}
    </svg>
  );
}

function GrowthTrendLines({ ids }) {
  const [hovId, setHovId] = useState(null);
  const W = 400, H = 180, pL = 36, pR = 12, pT = 10, pB = 28;
  const cW = W - pL - pR, cH = H - pT - pB;
  const allVals = ids.flatMap(id => CMP_GROWTH_DATA[id] || []);
  const minV = Math.min(...allVals) - 5, maxV = Math.max(...allVals) + 5;
  const toX = (i) => pL + (i / (CMP_GROWTH_MONTHS.length - 1)) * cW;
  const toY = (v) => pT + cH - ((v - minV) / (maxV - minV)) * cH;
  const grids = [minV, Math.round((minV + maxV) / 2), maxV].map(Math.round);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {grids.map(v => (
        <g key={v}>
          <line x1={pL} y1={toY(v)} x2={pL + cW} y2={toY(v)} stroke="#f1f5f9" strokeWidth="1" />
          <text x={pL - 4} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="7.5" fill="#94a3b8" fontWeight="600">{v}K</text>
        </g>
      ))}
      {CMP_GROWTH_MONTHS.map((m, i) => <text key={m} x={toX(i)} y={pT + cH + 14} textAnchor="middle" fontSize="7.5" fill="#94a3b8" fontWeight="600">{m}</text>)}
      {ids.map(id => {
        const data = CMP_GROWTH_DATA[id];
        if (!data) return null;
        const pts = data.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
        const isHov = hovId === id;
        const isDim = hovId && !isHov;
        return (
          <g key={id} onMouseEnter={() => setHovId(id)} onMouseLeave={() => setHovId(null)} style={{ cursor: "pointer" }}>
            <polyline points={pts} fill="none" stroke={CMP_COLORS[id]} strokeWidth={isHov ? 2.5 : 1.5} strokeLinejoin="round" strokeLinecap="round" opacity={isDim ? 0.15 : 1} style={{ transition: "all 0.2s" }} />
            {isHov && data.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={CMP_COLORS[id]} />)}
            {isHov && (() => { const last = data[data.length - 1]; return <text x={toX(data.length - 1) + 5} y={toY(last)} dominantBaseline="middle" fontSize="8" fontWeight="800" fill={CMP_COLORS[id]}>{last}K</text>; })()}
          </g>
        );
      })}
    </svg>
  );
}

function CompareDonutChart({ ids }) {
  const [hovSeg, setHovSeg] = useState(null);
  const total = ids.reduce((s, id) => s + (CMP_METRICS[id]?.marketShare || 0), 0);
  const cx = 80, cy = 80, r = 62, inner = 38;
  let cumAngle = -90;
  const segs = ids.map(id => {
    const share = CMP_METRICS[id]?.marketShare || 0;
    const angle = (share / Math.max(total, 1)) * 360;
    const start = cumAngle;
    cumAngle += angle;
    return { id, share, start, end: cumAngle, angle };
  });
  const arc = (seg) => {
    const [x1, y1] = polar(cx, cy, r, seg.start);
    const [x2, y2] = polar(cx, cy, r, seg.end);
    const [ix1, iy1] = polar(cx, cy, inner, seg.end);
    const [ix2, iy2] = polar(cx, cy, inner, seg.start);
    const large = seg.angle > 180 ? 1 : 0;
    return `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} L${ix1.toFixed(1)},${iy1.toFixed(1)} A${inner},${inner} 0 ${large},0 ${ix2.toFixed(1)},${iy2.toFixed(1)} Z`;
  };
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-40 flex-shrink-0">
        {segs.map(seg => {
          const isHov = hovSeg === seg.id;
          const isDim = hovSeg && !isHov;
          return <path key={seg.id} d={arc(seg)} fill={CMP_COLORS[seg.id]} opacity={isDim ? 0.2 : isHov ? 1 : 0.85} style={{ transition: "all 0.2s", cursor: "pointer" }} onMouseEnter={() => setHovSeg(seg.id)} onMouseLeave={() => setHovSeg(null)} />;
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="14" fontWeight="900" fill="#1e293b">{hovSeg ? CMP_METRICS[hovSeg].marketShare : total}%</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="700">{hovSeg ? CMP_NAMES[hovSeg] : "Total Share"}</text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {ids.map(id => (
          <div key={id} className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 cursor-pointer" onMouseEnter={() => setHovSeg(id)} onMouseLeave={() => setHovSeg(null)}>
            <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: CMP_COLORS[id] }} />
            <span className={hovSeg === id ? "text-slate-900 font-bold" : ""}>{CMP_NAMES[id]}</span>
            <span className="font-mono text-slate-400 ml-auto">{CMP_METRICS[id]?.marketShare}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareScoreCard({ id, rank }) {
  const m = CMP_METRICS[id];
  const R = 22, r = 14, circum = 2 * Math.PI * R;
  const scorePct = m.overallScore / 100;
  const medal = rank === 1
    ? <span className="inline-flex items-center gap-0.5 text-amber-600 font-extrabold text-[10px]"><Ic name="military_tech" size={14} /> #{rank}</span>
    : rank === 2
      ? <span className="inline-flex items-center gap-0.5 text-slate-400 font-extrabold text-[10px]"><Ic name="military_tech" size={14} /> #{rank}</span>
      : rank === 3
        ? <span className="inline-flex items-center gap-0.5 text-amber-800 font-extrabold text-[10px]"><Ic name="military_tech" size={14} /> #{rank}</span>
        : null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black" style={{ background: CMP_COLORS[id] }}>{CMP_INITS[id]}</div>
          <div>
            <p className="text-xs font-extrabold text-slate-800">{CMP_NAMES[id]}</p>
            {medal && <span className="text-[10px]">{medal}</span>}
          </div>
        </div>
        <svg viewBox="0 0 52 52" className="w-12 h-12">
          <circle cx="26" cy="26" r={R} fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle cx="26" cy="26" r={R} fill="none" stroke={CMP_COLORS[id]} strokeWidth="6" strokeDasharray={`${(scorePct * circum).toFixed(1)} ${circum.toFixed(1)}`} strokeDashoffset={circum / 4} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
          <text x="26" y="26" textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="900" fill={CMP_COLORS[id]}>{m.overallScore}</text>
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "Market Share", val: `${m.marketShare}%` },
          { label: "Growth", val: `${m.revenueGrowth > 0 ? "+" : ""}${m.revenueGrowth}%`, color: m.revenueGrowth >= 0 ? "#0D9488" : "#F43F5E" },
          { label: "Rating", val: `${m.rating} ★` },
          { label: "Sentiment", val: `${m.sentiment}%` },
        ].map(kpi => (
          <div key={kpi.label} className="bg-slate-50 rounded-lg px-2 py-1.5">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{kpi.label}</p>
            <p className="text-[11px] font-extrabold mt-0.5" style={{ color: kpi.color || "#1e293b" }}>{kpi.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardTable({ ids }) {
  const ranked = [...ids].sort((a, b) => CMP_METRICS[b].overallScore - CMP_METRICS[a].overallScore);
  const medal = (i) =>
    i === 0 ? <Ic name="military_tech" size={16} className="text-amber-500" />
      : i === 1 ? <Ic name="military_tech" size={16} className="text-slate-400" />
        : i === 2 ? <Ic name="military_tech" size={16} className="text-amber-800" />
          : null;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-3 px-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest w-8">#</th>
            <th className="py-3 px-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Competitor</th>
            <th className="py-3 px-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Score</th>
            <th className="py-3 px-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Share</th>
            <th className="py-3 px-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Growth</th>
            <th className="py-3 px-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Top Reason</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ranked.map((id, i) => {
            const m = CMP_METRICS[id];
            const isTop = i === 0;
            return (
              <tr key={id} className={`hover:bg-slate-50/70 transition ${isTop ? "bg-indigo-50/50" : ""}`}>
                <td className="py-3 px-4 text-sm">{medal(i) || <span className="text-[11px] font-bold text-slate-400">#{i + 1}</span>}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg flex items-center justify-center text-white text-[9px] font-black" style={{ background: CMP_COLORS[id] }}>{CMP_INITS[id]}</div>
                    <span className={`text-xs font-extrabold ${isTop ? "text-indigo-700" : "text-slate-700"}`}>{CMP_NAMES[id]}</span>
                    {isTop && <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-bold">Top Competitor</span>}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-xs font-extrabold" style={{ color: CMP_COLORS[id] }}>{m.overallScore}</span>
                </td>
                <td className="py-3 px-4 text-center text-xs font-bold text-slate-600">{m.marketShare}%</td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-xs font-extrabold ${m.revenueGrowth >= 0 ? "text-teal-600" : "text-rose-500"}`}>{m.revenueGrowth >= 0 ? "+" : ""}{m.revenueGrowth}%</span>
                </td>
                <td className="py-3 px-4 text-[10px] text-slate-500 max-w-[220px] leading-snug">{CMP_REASONS[id]?.split(".")[0]}.</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function InsightPanel({ ids }) {
  const metricLabels = { overallScore: "Overall Score", marketShare: "Market Share", revenueGrowth: "Revenue Growth", engagement: "Engagement", rating: "Customer Rating", socialScore: "Social Media", startingPrice: "Pricing (Lowest)", sentiment: "Brand Sentiment" };
  const leaders = Object.entries(CMP_INSIGHTS.leader)
    .filter(([, lid]) => ids.includes(lid))
    .map(([metric, lid]) => ({ metric, label: metricLabels[metric] || metric, leader: lid }));
  return (
    <div className="space-y-5">
      {/* Category leaders */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-1.5">{<Ic name="trophy" />} Category Leaders</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {leaders.map(({ metric, label, leader }) => (
            <div key={metric} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm space-y-1.5">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">{label}</p>
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-md flex items-center justify-center text-white text-[8px] font-black" style={{ background: CMP_COLORS[leader] }}>{CMP_INITS[leader]}</div>
                <span className="text-[10px] font-extrabold text-slate-800">{CMP_NAMES[leader]}</span>
              </div>
              <p className="text-[9px] font-bold" style={{ color: CMP_COLORS[leader] }}>
                {metric === "startingPrice" ? `$${CMP_METRICS[leader][metric]}/mo` : metric === "rating" ? `${CMP_METRICS[leader][metric]} ★` : metric === "revenueGrowth" ? `+${CMP_METRICS[leader][metric]}%` : `${CMP_METRICS[leader][metric]}${metric === "marketShare" ? "%" : metric === "overallScore" || metric === "engagement" || metric === "socialScore" || metric === "sentiment" ? "/100" : ""}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & weaknesses grid */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-1.5">{<Ic name="bar_chart" />} Strengths vs. Weaknesses</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ids.map(id => {
            const m = CMP_METRICS[id];
            const strengths = Object.entries({ "Score": m.overallScore >= 75, "Growth": m.revenueGrowth >= 5, "Engagement": m.engagement >= 70, "Sentiment": m.sentiment >= 60, "Rating": m.rating >= 4.0 }).filter(([, v]) => v).map(([k]) => k);
            const weaknesses = Object.entries({ "Score": m.overallScore < 65, "Growth": m.revenueGrowth < 0, "Engagement": m.engagement < 50, "Sentiment": m.sentiment < 40, "Rating": m.rating < 3.5 }).filter(([, v]) => v).map(([k]) => k);
            return (
              <div key={id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-lg flex items-center justify-center text-white text-[9px] font-black" style={{ background: CMP_COLORS[id] }}>{CMP_INITS[id]}</div>
                  <span className="text-xs font-extrabold text-slate-800">{CMP_NAMES[id]}</span>
                </div>
                <div className="space-y-1.5">
                  {strengths.length > 0 && <div className="flex flex-wrap gap-1">{strengths.map(s => <span key={s} className="text-[9px] bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded font-bold">✓ {s}</span>)}</div>}
                  {weaknesses.length > 0 && <div className="flex flex-wrap gap-1">{weaknesses.map(w => <span key={w} className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded font-bold">✗ {w}</span>)}</div>}
                  {strengths.length === 0 && weaknesses.length === 0 && <span className="text-[10px] text-slate-400 italic">Balanced across all metrics</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic recommendations */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-700 mb-3 flex items-center gap-1.5">{<Ic name="target" />} Strategic Recommendations</h4>
        <div className="space-y-2">
          {CMP_INSIGHTS.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
              <span className="flex-shrink-0 mt-0.5 text-indigo-500"><Ic name={rec.icon} size={16} /></span>
              <p className="text-[11px] text-slate-600 leading-relaxed">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareView() {
  const [selIds, setSelIds] = useState(CMP_IDS);
  const [activeMetric, setActiveMetric] = useState("overallScore");
  const [activeVizTab, setActiveVizTab] = useState("radar");
  const activeMeta = METRIC_TABS.find(t => t.key === activeMetric) || METRIC_TABS[0];
  const ranked = [...selIds].sort((a, b) => CMP_METRICS[b].overallScore - CMP_METRICS[a].overallScore);
  const VIZ_TABS = [
    { id: "radar", label: "Radar" },
    { id: "bar", label: "Bar Chart" },
    { id: "trend", label: "Growth Trend" },
    { id: "share", label: "Market Share" },
  ];
  const TABLE_METRICS = [
    { key: "overallScore", label: "Overall Score", render: (id) => <span className="font-extrabold" style={{ color: CMP_COLORS[id] }}>{CMP_METRICS[id].overallScore}<span className="text-slate-400 font-normal">/100</span></span> },
    { key: "marketShare", label: "Market Share", render: (id) => <span className="font-bold text-slate-700">{CMP_METRICS[id].marketShare}%</span> },
    { key: "revenueGrowth", label: "Revenue Growth", render: (id) => <span className={`font-extrabold ${CMP_METRICS[id].revenueGrowth >= 0 ? "text-teal-600" : "text-rose-500"}`}>{CMP_METRICS[id].revenueGrowth >= 0 ? "+" : ""}{CMP_METRICS[id].revenueGrowth}%</span> },
    { key: "engagement", label: "Customer Engagement", render: (id) => <div className="flex items-center gap-2"><div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${CMP_METRICS[id].engagement}%` }} /></div><span className="text-[10px] font-bold text-slate-600">{CMP_METRICS[id].engagement}</span></div> },
    { key: "productCount", label: "Product Count", render: (id) => <span className="font-bold text-slate-700">{CMP_METRICS[id].productCount}</span> },
    { key: "startingPrice", label: "Starting Price", render: (id) => <span className="font-bold text-slate-700">${CMP_METRICS[id].startingPrice}/mo</span> },
    { key: "rating", label: "Customer Rating", render: (id) => <span className="font-bold text-amber-500">{CMP_METRICS[id].rating} ★</span> },
    { key: "socialScore", label: "Social Performance", render: (id) => <div className="flex items-center gap-2"><div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full" style={{ width: `${CMP_METRICS[id].socialScore}%` }} /></div><span className="text-[10px] font-bold text-slate-600">{CMP_METRICS[id].socialScore}</span></div> },
    { key: "sentiment", label: "Brand Sentiment", render: (id) => <div className="flex items-center gap-2"><div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${CMP_METRICS[id].sentiment}%`, background: CMP_METRICS[id].sentiment >= 60 ? "#0D9488" : CMP_METRICS[id].sentiment >= 40 ? "#D97706" : "#F43F5E" }} /></div><span className="text-[10px] font-bold text-slate-600">{CMP_METRICS[id].sentiment}%</span></div> },
    { key: "lastUpdated", label: "Last Updated", render: (id) => <span className="text-[10px] text-slate-400 font-semibold">{CMP_METRICS[id].lastUpdated}</span> },
  ];
  return (
    <div className="px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">Competitor Comparison Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">Select competitors to compare across all key performance dimensions.</p>
        </div>
        <div className="text-[10px] text-slate-400 font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
          {selIds.length} / {CMP_IDS.length} selected
        </div>
      </div>

      {/* Competitor Multi-Select */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Select Competitors to Compare</p>
        <div className="flex flex-wrap gap-2">
          {CMP_IDS.map(id => {
            const isSelected = selIds.includes(id);
            return (
              <button key={id} onClick={() => setSelIds(prev => isSelected ? (prev.length > 1 ? prev.filter(x => x !== id) : prev) : [...prev, id])} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition ${isSelected ? "border-transparent text-white shadow-sm" : "border-slate-200 text-slate-500 bg-slate-50 hover:border-slate-300"}`} style={isSelected ? { background: CMP_COLORS[id] } : {}}>
                <span className={`h-4 w-4 rounded-md flex items-center justify-center text-[8px] font-black ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>{CMP_INITS[id]}</span>
                {CMP_NAMES[id]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Score Cards */}
      <div>
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Performance Score Cards</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {ranked.map((id, i) => <CompareScoreCard key={id} id={id} rank={i + 1} />)}
        </div>
      </div>

      {/* Full Metrics Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <p className="text-xs font-extrabold text-slate-800">{<Ic name="list_alt" />} Full Metrics Comparison Table</p>
          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold ml-auto">{selIds.length} competitors</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 min-w-[140px]">Metric</th>
                {selIds.map(id => (
                  <th key={id} className="py-3 px-4 text-[9px] font-extrabold uppercase tracking-widest text-center min-w-[110px]" style={{ color: CMP_COLORS[id] }}>
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-5 w-5 rounded-md flex items-center justify-center text-white text-[8px] font-black" style={{ background: CMP_COLORS[id] }}>{CMP_INITS[id]}</div>
                      {CMP_NAMES[id]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TABLE_METRICS.map(({ key, label, render }) => (
                <tr key={key} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-bold text-slate-500 sticky left-0 bg-white text-[10px] uppercase tracking-wider">{label}</td>
                  {selIds.map(id => (
                    <td key={id} className="py-3 px-4 text-center">{render(id)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Visualizations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs font-extrabold text-slate-800">{<Ic name="bar_chart" />} Interactive Visualizations</p>
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {VIZ_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveVizTab(tab.id)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition ${activeVizTab === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeVizTab === "radar" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-500 mb-2">Hover a competitor polygon to isolate it</p>
              <RadarChart ids={selIds} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-500 mb-3 uppercase tracking-widest">Axes Reference</p>
              <div className="space-y-2">
                {RADAR_AXES.map(ax => (
                  <div key={ax.key} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-semibold">{ax.label}</span>
                    <div className="flex gap-2">
                      {selIds.map(id => {
                        const v = CMP_METRICS[id][ax.key];
                        const pct = Math.round((v / ax.max) * 100);
                        return <span key={id} className="font-mono font-bold" style={{ color: CMP_COLORS[id] }}>{pct}%</span>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {selIds.map(id => (
                  <div key={id} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: CMP_COLORS[id] }} />
                    {CMP_NAMES[id]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeVizTab === "bar" && (
          <div className="space-y-4">
            <div className="flex items-center gap-1 flex-wrap">
              {METRIC_TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveMetric(tab.key)} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${activeMetric === tab.key ? "border-indigo-400 text-indigo-700 bg-indigo-50" : "border-slate-200 text-slate-500 bg-white hover:border-slate-300"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-500 mb-3">{activeMeta.label} — sorted highest to lowest</p>
              <MetricBarChart ids={selIds} metric={activeMetric} unit={activeMeta.unit} max={activeMeta.max} />
            </div>
          </div>
        )}

        {activeVizTab === "trend" && (
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-3">Customer count growth Jan–Jul 2025. Hover a line to isolate.</p>
            <div className="bg-slate-50 rounded-xl p-4">
              <GrowthTrendLines ids={selIds} />
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {selIds.map(id => (
                <div key={id} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                  <div className="h-2 w-4 rounded-sm" style={{ background: CMP_COLORS[id] }} />
                  {CMP_NAMES[id]}
                  <span className="font-mono text-slate-400">{CMP_GROWTH_DATA[id]?.[CMP_GROWTH_DATA[id].length - 1]}K</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeVizTab === "share" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[10px] font-bold text-slate-500 mb-3">Market share distribution. Hover to inspect.</p>
              <CompareDonutChart ids={selIds} />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">Share Breakdown</p>
              {[...selIds].sort((a, b) => CMP_METRICS[b].marketShare - CMP_METRICS[a].marketShare).map(id => (
                <div key={id} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-600">{CMP_NAMES[id]}</span>
                    <span style={{ color: CMP_COLORS[id] }}>{CMP_METRICS[id].marketShare}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${CMP_METRICS[id].marketShare / 35 * 100}%`, background: CMP_COLORS[id] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Competitive Leaderboard */}
      <div className="space-y-3">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{<Ic name="trophy" />} Competitive Ranking Leaderboard</p>
        <LeaderboardTable ids={selIds} />
      </div>

      {/* AI Insights & Recommendations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-xs font-extrabold text-slate-800">{<Ic name="smart_toy" />} AI-Powered Insights &amp; Recommendations</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Generated from competitive intelligence across all selected brands.</p>
        </div>
        <InsightPanel ids={selIds} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SVG ICONS FOR ACTIONS & TABS
   ═══════════════════════════════════════════════════════════ */
const IconOverview = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const IconPlus = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconUserCheck = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const IconRadar = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 12L18.5 5.5" />
    <path d="M12 3a9 9 0 017 15" opacity="0.4" />
  </svg>
);

const IconFileText = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconCompare = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="8" height="18" rx="1" />
    <rect x="14" y="3" width="8" height="18" rx="1" />
  </svg>
);


/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const navigate = useNavigate();

  // Primary State
  const [activeNav, setActiveNav] = useState("dashboard"); // options: dashboard, list, workspace, reports, compare
  const [selectedComp, setSelectedComp] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [fastApiUrl] = useState(import.meta.env.VITE_FASTAPI_URL || "https://ai-backend-zfq1.onrender.com");

  // Dynamic analysis result state from FastAPI
  const [analysisResult, setAnalysisResult] = useState(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // New Competitor Input Form State
  const [newCompName, setNewCompName] = useState("");
  const [newCompWebsiteUrl, setNewCompWebsiteUrl] = useState("");

  // Sequential Agent Workspace Progress State
  const [activeStep, setActiveStep] = useState(1); // steps: 1 to 5

  // Pipeline Step Loadings (simulated sequentially while API runs)
  const [stepStates, setStepStates] = useState({
    1: "idle",
    2: "idle",
    3: "idle",
    4: "idle",
    5: "idle"
  });

  // Assistant states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // Comparison State
  const [compareCompA, setCompareCompA] = useState("");
  const [compareCompB, setCompareCompB] = useState("");
  const [compareDataA, setCompareDataA] = useState(null);
  const [compareDataB, setCompareDataB] = useState(null);

  // Fetch competitors dynamically from Supabase/FastAPI on load
  useEffect(() => {
    const loadCompetitors = async () => {
      try {
        const res = await fetch(`${fastApiUrl}/competitors`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (data && data.length > 0) {
          setCompetitors(data);
          return;
        }
      } catch (err) {
        console.warn("FastAPI competitors fetch failed, falling back to Supabase direct query:", err);
      }

      try {
        const { data, error } = await supabase.from("competitors").select("*");
        if (error) throw error;
        if (data && data.length > 0) {
          setCompetitors(data);
        }
      } catch (err) {
        console.warn("Supabase direct query failed, relying on mock fallback list:", err);
        // Load default seed data
        setCompetitors([
          { id: "nova", name: "ShoeZone", website_url: "https://novatech.co" },
          { id: "apex", name: "Stridexboot", website_url: "https://apex.com" },
          { id: "vortex", name: "Aeropulse", website_url: "https://vortex.ai" }
        ]);
      }
    };
    loadCompetitors();
  }, [fastApiUrl]);

  // Load existing analysis report when competitor is selected
  useEffect(() => {
    if (!selectedComp) return;
    const fetchExistingReport = async () => {
      setStepStates({ 1: "idle", 2: "idle", 3: "idle", 4: "idle", 5: "idle" });
      setAnalysisResult(null);
      setChatMessages([
        {
          sender: "agent",
          text: `Interrogation thread established for ${selectedComp.name}. If already analyzed, the dossier will load immediately. Otherwise, click "Run Sequential Pipeline" to execute the AI analyze pipeline.`,
          time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      try {
        const { data, error } = await supabase
          .from("reports")
          .select("*")
          .eq("competitor_id", selectedComp.id)
          .order("created_at", { ascending: false })
          .limit(1);
        if (error) throw error;
        if (data && data.length > 0) {
          const report = data[0];
          const restored = {
            tracking: report.tracking_data,
            intelligence: report.intelligence_data,
            strategy: report.strategy_data,
            recommendation: report.recommendation_data,
            prediction: report.prediction_data
          };
          setAnalysisResult(restored);
          setStepStates({ 1: "done", 2: "done", 3: "done", 4: "done", 5: "done" });
          setChatMessages(prev => [...prev, {
            sender: "agent",
            text: `Loaded existing analysis report compiled on ${new Date(report.created_at).toLocaleString()}. You can navigate the tabs below or query me directly!`,
            time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      } catch (err) {
        console.warn("Failed to load existing report:", err);
      }
    };
    fetchExistingReport();
  }, [selectedComp]);

  // Load Comparison Data
  useEffect(() => {
    const fetchCompareData = async () => {
      if (compareCompA) {
        const { data } = await supabase.from("reports").select("*").eq("competitor_id", compareCompA).order("created_at", { ascending: false }).limit(1);
        setCompareDataA(data && data.length > 0 ? data[0] : null);
      } else {
        setCompareDataA(null);
      }
    };
    fetchCompareData();
  }, [compareCompA]);

  useEffect(() => {
    const fetchCompareData = async () => {
      if (compareCompB) {
        const { data } = await supabase.from("reports").select("*").eq("competitor_id", compareCompB).order("created_at", { ascending: false }).limit(1);
        setCompareDataB(data && data.length > 0 ? data[0] : null);
      } else {
        setCompareDataB(null);
      }
    };
    fetchCompareData();
  }, [compareCompB]);

  // Reset agent workspace upon competitor selection
  const handleSelectCompetitor = (comp) => {
    setSelectedComp(comp);
    setActiveNav("workspace");
  };

  const handleBackToRoster = () => {
    setSelectedComp(null);
    setActiveNav("list");
  };

  // Add Competitor to Supabase
  const handleAddCompetitorSubmit = async (e) => {
    e.preventDefault();
    if (!newCompName.trim()) return;

    const newComp = {
      name: newCompName,
      website_url: newCompWebsiteUrl || "https://example.com"
    };

    try {
      const { data, error } = await supabase.from("competitors").insert([newComp]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        setCompetitors([...competitors, data[0]]);
      }
    } catch (err) {
      console.error("Failed to save competitor to Supabase database:", err);
      // Fallback local list update
      const fallbackComp = {
        id: Math.random().toString(),
        name: newCompName,
        website_url: newCompWebsiteUrl || "https://example.com"
      };
      setCompetitors([...competitors, fallbackComp]);
    }

    setNewCompName("");
    setNewCompWebsiteUrl("");
    setShowAddModal(false);
  };

  // Trigger analysis call to FastAPI backend on Render
  const runFullPipeline = async () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setAnalysisResult(null);
    setStepStates({ 1: "idle", 2: "idle", 3: "idle", 4: "idle", 5: "idle" });

    // Step 1 Ingestion starts
    setActiveStep(1);
    setStepStates(prev => ({ ...prev, 1: "loading" }));

    // Start API request in parallel
    let responseData = null;
    let apiError = null;

    const apiPromise = fetch(`${fastApiUrl}/analyze/${selectedComp.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        responseData = data;
      })
      .catch(err => {
        apiError = err;
      });

    // We simulate step progress updates for user feedback while backend executes
    await new Promise(r => setTimeout(r, 5000));
    setStepStates(prev => ({ ...prev, 1: "done" }));

    setActiveStep(2);
    setStepStates(prev => ({ ...prev, 2: "loading" }));
    await new Promise(r => setTimeout(r, 5000));
    setStepStates(prev => ({ ...prev, 2: "done" }));

    setActiveStep(3);
    setStepStates(prev => ({ ...prev, 3: "loading" }));
    await new Promise(r => setTimeout(r, 5000));
    setStepStates(prev => ({ ...prev, 3: "done" }));

    setActiveStep(4);
    setStepStates(prev => ({ ...prev, 4: "loading" }));
    await new Promise(r => setTimeout(r, 5000));
    setStepStates(prev => ({ ...prev, 4: "done" }));

    setActiveStep(5);
    setStepStates(prev => ({ ...prev, 5: "loading" }));

    try {
      await apiPromise;
    } catch (e) {
      apiError = e;
    }

    if (apiError || !responseData) {
      console.error("Analysis API failed:", apiError);
      setStepStates({ 1: "idle", 2: "idle", 3: "idle", 4: "idle", 5: "idle" });
      setPipelineRunning(false);
      alert("Analysis failed to run or timed out: " + (apiError?.message || "Please make sure Render server is active and try again"));
      return;
    }

    setAnalysisResult(responseData);

    // Save report in Supabase database
    try {
      const { error } = await supabase.from("reports").insert([{
        competitor_id: selectedComp.id,
        tracking_data: responseData.tracking,
        intelligence_data: responseData.intelligence,
        strategy_data: responseData.strategy,
        recommendation_data: responseData.recommendation,
        prediction_data: responseData.prediction
      }]);
      if (error) throw error;
    } catch (err) {
      console.warn("Failed to save report in Supabase database:", err);
    }

    setStepStates(prev => ({ ...prev, 5: "done" }));
    setPipelineRunning(false);
    setChatMessages(prev => [...prev, {
      sender: "agent",
      text: `Analysis complete! Live report dossier compiled and saved to Supabase. Navigate through the Agent steps below to inspect results!`,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // Compile full unified report modal
  const triggerReportCompilation = async () => {
    if (!analysisResult) {
      alert("Please run the analysis pipeline first before compiling the dossier report.");
      return;
    }
    setShowReportModal(true);
  };

  // Step 2 Data Interrogator Chat Q&A
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !analysisResult) return;

    const userQ = chatInput;
    setChatInput("");
    setStepStates(prev => ({ ...prev, 2: "loading" }));

    // Append user question
    const userMsg = {
      sender: "user",
      text: userQ,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);

    let reply = "";
    const qLower = userQ.toLowerCase();

    // Query analysis intelligence results to respond semantically
    const intel = analysisResult.intelligence;
    if (qLower.includes("summary") || qLower.includes("overview")) {
      reply = `Based on the crawler data, here is the intelligence summary:\n\n${intel.summary}`;
    } else if (qLower.includes("pricing") || qLower.includes("cost") || qLower.includes("tier")) {
      reply = `Here are the pricing insights extracted from public landing page audits:\n\n${intel.pricing_insights}`;
    } else if (qLower.includes("engagement") || qLower.includes("traffic") || qLower.includes("social")) {
      reply = `Customer engagement audit parameters:\n\n${intel.engagement_insights}`;
    } else if (qLower.includes("campaign") || qLower.includes("ad") || qLower.includes("marketing")) {
      reply = `Active marketing campaign audits:\n\n${intel.campaign_insights}`;
    } else if (qLower.includes("growth") || qLower.includes("signal") || qLower.includes("future")) {
      reply = `Detected growth signals and category momentum indicators:\n\n${intel.growth_signal}`;
    } else if (qLower.includes("weak") || qLower.includes("vulnerab") || qLower.includes("risk")) {
      reply = `Key competitor weaknesses audited:\n\n${analysisResult.strategy.core_weaknesses}`;
    } else {
      reply = `Here is the comprehensive intelligence summary for ${selectedComp.name}:\n\n${intel.summary}\n\nAsk me specifically about pricing, campaign ad metrics, weaknesses, or growth signals.`;
    }

    setChatMessages(prev => [...prev, {
      sender: "agent",
      text: reply,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }]);
    setStepStates(prev => ({ ...prev, 2: "done" }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-display { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/*  Enterprise Bright/White Sidebar */}
      <Sidebar active={activeNav} onNav={setActiveNav} selectedCompName={selectedComp?.name} />

      {/* Main Workspace Layout */}
      <main className="flex-1 min-w-0" style={{ marginLeft: "240px" }}>

        {/* Topbar Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="font-display text-lg font-extrabold text-slate-900 tracking-tight leading-none">
              Aetheris Category Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-1">Professional competitive intelligence and automated multi-agent analysis.</p>
          </div>

          <div className="flex items-center gap-3">
            {selectedComp && (
              <button
                id="btn-report-compile"
                onClick={triggerReportCompilation}
                disabled={generatingReport}
                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all active:scale-[0.98]"
              >
                {generatingReport ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Compiling Report...
                  </>
                ) : (
                  <>
                    <IconFileText />
                    Compile Dossier Report
                  </>
                )}
              </button>
            )}
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════
           VIEW 1: UNIFIED GLOBAL DASHBOARD (POST-LOGIN)
           ═══════════════════════════════════════════════════════════ */}
        {activeNav === "dashboard" && (
          <div className="px-8 py-8 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">Market Landscape</h2>
              <p className="text-xs text-slate-500 mt-1">Overview indicators parsed from tracked brand actions.</p>
            </div>

            {/* KPI Overview Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Monitored Brands", val: "6", change: "+1 in 30d", isPos: true },
                { title: "Ingestion Volume", val: "1.4M", change: "420 events/hr", isPos: true },
                { title: "Aggregated Share", val: "100%", change: "Stable Index", isPos: true },
                { title: "Volatile Segments", val: "2", change: "+1 alert flag", isPos: false },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider leading-none">{kpi.title}</p>
                  <p className="font-display text-2xl font-extrabold text-slate-900 mt-2">{kpi.val}</p>
                  <span className={`text-[10px] font-bold mt-1.5 inline-block ${kpi.isPos ? "text-teal-600" : "text-rose-500"}`}>{kpi.change}</span>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Donut Chart Card */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-sm font-extrabold text-slate-800 mb-1">Market Share Distribution</h3>
                <p className="text-[11px] text-slate-400 mb-6">Percentage allocation based on ARR.</p>
                <DonutChart />
              </div>

              {/* Bar Chart Card */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-sm font-extrabold text-slate-800 mb-1">Competitor Performance Comparison</h3>
                <p className="text-[11px] text-slate-400 mb-6">Calculated scoring metrics across 3 category spaces.</p>
                <BarChart />
              </div>
            </div>

            {/* Alert List and Traffic Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* alerts */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-display text-sm font-extrabold text-slate-800">Recent Category Alerts</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Critical competitive indicators ingested within 24 hours.</p>
                </div>

                <div className="space-y-3">
                  {GLOBAL_ALERTS.map((al, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                      <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${al.alertType === "danger"
                        ? "bg-rose-500"
                        : al.alertType === "warning"
                          ? "bg-amber-500"
                          : al.alertType === "success"
                            ? "bg-teal-500"
                            : "bg-indigo-500"
                        }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800">{al.company}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{al.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">{al.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* traffic comparisons */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-display text-sm font-extrabold text-slate-800">Traffic & Sentiment Scores</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Active visitor estimation vs customer satisfaction ratings.</p>
                </div>

                <div className="space-y-3">
                  {competitors.slice(0, 4).map(c => {
                    const d = COMP_DETAILS[c.id] || COMP_DETAILS.nova;
                    const init = getInitials(c.name);
                    const color = getColor(c.id || c.name);
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCompetitor(c)}
                        className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition"
                      >
                        <div className="flex items-center gap-2.5 w-32 shrink-0">
                          <span
                            className="flex h-6.5 w-6.5 items-center justify-center rounded text-white text-[9px] font-extrabold"
                            style={{ background: color }}
                          >
                            {init}
                          </span>
                          <span className="font-bold text-slate-800">{c.name}</span>
                        </div>

                        <div className="flex-1 px-4">
                          <div className="h-2 rounded-full bg-slate-100 relative">
                            <div className="h-full rounded-full transition-all" style={{ width: `${d.satisfaction}%`, background: color }} />
                          </div>
                        </div>

                        <div className="text-right w-24 shrink-0 font-mono text-[11px]">
                          <span className="text-slate-900 font-bold">{d.revenue}</span>
                          <span className="text-slate-400 ml-1">ARR</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           VIEW 2: COMPETITOR ROSTER
           ═══════════════════════════════════════════════════════════ */}
        {activeNav === "list" && (
          <div className="px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">Competitor Directory</h2>
                <p className="text-xs text-slate-500 mt-1">Select an active entity to construct the analysis workspace pipeline.</p>
              </div>

              <button
                id="btn-open-add-modal"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 transition"
              >
                <IconPlus />
                Add Competitor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitors.map(c => {
                const init = getInitials(c.name);
                const color = getColor(c.id || c.name);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCompetitor(c)}
                    className="bg-white border border-slate-250/70 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-450 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white text-sm font-extrabold font-display shadow-sm shadow-black/10"
                            style={{ background: color }}
                          >
                            {init}
                          </span>
                          <div>
                            <h3 className="font-display font-extrabold text-slate-800 text-base leading-none">{c.name}</h3>
                            <p className="text-[10px] text-slate-400 font-medium mt-1.5 truncate max-w-[180px]">
                              {c.website_url}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="mt-6 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-500 hover:text-white text-xs font-bold text-slate-700 transition pointer-events-none"
                    >
                      <span>Analyze</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3 w-3">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           VIEW 3: DEDICATED PIPELINE WORKSPACE FOR COMPETITOR
           ═══════════════════════════════════════════════════════════ */}
        {activeNav === "workspace" && selectedComp && (
          <div className="px-8 py-6 space-y-6">

            {/* Header row details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToRoster}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-800 transition"
                >
                  Roster
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-slate-800">{selectedComp.name}</span>
                <span className="text-slate-350 font-mono text-[10px] truncate max-w-[200px]">({selectedComp.website_url})</span>
              </div>

              <button
                onClick={runFullPipeline}
                disabled={pipelineRunning}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-white shadow-sm transition disabled:opacity-50"
              >
                {pipelineRunning ? "Running Pipeline..." : "Run Sequential Pipeline"}
              </button>
            </div>

            {/* Pipeline Stage Steps Bar (Placed ABOVE the Display Area) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mb-3">Multi-Agent Processing Pipeline</p>

              <div className="grid grid-cols-5 gap-2 relative">
                {[
                  { step: 1, label: "1. Competitor Tracking Agent", desc: "Ingest Tracking" },
                  { step: 2, label: "2. Data Intelligence Agent", desc: "Interrogate AI" },
                  { step: 3, label: "3. Strategic Analysis Agent", desc: "Strategy Action" },
                  { step: 4, label: "4. Recommendation Agent", desc: "Ad Campaigns" },
                  { step: 5, label: "5. Market Prediction Agent", desc: "Trend Forecast" },
                ].map((s) => {
                  const state = stepStates[s.step];
                  const isCurrent = activeStep === s.step;

                  return (
                    <button
                      key={s.step}
                      onClick={() => setActiveStep(s.step)}
                      className={`text-left p-3 rounded-xl border transition relative ${isCurrent
                        ? "bg-teal-500/5 border-teal-500/60 shadow-sm"
                        : "bg-slate-50/50 border-slate-100 hover:border-slate-300"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-extrabold uppercase ${isCurrent ? "text-teal-600" : "text-slate-500"}`}>
                          {s.label.split(" Agent")[0]}
                        </span>
                        {state === "loading" && (
                          <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
                        )}
                        {state === "done" && (
                          <span className="text-teal-600 text-[10px] font-bold">✓</span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-455 mt-1 truncate">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage Component Box (Display Area is now BELOW Steps Bar) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[580px] shadow-sm">

              {/* Spinner loader */}
              {!analysisResult && !pipelineRunning && (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <span className="text-4xl text-slate-350">{<Ic name="smart_toy" />}</span>
                  <h3 className="font-display font-extrabold text-slate-800 text-base">Crawl Database Pending</h3>
                  <p className="text-xs text-slate-500 max-w-sm text-center leading-relaxed">
                    This brand has no compiled analysis reports. Click "Run Sequential Pipeline" above to initialize crawler analysis.
                  </p>
                </div>
              )}

              {pipelineRunning && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <svg className="animate-spin h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-xs font-mono text-slate-500">Agent executing pipeline protocols (may take 30+ seconds)...</p>
                  <div className="w-64 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-500 h-full animate-pulse" style={{ width: `${activeStep * 20}%` }} />
                  </div>
                </div>
              )}

              {/* STEP 1: COMPETITOR TRACKING LOGS */}
              {analysisResult && !pipelineRunning && activeStep === 1 && (
                <TrackingChartsPanel analysisResult={analysisResult} />
              )}

              {/* STEP 2: DATA INTELLIGENCE AGENT */}
              {analysisResult && !pipelineRunning && activeStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-800 text-sm">Interrogate Data Intelligence Agent</h3>
                    <p className="text-xs text-slate-400">Query and read core metrics compiled from parsed data channels.</p>
                  </div>

                  {/* Highlights Summary Box */}
                  <div className="bg-teal-500/5 border border-teal-500/25 rounded-2xl p-5 text-xs text-slate-700 leading-relaxed">
                    <h4 className="font-extrabold text-teal-800 uppercase tracking-widest text-[9px] mb-2">AI Summary Analysis</h4>
                    <p>{analysisResult.intelligence?.summary}</p>
                  </div>

                  {/* Enhanced analytics cards with embedded mini SVG charts */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Engagement Insights</p>
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Trend</span>
                      </div>
                      <EngagementLineChart />
                      <div className="flex items-center gap-3 text-[9px] font-bold">
                        <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded-sm" style={{ background: "#4F46E5" }} /> Likes</div>
                        <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded-sm" style={{ background: "#0D9488" }} /> Comments</div>
                        <div className="flex items-center gap-1"><div className="h-1.5 w-3 rounded-sm" style={{ background: "#D97706" }} /> Shares</div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">{analysisResult.intelligence?.engagement_insights}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pricing Metrics</p>
                        <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Bar</span>
                      </div>
                      <PricingMiniBar />
                      <p className="text-[10px] text-slate-500 leading-snug">{analysisResult.intelligence?.pricing_insights}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Growth Signals</p>
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Area</span>
                      </div>
                      <GrowthAreaChart />
                      <div className="text-[9px] font-bold text-indigo-600 text-right">+284K customers tracked</div>
                      <p className="text-[10px] text-slate-500 leading-snug">{analysisResult.intelligence?.growth_signal}</p>
                    </div>

                  </div>
                </div>
              )}


              {/* STEP 3: STRATEGIC ANALYSIS AGENT */}
              {analysisResult && !pipelineRunning && activeStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-800 text-sm">Strategic Priority Cards</h3>
                    <p className="text-xs text-slate-400">Positioning and core roadmaps calculated by Strategic Analysis Agent.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5"> Market Positioning</h4>
                      <p className="leading-relaxed">{analysisResult.strategy?.market_positioning}</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1.5">{<Ic name="target" />} Target Audience</h4>
                      <p className="leading-relaxed">{analysisResult.strategy?.target_audience}</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 border-teal-500/20 bg-teal-500/[0.01]">
                      <h4 className="font-bold text-teal-800 flex items-center gap-1.5"> Core Strengths</h4>
                      <p className="leading-relaxed text-slate-700">{analysisResult.strategy?.core_strengths}</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2 border-rose-500/20 bg-rose-500/[0.01]">
                      <h4 className="font-bold text-rose-800 flex items-center gap-1.5">{<Ic name="warning" />} Core Weaknesses</h4>
                      <p className="leading-relaxed text-slate-700">{analysisResult.strategy?.core_weaknesses}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs space-y-2">
                    <h4 className="font-bold text-slate-800">{<Ic name="rocket_launch" />} Category Growth Strategy</h4>
                    <p className="leading-relaxed text-slate-655">{analysisResult.strategy?.growth_strategy}</p>
                  </div>

                  {/* Market Position Perceptual Scatter Plot */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="mb-3">
                      <h4 className="font-bold text-slate-800 text-xs"> Market Positioning Map</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Perceptual scatter — Price Level (x-axis) vs Quality Score (y-axis). Bubble size reflects relative market share. Hover to focus a competitor.</p>
                    </div>
                    <MarketPositionScatter />
                  </div>

                  {/* SWOT KPI Strip */}
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs mb-3">{<Ic name="bar_chart" />} Competitive KPI Overview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Competitive Strength", score: 74, color: "#4F46E5", icon: "", desc: "Relative strength index vs market avg." },
                        { label: "Weakness Index", score: 28, color: "#F43F5E", icon: "warning", desc: "Identified vulnerability exposure score" },
                        { label: "Opportunity Score", score: 82, color: "#0D9488", icon: "target", desc: "Addressable gap in competitor market" },
                        { label: "Market Position", score: 67, color: "#D97706", icon: "trending_up", desc: "Percentile rank within the category" },
                      ].map(kpi => (
                        <div key={kpi.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500"><Ic name={kpi.icon} size={16} /></span>
                            <span className="text-xs font-extrabold font-mono" style={{ color: kpi.color }}>{kpi.score}</span>
                          </div>
                          <p className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wide leading-tight">{kpi.label}</p>
                          <p className="text-[9px] text-slate-400 leading-snug">{kpi.desc}</p>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${kpi.score}%`, background: kpi.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 4: RECOMMENDATION AGENT */}
              {analysisResult && !pipelineRunning && activeStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-800 text-sm">Campaign Messaging & Creative Deck</h3>
                    <p className="text-xs text-slate-400">Defensive counters and ad positioning generated by Recommendation Agent.</p>
                  </div>

                  {/* AI Recommendations Assistant Chatbot */}
                  <div className="bg-indigo-500/[0.03] border border-indigo-500/20 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                        <Ic name="smart_toy" size={17} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">AI Recommendations Assistant</p>
                        <p className="text-[10px] text-indigo-600 font-semibold">Strategic insights powered by Recommendation Agent</p>
                      </div>
                      <span className="ml-auto flex items-center gap-1 text-[9px] font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Online
                      </span>
                    </div>

                    {/* Quick prompt chips */}
                    <div className="flex gap-2 flex-wrap items-center">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Quick Ask:</span>
                      {[
                        "What counter-campaign should we launch?",
                        "How should we position against this brand?",
                        "What pricing adjustments do you recommend?",
                        "Identify the biggest opportunity here.",
                      ].map(q => (
                        <button
                          key={q}
                          onClick={() => setChatInput(q)}
                          className="text-[10px] bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 hover:text-indigo-900 px-2.5 py-1 rounded-full transition font-semibold"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    {/* Message display */}
                    <div className="border border-indigo-200/50 rounded-xl bg-white/60 p-4 h-[260px] overflow-y-auto space-y-3">
                      {chatMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                          <Ic name="smart_toy" size={32} className="text-indigo-200" />
                          <p className="text-[11px] text-slate-400 font-semibold">Ask the AI for strategic recommendations based on the competitor analysis.</p>
                        </div>
                      )}
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${msg.sender === "user"
                              ? "bg-slate-900 text-white rounded-tr-none"
                              : "bg-white text-slate-700 border border-indigo-200/60 rounded-tl-none whitespace-pre-line shadow-sm"
                              }`}
                          >
                            <p>{msg.text}</p>
                            <span className={`text-[9px] block text-right mt-1.5 ${msg.sender === "user" ? "text-slate-400" : "text-slate-400"}`}>{msg.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input form */}
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={`Ask for strategic recommendations on ${selectedComp?.name || "this competitor"}...`}
                        className="flex-1 bg-white border border-indigo-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
                      />
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 rounded-xl transition shadow-sm"
                      >
                        <Ic name="send" size={14} className="text-white" />
                        Ask AI
                      </button>
                    </form>
                  </div>


                  {/* Campaign Messaging Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="bg-teal-500/[0.02] border border-teal-500/20 rounded-2xl p-5 space-y-2">
                      <h4 className="font-extrabold text-teal-800 uppercase tracking-widest text-[9px]">Counter Campaign Strategy</h4>
                      <p className="text-slate-700 leading-relaxed font-semibold">{analysisResult.recommendation?.counter_campaign_strategy}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                      <h4 className="font-extrabold text-slate-700 uppercase tracking-widest text-[9px]">Positioning Strategy</h4>
                      <p className="text-slate-600 leading-relaxed">{analysisResult.recommendation?.positioning_strategy}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                      <h4 className="font-extrabold text-slate-700 uppercase tracking-widest text-[9px]">Pricing Strategy</h4>
                      <p className="text-slate-600 leading-relaxed">{analysisResult.recommendation?.pricing_strategy}</p>
                    </div>

                    <div className="bg-indigo-500/[0.02] border border-indigo-500/25 rounded-2xl p-5 space-y-2">
                      <h4 className="font-extrabold text-indigo-800 uppercase tracking-widest text-[9px]">Content Opportunity</h4>
                      <p className="text-slate-650 leading-relaxed">{analysisResult.recommendation?.content_opportunity}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: MARKET PREDICTION AGENT */}
              {analysisResult && !pipelineRunning && activeStep === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-800 text-sm">Trend Forecast Index</h3>
                    <p className="text-xs text-slate-400">Likely next moves and category warnings compiled by Market Prediction Agent.</p>
                  </div>

                  {/* Threat Level Badge */}
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Direct Threat Level</p>
                      <h4 className="font-display text-lg font-black text-slate-850 mt-1">Category Threat Risk</h4>
                    </div>
                    <div>
                      {(() => {
                        const threat = (analysisResult.prediction?.threat_level || "low").toLowerCase();
                        if (threat.includes("high")) {
                          return <span className="bg-rose-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm uppercase">{<Ic name="error" />} High Threat</span>;
                        } else if (threat.includes("medium")) {
                          return <span className="bg-amber-500 text-slate-900 font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm uppercase">{<Ic name="warning" />} Medium Threat</span>;
                        } else {
                          return <span className="bg-teal-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm uppercase">{<Ic name="check_circle" />} Low Threat</span>;
                        }
                      })()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1">{<Ic name="auto_awesome" />} Likely Next Move</h4>
                      <p className="leading-relaxed">{analysisResult.prediction?.likely_next_move}</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1"><Ic name="build" size={15} /> Future Direction</h4>
                      <p className="leading-relaxed">{analysisResult.prediction?.future_product_direction}</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                      <h4 className="font-bold text-slate-800 flex items-center gap-1">{<Ic name="bar_chart" />} Trend Shift</h4>
                      <p className="leading-relaxed">{analysisResult.prediction?.marketing_trend_shift}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
           VIEW 4: REPORTS LIST VIEW
           ═══════════════════════════════════════════════════════════ */}
        {activeNav === "reports" && (
          <div className="px-8 py-8 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">Report Repository</h2>
              <p className="text-xs text-slate-500 mt-1">Access compiled intelligence reports on monitored market competitors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {competitors.map(c => {
                const init = getInitials(c.name);
                const color = getColor(c.id || c.name);
                return (
                  <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-350 shadow-sm transition">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
                          style={{ background: color }}
                        >
                          {init}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{c.name} Intelligence Dossier</h4>
                          <p className="text-[10px] text-slate-455 font-semibold font-mono">ID: {c.id || "Unindexed"}</p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 space-y-1.5 border-t border-slate-100 pt-3">
                        <p>· Domain URL: <strong className="text-slate-700">{c.website_url}</strong></p>
                        <p>· Storage Path: <strong>Direct Supabase JSONB</strong></p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectCompetitor(c)}
                      className="mt-5 w-full py-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-500 hover:text-white text-xs font-bold text-slate-700 transition"
                    >
                      Open Pipeline to Compile Report
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* ═══════════════════════════════════════════════════════════
           VIEW 5: COMPARISON VIEW (PAGE 3)
           ═══════════════════════════════════════════════════════════ */}
        {activeNav === "compare" && <CompareView />}

      </main>

      {/* ═══════════════════════════════════════════════════════════
               MODAL 1: DYNAMIC ADD COMPETITOR
               ═══════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-scaleUp text-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">Add Custom Competitor</h3>
                <p className="text-xs text-slate-400">Initialize a new competitor for pipeline tracking.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-800 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCompetitorSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. STRIDEX"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold">Website URL</label>
                <input
                  type="url"
                  required
                  value={newCompWebsiteUrl}
                  onChange={(e) => setNewCompWebsiteUrl(e.target.value)}
                  className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="https://stridex-two.vercel.app/"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition shadow-md"
              >
                Create & Ingest Brand
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
               MODAL 2: PRINTABLE UNIFIED REPORT DOSSIER VIEWER
               ═══════════════════════════════════════════════════════════ */}
      {showReportModal && selectedComp && analysisResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl relative animate-scaleUp print-container text-slate-800">

            {/* Header controls */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 no-print">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 font-display">Unified Intelligence Dossier</h3>
                <p className="text-xs text-slate-455">Ready for team export and executive delivery.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md"
                >
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition border border-slate-200"
                >
                  Close Dossier
                </button>
              </div>
            </div>

            {/* Print Area Contents */}
            <div className="space-y-6">

              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-850 pb-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 font-display">AETHERIS STRATEGY GROUP</h1>
                  <p className="text-xs text-teal-600 uppercase tracking-widest font-mono font-bold mt-0.5">CONFIDENTIAL COMPETITOR RESEARCH DOSSIER</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono">COMPILED: {new Date().toLocaleDateString()} · CRAWLER CLASS: MULTI-AGENT PIPELINE</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 font-mono bg-slate-100 px-3 py-1 rounded">
                    {analysisResult.prediction?.threat_level || "Low"}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">THREAT LEVEL</p>
                </div>
              </div>

              {/* Profile details grid */}
              <div className="grid grid-cols-2 gap-4 text-xs py-4 bg-slate-50 rounded-xl px-4 border border-slate-200">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Company Name</p>
                  <p className="font-extrabold text-slate-900 mt-0.5">{selectedComp.name}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Website URL</p>
                  <p className="font-semibold text-slate-700 mt-0.5 truncate">{selectedComp.website_url}</p>
                </div>
              </div>

              {/* Section 1 Ingest */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h4 className="text-xs uppercase tracking-widest text-teal-600 font-extrabold font-mono">1. COMPETITOR TRACKING SUMMARY</h4>
                <div className="text-xs space-y-1 text-slate-700">
                  <p>· <strong>Audited Products:</strong> {
                    analysisResult.tracking?.products?.map(p => typeof p === "object" && p !== null ? (p.name || p.title || JSON.stringify(p)) : p).filter(Boolean).join(", ") || "None listed"
                  }</p>
                  <p>· <strong>Marketing Campaigns:</strong> {
                    analysisResult.tracking?.campaigns?.map(c => typeof c === "object" && c !== null ? (c.title || c.messaging || JSON.stringify(c)) : c).filter(Boolean).join(", ") || "None detected"
                  }</p>
                  <p>· <strong>Recent Social Activity:</strong> {
                    analysisResult.tracking?.social_posts?.map(post => typeof post === "object" && post !== null ? (post.text || post.content || JSON.stringify(post)) : post).filter(Boolean).join(" | ") || "None audited"
                  }</p>
                </div>
              </div>

              {/* Section 2 Campaigns */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h4 className="text-xs uppercase tracking-widest text-teal-600 font-extrabold font-mono">2. DATA INTELLIGENCE AUDIT</h4>
                <div className="text-xs space-y-2 text-slate-700">
                  <p>· <strong>Summary:</strong> {analysisResult.intelligence?.summary}</p>
                  <p>· <strong>Engagement Insights:</strong> {analysisResult.intelligence?.engagement_insights}</p>
                  <p>· <strong>Pricing Insights:</strong> {analysisResult.intelligence?.pricing_insights}</p>
                  <p>· <strong>Growth Signals:</strong> {analysisResult.intelligence?.growth_signal}</p>
                </div>
              </div>

              {/* Section 3 Strategy */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h4 className="text-xs uppercase tracking-widest text-teal-600 font-extrabold font-mono">3. STRATEGIC ANALYSIS</h4>
                <div className="text-xs space-y-2 text-slate-700">
                  <p>· <strong>Market Positioning:</strong> {analysisResult.strategy?.market_positioning}</p>
                  <p>· <strong>Core Strengths:</strong> {analysisResult.strategy?.core_strengths}</p>
                  <p>· <strong>Core Weaknesses:</strong> {analysisResult.strategy?.core_weaknesses}</p>
                  <p>· <strong>Growth Strategy:</strong> {analysisResult.strategy?.growth_strategy}</p>
                </div>
              </div>

              {/* Section 4 Recommendations */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <h4 className="text-xs uppercase tracking-widest text-teal-600 font-extrabold font-mono">4. RECOMMENDED COUNTERS</h4>
                <div className="text-xs space-y-2 text-slate-700">
                  <p>· <strong>Counter Campaign Strategy:</strong> {analysisResult.recommendation?.counter_campaign_strategy}</p>
                  <p>· <strong>Positioning Actions:</strong> {analysisResult.recommendation?.positioning_strategy}</p>
                  <p>· <strong>Pricing Strategy:</strong> {analysisResult.recommendation?.pricing_strategy}</p>
                </div>
              </div>

              {/* Section 5 Predictions */}
              <div className="space-y-2 pb-4">
                <h4 className="text-xs uppercase tracking-widest text-teal-600 font-extrabold font-mono">5. FUTURE PREDICTIONS</h4>
                <div className="text-xs space-y-2 text-slate-700">
                  <p>· <strong>Likely Next Move:</strong> {analysisResult.prediction?.likely_next_move}</p>
                  <p>· <strong>Product Direction:</strong> {analysisResult.prediction?.future_product_direction}</p>
                  <p>· <strong>Trend Shift:</strong> {analysisResult.prediction?.marketing_trend_shift}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-8 border-t border-slate-200 flex justify-between text-[9px] text-slate-400 font-mono">
                <p>COMPILER AUDIT: Aetheris Autonomous Engine</p>
                <p>CONFIDENTIALITY LEVEL: SECURE DOSSIER</p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div >
  );
}

export function Sidebar({ active, onNav, selectedCompName }) {
  const navItems = [
    { id: "dashboard", label: "Overview", icon: IconOverview },
    { id: "list", label: "Competitor Directory", icon: IconUserCheck },
    {
      id: "workspace",
      label: "Agent Workspace",
      icon: IconRadar,
      disabled: !selectedCompName,
      badge: selectedCompName ? "Active" : null
    },
    { id: "reports", label: "Unified Reports", icon: IconFileText },
    { id: "compare", label: "Comparison View", icon: IconCompare }
  ];

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-white border-r border-slate-200 shrink-0 fixed top-0 left-0 z-40 h-full">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-200">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-teal-450 shadow-md shadow-black/10">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.3" opacity="0.6" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </span>
        <div>
          <span className="font-display font-extrabold text-slate-800 tracking-tight text-sm leading-none">Aetheris</span>
          <p className="text-[10px] text-teal-655 font-bold mt-0.5">Multi-Agent Workspace</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Navigation</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 text-left ${isActive
                ? "bg-slate-100 text-slate-900 shadow-sm border border-slate-200/40"
                : isDisabled
                  ? "text-slate-300 cursor-not-allowed opacity-50"
                  : "text-slate-500 hover:text-slate-850 hover:bg-slate-50"
                }`}
            >
              <Icon />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${isActive ? "bg-teal-500/15 text-teal-700" : "bg-teal-600/10 text-teal-650"
                  }`}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="border-t border-slate-200 px-4 py-4 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-inner">JD</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800">Jane Doe</p>
            <p className="text-[10px] text-slate-450 truncate">strategy@aetheris.ai</p>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" title="System Online" />
        </div>
      </div>
    </aside>
  );
}

