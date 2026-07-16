import { Users, Cog, Cpu, Database, Brain, Layers } from "lucide-react";
import { useRef } from "react";

const LAYERS = [
  { label: "PEOPLE",     icon: Users,    color: "#60a5fa" },
  { label: "PROCESSES",  icon: Cog,      color: "#818cf8" },
  { label: "TECHNOLOGY", icon: Cpu,      color: "#a78bfa" },
  { label: "DATA",       icon: Database, color: "#c084fc" },
  { label: "AI",         icon: Brain,    color: "#e879f9" },
];

export function BOSVisualization() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = true;

  return (
    <div
      ref={ref}
      className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f172a 0%, #162040 100%)" }}
      aria-label="Business Operating System: People, Processes, Technology, Data, and AI flow into one Business Operating System"
    >
      {/* ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.28), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3 text-center">
          Your Integrated Framework
        </p>

        <div className="flex flex-col items-center">
          {LAYERS.map(({ label, icon: Icon, color }, i) => (
            <div key={label} className="flex flex-col items-center w-full">
              {/* Layer pill */}
              <div
                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.1)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 0.45s ${i * 110}ms, transform 0.45s ${i * 110}ms`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: `${color}22` }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden="true" />
                </div>
                <span className="text-sm font-bold text-white tracking-widest">{label}</span>
                <div
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{
                    background: color,
                    animation: visible ? `bos-dot-pulse 2s ${i * 220}ms ease-in-out infinite` : "none",
                  }}
                />
              </div>

              {/* Animated connector */}
              {i < LAYERS.length - 1 && (
                <div
                  className="relative flex justify-center"
                  style={{ height: "12px", width: "2px", margin: "1px 0", background: "rgba(96,165,250,0.2)", borderRadius: "1px" }}
                >
                  <div
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      left: "-2px",
                      top: 0,
                      background: "#60a5fa",
                      animation: visible ? `bos-flow 1.0s ${i * 110 + 500}ms linear infinite` : "none",
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Arrow into BOS */}
          <div className="flex flex-col items-center" style={{ margin: "3px 0 5px" }}>
            <div className="w-0.5 h-3" style={{ background: "rgba(37,99,235,0.7)" }} />
            <div
              style={{
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: "6px solid #2563EB",
              }}
              aria-hidden="true"
            />
          </div>

          {/* BOS destination */}
          <div
            className="w-full rounded-2xl py-4 px-5 text-center border-2"
            style={{
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563EB 100%)",
              borderColor: "rgba(147,197,253,0.4)",
              boxShadow: visible ? "0 0 28px rgba(37,99,235,0.5), 0 0 56px rgba(37,99,235,0.2)" : "none",
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.94)",
              transition: "opacity 0.6s 650ms, transform 0.6s 650ms, box-shadow 0.6s 650ms",
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Layers className="h-5 w-5 text-white shrink-0" aria-hidden="true" />
              <div className="text-white font-black text-sm tracking-wide leading-snug">
                BUSINESS OPERATING SYSTEM
              </div>
            </div>
            {/* Inputs */}
            <div className="text-blue-300 text-[9px] font-semibold tracking-wide text-center mb-1 opacity-80">
              People · Processes · Technology · Data · AI
            </div>
            {/* Divider arrow */}
            <div className="flex justify-center mb-1">
              <span className="text-blue-300 text-[10px] opacity-60">↓</span>
            </div>
            {/* Outcomes */}
            <div className="flex justify-center gap-x-3 flex-wrap">
              {["Clarity", "Accountability", "Visibility", "Scalability", "Growth"].map((outcome) => (
                <span key={outcome} className="text-blue-100 text-[9px] font-bold whitespace-nowrap">
                  ✓ {outcome}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bos-flow {
          0%   { top: 0%;   opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes bos-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.6); }
        }
      `}</style>
    </div>
  );
}
