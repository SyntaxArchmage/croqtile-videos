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

const TOTAL_FRAMES = 770;

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
const PERF_COMPARISONS = [
  { kernel: "GEMM FP16", croq: 471.3, baseline: 447.5, baseLabel: "PyTorch", unit: "TFLOPS" },
  { kernel: "GEMM FP8", croq: 262.7, baseline: 256.9, baseLabel: "CUTLASS", unit: "TFLOPS" },
  { kernel: "SPMM FP16", croq: 630.5, baseline: 628.5, baseLabel: "cuSparseLt", unit: "TFLOPS" },
  { kernel: "SPMM FP8", croq: 995.6, baseline: 952.1, baseLabel: "cuSparseLt", unit: "TFLOPS" },
] as const;

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
                opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
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
                // CroqTile (i=1) and CUTLASS (i=5) arrive from Seg 2 morph — start visible
                const isCarried = i === 1 || i === 5;
                const barSpring = isCarried
                  ? 1
                  : spring({
                      frame: Math.max(0, frame - 18 - i * 14),
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
                const slideY = isCarried
                  ? 0
                  : interpolate(barSpring, [0, 1], [14, 0], {
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

          {/* ─── Phase B — Zero-cost abstraction: multi-kernel comparison ─── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 8,
              gap: 20,
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
                fontSize: 52,
                fontWeight: 800,
                color: THEME.colors.textPrimary,
                textAlign: "center",
                letterSpacing: "-0.025em",
                textShadow: titleShadow,
              }}
            >
              Zero-Cost Abstraction
            </div>

            {/* Multi-kernel comparison rows */}
            <div style={{ width: 1080, opacity: interpolate(comparisonSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * phaseBVisible }}>
              {PERF_COMPARISONS.map((comp, i) => {
                const rowSpring = spring({
                  frame: Math.max(0, bFrame - 24 - i * 16),
                  fps,
                  config: { damping: 16, stiffness: 90, mass: 0.85 },
                  from: 0,
                  to: 1,
                });
                const maxVal = Math.max(comp.croq, comp.baseline);
                const croqW = (comp.croq / maxVal) * 580 * rowSpring;
                const baseW = (comp.baseline / maxVal) * 580 * rowSpring;
                const pct = ((comp.croq / comp.baseline - 1) * 100).toFixed(1);
                return (
                  <div key={comp.kernel} style={{ display: "flex", alignItems: "center", marginBottom: 14, opacity: rowSpring, transform: `translateY(${interpolate(rowSpring, [0, 1], [12, 0])}px)` }}>
                    <div style={{ width: 140, flexShrink: 0, fontFamily: THEME.fonts.mono, fontSize: 16, fontWeight: 600, color: THEME.colors.accent, textAlign: "right", paddingRight: 16 }}>
                      {comp.kernel}
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: croqW, height: 22, borderRadius: THEME.radius.sm, background: `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.primary}cc)`, boxShadow: `${THEME.shadows.glowSm}, 0 0 16px rgba(110,231,183,0.3)` }} />
                        <span style={{ fontFamily: THEME.fonts.mono, fontSize: 14, fontWeight: 700, color: THEME.colors.primary }}>{comp.croq}</span>
                        <span style={{ fontFamily: THEME.fonts.mono, fontSize: 13, color: THEME.colors.primary, opacity: 0.7 }}>CroqTile</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: baseW, height: 22, borderRadius: THEME.radius.sm, background: `linear-gradient(90deg, ${THEME.colors.textMuted}, ${THEME.colors.textMuted}88)` }} />
                        <span style={{ fontFamily: THEME.fonts.mono, fontSize: 14, fontWeight: 600, color: THEME.colors.textMuted }}>{comp.baseline}</span>
                        <span style={{ fontFamily: THEME.fonts.mono, fontSize: 13, color: THEME.colors.textSecondary, opacity: 0.7 }}>{comp.baseLabel}</span>
                      </div>
                    </div>
                    <div style={{ width: 70, flexShrink: 0, textAlign: "center", fontFamily: THEME.fonts.mono, fontSize: 18, fontWeight: 700, color: THEME.colors.primary, textShadow: "0 0 12px rgba(110,231,183,0.4)" }}>
                      +{pct}%
                    </div>
                  </div>
                );
              })}
            </div>

            <p
              style={{
                margin: 0,
                marginTop: 4,
                opacity:
                  interpolate(
                    frame,
                    [PHASE_B_START + 80, PHASE_B_START + 110],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  ) * phaseBVisible,
                transform: `translateY(${interpolate(
                  frame,
                  [PHASE_B_START + 80, PHASE_B_START + 110],
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
