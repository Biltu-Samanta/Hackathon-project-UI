import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "./dashboard.jsx";

/* ═══════════════════════════════════════════════════════════
   STATIC AI STRATEGY DATA
═══════════════════════════════════════════════════════════ */
const STRATEGIES = [
  {
    id: 1,
    category: "Pricing",
    priority: "High",
    impact: "Revenue +18%",
    emoji: "💡",
    title: "Capture the Mid-Market Gap",
    summary: "NovaTech's recent Enterprise price hike to $199/mo has opened a significant mid-market gap. Launch a $49/mo SMB tier to intercept their churned customers before Apex Corp does.",
    steps: [
      "Audit current feature set for an SMB-ready subset",
      "Launch a $49/mo 'Growth' plan with 3 core features",
      "Target NovaTech's churned users via LinkedIn & Google retargeting",
      "Set up a 14-day free trial funnel with onboarding email sequence",
    ],
    tags: ["Pricing", "SMB", "Acquisition"],
    effort: "Medium",
    timeline: "30–45 days",
  },
  {
    id: 2,
    category: "Content",
    priority: "High",
    impact: "Traffic +22%",
    emoji: "📈",
    title: "Dominate Video Tutorial Content",
    summary: "All 6 tracked competitors have fewer than 50 YouTube videos. A consistent video tutorial series targeting 'how to do competitor analysis' searches could capture 15–20% additional organic traffic.",
    steps: [
      "Identify top 20 competitor analysis search queries via SEMrush",
      "Produce 10 tutorial videos covering core use cases",
      "Optimize each video with timestamps, chapters, and rich descriptions",
      "Cross-promote on LinkedIn and embed in product documentation",
    ],
    tags: ["SEO", "YouTube", "Organic Growth"],
    effort: "High",
    timeline: "60–90 days",
  },
  {
    id: 3,
    category: "Partnerships",
    priority: "Medium",
    impact: "Reach +35%",
    emoji: "🤝",
    title: "Counter VortexAI's Salesforce Integration",
    summary: "VortexAI's new Salesforce CRM partnership gives them a major enterprise distribution advantage. An equivalent HubSpot or Pipedrive integration would directly neutralize their moat.",
    steps: [
      "Evaluate HubSpot Marketplace requirements and certification process",
      "Scope a bi-directional data sync integration (2 weeks dev est.)",
      "Co-market with HubSpot via their partner newsletter (280K subscribers)",
      "Create integration-specific landing pages for SEO capture",
    ],
    tags: ["Integrations", "HubSpot", "Enterprise"],
    effort: "High",
    timeline: "45–60 days",
  },
  {
    id: 4,
    category: "Audience",
    priority: "High",
    impact: "TAM +34%",
    emoji: "🎯",
    title: "First-Mover in Mid-Market B2B",
    summary: "The mid-market B2B segment (200–1000 employees) is growing 34% YoY. None of the top 6 competitors have dedicated messaging or SKUs for this tier — you have a 90-day window.",
    steps: [
      "Create a dedicated 'Mid-Market' landing page with specific pain points",
      "Develop case studies from 2–3 mid-market pilot customers",
      "Launch targeted LinkedIn ads to companies with 200–1000 employees",
      "Build a 'teams' feature that addresses multi-seat collaboration",
    ],
    tags: ["B2B", "Mid-Market", "Product"],
    effort: "Medium",
    timeline: "30–60 days",
  },
  {
    id: 5,
    category: "SEO",
    priority: "Medium",
    impact: "Rankings +15 positions",
    emoji: "🔍",
    title: "Reclaim Lost SEO Rankings from CoreBrand",
    summary: "CoreBrand recently displaced you for 'competitor analytics' — a keyword driving ~8,400 searches/month. A content cluster strategy can recover this within 60 days.",
    steps: [
      "Publish an updated 10,000-word 'Ultimate Guide to Competitor Analytics'",
      "Build 5 supporting cluster articles targeting long-tail variations",
      "Earn 10+ backlinks via a data-driven industry report",
      "Update meta titles and schema markup across existing content",
    ],
    tags: ["SEO", "Content", "Authority"],
    effort: "Medium",
    timeline: "45–60 days",
  },
  {
    id: 6,
    category: "Social",
    priority: "Low",
    impact: "Engagement +40%",
    emoji: "📣",
    title: "LinkedIn Thought Leadership Program",
    summary: "Apex Corp's LinkedIn page is underperforming at 3.8% engagement. Launching a consistent thought leadership content program — CEO posts, data insights, industry commentary — can establish dominant brand authority.",
    steps: [
      "Identify 3 internal subject matter experts for weekly posting",
      "Create a 12-week content calendar with data posts and opinion pieces",
      "Engage with relevant industry conversations daily (30 min/day)",
      "Cross-post top performers to Instagram and Twitter/X",
    ],
    tags: ["LinkedIn", "Brand", "Thought Leadership"],
    effort: "Low",
    timeline: "Ongoing (12 weeks).",
  },
];

const SUGGESTED_QUESTIONS = [
  "Which competitor is the biggest threat this quarter?",
  "How should I respond to Apex Corp's price cut?",
  "What's the best channel to acquire NovaTech's churned users?",
  "Which market segment should I focus on next?",
  "How do I improve my SEO against CoreBrand?",
  "What product features should I prioritize to beat VortexAI?",
];

/* Mock AI responses */
const AI_REPLIES = {
  default: (q) => [
    `Great question about "${q}". Based on the competitive intelligence data I've analyzed, here's my strategic recommendation:`,
    "",
    "**Key Finding:** Your competitors are showing a pattern of over-investment in enterprise features while neglecting the growing mid-market segment (200–1,000 employees, +34% YoY growth).",
    "",
    "**Recommended Action:**",
    "1. **Immediate (0–30 days):** Audit your current positioning and identify any messaging gaps vs. the mid-market pain points",
    "2. **Short-term (30–60 days):** Launch targeted campaigns on LinkedIn to companies in this size range",
    "3. **Medium-term (60–90 days):** Develop dedicated product packaging and case studies for the segment",
    "",
    "**Risk to watch:** NovaTech is moving fast. Their latest product launch signals an enterprise focus — which ironically leaves the mid-market more open to you.",
    "",
    "Want me to dig deeper into any specific aspect of this strategy?",
  ].join("\n"),
  "Which competitor is the biggest threat this quarter?": [
    "Based on current data across all tracked competitors, **NovaTech is your #1 threat this quarter** for these reasons:",
    "",
    "📊 **Growth velocity:** +12.4% — fastest in your category",
    "🚀 **Recent moves:** Just launched 'Nova X Pro' targeting enterprise analytics",
    "💰 **Ad spend:** Estimated $400K+/month in Google Ads",
    "🔗 **Ecosystem:** Building integrations that create switching costs",
    "",
    "**However**, watch Apex Corp closely. Their 18% price cut is a desperation signal — companies that slash prices aggressively are often preparing a major product push or acquisition.",
    "",
    "**My recommendation:** Focus on the mid-market gap that NovaTech is vacating as they move upmarket. This is a 90-day window.",
  ].join("\n"),
  "How should I respond to Apex Corp's price cut?": [
    "**Don't match Apex Corp's price cut.** Here's the strategic reasoning:",
    "",
    "Price cuts are often a signal of weakness, not strength. Apex Corp's 18% reduction likely reflects one of:",
    "• Customer churn pressure (their G2 rating trends suggest this)",
    "• An upcoming product relaunch they need MRR to fund",
    "• Acquisition positioning to inflate user count metrics",
    "",
    "**Your optimal response strategy:**",
    "",
    "1. **Hold pricing** — don't race to the bottom",
    "2. **Add value** — bundle a high-perceived-value feature (AI recommendations, custom reporting) at the same price point",
    "3. **Create comparison content** — publish a transparent comparison page that highlights your stability and roadmap vs. their volatility",
    "4. **Win their churned users** — set up Google Ads targeting 'Apex Corp alternative' searches",
    "",
    "Apex Corp customers who left due to trust issues want **stability and roadmap confidence**, not just lower prices.",
  ].join("\n"),
};

const getReply = (question) => {
  return AI_REPLIES[question] || AI_REPLIES.default(question);
};

/* ═══════════════════════════════════════════════════════════
   PRIORITY BADGE
═══════════════════════════════════════════════════════════ */
const PRIORITY_STYLES = {
  High:   "bg-rose-50 text-rose-700 border border-rose-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low:    "bg-slate-100 text-slate-600 border border-slate-200",
};
const EFFORT_STYLES = {
  High:   "text-rose-600",
  Medium: "text-amber-600",
  Low:    "text-teal-600",
};

/* ═══════════════════════════════════════════════════════════
   STRATEGY CARD
═══════════════════════════════════════════════════════════ */
function StrategyCard({ s, expanded, onToggle }) {
  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-md ${expanded ? "border-teal-300 ring-1 ring-teal-200" : "border-slate-200 hover:border-slate-300"}`}
      onClick={onToggle}
    >
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{s.emoji}</span>
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${PRIORITY_STYLES[s.priority]}`}>
                  {s.priority} Priority
                </span>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md border border-teal-100">
                  {s.impact}
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-900 text-sm leading-snug">{s.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-slate-400">Effort</p>
              <p className={`text-[11px] font-bold ${EFFORT_STYLES[s.effort]}`}>{s.effort}</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none"
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${expanded ? "rotate-180" : ""}`}>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">{s.summary}</p>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mt-3">
          {s.tags.map(t => (
            <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{t}</span>
          ))}
          <span className="text-[10px] text-slate-400 ml-auto font-medium">⏱ {s.timeline}</span>
        </div>
      </div>

      {/* Expanded steps */}
      {expanded && (
        <div className="border-t border-teal-100 bg-gradient-to-b from-teal-50/40 to-white px-5 pb-5 pt-4" onClick={e => e.stopPropagation()}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-3">Action Plan</p>
          <ol className="space-y-2.5">
            {s.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold mt-0.5">{i + 1}</span>
                <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 py-2 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-500 transition-colors">
              Export Strategy →
            </button>
            <button className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CHAT MESSAGE
═══════════════════════════════════════════════════════════ */
function ChatMessage({ role, text, typing }) {
  const isAI = role === "ai";

  const renderText = (t) => {
    const lines = t.split("\n");
    return lines.map((line, i) => {
      // Bold **text**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j} className="font-bold text-slate-900">{part}</strong> : part
      );
      return (
        <p key={i} className={`${line === "" ? "h-2" : ""} text-xs leading-relaxed`}>
          {rendered}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
      {isAI ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white text-sm font-bold shadow-md shadow-teal-600/20">
          ✦
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 text-xs font-bold">
          JD
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${isAI
        ? "bg-white border border-slate-200 rounded-tl-sm"
        : "bg-teal-600 text-white rounded-tr-sm"
      }`}>
        {typing ? (
          <div className="flex items-center gap-1 py-1">
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        ) : isAI ? (
          <div className="text-slate-700 space-y-0">{renderText(text)}</div>
        ) : (
          <p className="text-xs text-white leading-relaxed">{text}</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI RECOMMENDATIONS PAGE
═══════════════════════════════════════════════════════════ */
export default function AIRecommendationsPage() {
  const [expandedId, setExpandedId]   = useState(null);
  const [filterCat, setFilterCat]     = useState("All");
  const [filterPri, setFilterPri]     = useState("All");
  const [messages, setMessages]       = useState([
    {
      role: "ai",
      text: "Hi! I'm the Aetheris AI strategist. I've analyzed all 6 competitors in your market and generated 6 strategic recommendations.\n\nAsk me anything — pricing tactics, content gaps, competitive responses, or which opportunity to pursue first. I'll give you data-backed answers.",
    },
  ]);
  const [input, setInput]             = useState("");
  const [typing, setTyping]           = useState(false);
  const bottomRef                     = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const categories = ["All", ...new Set(STRATEGIES.map(s => s.category))];
  const priorities = ["All", "High", "Medium", "Low"];

  const filtered = STRATEGIES.filter(s =>
    (filterCat === "All" || s.category === filterCat) &&
    (filterPri === "All" || s.priority === filterPri)
  );

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { role: "ai", text: getReply(text) }]);
    }, 1400 + Math.random() * 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .font-sans  { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
        .font-display { font-family: 'Manrope', system-ui, sans-serif; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .animate-bounce { animation: bounce 1s infinite; }
        .chat-fade { animation: chatFade 0.3s ease both; }
        @keyframes chatFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ── Shared Sidebar from dashboard ──────────────────── */}
      <Sidebar active="ai" />

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col" style={{ marginLeft: "224px" }}>

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 text-white text-base font-bold shadow-md shadow-teal-600/25">
                ✦
              </div>
              <div>
                <h1 className="font-display text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                  AI Recommendations
                </h1>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  6 strategies generated · Powered by Aetheris AI
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                AI Live · Updated hourly
              </span>
              <Link to="/dashboard"
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                ← Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* ── Split Layout: Strategies (left) + Chat (right) ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT — Strategy Recommendations */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <div className="px-6 py-5">

              {/* Filter bar */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {categories.map(c => (
                    <button key={c} onClick={() => setFilterCat(c)}
                      className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition-all duration-150 ${filterCat === c ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <div className="flex gap-1.5">
                  {priorities.map(p => (
                    <button key={p} onClick={() => setFilterPri(p)}
                      className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition-all duration-150 ${filterPri === p
                        ? p === "High" ? "bg-rose-600 text-white" : p === "Medium" ? "bg-amber-500 text-white" : p === "Low" ? "bg-slate-600 text-white" : "bg-slate-900 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                      {p}
                    </button>
                  ))}
                </div>
                <span className="ml-auto text-[11px] text-slate-400">{filtered.length} strategies</span>
              </div>

              {/* Summary bar */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "High Priority",   count: STRATEGIES.filter(s=>s.priority==="High").length,   color: "text-rose-600 bg-rose-50 border-rose-200"   },
                  { label: "Est. Avg Impact", count: "+24%",                                              color: "text-teal-700 bg-teal-50 border-teal-200"    },
                  { label: "Strategies Ready",count: STRATEGIES.length,                                   color: "text-slate-700 bg-slate-50 border-slate-200" },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl border p-3 ${s.color}`}>
                    <p className="text-[10px] font-semibold opacity-70 mb-0.5">{s.label}</p>
                    <p className="font-display text-xl font-extrabold">{s.count}</p>
                  </div>
                ))}
              </div>

              {/* Strategy cards */}
              <div className="space-y-3">
                {filtered.map(s => (
                  <StrategyCard key={s.id} s={s}
                    expanded={expandedId === s.id}
                    onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-slate-400">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="text-sm font-semibold">No strategies match this filter</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT — AI Chat */}
          <div className="w-96 shrink-0 flex flex-col border-l border-slate-200 bg-white">

            {/* Chat header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white text-sm font-bold">✦</div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Ask the AI Strategist</p>
                  <p className="text-[10px] text-teal-400 mt-0.5">Powered by Aetheris AI</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-[9px] text-teal-400 font-semibold">Live</span>
                </div>
              </div>
            </div>

            {/* Suggested questions */}
            <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/60">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Suggested Questions</p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED_QUESTIONS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-left text-[10px] text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-2.5 py-1.5 rounded-lg transition-colors font-medium leading-snug">
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className="chat-fade">
                  <ChatMessage role={m.role} text={m.text} />
                </div>
              ))}
              {typing && (
                <div className="chat-fade">
                  <ChatMessage role="ai" text="" typing />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-slate-200 bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about competitors, strategy, pricing…"
                  rows={2}
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2.5 resize-none text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 leading-relaxed"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || typing}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-1.5">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
