/**
 * remotion/compositions/CompileTimeSafety.tsx
 * Segment 4 — Compile-Time Safety (1298 frames @ 30fps)
 *
 * 9 subtitle-aligned micro-phases with additive layering.
 * Elements persist and dim; old elements don't vanish completely.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";
import { DeviceShell } from "../components/DeviceShell";

const P2 = 91;
const P3 = 191;
const P4 = 336;
const P5 = 454;
const P6 = 593;
const P7 = 735;
const P8 = 933;
const P9 = 1100;

const MINT = THEME.colors.primary;
const DANGER = THEME.colors.danger;
const BORDER_SUBTLE = "rgba(255,255,255,0.06)";
const BG_SUBTLE = "rgba(255,255,255,0.03)";
const CONTENT_PAD_BOTTOM = 200;

const OOB_CODE = [
  { text: "shared f16 buf[64][64];", bug: false },
  { text: "int idx = threadIdx.x * K + 128;", bug: true },
  { text: "buf[warp_m][idx] = val;  // OOB!", bug: true },
];

const CROQ_CODE = [
  "kernel tile_gemm(Grid g, Span lhs, Span rhs) {",
  "  tile smem[WARP_M, TILE_K];",
  "  tma.copy lhs.subspan(WARP_M, TILE_K) => smem;",
  "  // compiler: validated DMA bounds, shapes, sync",
  "}",
];

const BUG_TYPES = ["DMA Overflow", "Shape Mismatch", "Sync Error"];

function cl(frame: number, lo: number, hi: number): number {
  return interpolate(frame, [lo, hi], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function dimAfter(frame: number, start: number, to = 0.25): number {
  return interpolate(frame, [start, start + 30], [1, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function lc(t: number, a: string, b: string): string {
  const pa = px(a), pb = px(b);
  const m = (i: number) => Math.round(pa[i] + (pb[i] - pa[i]) * t);
  return `rgb(${m(0)},${m(1)},${m(2)})`;
}

function px(s: string): [number, number, number] {
  const h = s.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}

const PIPE_STAGES = [
  { label: "Lexer", sub: "Tokenization" },
  { label: "Parser", sub: "AST generation" },
  { label: "Type Check", sub: "Shape analysis" },
  { label: "DMA Verify", sub: "Bounds check" },
  { label: "Sync Check", sub: "Barrier validation" },
  { label: "Codegen", sub: "Safe binary" },
];

export const CompileTimeSafety: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phases 1-2 (0–P3): Full-screen centered title + factor transition ──
  const p12Op = cl(frame, 0, 5) * dimAfter(frame, P3 - 9, 0);
  const titleSc = spring({ frame: frame - 2, fps, config: { damping: 13, stiffness: 125, mass: 0.55 }, from: 0.88, to: 1 });
  const shieldRot = interpolate(frame, [0, 36], [-8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const usabilityOp = cl(frame, 7, 22);
  const arrowOp = cl(frame, 27, 44);
  const debugOp = cl(frame, 38, 54);
  const debugGlow = 0.82 + 0.18 * Math.sin(frame * 0.2);
  const p2BarOp = cl(frame, P2, P2 + 16) * dimAfter(frame, P3 - 9, 0);
  const p2BarW = cl(frame, P2 + 7, P2 + 54);
  const liftY = interpolate(frame, [P3 - 36, P3 + 9], [0, -60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Phases 3-5: Code + GPU + time ──
  const codeEnter = spring({ frame: frame - P3 - 4, fps, config: { damping: 16, stiffness: 125, mass: 0.65 }, from: 0.92, to: 1 });
  const codeOp = cl(frame, P3, P3 + 22) * dimAfter(frame, P6, 0);
  const bugHL = cl(frame, P3 + 25, P3 + 51);

  const gpuX = spring({ frame: frame - P4 - 6, fps, config: { damping: 14, stiffness: 110, mass: 0.7 }, from: 60, to: 0 });
  const gpuOp = cl(frame, P4, P4 + 16) * dimAfter(frame, P6, 0);
  const crashOp = cl(frame, P4 + 25, P4 + 42);
  const shake = frame > P4 + 27 && frame < P4 + 54
    ? Math.sin((frame - P4) * 1.2) * cl(frame, P4 + 27, P4 + 36) * 3.5 * dimAfter(frame, P4 + 45, 0)
    : 0;

  const timeOp = cl(frame, P5, P5 + 20) * dimAfter(frame, P6, 0);
  const clockRot = (frame - P5) * 18;
  const timeProg = cl(frame, P5, P5 + 73);

  // ── Phases 6-7: CroqTile compiler comparison ──
  const solEnter = spring({ frame: frame - P6 - 4, fps, config: { damping: 16, stiffness: 120, mass: 0.65 }, from: 0.9, to: 1 });
  const solOp = cl(frame, P6, P6 + 25) * dimAfter(frame, P8, 0.25);
  const stageOp = (i: number) => cl(frame, P6 + 15 + i * 11, P6 + 29 + i * 11);
  const pipeGlow = frame >= P7 ? spring({ frame: frame - P7 - 5, fps, config: { damping: 12, stiffness: 140, mass: 0.5 }, from: 0.6, to: 1 }) : 0;
  const checkOp = (i: number) => cl(frame, P7 + 9 + i * 15, P7 + 27 + i * 15);
  const dslFade = cl(frame, P6 + 54, P6 + 82);
  const analysisOp = cl(frame, P7 + 45, P7 + 69);

  // ── Phase 6-7 popup: code analysis property badges ──
  const ANALYSIS_PROPS = [
    { label: "Static + Dynamic + Hybrid", icon: "⚙", accent: MINT },
    { label: "High Coverage", icon: "◉", accent: "#818CF8" },
    { label: "Manageable Cost", icon: "⚡", accent: THEME.colors.accentWarm },
  ];
  const popupBase = P7 + 58;
  const popupSc = (i: number) => spring({
    frame: frame - popupBase - i * 14, fps,
    config: { damping: 13, stiffness: 130, mass: 0.6 }, from: 0.5, to: 1,
  });
  const popupOp = (i: number) => cl(frame, popupBase + i * 14, popupBase + i * 14 + 18) * dimAfter(frame, P8, 0.15);
  const popupGlow = (i: number) => {
    const t = frame - popupBase - i * 14;
    return t > 0 && t < 30 ? interpolate(t, [0, 12, 30], [0, 0.8, 0.3], { extrapolateRight: "clamp" }) : (t >= 30 ? 0.3 : 0);
  };

  // ── Phases 8-9: Bug cards morph ──
  const cardsOp = cl(frame, P8, P8 + 20);
  const cardSc = (i: number) => spring({
    frame: frame - P8 - 7 - i * 11, fps,
    config: { damping: 14, stiffness: 160, mass: 0.52 }, from: 0.78, to: 1,
  });
  const morphT = cl(frame, P9, P9 + 100);
  const morphE = morphT * morphT * (3 - 2 * morphT);
  const bannerSc = spring({ frame: frame - P9 - 13, fps, config: { damping: 13, stiffness: 115, mass: 0.62 }, from: 0.82, to: 1 });

  return (
    <PageContainer tag="Segment 04" style={{ pointerEvents: "none" }}>
      <div style={{
        flex: 1, minHeight: 0, width: "100%", position: "relative",
        display: "flex", flexDirection: "column", overflow: "hidden", paddingBottom: CONTENT_PAD_BOTTOM,
      }}>
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.032} />
        </AbsoluteFill>

        {/* ── Phases 1-2: Full-screen centered title + transition ── */}
        <AbsoluteFill style={{
          opacity: p12Op, pointerEvents: "none", zIndex: 10,
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          transform: `translateY(${liftY}px)`,
          paddingBottom: 200,
        }}>
          {/* Shield icon + title */}
          <div style={{
            display: "flex", alignItems: "center", gap: 28, marginBottom: 48,
            transform: `scale(${titleSc})`, transformOrigin: "center",
          }}>
            <div style={{
              width: 96, height: 96, borderRadius: THEME.radius.lg,
              border: `2px solid ${MINT}66`, display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(145deg, rgba(110,231,183,0.14), rgba(8,12,18,0.95))`,
              boxShadow: `${THEME.shadows.card}, 0 0 36px ${THEME.colors.primaryGlow}`,
              transform: `rotate(${shieldRot}deg)`,
            }}>
              <svg width={56} height={56} viewBox="0 0 64 64" fill="none">
                <path d="M32 6L10 14v18c0 14 9 26.5 22 32 13-5.5 22-18 22-32V14L32 6z"
                  stroke={MINT} strokeWidth={2.5} fill="rgba(110,231,183,0.1)" />
                <path d="M24 32l6 6 12-14" stroke={MINT} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 style={{
              margin: 0, fontSize: THEME.fontSize["3xl"], fontWeight: 700, fontFamily: THEME.fonts.sans,
              color: THEME.colors.textPrimary, letterSpacing: "-0.025em", lineHeight: 1.15,
            }}>
              Compile-Time Safety
            </h1>
          </div>

          {/* Factor transition: Usability → Debugging */}
          <div style={{
            display: "flex", flexDirection: "row", alignItems: "center", gap: 32,
            width: "min(1000px, 90%)",
          }}>
            {/* Usability: done */}
            <div style={{
              flex: 1, opacity: usabilityOp * 0.5, textAlign: "center",
            }}>
              <div style={{
                fontSize: THEME.fontSize.xl, fontWeight: 700, fontFamily: THEME.fonts.sans,
                color: THEME.colors.textSecondary, marginBottom: 6,
              }}>
                <span style={{ color: MINT, marginRight: 8 }}>✓</span>
                Usability
              </div>
              <div style={{
                fontSize: THEME.fontSize.base, color: THEME.colors.textMuted, fontFamily: THEME.fonts.sans,
              }}>
                Solved in the previous chapter
              </div>
            </div>

            {/* Arrow */}
            <div style={{
              fontSize: 48, color: MINT, opacity: arrowOp,
              transform: `translateX(${(1 - arrowOp) * 20}px)`,
              fontWeight: 300,
            }}>→</div>

            {/* Debugging: new focus */}
            <div style={{
              flex: 1, opacity: debugOp, textAlign: "center",
              padding: "20px 16px", borderRadius: THEME.radius.lg,
              border: `2px solid rgba(110,231,183,${0.3 + 0.25 * debugGlow})`,
              background: `linear-gradient(180deg, rgba(110,231,183,${0.06 + 0.06 * debugGlow}), rgba(17,24,39,0.96))`,
              boxShadow: `0 0 ${28 * debugGlow}px ${THEME.colors.primaryGlow}`,
            }}>
              <div style={{
                fontSize: THEME.fontSize.xl, fontWeight: 700, fontFamily: THEME.fonts.sans,
                color: THEME.colors.textPrimary, marginBottom: 6,
              }}>
                Debugging Speed
              </div>
              <div style={{
                fontSize: THEME.fontSize.base, color: THEME.colors.textSecondary, fontFamily: THEME.fonts.sans,
              }}>
                The real bottleneck in kernel dev
              </div>
            </div>
          </div>

          {/* Phase 2: efficiency bar */}
          <div style={{
            opacity: p2BarOp, marginTop: 36, width: "min(900px, 85%)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 20px", borderRadius: THEME.radius.md,
              background: BG_SUBTLE, border: `1px solid ${BORDER_SUBTLE}`,
            }}>
              <span style={{
                fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.sm, color: THEME.colors.textMuted,
                letterSpacing: "0.06em", whiteSpace: "nowrap",
              }}>Development velocity</span>
              <div style={{
                flex: 1, height: 10, borderRadius: THEME.radius.full,
                background: BG_SUBTLE, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${p2BarW * 100}%`, borderRadius: THEME.radius.full,
                  background: `linear-gradient(90deg, ${MINT}, ${THEME.colors.primaryDark})`, opacity: 0.85,
                }} />
              </div>
              <span style={{
                fontFamily: THEME.fonts.sans, fontSize: THEME.fontSize.base, fontWeight: 700,
                color: MINT, whiteSpace: "nowrap",
              }}>Debugging is the bottleneck</span>
            </div>
          </div>
        </AbsoluteFill>

        {/* ── Main content area ── */}
        <div style={{ position: "relative", zIndex: 5, flex: 1, minHeight: 0, marginTop: 12 }}>

          {/* Phases 3-5: Code + GPU + time */}
          <div style={{ opacity: codeOp, pointerEvents: "none" }}>
            <div style={{
              display: "flex", flexDirection: "row", gap: 22, alignItems: "flex-start",
              transform: `scale(${codeEnter})`, transformOrigin: "top center",
            }}>
              <div style={{ flex: 3, minWidth: 0 }}>
                <div style={{
                  fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.sm, color: DANGER,
                  letterSpacing: "0.1em", marginBottom: 6, textTransform: "uppercase",
                }}>
                  Traditional kernel · runtime only
                </div>
                <DeviceShell title="kernel.cu" width={780} height={230} style={{ width: "100%", height: 230 }}>
                  <div style={{
                    padding: "14px 18px", fontFamily: THEME.fonts.mono, fontSize: 18,
                    lineHeight: 1.65, color: THEME.colors.textCode,
                  }}>
                    {OOB_CODE.map((line, i) => {
                      const lo = cl(frame, P3 + 5 + i * 9, P3 + 18 + i * 9);
                      const bg = line.bug ? `rgba(248,113,113,${(0.06 + 0.28 * bugHL) * (0.92 + 0.08 * Math.sin(frame * 0.3))})` : "transparent";
                      const bd = line.bug ? `1px solid rgba(248,113,113,${0.2 + 0.4 * bugHL})` : "1px solid transparent";
                      return (
                        <div key={i} style={{
                          opacity: lo, padding: "4px 10px", marginBottom: 5,
                          borderRadius: THEME.radius.sm, background: bg, border: bd,
                          whiteSpace: "pre-wrap",
                        }}>
                          {line.text}
                        </div>
                      );
                    })}
                  </div>
                </DeviceShell>
              </div>

              <div style={{
                flex: 2, minWidth: 0, opacity: gpuOp,
                transform: `translateX(${gpuX}px) translateX(${shake}px)`,
              }}>
                <div style={{
                  fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.sm,
                  color: THEME.colors.textMuted, letterSpacing: "0.1em", marginBottom: 6,
                }}>
                  GPU device
                </div>
                <div style={{
                  borderRadius: THEME.radius.lg,
                  border: `2px solid ${crashOp > 0.3 ? DANGER : THEME.colors.textMuted}44`,
                  background: `linear-gradient(180deg, rgba(55,65,81,0.95), rgba(17,24,39,0.98))`,
                  padding: "18px 16px", boxShadow: THEME.shadows.card,
                }}>
                  <svg width="100%" height={72} viewBox="0 0 240 72" fill="none">
                    <rect x={8} y={6} width={224} height={60} rx={8}
                      stroke={MINT} strokeWidth={1.5} fill="rgba(110,231,183,0.04)" />
                    {[0, 1, 2, 3, 4, 5].map((k) => (
                      <rect key={k} x={18 + k * 38} y={16} width={28} height={38} rx={4}
                        fill={k === 5 ? `rgba(248,113,113,${0.25 + 0.4 * crashOp})` : "rgba(129,140,248,0.25)"} />
                    ))}
                  </svg>
                  <div style={{
                    opacity: crashOp, marginTop: 10, padding: "8px 12px",
                    borderRadius: THEME.radius.md, background: "rgba(8,12,18,0.96)",
                    border: `1px solid ${DANGER}77`, fontFamily: THEME.fonts.mono,
                    fontSize: THEME.fontSize.sm, color: DANGER,
                    boxShadow: `0 6px 24px rgba(248,113,113,0.2)`,
                  }}>
                    CUDA error: illegal memory access (OOB)
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 5: time overlay — positioned below the code/GPU row */}
            <div style={{
              position: "absolute", left: "50%", bottom: 40,
              transform: "translateX(-50%)", opacity: timeOp,
              textAlign: "center", pointerEvents: "none",
            }}>
              <div style={{
                background: "rgba(8,12,18,0.93)", borderRadius: THEME.radius.lg,
                padding: "22px 44px", border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}>
                <div style={{
                  width: 72, height: 72, margin: "0 auto 14px",
                  borderRadius: THEME.radius.full,
                  border: `3px solid ${THEME.colors.accentWarm}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `rotate(${clockRot}deg)`,
                }}>
                  <svg width={36} height={36} viewBox="0 0 64 64" fill="none">
                    <circle cx={32} cy={32} r={26} stroke={THEME.colors.textMuted} strokeWidth={2} />
                    <line x1={32} y1={32} x2={32} y2={14} stroke={THEME.colors.accentWarm} strokeWidth={3} strokeLinecap="round" />
                    <line x1={32} y1={32} x2={46} y2={38} stroke={DANGER} strokeWidth={2} strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{
                  fontSize: THEME.fontSize["2xl"], fontWeight: 700, fontFamily: THEME.fonts.sans,
                  color: lc(timeProg, THEME.colors.accentWarm, DANGER),
                }}>
                  {timeProg < 0.5 ? "hours" : "days"}
                </div>
                <div style={{ fontSize: THEME.fontSize.base, color: THEME.colors.textSecondary, marginTop: 6, fontFamily: THEME.fonts.sans }}>
                  to find one DMA / shape bug
                </div>
              </div>
            </div>
          </div>

          {/* Phases 6-7: Stacked comparison — Other DSLs (top) → CroqTile (bottom) */}
          <AbsoluteFill style={{ opacity: solOp, pointerEvents: "none", top: 0 }}>
            <div style={{
              display: "flex", flexDirection: "column", gap: 16,
              transform: `scale(${solEnter})`, transformOrigin: "top center",
            }}>
              {/* Top: Other DSLs — full width, compact, shrinks as CroqTile enters */}
              <div style={{
                opacity: dslFade,
                transform: `scale(${1 - 0.03 * pipeGlow})`,
                transformOrigin: "top center",
              }}>
                <div style={{
                  fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.sm, color: DANGER,
                  letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  Other kernel DSLs — template-based C++ extension
                </div>
                <div style={{
                  borderRadius: THEME.radius.lg, padding: "14px 20px",
                  border: `1px solid ${DANGER}33`,
                  background: `linear-gradient(90deg, rgba(248,113,113,0.04), rgba(17,24,39,0.95))`,
                  boxShadow: THEME.shadows.card,
                  display: "flex", flexDirection: "row", alignItems: "center", gap: 12,
                }}>
                  {["C++ Preprocessor", "Template Instantiation", "Host Compiler (NVCC)"].map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{
                        padding: "8px 14px", borderRadius: THEME.radius.sm,
                        background: BG_SUBTLE, border: `1px solid ${BORDER_SUBTLE}`,
                        fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary,
                      }}>
                        {s}
                      </div>
                      {i < 2 && (
                        <span style={{ color: THEME.colors.textMuted, fontSize: 16 }}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                  <span style={{ color: THEME.colors.textMuted, fontSize: 16, marginLeft: 4 }}>→</span>
                  <div style={{
                    padding: "8px 14px", borderRadius: THEME.radius.sm,
                    background: `rgba(248,113,113,0.1)`, border: `1px solid ${DANGER}55`,
                    fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.sm, fontWeight: 700, color: DANGER,
                  }}>
                    No kernel-level static analysis
                  </div>
                </div>
              </div>

              {/* Bottom: CroqTile standalone compiler pipeline — full width */}
              <div>
                <div style={{
                  fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.sm, color: MINT,
                  letterSpacing: "0.1em", marginBottom: 8, textTransform: "uppercase",
                  fontWeight: 600,
                }}>
                  CroqTile · standalone compiler
                </div>
                <div style={{
                  borderRadius: THEME.radius.lg, padding: "16px 20px",
                  border: `2px solid rgba(110,231,183,${0.18 + 0.4 * pipeGlow})`,
                  background: `linear-gradient(180deg, rgba(31,41,55,0.96), rgba(17,24,39,0.98))`,
                  boxShadow: pipeGlow > 0
                    ? `${THEME.shadows.card}, 0 0 ${32 * pipeGlow}px ${THEME.colors.primaryGlow}`
                    : THEME.shadows.card,
                }}>
                  <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    {PIPE_STAGES.map((stage, i) => (
                      <React.Fragment key={stage.label}>
                        <div style={{
                          flex: "1 1 0", minWidth: 100, padding: "12px 10px",
                          borderRadius: THEME.radius.md,
                          border: `1px solid ${MINT}${i < 4 ? "44" : "33"}`,
                          background: `rgba(110,231,183,${0.04 + (pipeGlow > 0 ? 0.04 * pipeGlow : 0)})`,
                          textAlign: "center", opacity: stageOp(i),
                          transform: `translateY(${(1 - stageOp(i)) * 8}px)`,
                          position: "relative",
                        }}>
                          <div style={{
                            fontFamily: THEME.fonts.sans, fontWeight: 700,
                            fontSize: THEME.fontSize.base, color: THEME.colors.textPrimary,
                          }}>
                            {stage.label}
                          </div>
                          <div style={{
                            fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.xs,
                            color: THEME.colors.textSecondary, marginTop: 4,
                          }}>
                            {stage.sub}
                          </div>
                          {frame >= P7 && (
                            <div style={{
                              position: "absolute", right: -4, top: -6,
                              width: 22, height: 22, borderRadius: THEME.radius.full,
                              background: MINT, color: "#0A0E1A",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontWeight: 900, fontSize: THEME.fontSize.xs,
                              transform: `scale(${checkOp(i)})`, opacity: checkOp(i),
                              boxShadow: `0 0 12px ${MINT}`,
                            }}>
                              ✓
                            </div>
                          )}
                        </div>
                        {i < PIPE_STAGES.length - 1 && (
                          <div style={{
                            alignSelf: "center", fontSize: 18, color: `${MINT}88`,
                            opacity: stageOp(i),
                          }}>
                            →
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div style={{
                    marginTop: 14, borderRadius: THEME.radius.md,
                    background: "rgba(0,0,0,0.2)", padding: "12px 16px",
                    fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.base,
                    lineHeight: 1.55, color: THEME.colors.textCode,
                  }}>
                    {CROQ_CODE.map((line, i) => (
                      <div key={i} style={{ whiteSpace: "pre-wrap" }}>{line}</div>
                    ))}
                  </div>

                  <div style={{
                    marginTop: 14, textAlign: "center", opacity: analysisOp,
                    fontFamily: THEME.fonts.mono, fontSize: THEME.fontSize.sm, fontWeight: 800,
                    letterSpacing: "0.12em", color: MINT,
                    padding: "10px 18px", borderRadius: THEME.radius.md,
                    border: `1px solid ${MINT}55`, background: `rgba(110,231,183,0.06)`,
                  }}>
                    COMPILE-TIME STATIC ANALYSIS · ALL PASSES GREEN
                  </div>

                  {/* Pop-up badges: static-dynamic-hybrid / high coverage / manageable cost */}
                  <div style={{
                    marginTop: 16, display: "flex", flexDirection: "row",
                    gap: 14, justifyContent: "center",
                  }}>
                    {ANALYSIS_PROPS.map((prop, i) => (
                      <div key={prop.label} style={{
                        opacity: popupOp(i),
                        transform: `scale(${popupSc(i)}) translateY(${(1 - popupOp(i)) * 12}px)`,
                        transformOrigin: "center bottom",
                        padding: "12px 22px", borderRadius: THEME.radius.lg,
                        border: `1.5px solid ${prop.accent}88`,
                        background: `linear-gradient(170deg, rgba(17,24,39,0.97), rgba(31,41,55,0.95))`,
                        boxShadow: `${THEME.shadows.card}, 0 0 ${20 * popupGlow(i)}px ${prop.accent}55`,
                        display: "flex", alignItems: "center", gap: 10,
                      }}>
                        <span style={{
                          fontSize: 22, filter: `brightness(${1 + 0.4 * popupGlow(i)})`,
                        }}>
                          {prop.icon}
                        </span>
                        <span style={{
                          fontFamily: THEME.fonts.sans, fontSize: THEME.fontSize.base,
                          fontWeight: 700, color: prop.accent, letterSpacing: "-0.01em",
                        }}>
                          {prop.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AbsoluteFill>

          {/* Phases 8-9: Bug cards morph */}
          <AbsoluteFill style={{ opacity: cardsOp, pointerEvents: "none" }}>
            <div style={{
              position: "absolute", left: "50%", top: 8,
              transform: "translateX(-50%)", width: "min(1100px, 96%)",
            }}>
              <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
                {BUG_TYPES.map((label, i) => {
                  const sc = cardSc(i);
                  const bc = frame >= P9 ? lc(morphE, DANGER, MINT) : DANGER;
                  const ic = frame >= P9 ? lc(morphE, DANGER, MINT) : DANGER;
                  const xOp = 1 - morphE;
                  const cOp = morphE;
                  return (
                    <div key={label} style={{
                      flex: 1, borderRadius: THEME.radius.lg, padding: "18px 14px",
                      border: `1px solid ${bc}77`,
                      background: `linear-gradient(180deg, rgba(${Math.round(248 - 138 * morphE)},${Math.round(113 + 118 * morphE)},${Math.round(113 + 70 * morphE)},0.12), rgba(17,24,39,0.96))`,
                      boxShadow: THEME.shadows.card, transform: `scale(${sc})`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: THEME.radius.md,
                          border: `2px solid ${ic}`, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: 22, fontWeight: 900, position: "relative",
                          boxShadow: morphE > 0.5 ? `0 0 14px ${MINT}44` : undefined,
                        }}>
                          <span style={{ position: "absolute", color: DANGER, opacity: xOp, transform: `scale(${0.9 + 0.1 * xOp})` }}>✗</span>
                          <span style={{ position: "absolute", color: MINT, opacity: cOp, transform: `scale(${0.85 + 0.15 * cOp})` }}>✓</span>
                        </div>
                        <div>
                          <div style={{ fontFamily: THEME.fonts.sans, fontSize: THEME.fontSize.lg, fontWeight: 700, color: THEME.colors.textPrimary }}>
                            {label}
                          </div>
                          <div style={{ fontFamily: THEME.fonts.sans, fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary, marginTop: 3 }}>
                            {morphE > 0.3 ? "caught at compile time" : "runtime-only in CUDA"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {frame >= P9 && (
                <div style={{
                  marginTop: 22, textAlign: "center",
                  borderRadius: THEME.radius.md, padding: "16px 24px",
                  transform: `scale(${bannerSc})`,
                  border: `2px solid ${MINT}`,
                  background: `linear-gradient(90deg, rgba(110,231,183,0.14), rgba(129,140,248,0.08))`,
                  boxShadow: `${THEME.shadows.glow}, 0 0 40px ${THEME.colors.primaryGlow}`,
                  opacity: cl(frame, P9 + 7, P9 + 33),
                }}>
                  <span style={{
                    fontFamily: THEME.fonts.sans, fontSize: THEME.fontSize["2xl"], fontWeight: 700,
                    color: THEME.colors.textPrimary, letterSpacing: "-0.02em",
                  }}>
                    Caught at compile time
                  </span>
                </div>
              )}
            </div>
          </AbsoluteFill>
        </div>

      </div>
    </PageContainer>
  );
};
