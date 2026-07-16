import { useEffect, useRef } from "react";

interface BOSVisualizationProps {
  mode?: "hero" | "diagram";
  className?: string;
}

const PILLARS = [
  { label: "People", icon: "👥", color: "#2563EB" },
  { label: "Processes", icon: "⚙️", color: "#2563EB" },
  { label: "Technology", icon: "💻", color: "#2563EB" },
  { label: "Data", icon: "📊", color: "#2563EB" },
  { label: "AI", icon: "🤖", color: "#2563EB" },
];

function HeroFlow({ visible }: { visible: boolean }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center h-full min-h-[480px] py-8"
      aria-label="Business Operating System diagram: People, Processes, Technology, Data, and AI connect into a central Business Operating System hub"
    >
      <style>{`
        @keyframes bos-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); transform: scale(1); }
          50% { box-shadow: 0 0 0 14px rgba(37,99,235,0); transform: scale(1.03); }
        }
        @keyframes bos-flow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes bos-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bos-connector-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .bos-pulse { animation: bos-pulse 2.8s ease-in-out infinite; }
        .bos-pillar { animation: bos-fadein 0.5s ease both; }
        .bos-connector { animation: bos-connector-glow 2s ease-in-out infinite; }
      `}</style>

      <div className="flex flex-col items-center gap-0 w-full max-w-[260px]">
        {PILLARS.map((pillar, i) => (
          <div
            key={pillar.label}
            className="flex flex-col items-center w-full"
          >
            <div
              className="bos-pillar flex items-center gap-3 px-5 py-3 rounded-xl border bg-white shadow-sm w-full"
              style={{
                animationDelay: visible ? `${i * 100}ms` : "9999s",
                opacity: visible ? undefined : 0,
                borderColor: "rgba(37,99,235,0.25)",
                background: "linear-gradient(135deg,#fff 80%,rgba(37,99,235,0.06))",
              }}
            >
              <span className="text-xl" aria-hidden="true">{pillar.icon}</span>
              <span className="font-semibold text-[#111827] text-sm">{pillar.label}</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 bos-connector" style={{ animationDelay: `${i * 300}ms` }} />
            </div>

            {i < PILLARS.length - 1 && (
              <div className="flex flex-col items-center py-1">
                <svg width="2" height="20" aria-hidden="true">
                  <line
                    x1="1" y1="0" x2="1" y2="20"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="bos-connector"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}

        <div className="flex flex-col items-center py-2">
          <svg width="2" height="24" aria-hidden="true">
            <line x1="1" y1="0" x2="1" y2="24" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 4" className="bos-connector" />
          </svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path d="M7 10L0 0h14L7 10z" fill="#2563EB" opacity="0.7" />
          </svg>
        </div>

        <div
          className="bos-pulse flex flex-col items-center justify-center rounded-2xl px-6 py-5 text-center w-full"
          style={{
            background: "linear-gradient(135deg,#1d4ed8,#2563EB)",
            border: "2px solid rgba(37,99,235,0.5)",
            animationDelay: visible ? "600ms" : "9999s",
          }}
        >
          <span className="text-2xl mb-1" aria-hidden="true">⚡</span>
          <span className="text-white font-bold text-sm leading-tight">Business Operating</span>
          <span className="text-white font-bold text-sm">System</span>
          <span className="text-blue-200 text-xs mt-1">People · Process · Technology · Data · AI</span>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl" aria-hidden="true">
        <div className="absolute top-8 right-8 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle,rgba(37,99,235,0.08),transparent)" }} />
        <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full" style={{ background: "radial-gradient(circle,rgba(37,99,235,0.06),transparent)" }} />
      </div>
    </div>
  );
}

function DiagramHub({ visible }: { visible: boolean }) {
  const nodes = [
    { label: "People", icon: "👥", angle: -90, r: 110 },
    { label: "Processes", icon: "⚙️", angle: -18, r: 110 },
    { label: "Technology", icon: "💻", angle: 54, r: 110 },
    { label: "Data", icon: "📊", angle: 126, r: 110 },
    { label: "AI", icon: "🤖", angle: 198, r: 110 },
  ];

  const cx = 160;
  const cy = 160;

  return (
    <div className="flex items-center justify-center w-full" aria-label="Business Operating System hub connecting People, Processes, Technology, Data, and AI">
      <style>{`
        @keyframes hub-pulse {
          0%, 100% { r: 42; opacity: 0.15; }
          50% { r: 52; opacity: 0.05; }
        }
        @keyframes line-dash {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        .hub-ring { animation: hub-pulse 2.5s ease-in-out infinite; }
        .hub-line { animation: line-dash 2s linear infinite; }
        .hub-node { animation: bos-fadein 0.6s ease both; }
      `}</style>

      <svg
        viewBox="0 0 320 320"
        width="320"
        height="320"
        className="overflow-visible"
        role="img"
        aria-hidden="true"
      >
        <circle cx={cx} cy={cy} fill="rgba(37,99,235,0.08)" className="hub-ring" />
        <circle cx={cx} cy={cy} r={44} fill="url(#hubGrad)" />
        <defs>
          <radialGradient id="hubGrad" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>
        </defs>
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">Business</text>
        <text x={cx} y={cy + 7} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">Operating</text>
        <text x={cx} y={cy + 20} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">System</text>

        {nodes.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const nx = cx + node.r * Math.cos(rad);
          const ny = cy + node.r * Math.sin(rad);
          const dx = nx - cx;
          const dy = ny - cy;
          const len = Math.sqrt(dx * dx + dy * dy);
          const lx1 = cx + (dx / len) * 46;
          const ly1 = cy + (dy / len) * 46;
          const lx2 = cx + (dx / len) * (node.r - 24);
          const ly2 = cy + (dy / len) * (node.r - 24);

          return (
            <g key={node.label}>
              <line
                x1={lx1} y1={ly1} x2={lx2} y2={ly2}
                stroke="#2563EB"
                strokeWidth="1.5"
                strokeDasharray="5 3"
                opacity={visible ? 0.6 : 0}
                className="hub-line"
                style={{ animationDelay: `${i * 200}ms`, transition: "opacity 0.5s" }}
              />
              <circle cx={nx} cy={ny} r={22} fill="white" stroke="rgba(37,99,235,0.3)" strokeWidth="1.5"
                opacity={visible ? 1 : 0}
                style={{ transition: `opacity 0.5s ${i * 100}ms` }}
              />
              <text x={nx} y={ny - 3} textAnchor="middle" fontSize="13" aria-hidden="true">{node.icon}</text>
              <text x={nx} y={ny + 14} textAnchor="middle" fill="#111827" fontSize="8" fontWeight="600">{node.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function BOSVisualization({ mode = "hero", className = "" }: BOSVisualizationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visRef = useRef(false);
  const [visible, setVisible] = [visRef.current, (v: boolean) => { visRef.current = v; }];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          ref.current?.setAttribute("data-visible", "true");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`bos-viz-root ${className}`} data-visible="false">
      <style>{`
        .bos-viz-root[data-visible="true"] .bos-pillar { opacity: 1 !important; }
        .bos-viz-root[data-visible="true"] .hub-node { opacity: 1 !important; }
      `}</style>
      {mode === "hero" ? (
        <HeroFlow visible={true} />
      ) : (
        <DiagramHub visible={true} />
      )}
    </div>
  );
}
