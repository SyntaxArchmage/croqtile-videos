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

const LOC_ROWS: {
  label: string;
  loc: number;
  color: string;
  mintGlow: boolean;
}[] = [
  { label: "CroqTile-Python", loc: 30, color: "#6EE7B7", mintGlow: true },
  { label: "CroqTile", loc: 36, color: "#6EE7B7", mintGlow: true },
  { label: "TileLang", loc: 70, color: "#6B7280", mintGlow: false },
  { label: "Triton", loc: 80, color: "#6B7280", mintGlow: false },
  { label: "CUDA + CuTe", loc: 182, color: "#FCD34D", mintGlow: false },
  { label: "CUTLASS", loc: 280, color: "#FCD34D", mintGlow: false },
];

const MAX_LOC = 280;
const CROQ_TFLOPS = 471.3;
const TORCH_TFLOPS = 447.5;

const SCATTER = [
  { id: "croq", label: "CroqTile", x: 7.8, y: 471, color: THEME.colors.primary, large: true },
  { id: "triton", label: "Triton", x: 3.5, y: 430, color: "#6B7280", large: false },
  { id: "tilelang", label: "TileLang", x: 4.0, y: 420, color: "#6B7280", large: false },
  { id: "cuda", label: "CUDA+CuTe", x: 1.5, y: 447, color: "#6B7280", large: false },
  { id: "cutlass", label: "CUTLASS", x: 1.0, y: 447, color: "#6B7280", large: false },
] as const;

const LABEL_W = 200;
const MAX_BAR_W = 720;
const ROW_H = 56;

export const PerfChart: React.FC = () => {
  const frame = Math.min(useCurrentFrame(), TOTAL_FRAMES - 1);
  const { fps } = useVideoConfig();

  const phaseAOpacity = interpolate(
    frame,
    [Math.max(0, PHASE_A_END - 29), PHASE_B_START],
    [1, 0],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const phaseBFadeOut = interpolate(
    frame,
    [PHASE_B_END - 19, PHASE_B_END + 11],
    [1, 0],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const phaseBFadeIn = interpolate(frame, [235, 265], [0, 1], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phaseBVisible = phaseBFadeIn * phaseBFadeOut;

  const phaseCOpacity = interpolate(
    frame,
    [PHASE_C_START - 20, PHASE_C_START + 15],
    [0, 1],
    {
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const bFrame = Math.max(0, frame - PHASE_B_START);

  const titleSpring = spring({
    frame: Math.max(0, bFrame - 8),
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.85 },
    from: 0,
    to: 1,
  });

  const comparisonSpring = spring({
    frame: Math.max(0, bFrame - 28),
    fps,
    config: { damping: 18, stiffness: 95, mass: 0.8 },
    from: 0,
    to: 1,
  });

  const badgeSpring = spring({
    frame: Math.max(0, bFrame - 52),
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.65 },
    from: 0.75,
    to: 1,
  });

  const barGrowth = spring({
    frame: Math.max(0, bFrame - 40),
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

  const valueFade = interpolate(
    frame,
    [PHASE_B_START + 55, PHASE_B_START + 78],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scatterMorph = interpolate(
    frame,
    [PHASE_C_START - 22, PHASE_C_START + 12],
    [0, 1],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const cFrame = Math.max(0, frame - PHASE_C_START);

  const plotW = 860;
  const plotH = 420;
  const padL = 72;
  const padB = 48;
  const padT = 28;
  const xMin = 0;
  const xMax = 9;
  const yMin = 400;
  const yMax = 485;

  const toSx = (x: number) =>
    padL + ((x - xMin) / (xMax - xMin)) * (plotW - padL - 32);
  const toSy = (y: number) =>
    padT + (1 - (y - yMin) / (yMax - yMin)) * (plotH - padT - padB);

  const pulse = 0.55 + 0.45 * Math.sin(frame * 0.14);

  return (
    <PageContainer tag="Performance">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.035} />
        </AbsoluteFill>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: phaseAOpacity,
              pointerEvents: phaseAOpacity < 0.02 ? "none" : "auto",
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 36,
                fontFamily: THEME.fonts.sans,
                fontSize: THEME.fontSize.xl,
                fontWeight: 700,
                color: THEME.colors.textPrimary,
                textAlign: "center",
              }}
            >
              Lines of Code — Persistent GEMM Kernel
            </h2>
            <div
              style={{
                width: LABEL_W + MAX_BAR_W + 48,
              }}
            >
              {LOC_ROWS.map((row, i) => {
                const p = spring({
                  frame: Math.max(0, frame - 8 - i * 16),
                  fps,
                  config: { damping: 17, stiffness: 88, mass: 0.9 },
                  from: 0,
                  to: 1,
                });
                const w = (row.loc / MAX_LOC) * MAX_BAR_W * Math.max(0, p);
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      height: ROW_H,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: LABEL_W,
                        flexShrink: 0,
                        fontFamily: THEME.fonts.sans,
                        fontSize: THEME.fontSize.sm,
                        fontWeight: 600,
                        color: THEME.colors.textSecondary,
                        textAlign: "right",
                        paddingRight: 16,
                      }}
                    >
                      {row.label}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 28,
                        borderRadius: THEME.radius.sm,
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.12))",
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
                            ? `${THEME.shadows.glow}, 0 0 20px rgba(110,231,183,0.45)`
                            : "0 4px 16px rgba(0,0,0,0.35)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        marginLeft: 14,
                        width: 44,
                        fontFamily: THEME.fonts.mono,
                        fontSize: THEME.fontSize.sm,
                        color: THEME.colors.textMuted,
                      }}
                    >
                      {row.loc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              opacity: phaseBVisible,
              pointerEvents: phaseBVisible < 0.02 ? "none" : "auto",
            }}
          >
            <div
              style={{
                transform: `scale(${0.92 + titleSpring * 0.08}) translateY(${
                  interpolate(titleSpring, [0, 1], [24, 0])
                }px)`,
                opacity: titleSpring * phaseBVisible,
                fontFamily: THEME.fonts.sans,
                fontSize: THEME.fontSize["3xl"],
                fontWeight: 800,
                color: THEME.colors.textPrimary,
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              Zero-Cost Abstraction
            </div>

            <div
              style={{
                opacity: comparisonSpring * phaseBVisible,
                transform: `translateY(${interpolate(comparisonSpring, [0, 1], [18, 0])}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  transform: `scale(${badgeSpring})`,
                  padding: "10px 22px",
                  borderRadius: THEME.radius.md,
                  background:
                    "linear-gradient(135deg, rgba(110,231,183,0.18), rgba(129,140,248,0.12))",
                  border: "1px solid rgba(110,231,183,0.35)",
                  boxShadow: `${THEME.shadows.glowSm}, ${THEME.shadows.inset}`,
                  fontFamily: THEME.fonts.mono,
                  fontSize: THEME.fontSize.lg,
                  fontWeight: 700,
                  color: THEME.colors.primary,
                  letterSpacing: "0.04em",
                }}
              >
                +5.3%
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-end",
                  gap: 120,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 200,
                  }}
                >
                  <div
                    style={{
                      opacity: valueFade,
                      marginBottom: 12,
                      fontFamily: THEME.fonts.mono,
                      fontSize: THEME.fontSize["2xl"],
                      fontWeight: 700,
                      color: THEME.colors.textPrimary,
                    }}
                  >
                    {CROQ_TFLOPS.toFixed(1)}
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: THEME.fontSize.sm,
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
                      width: 120,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      borderRadius: THEME.radius.md,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.18))",
                      boxShadow: THEME.shadows.inset,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: croqBarH,
                        borderRadius: THEME.radius.md,
                        background: `linear-gradient(180deg, ${THEME.colors.primary}, ${THEME.colors.primaryDark})`,
                        boxShadow: `${THEME.shadows.glow}, 0 12px 40px rgba(110,231,183,0.22)`,
                        opacity: interpolate(scatterMorph, [0, 1], [1, 0.15]),
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      fontFamily: THEME.fonts.sans,
                      fontSize: THEME.fontSize.lg,
                      fontWeight: 600,
                      color: THEME.colors.primary,
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
                    width: 200,
                  }}
                >
                  <div
                    style={{
                      opacity: valueFade,
                      marginBottom: 12,
                      fontFamily: THEME.fonts.mono,
                      fontSize: THEME.fontSize["2xl"],
                      fontWeight: 700,
                      color: THEME.colors.textSecondary,
                    }}
                  >
                    {TORCH_TFLOPS.toFixed(1)}
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: THEME.fontSize.sm,
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
                      width: 120,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      borderRadius: THEME.radius.md,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))",
                      boxShadow: THEME.shadows.inset,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: torchBarH,
                        borderRadius: THEME.radius.md,
                        background: "linear-gradient(180deg, #6B7280, #374151)",
                        boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
                        opacity: interpolate(scatterMorph, [0, 1], [1, 0.12]),
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      fontFamily: THEME.fonts.sans,
                      fontSize: THEME.fontSize.lg,
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
                marginTop: 8,
                opacity: interpolate(
                  frame,
                  [PHASE_B_START + 60, PHASE_B_START + 88],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                ) * phaseBVisible,
                fontFamily: THEME.fonts.sans,
                fontSize: THEME.fontSize.base,
                color: THEME.colors.textSecondary,
                textAlign: "center",
                maxWidth: 640,
                lineHeight: 1.45,
              }}
            >
              Higher abstraction, less code — but no performance loss
            </p>
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: phaseCOpacity,
              pointerEvents: phaseCOpacity < 0.02 ? "none" : "auto",
            }}
          >
            <svg
              width={Math.min(plotW + 120, 1100)}
              height={plotH + 56}
              viewBox={`0 0 ${plotW + 120} ${plotH + 56}`}
              style={{ overflow: "visible" }}
            >
              <defs>
                <filter
                  id="croqGlow"
                  x="-80%"
                  y="-80%"
                  width="260%"
                  height="260%"
                >
                  <feGaussianBlur
                    stdDeviation={8 + pulse * 6}
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
                y={20}
                textAnchor="middle"
                fill={THEME.colors.textSecondary}
                style={{
                  fontFamily: THEME.fonts.sans,
                  fontSize: THEME.fontSize.sm,
                  fontWeight: 600,
                }}
              >
                Simplicity →
              </text>
              <text
                x={18}
                y={padT + plotH / 2 - 40}
                textAnchor="middle"
                fill={THEME.colors.textSecondary}
                transform={`rotate(-90, 18, ${padT + plotH / 2 - 40})`}
                style={{
                  fontFamily: THEME.fonts.sans,
                  fontSize: THEME.fontSize.sm,
                  fontWeight: 600,
                }}
              >
                Performance (TFLOPS) ↑
              </text>
              <line
                x1={padL}
                y1={plotH - padB}
                x2={plotW - 8}
                y2={plotH - padB}
                stroke={THEME.colors.textMuted}
                strokeOpacity={0.5}
                strokeWidth={1}
              />
              <line
                x1={padL}
                y1={padT}
                x2={padL}
                y2={plotH - padB}
                stroke={THEME.colors.textMuted}
                strokeOpacity={0.5}
                strokeWidth={1}
              />
              {SCATTER.map((pt, i) => {
                const cx = toSx(pt.x);
                const cy = toSy(pt.y);
                const appear = spring({
                  frame: Math.max(0, cFrame - 6 - i * 10),
                  fps,
                  config: { damping: 16, stiffness: 85, mass: 0.85 },
                  from: 0,
                  to: 1,
                });
                const r = pt.large ? 15 + pulse * 3 : 9;
                const fo = appear * phaseCOpacity;
                return (
                  <g key={pt.id} opacity={fo}>
                    {pt.large && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r + 18 * pulse}
                        fill={THEME.colors.primary}
                        fillOpacity={0.12 + 0.1 * pulse}
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={pt.color}
                      stroke={
                        pt.large ? THEME.colors.primaryDark : "rgba(0,0,0,0.35)"
                      }
                      strokeWidth={pt.large ? 2 : 1}
                      filter={pt.large ? "url(#croqGlow)" : undefined}
                    />
                    <text
                      x={cx}
                      y={cy + r + 18}
                      textAnchor="middle"
                      fill={THEME.colors.textPrimary}
                      style={{
                        fontFamily: THEME.fonts.sans,
                        fontSize: pt.large ? 14 : 12,
                        fontWeight: pt.large ? 700 : 600,
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
