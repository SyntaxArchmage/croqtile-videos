import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";

const TOTAL_FRAMES = 750;

const PHASE_A_END = 249;
const PHASE_B_START = 250;
const PHASE_B_END = 499;
const PHASE_C_START = 500;

/** Bars extending roughly beyond absolute ~700 overlap subtitles — reserve band */
const SAFE_BOTTOM_PADDING = 360;

const LOC_ROWS: {
  label: string;
  loc: number;
  color: string;
  mintGlow: boolean;
}[] = [
  {
    label: "CroqTile-Python",
    loc: 30,
    color: THEME.colors.primary,
    mintGlow: true,
  },
  {
    label: "CroqTile",
    loc: 36,
    color: THEME.colors.primary,
    mintGlow: true,
  },
  {
    label: "TileLang",
    loc: 70,
    color: THEME.colors.textSecondary,
    mintGlow: false,
  },
  {
    label: "Triton",
    loc: 80,
    color: THEME.colors.textSecondary,
    mintGlow: false,
  },
  {
    label: "CUDA + CuTe",
    loc: 182,
    color: THEME.colors.accentWarm,
    mintGlow: false,
  },
  {
    label: "CUTLASS",
    loc: 280,
    color: THEME.colors.accentWarm,
    mintGlow: false,
  },
];

const MAX_LOC = 280;
const CROQ_TFLOPS = 471.3;
const TORCH_TFLOPS = 447.5;

const SCATTER = [
  {
    id: "croq",
    label: "CroqTile",
    x: 7.8,
    y: 471,
    color: THEME.colors.primary,
    large: true,
  },
  {
    id: "triton",
    label: "Triton",
    x: 3.5,
    y: 430,
    color: THEME.colors.textSecondary,
    large: false,
  },
  {
    id: "tilelang",
    label: "TileLang",
    x: 4.0,
    y: 420,
    color: THEME.colors.textSecondary,
    large: false,
  },
  {
    id: "cuda",
    label: "CUDA+CuTe",
    x: 1.5,
    y: 447,
    color: THEME.colors.textSecondary,
    large: false,
  },
  {
    id: "cutlass",
    label: "CUTLASS",
    x: 1.0,
    y: 447,
    color: THEME.colors.textSecondary,
    large: false,
  },
] as const;

const LABEL_W = 240;
const MAX_BAR_W = 740;
const ROW_H = 62;

export const PerfChart: React.FC = () => {
  const frame = Math.min(useCurrentFrame(), TOTAL_FRAMES - 1);
  const { fps } = useVideoConfig();

  const phaseAOpacity = interpolate(
    frame,
    [Math.max(0, PHASE_A_END - 32), PHASE_B_START],
    [1, 0],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const phaseBFadeOut = interpolate(
    frame,
    [PHASE_B_END - 22, PHASE_B_END + 16],
    [1, 0],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const phaseBFadeIn = interpolate(frame, [228, 268], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phaseBVisible = phaseBFadeIn * phaseBFadeOut;

  const phaseCOpacity = interpolate(
    frame,
    [PHASE_C_START - 24, PHASE_C_START + 18],
    [0, 1],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const bFrame = Math.max(0, frame - PHASE_B_START);

  const titleSpring = spring({
    frame: Math.max(0, bFrame - 6),
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.85 },
    from: 0,
    to: 1,
  });

  const comparisonSpring = spring({
    frame: Math.max(0, bFrame - 26),
    fps,
    config: { damping: 18, stiffness: 95, mass: 0.8 },
    from: 0,
    to: 1,
  });

  const badgeSpring = spring({
    frame: Math.max(0, bFrame - 48),
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.65 },
    from: 0.75,
    to: 1,
  });

  const barGrowth = spring({
    frame: Math.max(0, bFrame - 38),
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.82 },
    from: 0,
    to: 1,
  });

  const maxBarPx = 320;
  const croqBarH =
    Math.max(0, barGrowth) * maxBarPx * (CROQ_TFLOPS / CROQ_TFLOPS);
  const torchBarH =
    Math.max(0, barGrowth) * maxBarPx * (TORCH_TFLOPS / CROQ_TFLOPS);

  const valueSpring = spring({
    frame: Math.max(0, bFrame - 52),
    fps,
    config: { damping: 17, stiffness: 88, mass: 0.82 },
    from: 0,
    to: 1,
  });

  const torchValueSpring = spring({
    frame: Math.max(0, bFrame - 62),
    fps,
    config: { damping: 17, stiffness: 88, mass: 0.82 },
    from: 0,
    to: 1,
  });

  const scatterMorph = interpolate(
    frame,
    [PHASE_C_START - 26, PHASE_C_START + 14],
    [0, 1],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const cFrame = Math.max(0, frame - PHASE_C_START);

  const plotW = 880;
  const plotH = 380;
  const padL = 72;
  const padB = 44;
  const padT = 36;
  const xMin = 0;
  const xMax = 9;
  const yMin = 400;
  const yMax = 485;

  const toSx = (x: number) =>
    padL + ((x - xMin) / (xMax - xMin)) * (plotW - padL - 32);
  const toSy = (y: number) =>
    padT + (1 - (y - yMin) / (yMax - yMin)) * (plotH - padT - padB);

  const pulse = 0.55 + 0.45 * Math.sin(frame * 0.14);

  const titleShadow =
    "0 0 28px rgba(110,231,183,0.22), 0 2px 24px rgba(0,0,0,0.55)";

  return (
    <PageContainer tag="Segment 03">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingBottom: SAFE_BOTTOM_PADDING,
          paddingTop: 8,
        }}
      >
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.028} blendMode="soft-light" />
        </AbsoluteFill>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {/* ─── Phase A — LOC bar chart ─── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 16,
              opacity: phaseAOpacity,
              pointerEvents: phaseAOpacity < 0.02 ? "none" : "auto",
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 40,
                fontFamily: THEME.fonts.sans,
                fontSize: 48,
                fontWeight: 700,
                color: THEME.colors.textPrimary,
                textAlign: "center",
                letterSpacing: "-0.02em",
                textShadow:
                  "0 0 40px rgba(110,231,183,0.18), 0 4px 32px rgba(0,0,0,0.45)",
              }}
            >
              Lines of Code — Persistent GEMM Kernel
            </h2>
            <div
              style={{
                width: LABEL_W + MAX_BAR_W + 56,
              }}
            >
              {LOC_ROWS.map((row, i) => {
                const barSpring = spring({
                  frame: Math.max(0, frame - 10 - i * 14),
                  fps,
                  config: { damping: 17, stiffness: 92, mass: 0.88 },
                  from: 0,
                  to: 1,
                });
                const rowOpacity = interpolate(barSpring, [0, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const barStretch = interpolate(barSpring, [0, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const w =
                  (row.loc / MAX_LOC) *
                  MAX_BAR_W *
                  Math.max(0, barStretch);
                const slideY = interpolate(barSpring, [0, 1], [14, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      height: ROW_H,
                      marginBottom: 8,
                      opacity: rowOpacity,
                      transform: `translateY(${slideY}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: LABEL_W,
                        flexShrink: 0,
                        fontFamily: THEME.fonts.sans,
                        fontSize: 18,
                        fontWeight: 600,
                        color: THEME.colors.textSecondary,
                        textAlign: "right",
                        paddingRight: 18,
                      }}
                    >
                      {row.label}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 34,
                        borderRadius: THEME.radius.sm,
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.14))",
                        boxShadow: THEME.shadows.inset,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: Math.max(0, w),
                          borderRadius: THEME.radius.sm,
                          background: `linear-gradient(90deg, ${row.color}, ${row.color}cc)`,
                          boxShadow: row.mintGlow
                            ? `${THEME.shadows.glow}, 0 0 24px rgba(110,231,183,0.42)`
                            : "0 4px 18px rgba(0,0,0,0.42)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        marginLeft: 16,
                        minWidth: 52,
                        fontFamily: THEME.fonts.mono,
                        fontSize: THEME.fontSize.base,
                        fontWeight: 600,
                        color: THEME.colors.textMuted,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {row.loc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Phase B — Zero-cost abstraction + GEMM bars ─── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 8,
              gap: 26,
              opacity: phaseBVisible,
              pointerEvents: phaseBVisible < 0.02 ? "none" : "auto",
            }}
          >
            <div
              style={{
                transform: `scale(${0.92 + titleSpring * 0.08}) translateY(${interpolate(titleSpring, [0, 1], [28, 0])}px)`,
                opacity: interpolate(titleSpring, [0, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }) * phaseBVisible,
                fontFamily: THEME.fonts.sans,
                fontSize: 56,
                fontWeight: 800,
                color: THEME.colors.textPrimary,
                textAlign: "center",
                letterSpacing: "-0.025em",
                textShadow: titleShadow,
              }}
            >
              Zero-Cost Abstraction
            </div>

            <div
              style={{
                opacity:
                  interpolate(comparisonSpring, [0, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }) * phaseBVisible,
                transform: `translateY(${interpolate(comparisonSpring, [0, 1], [22, 0])}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
              }}
            >
              <div
                style={{
                  fontFamily: THEME.fonts.mono,
                  fontSize: THEME.fontSize.lg,
                  fontWeight: 600,
                  color: THEME.colors.accent,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textShadow: "0 0 18px rgba(129,140,248,0.35)",
                }}
              >
                GEMM FP16
              </div>
              <div
                style={{
                  transform: `scale(${badgeSpring})`,
                  opacity: interpolate(badgeSpring, [0.75, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  padding: "12px 26px",
                  borderRadius: THEME.radius.md,
                  background:
                    "linear-gradient(135deg, rgba(110,231,183,0.22), rgba(129,140,248,0.14))",
                  border: "1px solid rgba(110,231,183,0.42)",
                  boxShadow: `${THEME.shadows.glowSm}, ${THEME.shadows.inset}, 0 0 36px rgba(129,140,248,0.12)`,
                  fontFamily: THEME.fonts.mono,
                  fontSize: THEME.fontSize.xl,
                  fontWeight: 700,
                  color: THEME.colors.primary,
                  letterSpacing: "0.06em",
                  textShadow:
                    "0 0 18px rgba(110,231,183,0.55), 0 2px 12px rgba(0,0,0,0.35)",
                }}
              >
                +5.3%
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: 130,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 220,
                  }}
                >
                  <div
                    style={{
                      opacity:
                        interpolate(valueSpring, [0, 1], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }),
                      transform: `translateY(${interpolate(valueSpring, [0, 1], [12, 0])}px) scale(${0.94 + valueSpring * 0.06})`,
                      marginBottom: 14,
                      fontFamily: THEME.fonts.mono,
                      fontSize: 46,
                      fontWeight: 700,
                      color: THEME.colors.textPrimary,
                      textShadow:
                        "0 0 22px rgba(110,231,183,0.35), 0 2px 14px rgba(0,0,0,0.35)",
                    }}
                  >
                    {CROQ_TFLOPS.toFixed(1)}
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: THEME.fontSize.lg,
                        color: THEME.colors.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      TFLOPS
                    </span>
                  </div>
                  <div
                    style={{
                      height: maxBarPx,
                      width: 124,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      borderRadius: THEME.radius.md,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.18))",
                      boxShadow: THEME.shadows.inset,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: croqBarH,
                        borderRadius: THEME.radius.md,
                        background: `linear-gradient(180deg, ${THEME.colors.primary}, ${THEME.colors.primaryDark})`,
                        boxShadow: `${THEME.shadows.glow}, 0 14px 44px rgba(110,231,183,0.26)`,
                        opacity: interpolate(scatterMorph, [0, 1], [1, 0.12]),
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      fontFamily: THEME.fonts.sans,
                      fontSize: THEME.fontSize.xl,
                      fontWeight: 700,
                      color: THEME.colors.primary,
                      textShadow:
                        "0 0 16px rgba(110,231,183,0.35)",
                    }}
                  >
                    CroqTile
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 220,
                  }}
                >
                  <div
                    style={{
                      opacity:
                        interpolate(torchValueSpring, [0, 1], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }),
                      transform: `translateY(${interpolate(torchValueSpring, [0, 1], [12, 0])}px) scale(${0.94 + torchValueSpring * 0.06})`,
                      marginBottom: 14,
                      fontFamily: THEME.fonts.mono,
                      fontSize: 46,
                      fontWeight: 700,
                      color: THEME.colors.textSecondary,
                      textShadow: "0 2px 14px rgba(0,0,0,0.35)",
                    }}
                  >
                    {TORCH_TFLOPS.toFixed(1)}
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: THEME.fontSize.lg,
                        color: THEME.colors.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      TFLOPS
                    </span>
                  </div>
                  <div
                    style={{
                      height: maxBarPx,
                      width: 124,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      borderRadius: THEME.radius.md,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.22))",
                      boxShadow: THEME.shadows.inset,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: torchBarH,
                        borderRadius: THEME.radius.md,
                        background: `linear-gradient(180deg, ${THEME.colors.textMuted}, #273041)`,
                        boxShadow: "0 10px 32px rgba(0,0,0,0.48)",
                        opacity: interpolate(scatterMorph, [0, 1], [1, 0.1]),
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      fontFamily: THEME.fonts.sans,
                      fontSize: THEME.fontSize.xl,
                      fontWeight: 600,
                      color: THEME.colors.textSecondary,
                    }}
                  >
                    PyTorch
                  </div>
                </div>
              </div>
            </div>

            <p
              style={{
                margin: 0,
                marginTop: 4,
                opacity:
                  interpolate(
                    frame,
                    [PHASE_B_START + 58, PHASE_B_START + 86],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ) * phaseBVisible,
                transform: `translateY(${interpolate(
                  frame,
                  [PHASE_B_START + 58, PHASE_B_START + 86],
                  [10, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                )}px)`,
                fontFamily: THEME.fonts.sans,
                fontSize: THEME.fontSize.lg,
                color: THEME.colors.textSecondary,
                textAlign: "center",
                maxWidth: 720,
                lineHeight: 1.5,
              }}
            >
              Higher abstraction, less code — but no performance loss
            </p>
          </div>

          {/* ─── Phase C — scatter plot ─── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: 48,
              opacity: phaseCOpacity,
              pointerEvents: phaseCOpacity < 0.02 ? "none" : "auto",
            }}
          >
            <svg
              width={Math.min(plotW + 130, 1120)}
              height={plotH + 72}
              viewBox={`0 0 ${plotW + 130} ${plotH + 72}`}
              style={{ overflow: "visible" }}
            >
              <defs>
                <filter
                  id="croqGlow"
                  x="-120%"
                  y="-120%"
                  width="340%"
                  height="340%"
                >
                  <feGaussianBlur
                    stdDeviation={10 + pulse * 8}
                    result="b"
                  />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <text
                x={padL + (plotW - padL) / 2}
                y={26}
                textAnchor="middle"
                fill={THEME.colors.textSecondary}
                style={{
                  fontFamily: THEME.fonts.sans,
                  fontSize: 18,
                  fontWeight: 600,
                  textShadow: "0 1px 10px rgba(0,0,0,0.45)",
                }}
              >
                Simplicity → (simpler →)
              </text>
              <text
                x={22}
                y={padT + plotH / 2}
                textAnchor="middle"
                fill={THEME.colors.textSecondary}
                transform={`rotate(-90, 22, ${padT + plotH / 2})`}
                style={{
                  fontFamily: THEME.fonts.sans,
                  fontSize: 18,
                  fontWeight: 600,
                  textShadow: "0 1px 10px rgba(0,0,0,0.45)",
                }}
              >
                Performance (TFLOPS) ↑
              </text>
              <line
                x1={padL}
                y1={plotH - padB}
                x2={plotW}
                y2={plotH - padB}
                stroke={THEME.colors.textMuted}
                strokeOpacity={0.55}
                strokeWidth={1}
              />
              <line
                x1={padL}
                y1={padT}
                x2={padL}
                y2={plotH - padB}
                stroke={THEME.colors.textMuted}
                strokeOpacity={0.55}
                strokeWidth={1}
              />
              {SCATTER.map((pt, i) => {
                const cx = toSx(pt.x);
                const cy = toSy(pt.y);
                const appear = spring({
                  frame: Math.max(0, cFrame - 8 - i * 12),
                  fps,
                  config: { damping: 16, stiffness: 88, mass: 0.82 },
                  from: 0,
                  to: 1,
                });
                const pop = interpolate(appear, [0, 1], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                const rBase = pt.large ? 17 + pulse * 3 : 10;
                const r = rBase * (0.35 + 0.65 * pop);
                const fo =
                  interpolate(appear, [0, 1], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }) * phaseCOpacity;
                const labelYOffset = interpolate(appear, [0, 1], [10, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <g key={pt.id} opacity={fo}>
                    {pt.large && (
                      <>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={(r + 36) * (0.4 + 0.6 * pop)}
                          fill={THEME.colors.primary}
                          fillOpacity={0.06 + 0.08 * pulse}
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r={(r + 22 * pulse) * pop}
                          fill={THEME.colors.primary}
                          fillOpacity={0.14 + 0.12 * pulse}
                        />
                      </>
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={Math.max(0.001, r)}
                      fill={pt.color}
                      stroke={
                        pt.large ? THEME.colors.primaryDark : "rgba(0,0,0,0.4)"
                      }
                      strokeWidth={pt.large ? 2.5 : 1}
                      filter={pt.large ? "url(#croqGlow)" : undefined}
                    />
                    <text
                      x={cx}
                      y={cy + rBase + 22 - labelYOffset}
                      textAnchor="middle"
                      fill={
                        pt.large
                          ? THEME.colors.textPrimary
                          : THEME.colors.textSecondary
                      }
                      style={{
                        fontFamily: THEME.fonts.sans,
                        fontSize: pt.large ? 17 : 14,
                        fontWeight: pt.large ? 700 : 600,
                        textShadow: pt.large
                          ? "0 0 14px rgba(110,231,183,0.55), 0 2px 12px rgba(0,0,0,0.55)"
                          : "0 2px 10px rgba(0,0,0,0.55)",
                      }}
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
