/**
 * remotion/compositions/CompileTimeSafety.tsx
 * Segment 4 — Compile-Time Safety (900 frames @ 30fps)
 *
 * Phases: intro + CroqTile compile error → CUDA runtime crash → contrast split → bug checklist.
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

/** Phase boundaries (exclusive ends): A [0,225), B [225,450), C [450,675), D [675,900) */
const PHASE_A_END = 225;
const PHASE_B_END = 450;
const PHASE_C_END = 675;

const MINT = THEME.colors.primary;
const DANGER = THEME.colors.danger;

const CROQ_LINES: { text: string; isBug: boolean }[] = [
  { text: "shared f16 [WARP_M, TILE_K] lhs_s;", isBug: false },
  {
    text: "tma.copy lhs.subspan(WARP_M, TILE_K * 2).at(bm, iv_k) => lhs_s;",
    isBug: true,
  },
];

const CUDA_LINES: string[] = [
  "__global__ void fused_gemm(",
  "    half* __restrict__ out,",
  "    const half* __restrict__ lhs,",
  "    const half* __restrict__ rhs, int K) {",
  "  int tid = threadIdx.x + blockIdx.x * blockDim.x;",
  "  half v = lhs[tid * K + 128];  // shape / indexing mismatch",
  "  __syncthreads();                  // fragile barrier pairing",
  "  out[tid] = v;",
  "}",
];

const BUG_SUMMARY: string[] = [
  "DMA buffer overflows",
  "Tensor shape mismatches",
  "Synchronization errors",
];

function trapezoidOpacity(
  frame: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number,
): number {
  const rise = interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fall = interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(rise, fall);
}

const TerminalCompilePopup: React.FC<{
  opacity: number;
  scale: number;
}> = ({ opacity, scale }) => (
  <div
    style={{
      marginTop: 14,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    }}
  >
    <div
      style={{
        borderRadius: THEME.radius.md,
        border: `1px solid rgba(248,113,113,0.5)`,
        background: "rgba(8,12,18,0.96)",
        boxShadow: `0 16px 48px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)`,
        padding: "12px 14px",
        fontFamily: THEME.fonts.mono,
        fontSize: 14,
        lineHeight: 1.55,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingBottom: 8,
        }}
      >
        <span style={{ color: THEME.colors.textMuted, flexShrink: 0 }}>croqtile</span>
        <span style={{ color: THEME.colors.textMuted }}>◆</span>
        <span style={{ color: DANGER, fontWeight: 700, letterSpacing: "0.06em", fontSize: 13 }}>
          compile · ERROR
        </span>
      </div>
      <div style={{ color: THEME.colors.textMuted }}>
        <span style={{ color: "#4ADE80" }}>$ </span>
        <span style={{ color: THEME.colors.textSecondary }}>croqtile build tile_kernel.croq</span>
      </div>
      <div style={{ marginTop: 8 }}>
        <span style={{ color: THEME.colors.textMuted }}>tile_kernel.croq:2:1 · </span>
        <span style={{ color: DANGER }}>
          span layout mismatch — expected [64, 64], inferred [64, 128]
        </span>
      </div>
    </div>
  </div>
);

const CrashBanner: React.FC<{ opacity: number; translateY: number }> = ({ opacity, translateY }) => (
  <div
    style={{
      marginTop: 10,
      opacity,
      transform: `translateY(${translateY}px)`,
      padding: "10px 14px",
      borderRadius: THEME.radius.md,
      background: "rgba(17,24,39,0.96)",
      border: `1px solid rgba(248,113,113,0.55)`,
      boxShadow: `0 14px 40px rgba(0,0,0,0.55)`,
      fontFamily: THEME.fonts.mono,
      fontSize: 14,
      color: DANGER,
      letterSpacing: "0.02em",
    }}
  >
    CUDA error: illegal memory access
  </div>
);

const BadgeStat: React.FC<{
  label: string;
  tint: string;
  glyph: string;
  glyphTint: string;
  pulse: number;
}> = ({ label, tint, glyph, glyphTint, pulse }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: "12px 10px",
      borderRadius: THEME.radius.md,
      border: `1px solid ${tint}33`,
      background: `linear-gradient(180deg, ${tint}14, transparent)`,
      flex: 1,
      minWidth: 0,
    }}
  >
    <div
      style={{
        width: 54,
        height: 54,
        borderRadius: THEME.radius.full,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        fontWeight: 800,
        color: glyphTint,
        border: `2px solid ${glyphTint}88`,
        transform: `scale(${pulse})`,
        boxShadow: `0 0 24px ${tint}44`,
      }}
    >
      {glyph}
    </div>
    <span
      style={{
        fontFamily: THEME.fonts.sans,
        fontSize: 15,
        fontWeight: 600,
        color: tint,
        textAlign: "center",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  </div>
);

export const CompileTimeSafety: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phaseAOpacity = trapezoidOpacity(frame, 0, 1, PHASE_A_END - 36, PHASE_A_END + 18);
  const phaseBOpacity = trapezoidOpacity(frame, PHASE_A_END - 24, PHASE_A_END + 24, PHASE_B_END - 36, PHASE_B_END + 18);
  const phaseCOpacity = trapezoidOpacity(frame, PHASE_B_END - 24, PHASE_B_END + 24, PHASE_C_END - 36, PHASE_C_END + 18);
  const phaseDOpacity = trapezoidOpacity(frame, PHASE_C_END - 24, PHASE_C_END + 24, 900, 901);

  const panelSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.72 },
    from: 0.94,
    to: 1,
  });

  const phaseALocal = frame;
  const titleSpring = spring({
    frame: phaseALocal - 8,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.65 },
    from: 0.92,
    to: 1,
  });

  const bugPulse = interpolate(phaseALocal, [110, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bugPulseOsc =
    bugPulse *
    (0.92 +
      0.08 * Math.sin(interpolate(phaseALocal, [130, 220], [0, Math.PI * 5], { extrapolateRight: "extend" })));

  const bugHighlight = interpolate(phaseALocal, [95, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const terminalPop = spring({
    frame: phaseALocal - 148,
    fps,
    config: { damping: 13, stiffness: 125, mass: 0.62 },
    from: 0.9,
    to: 1,
  });
  const terminalOp = interpolate(phaseALocal, [135, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineReveal = (i: number) =>
    interpolate(phaseALocal, [52 + i * 14, 76 + i * 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const phaseBLocal = frame - PHASE_A_END;
  const cudaLineReveal = (i: number) =>
    interpolate(phaseBLocal, [18 + i * 11, 38 + i * 11], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const cudaBugPulse = interpolate(phaseBLocal, [95, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const crashOp = interpolate(phaseBLocal, [155, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const crashSpring = spring({
    frame: phaseBLocal - 158,
    fps,
    config: { damping: 12, stiffness: 118, mass: 0.68 },
    from: 0.88,
    to: 1,
  });
  const crashY = interpolate(phaseBLocal, [155, 195], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phaseCLocal = frame - PHASE_B_END;
  const leftGlow = spring({
    frame: phaseCLocal - 18,
    fps,
    config: { damping: 15, stiffness: 130, mass: 0.68 },
    from: 0.82,
    to: 1,
  });
  const rightShake =
    phaseCLocal > 40 && phaseCLocal < 120
      ? Math.sin(phaseCLocal * 0.65) *
        interpolate(phaseCLocal, [40, 58, 100, 120], [0, 3, 5, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const phaseDLocal = frame - PHASE_C_END;
  const listTitleSpring = spring({
    frame: phaseDLocal - 10,
    fps,
    config: { damping: 16, stiffness: 125, mass: 0.7 },
    from: 0.94,
    to: 1,
  });

  const headlineLayer = (
    variant: "a" | "b" | "c" | "d",
    opacity: number,
    title: string,
    subtitle: string,
  ) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        opacity,
        pointerEvents: "none",
      }}
    >
      <h1
        style={{
          fontSize: variant === "a" ? 52 : 48,
          color: THEME.colors.textPrimary,
          fontFamily: THEME.fonts.sans,
          fontWeight: 700,
          lineHeight: 1.14,
          margin: 0,
          marginBottom: 10,
          transform:
            variant === "a"
              ? `translateY(${interpolate(1 - titleSpring, [0, 1], [18, 0])}px) scale(${titleSpring})`
              : `scale(${panelSpring})`,
          transformOrigin: "top left",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          margin: 0,
          fontSize: 18,
          color: THEME.colors.textSecondary,
          fontFamily: THEME.fonts.sans,
          maxWidth: 1180,
          lineHeight: 1.45,
          transform:
            variant === "a"
              ? `translateY(${interpolate(phaseALocal, [40, 76], [12, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}px)`
              : undefined,
        }}
      >
        {subtitle}
      </p>
    </div>
  );

  const codeFontMain = 15;
  const labelMono = 14;

  return (
    <PageContainer tag="Segment 04" style={{ pointerEvents: "none" }}>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.032} />
        </AbsoluteFill>

        {/* Narrative headlines — stacked, phased */}
        <div style={{ position: "relative", minHeight: 104, zIndex: 2, flexShrink: 0 }}>
          {headlineLayer(
            "a",
            phaseAOpacity,
            "Debugging drives kernel velocity",
            "Beyond ergonomics, how fast you find bugs decides how fast you ship tuned kernels.",
          )}
          {headlineLayer(
            "b",
            phaseBOpacity,
            "When the GPU is your first test",
            "Traditional tuning hides DMA spills and shape bugs until hardware runs — costing hours or days.",
          )}
          {headlineLayer(
            "c",
            phaseCOpacity,
            "Compile pipeline built for kernels",
            "CroqTile ships with a standalone compiler so violations surface before launch schedules.",
          )}
          {headlineLayer(
            "d",
            phaseDOpacity,
            "Caught before the device executes",
            "DMA overflows, shape mismatches, sync hazards — flagged during compilation.",
          )}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            minHeight: 0,
            marginTop: 12,
            maxHeight: 430,
          }}
        >
          {/* Phase A — CroqTile + terminal */}
          <AbsoluteFill style={{ opacity: phaseAOpacity, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: "min(980px, 92%)",
                transform: `translateX(-50%) translateY(${interpolate(phaseALocal, [0, 42], [22, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}px) scale(${panelSpring})`,
              }}
            >
              <DeviceShell title="tile_kernel.croq" width={980} height={408} style={{ width: "100%", height: 408 }}>
                <div
                  style={{
                    height: "100%",
                    padding: "16px 20px 18px",
                    fontFamily: THEME.fonts.mono,
                    fontSize: codeFontMain,
                    lineHeight: 1.62,
                    color: THEME.colors.textCode,
                    background: `linear-gradient(180deg, rgba(0,0,0,0.14), transparent)`,
                  }}
                >
                  {CROQ_LINES.map((line, i) => {
                    const lf = lineReveal(i);
                    const isBug = line.isBug;
                    const bg = isBug
                      ? `rgba(248,113,113,${0.1 + 0.42 * bugHighlight})`
                      : "transparent";
                    const border = isBug
                      ? `1px solid rgba(248,113,113,${0.28 + 0.52 * bugHighlight})`
                      : "1px solid transparent";
                    return (
                      <div
                        key={i}
                        style={{
                          opacity: lf,
                          padding: "5px 10px",
                          marginBottom: 6,
                          borderRadius: THEME.radius.sm,
                          background: bg,
                          border,
                          boxShadow: isBug
                            ? `0 0 0 1px rgba(248,113,113,${0.14 * bugHighlight}) inset, 0 10px 30px rgba(248,113,113,${0.14 * bugPulseOsc})`
                            : undefined,
                          whiteSpace: "pre-wrap",
                          transform: isBug ? `scale(${bugPulseOsc})` : undefined,
                          transformOrigin: "center left",
                        }}
                      >
                        {line.text}
                      </div>
                    );
                  })}
                  <TerminalCompilePopup opacity={terminalOp} scale={terminalPop} />
                </div>
              </DeviceShell>
            </div>
          </AbsoluteFill>

          {/* Phase B — CroqTile | CUDA */}
          <AbsoluteFill style={{ opacity: phaseBOpacity, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                top: 0,
                display: "flex",
                flexDirection: "row",
                gap: 28,
                alignItems: "flex-start",
                transform: `translateY(${spring({
                  frame: phaseBLocal - 6,
                  fps,
                  config: { damping: 17, stiffness: 118, mass: 0.72 },
                  from: 18,
                  to: 0,
                })}px)`,
              }}
            >
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: labelMono,
                    color: MINT,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  CroqTile · compile-time
                </span>
                <DeviceShell title="tile_kernel.croq" width={640} height={312} style={{ width: "100%", height: 312 }}>
                  <div
                    style={{
                      padding: "14px 16px",
                      fontFamily: THEME.fonts.mono,
                      fontSize: codeFontMain - 1,
                      lineHeight: 1.58,
                      color: THEME.colors.textCode,
                      height: "100%",
                    }}
                  >
                    {CROQ_LINES.map((line, i) => (
                      <div
                        key={i}
                        style={{
                          opacity: cudaLineReveal(Math.min(i, 1)),
                          padding: "4px 8px",
                          marginBottom: 4,
                          borderRadius: THEME.radius.sm,
                          background: line.isBug ? "rgba(248,113,113,0.14)" : "transparent",
                          border: line.isBug ? `1px solid rgba(248,113,113,0.45)` : "1px solid transparent",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {line.text}
                      </div>
                    ))}
                    <TerminalCompilePopup
                      opacity={interpolate(phaseBLocal, [120, 152], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}
                      scale={spring({
                        frame: phaseBLocal - 130,
                        fps,
                        config: { damping: 14, stiffness: 122, mass: 0.62 },
                        from: 0.91,
                        to: 1,
                      })}
                    />
                  </div>
                </DeviceShell>
              </div>

              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: labelMono,
                    color: DANGER,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  CUDA · runtime failure
                </span>
                <DeviceShell title="manual_kernel.cu" width={640} height={312} style={{ width: "100%", height: 312 }}>
                  <div
                    style={{
                      padding: "14px 16px",
                      fontFamily: THEME.fonts.mono,
                      fontSize: codeFontMain - 1,
                      lineHeight: 1.56,
                      color: THEME.colors.textSecondary,
                      height: "100%",
                    }}
                  >
                    {CUDA_LINES.map((line, i) => {
                      const risky = line.includes("lhs[tid * K + 128]");
                      const barrier = line.includes("__syncthreads");
                      return (
                        <div
                          key={i}
                          style={{
                            opacity: cudaLineReveal(i),
                            padding: "3px 0",
                            whiteSpace: "pre",
                            borderRadius: risky || barrier ? THEME.radius.sm : undefined,
                            paddingLeft: risky || barrier ? 6 : 0,
                            background:
                              risky || barrier
                                ? `rgba(248,113,113,${0.06 + 0.34 * cudaBugPulse})`
                                : undefined,
                            border:
                              risky || barrier
                                ? `1px solid rgba(248,113,113,${0.35 + 0.4 * cudaBugPulse})`
                                : undefined,
                          }}
                        >
                          {risky ? (
                            <>
                              {line.split("half v")[0]}
                              <span style={{ color: THEME.colors.accentWarm }}>half v</span>
                              {line.slice(line.indexOf("=") - 1)}
                            </>
                          ) : (
                            line
                          )}
                        </div>
                      );
                    })}
                  </div>
                </DeviceShell>
                <CrashBanner opacity={crashOp * crashSpring} translateY={crashY} />
              </div>
            </div>
          </AbsoluteFill>

          {/* Phase C — contrast */}
          <AbsoluteFill style={{ opacity: phaseCOpacity, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                top: 0,
                display: "flex",
                flexDirection: "row",
                gap: 22,
                alignItems: "stretch",
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  transform: `translateX(${interpolate(phaseCLocal, [0, 28], [-14, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}px)`,
                }}
              >
                <BadgeStat
                  label="Compiler rejects invalid tiles"
                  tint={MINT}
                  glyph="✓"
                  glyphTint={MINT}
                  pulse={leftGlow}
                />
                <DeviceShell title="tile_kernel.croq" width={640} height={248} style={{ width: "100%", height: 248 }}>
                  <div
                    style={{
                      padding: "12px 14px",
                      fontFamily: THEME.fonts.mono,
                      fontSize: codeFontMain - 2,
                      color: THEME.colors.textCode,
                      opacity: 0.95,
                    }}
                  >
                    {CROQ_LINES.map((line, i) => (
                      <div key={i} style={{ marginBottom: 6, whiteSpace: "pre-wrap" }}>
                        {line.text}
                      </div>
                    ))}
                  </div>
                </DeviceShell>
              </div>

              <div
                style={{
                  width: 3,
                  alignSelf: "stretch",
                  marginTop: 64,
                  marginBottom: 48,
                  borderRadius: THEME.radius.full,
                  background: `linear-gradient(180deg, transparent, rgba(255,255,255,0.12), transparent)`,
                  opacity: interpolate(phaseCLocal, [12, 38], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  transform: `translateX(${rightShake}px)`,
                }}
              >
                <BadgeStat
                  label="Hardware exposes latent bugs"
                  tint={DANGER}
                  glyph="✗"
                  glyphTint={DANGER}
                  pulse={spring({
                    frame: phaseCLocal - 28,
                    fps,
                    config: { damping: 10, stiffness: 140, mass: 0.55 },
                    from: 0.88,
                    to: 1,
                  })}
                />
                <DeviceShell title="manual_kernel.cu" width={640} height={248} style={{ width: "100%", height: 248 }}>
                  <div
                    style={{
                      padding: "12px 14px",
                      fontFamily: THEME.fonts.mono,
                      fontSize: codeFontMain - 2,
                      color: THEME.colors.textSecondary,
                      opacity: 0.92,
                    }}
                  >
                    {CUDA_LINES.map((line, i) => (
                      <div key={i} style={{ whiteSpace: "pre", marginBottom: 3 }}>
                        {line}
                      </div>
                    ))}
                  </div>
                </DeviceShell>
              </div>
            </div>
          </AbsoluteFill>

          {/* Phase D — checklist */}
          <AbsoluteFill style={{ opacity: phaseDOpacity, pointerEvents: "none" }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 12,
                transform: `translateX(-50%) scale(${listTitleSpring})`,
                width: "min(920px, 94%)",
              }}
            >
              <div
                style={{
                  borderRadius: THEME.radius.lg,
                  border: `1px solid rgba(110,231,183,0.28)`,
                  background: `linear-gradient(145deg, rgba(17,24,39,0.94), rgba(15,23,42,0.98))`,
                  boxShadow: `${THEME.shadows.card}, 0 0 48px rgba(110,231,183,0.08)`,
                  padding: "22px 28px 26px",
                }}
              >
                <div
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: labelMono,
                    color: MINT,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  Compile-time intercepts
                </div>
                {BUG_SUMMARY.map((label, i) => {
                  const rowFrame = phaseDLocal - 22 - i * 48;
                  const rowOp = interpolate(rowFrame, [-10, 22], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  const rowY = interpolate(rowFrame, [-10, 22], [16, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  });
                  const checkSc = spring({
                    frame: rowFrame - 4,
                    fps,
                    config: { damping: 14, stiffness: 200, mass: 0.55 },
                    from: 0.4,
                    to: 1,
                  });
                  return (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        padding: "14px 12px",
                        marginBottom: i === BUG_SUMMARY.length - 1 ? 0 : 10,
                        borderRadius: THEME.radius.md,
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid rgba(255,255,255,0.06)`,
                        opacity: rowOp,
                        transform: `translateY(${rowY}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: THEME.radius.md,
                          border: `2px solid ${MINT}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          color: MINT,
                          transform: `scale(${checkSc}) rotate(${interpolate(checkSc, [0.4, 1], [-18, 0])}deg)`,
                          boxShadow: `0 0 18px rgba(110,231,183,0.35)`,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </div>
                      <span
                        style={{
                          fontFamily: THEME.fonts.sans,
                          fontSize: 42,
                          fontWeight: 600,
                          color: THEME.colors.textPrimary,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.2,
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </AbsoluteFill>
        </div>

        {/* Phase rail */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 10,
            zIndex: 2,
            opacity: interpolate(frame, [12, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <div
            style={{
              height: 3,
              borderRadius: THEME.radius.full,
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((frame + 1) / 900) * 100}%`,
                height: "100%",
                borderRadius: THEME.radius.full,
                background: `linear-gradient(90deg, ${MINT}, ${THEME.colors.accent})`,
                opacity: 0.85,
              }}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
