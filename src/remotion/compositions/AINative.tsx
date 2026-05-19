/**
 * remotion/compositions/AINative.tsx
 * Segment 6 — AI-native features (3:36–5:59 @ 30fps = 4650 frames)
 *
 * Reordered to match script flow (6A→6C→6D→6E→6B→closing):
 * 6A 0–500f     Born for Agentic AI — intro + two pillars
 * 6C 476–1300f  Zero Context Waste — tokens, minimal code changes
 * 6D 1252–2170f Compile Feedback Speed — error catching, fast loop
 * 6E 2120–2960f Harness Tools — profiler + knowledge base
 * 6B 2910–3650f Real Results — convergence benchmarks
 * 6F 3600–3880f Closing — effortless tuning + back cover with slogan
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";
import { DeviceShell } from "../components/DeviceShell";

const TOTAL_FRAMES = 4650;

const FADE_FRAMES = 24;

/** Body stacks below PageContainer header; keep primary visuals above ~y=700 for subtitle safe zone */
const BODY_MAX_HEIGHT = 432;

/** Typography — Segment 6 (1080p legibility; maps to THEME.fontSize where exact) */
const FS = {
  /** Between 2xl (38) and 3xl (52) — intentional video hero size */
  main: 48,
  mainAccent: THEME.fontSize["3xl"],
  /** Card/chart titles — between lg (20) and xl (28) */
  label: 22,
  labelSm: 18,
  mono: THEME.fontSize.lg,
  monoLg: 24,
} as const;

/** Benchmark chart series outside core palette */
const CHART = {
  tileLang: "#F472B6",
  cuteDsl: "#A78BFA",
} as const;

const SHELL_HEIGHT = 380;

const SEG = {
  A: { seqFrom: 0, seqDur: 500, start: 0, end: 500 },
  C: { seqFrom: 452, seqDur: 848, start: 476, end: 1300 },
  D: { seqFrom: 1228, seqDur: 942, start: 1252, end: 2170 },
  E: { seqFrom: 2096, seqDur: 864, start: 2120, end: 2960 },
  B: { seqFrom: 2886, seqDur: 764, start: 2910, end: 3650 },
  F: { seqFrom: 3576, seqDur: 304, start: 3600, end: 3880 },
} as const;

const SegmentWrap: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const fadeOut = interpolate(
    frame,
    [duration - FADE_FRAMES, duration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    },
  );
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      <NoiseOverlay opacity={0.028} blendMode="soft-light" />
      {children}
    </AbsoluteFill>
  );
};

/** CSS-only agent badge: monitor + antenna + eyes */
const AgentBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        width: 120,
        height: 140,
        position: "relative",
        filter: `drop-shadow(${THEME.shadows.glowSm})`,
      }}
    >
      {/* Antenna */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -18,
          width: 4,
          height: 22,
          marginLeft: -2,
          background: THEME.colors.bgElevated,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: -24,
          width: 12,
          height: 12,
          marginLeft: -6,
          borderRadius: THEME.radius.full,
          background: THEME.colors.primary,
          boxShadow: THEME.shadows.glowSm,
        }}
      />
      {/* Head */}
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 8,
          width: 100,
          height: 72,
          borderRadius: THEME.radius.md,
          background: `linear-gradient(145deg, ${THEME.colors.bgElevated}, ${THEME.colors.bgCard})`,
          border: `1px solid ${THEME.colors.primary}59`,
          boxShadow: THEME.shadows.inset,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            padding: "22px 20px 0",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: THEME.radius.full,
              background: THEME.colors.accent,
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: THEME.radius.full,
              background: THEME.colors.accent,
            }}
          />
        </div>
        {/* Terminal prompt bar */}
        <div
          style={{
            marginTop: 10,
            marginLeft: 12,
            marginRight: 12,
            height: 4,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${THEME.colors.primary}, transparent)`,
            opacity: 0.7,
          }}
        />
      </div>
      {/* Body / shell */}
      <div
        style={{
          position: "absolute",
          left: 4,
          bottom: 0,
          width: 112,
          height: 52,
          borderRadius: THEME.radius.md,
          background: THEME.colors.bgCard,
          border: `1px solid rgba(255,255,255,0.08)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 28,
            height: 18,
            borderRadius: 4,
            background: THEME.colors.bgBase,
            border: `1px solid ${THEME.colors.textMuted}`,
          }}
        />
        <div
          style={{
            fontSize: FS.labelSm,
            fontFamily: THEME.fonts.mono,
            color: THEME.colors.textCode,
            fontWeight: 600,
          }}
        >
          AI
        </div>
      </div>
    </div>
  );
};

const Sub6A: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame);

  const badgeOp = spring({
    frame: t - 8,
    fps,
    config: { damping: 16, stiffness: 100 },
    from: 0,
    to: 1,
  });

  const taglineOp = spring({
    frame: t - 24,
    fps,
    config: { damping: 15, stiffness: 90 },
    from: 0,
    to: 1,
  });

  const phase1Fade = interpolate(t, [240, 280], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phase2Fade = interpolate(t, [240, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pillarLeft = spring({
    frame: t - 290,
    fps,
    config: { damping: 16, stiffness: 110 },
    from: 0,
    to: 1,
  });
  const pillarRight = spring({
    frame: t - 340,
    fps,
    config: { damping: 16, stiffness: 100 },
    from: 0,
    to: 1,
  });

  const pillarSpringStyle = (p: number) => ({
    opacity: p * phase2Fade,
    transform: `translateY(${interpolate(p, [0, 1], [32, 0])}px) scale(${interpolate(p, [0, 1], [0.88, 1])})`,
  });

  return (
    <SegmentWrap duration={SEG.A.seqDur}>
      <PageContainer
        tag="Segment 06"
        title=""
        subtitle=""
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 48,
            opacity: badgeOp,
            transform: `translate(${(1 - badgeOp) * 48}px, ${(1 - badgeOp) * -36}px)`,
            zIndex: 2,
          }}
        >
          <AgentBadge scale={0.62} />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT,
            position: "relative",
          }}
        >
          {/* Phase 1: the question */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              opacity: taglineOp * phase1Fade,
              transform: `translateY(${interpolate(taglineOp, [0, 1], [18, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: FS.main,
                fontFamily: THEME.fonts.sans,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: 1.45,
                maxWidth: 820,
                color: THEME.colors.textPrimary,
              }}
            >
              怎样让{" "}
              <span style={{ color: THEME.colors.primary }}>AI Agent</span>{" "}
              成为更好的
              <br />
              计算核调优工程师？
            </div>
            <div
              style={{
                fontSize: FS.label,
                fontFamily: THEME.fonts.sans,
                color: THEME.colors.textSecondary,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              How do we make AI Agent a better kernel tuning engineer?
            </div>
          </div>

          {/* Phase 2: two visual pillars — bigger cards */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 48,
              opacity: phase2Fade,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                width: 380,
                borderRadius: THEME.radius.lg,
                background: THEME.colors.bgCard,
                border: `1px solid ${THEME.colors.primary}55`,
                boxShadow: `${THEME.shadows.card}, 0 0 32px ${THEME.colors.primaryGlow}`,
                padding: "36px 28px",
                ...pillarSpringStyle(pillarLeft),
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: THEME.radius.lg,
                  background: `linear-gradient(145deg, ${THEME.colors.primaryGlow}, ${THEME.colors.bgElevated})`,
                  border: `1px solid ${THEME.colors.primary}55`,
                  boxShadow: `0 0 32px ${THEME.colors.primaryGlow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <rect x="8" y="6" width="24" height="32" rx="3" stroke={THEME.colors.textCode} strokeWidth="1.75" fill={`${THEME.colors.bgBase}99`} />
                  <path d="M14 14h14M14 20h10M14 26h12" stroke={THEME.colors.primary} strokeWidth="2" strokeLinecap="round" />
                  <circle cx="38" cy="38" r="10" stroke={THEME.colors.primary} strokeWidth="2" fill={`${THEME.colors.bgBase}CC`} />
                  <path d="M45 45l6 6" stroke={THEME.colors.primary} strokeWidth="2.25" strokeLinecap="round" />
                  <circle cx="38" cy="38" r="4.5" stroke={THEME.colors.accent} strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: FS.mainAccent, fontFamily: THEME.fonts.sans, fontWeight: 700, color: THEME.colors.textPrimary, textAlign: "center" }}>
                  更友好的上下文
                </div>
                <div style={{ fontSize: FS.label, fontFamily: THEME.fonts.sans, color: THEME.colors.primary, textAlign: "center" }}>
                  Friendlier Context
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                width: 380,
                borderRadius: THEME.radius.lg,
                background: THEME.colors.bgCard,
                border: `1px solid ${THEME.colors.accentWarm}55`,
                boxShadow: `${THEME.shadows.card}, 0 0 32px ${THEME.colors.accentWarm}2E`,
                padding: "36px 28px",
                ...pillarSpringStyle(pillarRight),
              }}
            >
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: THEME.radius.lg,
                  background: `linear-gradient(145deg, ${THEME.colors.accentWarm}2E, ${THEME.colors.bgElevated})`,
                  border: `1px solid ${THEME.colors.accentWarm}66`,
                  boxShadow: `0 0 32px ${THEME.colors.accentWarm}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                  <rect
                    x="7"
                    y="10"
                    width="38"
                    height="28"
                    rx="4"
                    stroke={THEME.colors.textCode}
                    strokeWidth="1.75"
                    fill={`${THEME.colors.bgBase}99`}
                  />
                  <path
                    d="M7 16h38"
                    stroke={THEME.colors.textMuted}
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="13" r="1.5" fill={THEME.colors.danger} />
                  <circle cx="17" cy="13" r="1.5" fill={THEME.colors.accentWarm} />
                  <circle cx="22" cy="13" r="1.5" fill={THEME.colors.primary} />
                  <path
                    d="M13 24l-2 2 2 2M20 28h8"
                    stroke={THEME.colors.accentWarm}
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="38"
                    cy="34"
                    r="10"
                    stroke={THEME.colors.accentWarm}
                    strokeWidth="1.75"
                    fill={`${THEME.colors.bgElevated}EE`}
                  />
                  <path
                    d="M33.5 34l3 3 6-6"
                    stroke={THEME.colors.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div style={{ fontSize: FS.mainAccent, fontFamily: THEME.fonts.sans, fontWeight: 700, color: THEME.colors.textPrimary, textAlign: "center" }}>
                  更快的编译器反馈
                </div>
                <div style={{ fontSize: FS.label, fontFamily: THEME.fonts.sans, color: THEME.colors.accentWarm, textAlign: "center" }}>
                  Faster Compiler Feedback
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </SegmentWrap>
  );
};

const Sub6B: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame;

  const phase1Op = interpolate(t, [0, 18, 320, 350], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const phase2Op = interpolate(t, [300, 330, 520, 550], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const phase3Op = interpolate(t, [500, 530, 730, 764], [0, 1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const chartReveal = spring({
    frame: t - 14,
    fps,
    config: { damping: 16, stiffness: 95 },
    from: 0,
    to: 1,
  });

  const yForTflops = (v: number) =>
    interpolate(v, [0, 550], [340, 36], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const xForIter = (i: number, total: number) =>
    72 + (i * (888 - 72)) / (total - 1);

  const convergenceSeries = [
    {
      label: "CroqTile",
      color: THEME.colors.primary,
      values: [72, 198, 340, 418, 462, 480, 486],
      width: 4,
      glow: true,
    },
    {
      label: "Triton",
      color: THEME.colors.accent,
      values: [58, 148, 258, 328, 362, 378, 384],
      width: 2.5,
    },
    {
      label: "TileLang",
      color: CHART.tileLang,
      values: [52, 132, 228, 298, 322, 336, 343],
      width: 2.5,
    },
    {
      label: "Helion",
      color: THEME.colors.accentWarm,
      values: [48, 118, 208, 272, 298, 312, 318],
      width: 2.5,
    },
    {
      label: "CUDA",
      color: THEME.colors.danger,
      values: [38, 72, 108, 132, 148, 156, 162],
      width: 2,
    },
    {
      label: "CuTe-DSL",
      color: CHART.cuteDsl,
      values: [12, 16, 20, 22, 24, 26, 27],
      width: 2,
    },
  ];

  const CUBLAS_BASELINE = 420;

  const blockscaleRows = [
    { label: "CroqTile", value: 711, color: THEME.colors.primary },
    { label: "TileLang", value: 408, color: CHART.tileLang },
    { label: "Triton", value: 298, color: THEME.colors.accent },
    { label: "Helion", value: 167, color: THEME.colors.accentWarm },
  ];
  const blockscaleMax = 760;

  const blockscaleSprings = blockscaleRows.map((_, i) =>
    spring({
      frame: t - 318 - i * 16,
      fps,
      config: { damping: 16, stiffness: 120 },
      from: 0,
      to: 1,
    }),
  );

  const spmmCards = [
    {
      value: "84%",
      label: "win rate across 95 shapes",
      color: THEME.colors.primary,
      delay: 538,
    },
    {
      value: "+16.7%",
      label: "average speedup over cuSPARSELt",
      color: THEME.colors.accentWarm,
      delay: 578,
    },
    {
      value: "95",
      label: "sparse GEMM shapes tested",
      color: THEME.colors.accent,
      delay: 618,
    },
  ];

  const spmmSprings = spmmCards.map((c) =>
    spring({
      frame: t - c.delay,
      fps,
      config: { damping: 16, stiffness: 105 },
      from: 0,
      to: 1,
    }),
  );

  const animSpmmValue = (raw: string, progress: number): string => {
    if (raw.endsWith("%")) {
      const prefix = raw.startsWith("+") ? "+" : "";
      const num = parseFloat(raw.replace("+", ""));
      const v = Math.round(num * progress * 10) / 10;
      return `${prefix}${Number.isInteger(v) ? v : v.toFixed(1)}%`;
    }
    return String(Math.round(parseFloat(raw) * progress));
  };

  const LINE_BASE_DELAY = 18;
  const SEG_STAGGER = 8;

  const convergenceSegSprings = convergenceSeries.map((series, si) => {
    const lineDelay = LINE_BASE_DELAY + si * 10;
    return series.values.slice(0, -1).map((_, i) =>
      spring({
        frame: t - lineDelay - i * SEG_STAGGER,
        fps,
        config: { damping: 16, stiffness: 110 },
        from: 0,
        to: 1,
      }),
    );
  });

  const convergenceDotSprings = convergenceSeries.map((series, si) => {
    const lineDelay = LINE_BASE_DELAY + si * 10;
    return spring({
      frame: t - lineDelay - (series.values.length - 1) * SEG_STAGGER - 6,
      fps,
      config: { damping: 14, stiffness: 120 },
      from: 0,
      to: 1,
    });
  });

  const blockscaleLabelSpring = spring({
    frame: t - 390,
    fps,
    config: { damping: 16, stiffness: 90 },
    from: 0,
    to: 1,
  });

  const renderConvergenceChart = () => (
    <div
      style={{
        borderRadius: THEME.radius.lg,
        background: THEME.colors.bgCard,
        border: `1px solid rgba(255,255,255,0.06)`,
        boxShadow: THEME.shadows.card,
        padding: "14px 18px 8px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          fontSize: FS.labelSm,
          fontFamily: THEME.fonts.sans,
          fontWeight: 600,
          color: THEME.colors.textMuted,
          marginBottom: 4,
        }}
      >
        matmul FP16→FP32 · 16384³ · TFLOPS vs iterations
      </div>
      <svg
        viewBox="0 0 960 380"
        style={{ width: "100%", flex: 1, minHeight: 0, maxHeight: 340 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {[0, 110, 220, 330, 440, 550].map((v) => (
          <text
            key={v}
            x={48}
            y={yForTflops(v) + 5}
            fill={THEME.colors.textMuted}
            fontSize={FS.labelSm}
            fontFamily={THEME.fonts.mono}
            textAnchor="end"
            opacity={chartReveal}
          >
            {v}
          </text>
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={56}
            x2={908}
            y1={52 + i * 72}
            y2={52 + i * 72}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        <text
          x={48}
          y={44}
          fill={THEME.colors.textMuted}
          fontSize={FS.labelSm}
          fontFamily={THEME.fonts.mono}
          textAnchor="end"
        >
          TFLOPS
        </text>
        <text
          x={908}
          y={362}
          fill={THEME.colors.textMuted}
          fontSize={FS.labelSm}
          fontFamily={THEME.fonts.mono}
          textAnchor="end"
        >
          iterations
        </text>
        <line
          x1={72}
          x2={888}
          y1={yForTflops(CUBLAS_BASELINE)}
          y2={yForTflops(CUBLAS_BASELINE)}
          stroke={THEME.colors.textMuted}
          strokeWidth={2}
          strokeDasharray="10 8"
          opacity={0.82 * chartReveal}
        />
        <text
          x={892}
          y={yForTflops(CUBLAS_BASELINE) - 6}
          fill={THEME.colors.textMuted}
          fontSize={FS.labelSm}
          fontFamily={THEME.fonts.mono}
          opacity={chartReveal}
        >
          cuBLAS {CUBLAS_BASELINE}T
        </text>
        {convergenceSeries.map((series, si) => {
          const xs = series.values.map((_, i) =>
            xForIter(i, series.values.length),
          );
          const ys = series.values.map((v) => yForTflops(v));
          const segLens = series.values.slice(0, -1).map((_, i) => {
            const dx = xs[i + 1] - xs[i];
            const dy = ys[i + 1] - ys[i];
            return Math.max(1, Math.hypot(dx, dy));
          });
          const dot = convergenceDotSprings[si];
          const last = series.values.length - 1;
          return (
            <g key={series.label}>
              {segLens.map((_, i) => {
                const p = convergenceSegSprings[si][i];
                const stairD = `M ${xs[i]} ${ys[i]} H ${xs[i + 1]} V ${ys[i + 1]}`;
                const stairLen = Math.abs(xs[i + 1] - xs[i]) + Math.abs(ys[i + 1] - ys[i]);
                return (
                  <g key={i}>
                    <path
                      d={stairD}
                      fill="none"
                      stroke={series.color}
                      strokeWidth={series.width}
                      strokeLinecap="round"
                      strokeDasharray={stairLen}
                      strokeDashoffset={stairLen * (1 - p)}
                      style={
                        series.glow
                          ? { filter: `drop-shadow(${THEME.shadows.glowSm})` }
                          : undefined
                      }
                    />
                    <circle
                      cx={xs[i]}
                      cy={ys[i]}
                      r={i === 0 ? 5 : 4}
                      fill={THEME.colors.bgBase}
                      stroke={series.color}
                      strokeWidth={1.5}
                      opacity={p}
                    />
                  </g>
                );
              })}
              <g opacity={dot}>
                <circle
                  cx={xs[last]}
                  cy={ys[last]}
                  r={4 + 3 * dot}
                  fill={THEME.colors.bgBase}
                  stroke={series.color}
                  strokeWidth={2}
                />
                <text
                  x={xs[last] + 10}
                  y={ys[last] + 5}
                  fill={series.color}
                  fontSize={FS.labelSm}
                  fontFamily={THEME.fonts.mono}
                  fontWeight={600}
                >
                  {series.label} {series.values[last]}T
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );

  const sweepCharts = [
    "sweep_mnk_line.svg",
    "sweep_m_line.svg",
    "sweep_n_line.svg",
    "sweep_k_line.svg",
    "sweep_mn_line.svg",
    "sweep_mk_line.svg",
    "sweep_nk_line.svg",
  ];

  const sweepSprings = sweepCharts.map((_, i) =>
    spring({
      frame: t - 330 - i * 8,
      fps,
      config: { damping: 16, stiffness: 110 },
      from: 0,
      to: 1,
    }),
  );

  const renderSweepGrid = () => (
    <div
      style={{
        borderRadius: THEME.radius.lg,
        background: THEME.colors.bgCard,
        border: `1px solid rgba(255,255,255,0.06)`,
        boxShadow: THEME.shadows.card,
        padding: "14px 18px 10px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: FS.labelSm, fontFamily: THEME.fonts.sans, color: THEME.colors.textMuted }}>
          SPMM FP16 · 95 shapes · CroqTile vs cuSPARSELt
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: FS.labelSm, fontFamily: THEME.fonts.mono }}>
          <span style={{ color: THEME.colors.primary, fontWeight: 700 }}>84% win rate</span>
          <span style={{ color: THEME.colors.accentWarm, fontWeight: 700 }}>+16.7% avg</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, flex: 1, minHeight: 0 }}>
        {sweepCharts.slice(0, 4).map((src, i) => (
          <div
            key={src}
            style={{
              borderRadius: THEME.radius.sm,
              overflow: "hidden",
              border: `1px solid rgba(255,255,255,0.06)`,
              opacity: sweepSprings[i],
              transform: `scale(${interpolate(sweepSprings[i], [0, 1], [0.92, 1])})`,
            }}
          >
            <img src={staticFile(src)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: THEME.radius.sm }} />
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, flex: 0.75, minHeight: 0 }}>
        {sweepCharts.slice(4).map((src, i) => (
          <div
            key={src}
            style={{
              borderRadius: THEME.radius.sm,
              overflow: "hidden",
              border: `1px solid rgba(255,255,255,0.06)`,
              opacity: sweepSprings[i + 4],
              transform: `scale(${interpolate(sweepSprings[i + 4], [0, 1], [0.92, 1])})`,
            }}
          >
            <img src={staticFile(src)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: THEME.radius.sm }} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpmmSummary = () => (
    <div
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 28,
        alignItems: "stretch",
      }}
    >
      {spmmCards.map((card, i) => (
        <div
          key={card.label}
          style={{
            borderRadius: THEME.radius.lg,
            background: THEME.colors.bgCard,
            border: `1px solid ${card.color}44`,
            boxShadow: THEME.shadows.card,
            padding: "40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: spmmSprings[i],
            transform: `translateY(${interpolate(spmmSprings[i], [0, 1], [24, 0])}px) scale(${interpolate(spmmSprings[i], [0, 1], [0.92, 1])})`,
          }}
        >
          <div
            style={{
              fontSize: THEME.fontSize["4xl"],
              fontFamily: THEME.fonts.mono,
              fontWeight: 700,
              color: card.color,
              lineHeight: 1,
              textShadow:
                card.color === THEME.colors.primary
                  ? THEME.shadows.glowSm
                  : undefined,
            }}
          >
            {animSpmmValue(card.value, spmmSprings[i])}
          </div>
          <div
            style={{
              fontSize: FS.label,
              fontFamily: THEME.fonts.sans,
              fontWeight: 600,
              color: THEME.colors.textSecondary,
              textAlign: "center",
              lineHeight: 1.45,
            }}
          >
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <SegmentWrap duration={SEG.B.seqDur}>
      <PageContainer
        tag="Segment 06"
        title="AI tuning convergence"
        subtitle="Same agent · same hardware · same budget — only the language changes"
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: phase1Op,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderConvergenceChart()}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: phase2Op,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderSweepGrid()}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: phase3Op,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderSpmmSummary()}
          </div>
        </div>
      </PageContainer>
    </SegmentWrap>
  );
};

const highlightBox = (
  top: number,
  left: number,
  width: number,
  height: number,
  color: string,
  strength: number,
) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      width,
      height,
      borderRadius: 4,
      border: `2px solid ${color}`,
      background: color,
      opacity: 0.06 + 0.2 * Math.min(1, strength),
      pointerEvents: "none",
      boxShadow: `0 0 14px ${color}66`,
    }}
  />
);

const Sub6C: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame;

  const phase1Op = interpolate(t, [0, 18, 520, 560], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const phase2Op = interpolate(t, [520, 560, 800, 848], [0, 1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const title1Op = interpolate(t, [520, 560], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const title2Op = interpolate(t, [520, 560], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const tokenRows = [
    { label: "CroqTile", tokens: 303, loc: 36, color: THEME.colors.primary },
    { label: "Triton", tokens: 449, loc: 80, color: THEME.colors.accent },
    { label: "CUDA+CuTe", tokens: 1530, loc: 182, color: THEME.colors.danger },
    { label: "CUTLASS", tokens: 2350, loc: 280, color: THEME.colors.textMuted },
  ];
  const tokenMax = 2500;

  const tokenSprings = tokenRows.map((_, i) =>
    spring({
      frame: t - 24 - i * 18,
      fps,
      config: { damping: 16, stiffness: 110 },
      from: 0,
      to: 1,
    }),
  );

  const calloutSpring = spring({
    frame: t - 316,
    fps,
    config: { damping: 17, stiffness: 95 },
    from: 0,
    to: 1,
  });
  const calloutGlow = 0.5 + 0.5 * Math.sin(t * 0.22);

  const changeSiteRows = [
    { op: "改 tile size", croq: 1, cuda: 5 },
    { op: "改 swizzle", croq: 1, cuda: 3 },
    { op: "改 pipeline stages", croq: 1, cuda: 4 },
    { op: "改 data type", croq: 1, cuda: 7 },
    { op: "加 warp specialization", croq: 2, cuda: 6 },
  ];

  const rowSprings = changeSiteRows.map((_, i) =>
    spring({
      frame: t - 565 - i * 22,
      fps,
      config: { damping: 16, stiffness: 105 },
      from: 0,
      to: 1,
    }),
  );

  const tableHeaderSpring = spring({
    frame: t - 565,
    fps,
    config: { damping: 17, stiffness: 100 },
    from: 0,
    to: 1,
  });

  const summarySpring = spring({
    frame: t - 565 - changeSiteRows.length * 22 - 8,
    fps,
    config: { damping: 16, stiffness: 100 },
    from: 0,
    to: 1,
  });

  const phaseTitle = (zh: string, en: string, opacity: number) => (
    <div style={{ opacity, marginBottom: 4 }}>
      <div
        style={{
          fontSize: FS.label,
          fontFamily: THEME.fonts.sans,
          fontWeight: 700,
          color: THEME.colors.textPrimary,
        }}
      >
        {zh}
      </div>
      <div
        style={{
          fontSize: FS.labelSm,
          fontFamily: THEME.fonts.mono,
          color: THEME.colors.textMuted,
          marginTop: 2,
        }}
      >
        {en}
      </div>
    </div>
  );

  const renderTokenChart = () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        borderRadius: THEME.radius.lg,
        background: THEME.colors.bgCard,
        border: `1px solid rgba(255,255,255,0.06)`,
        boxShadow: THEME.shadows.card,
        padding: "20px 28px",
      }}
    >
      {phaseTitle("极简上下文", "Minimal Context", title1Op)}
      <div
        style={{
          fontSize: FS.labelSm,
          fontFamily: THEME.fonts.sans,
          color: THEME.colors.textMuted,
          opacity: title1Op,
        }}
      >
        token footprint · same GEMM kernel
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {tokenRows.map((row, i) => {
          const w = (row.tokens / tokenMax) * 100 * tokenSprings[i];
          return (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "128px 1fr 88px",
                alignItems: "center",
                gap: 16,
                opacity: tokenSprings[i],
                transform: `translateX(${interpolate(tokenSprings[i], [0, 1], [-20, 0])}px)`,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.textSecondary,
                    fontSize: FS.mono,
                    fontWeight: 600,
                  }}
                >
                  {row.label}
                </div>
                <div
                  style={{
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.textMuted,
                    fontSize: FS.labelSm,
                    marginTop: 2,
                  }}
                >
                  {row.loc} LOC
                </div>
              </div>
              <div
                style={{
                  height: 26,
                  borderRadius: THEME.radius.full,
                  background: THEME.colors.bgBase,
                  overflow: "hidden",
                  border: `1px solid rgba(255,255,255,0.06)`,
                }}
              >
                <div
                  style={{
                    width: `${w}%`,
                    height: "100%",
                    borderRadius: THEME.radius.full,
                    background:
                      row.label === "CroqTile"
                        ? `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.primaryDark})`
                        : row.color,
                    boxShadow:
                      row.label === "CroqTile" ? THEME.shadows.glowSm : undefined,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: THEME.fonts.mono,
                  color: row.color,
                  fontSize: FS.mono,
                  textAlign: "right",
                  fontWeight: 600,
                }}
              >
                {Math.round(row.tokens * tokenSprings[i])}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          alignSelf: "stretch",
          marginTop: 4,
          padding: "12px 24px",
          borderRadius: THEME.radius.md,
          background: `${THEME.colors.primary}1A`,
          border: `1px solid ${THEME.colors.primary}${Math.round((0.4 + 0.35 * calloutGlow) * 255).toString(16).padStart(2, "0")}`,
          boxShadow: `${THEME.shadows.glowSm}, 0 0 ${20 + 12 * calloutGlow}px ${THEME.colors.primaryGlow}`,
          opacity: calloutSpring,
          transform: `translateY(${interpolate(calloutSpring, [0, 1], [12, 0])}px) scale(${interpolate(calloutSpring, [0, 1], [0.94, 1])})`,
          transformOrigin: "top center",
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: FS.label,
            color: THEME.colors.primary,
            fontWeight: 700,
          }}
        >
          同等预算 → 5× 更多迭代
        </span>
        <span
          style={{
            fontFamily: THEME.fonts.sans,
            fontSize: FS.labelSm,
            color: THEME.colors.textSecondary,
            marginLeft: 16,
          }}
        >
          same budget · more optimization rounds
        </span>
      </div>
    </div>
  );

  const renderChangeSites = () => (
    <div
      style={{
        flex: 1,
        borderRadius: THEME.radius.lg,
        background: THEME.colors.bgCard,
        border: `1px solid rgba(255,255,255,0.06)`,
        boxShadow: THEME.shadows.card,
        padding: "20px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {phaseTitle("精确编辑", "Surgical Edits", title2Op)}
      <div
        style={{
          fontSize: FS.labelSm,
          fontFamily: THEME.fonts.sans,
          color: THEME.colors.textMuted,
          opacity: tableHeaderSpring,
        }}
      >
        code change sites per logical edit
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px 100px",
          gap: 12,
          padding: "6px 0",
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
          opacity: tableHeaderSpring,
          transform: `translateY(${interpolate(tableHeaderSpring, [0, 1], [10, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: FS.labelSm,
            color: THEME.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          operation
        </span>
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: FS.labelSm,
            color: THEME.colors.primary,
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          CroqTile
        </span>
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: FS.labelSm,
            color: THEME.colors.danger,
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          CUDA
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {changeSiteRows.map((row, i) => {
          const p = rowSprings[i];
          const highlight = row.croq === 1 && row.cuda >= 5;
          return (
            <div
              key={row.op}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 100px",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: THEME.radius.md,
                background: highlight
                  ? `${THEME.colors.primary}0F`
                  : THEME.colors.bgElevated,
                border: highlight
                  ? `1px solid ${THEME.colors.primary}44`
                  : `1px solid rgba(255,255,255,0.04)`,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
              }}
            >
              <span
                style={{
                  fontFamily: THEME.fonts.sans,
                  fontSize: FS.label,
                  color: THEME.colors.textPrimary,
                  fontWeight: 500,
                }}
              >
                {row.op}
              </span>
              <span
                style={{
                  fontFamily: THEME.fonts.mono,
                  fontSize: FS.monoLg,
                  color: THEME.colors.primary,
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {row.croq}
              </span>
              <span
                style={{
                  fontFamily: THEME.fonts.mono,
                  fontSize: FS.monoLg,
                  color: THEME.colors.danger,
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {row.cuda}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 32,
          marginTop: 4,
          opacity: summarySpring,
          transform: `translateY(${interpolate(summarySpring, [0, 1], [12, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: FS.label,
            color: THEME.colors.primary,
            fontWeight: 700,
          }}
        >
          1 change site
        </span>
        <span style={{ color: THEME.colors.textMuted, fontSize: FS.label }}>vs</span>
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: FS.label,
            color: THEME.colors.danger,
            fontWeight: 700,
          }}
        >
          5+ change sites
        </span>
      </div>
    </div>
  );

  return (
    <SegmentWrap duration={SEG.C.seqDur}>
      <PageContainer
        tag="Segment 06"
        title="Zero context waste"
        subtitle={
          title2Op > 0.5
            ? "One logical change · one edit site — agents stay on track"
            : "Fewer tokens per kernel — more room to iterate"
        }
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: phase1Op,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderTokenChart()}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: phase2Op,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderChangeSites()}
          </div>
        </div>
      </PageContainer>
    </SegmentWrap>
  );
};

const Sub6D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame;

  const phase1Op = interpolate(t, [0, 18, 520, 560], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const phase2Op = interpolate(t, [520, 560, 900, 942], [0, 1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const title1Op = interpolate(t, [520, 560], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const title2Op = interpolate(t, [520, 560], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const shellH = 340;

  const tradPanelSpring = spring({
    frame: t - 12,
    fps,
    config: { damping: 16, stiffness: 105 },
    from: 0,
    to: 1,
  });
  const tradLine1 = spring({ frame: t - 20, fps, config: { damping: 18, stiffness: 100 }, from: 0, to: 1 });
  const tradCompile = spring({ frame: t - 45, fps, config: { damping: 18, stiffness: 95 }, from: 0, to: 1 });
  const tradSuccess = spring({ frame: t - 72, fps, config: { damping: 18, stiffness: 95 }, from: 0, to: 1 });
  const tradLine2 = spring({ frame: t - 95, fps, config: { damping: 18, stiffness: 95 }, from: 0, to: 1 });
  const tradRunning = spring({ frame: t - 120, fps, config: { damping: 18, stiffness: 90 }, from: 0, to: 1 });
  const tradGpuWait = interpolate(t, [120, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tradError = spring({ frame: t - 175, fps, config: { damping: 14, stiffness: 120 }, from: 0, to: 1 });
  const tradDebugTime = spring({ frame: t - 210, fps, config: { damping: 17, stiffness: 95 }, from: 0, to: 1 });
  const errorPulse = 0.55 + 0.45 * Math.sin(t * 0.35);

  const croqSlide = spring({
    frame: t - 300,
    fps,
    config: { damping: 16, stiffness: 100 },
    from: 0,
    to: 1,
  });
  const croqLine1 = spring({ frame: t - 318, fps, config: { damping: 18, stiffness: 100 }, from: 0, to: 1 });
  const croqError = spring({ frame: t - 340, fps, config: { damping: 16, stiffness: 110 }, from: 0, to: 1 });
  const croqFixTime = spring({ frame: t - 400, fps, config: { damping: 17, stiffness: 95 }, from: 0, to: 1 });
  const croqSubtitle = spring({ frame: t - 430, fps, config: { damping: 17, stiffness: 90 }, from: 0, to: 1 });

  const loopReveal = spring({
    frame: t - 570,
    fps,
    config: { damping: 17, stiffness: 95 },
    from: 0,
    to: 1,
  });
  const croqLoopSpring = spring({
    frame: t - 590,
    fps,
    config: { damping: 16, stiffness: 88 },
    from: 0,
    to: 1,
  });
  const tradLoopSpring = spring({
    frame: t - 620,
    fps,
    config: { damping: 17, stiffness: 80 },
    from: 0,
    to: 1,
  });
  const magnitudeSpring = spring({
    frame: t - 700,
    fps,
    config: { damping: 15, stiffness: 100 },
    from: 0,
    to: 1,
  });

  const passAt1Rows = [
    { label: "CroqTile", value: 96.4, color: THEME.colors.primary, glow: true, delay: 750 },
    { label: "Triton", value: 92.6, color: THEME.colors.accent, glow: false, delay: 775 },
    { label: "CUDA", value: 88.6, color: THEME.colors.danger, glow: false, delay: 800 },
    { label: "Helion", value: 76.8, color: THEME.colors.textMuted, glow: false, delay: 825 },
  ];

  const passSprings = passAt1Rows.map((row) =>
    spring({
      frame: t - row.delay,
      fps,
      config: { damping: 16, stiffness: 110 },
      from: 0,
      to: 1,
    }),
  );

  const tick = 0.5 + 0.5 * Math.sin(t * 0.29);

  const termLine = (opacity: number, children: React.ReactNode, color: string = THEME.colors.textSecondary) => (
    <div
      style={{
        opacity,
        transform: `translateY(${interpolate(opacity, [0, 1], [8, 0])}px)`,
        fontFamily: THEME.fonts.mono,
        fontSize: FS.labelSm,
        color,
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );

  const phaseTitle = (zh: string, en: string, opacity: number) => (
    <div style={{ opacity, marginBottom: 8 }}>
      <div
        style={{
          fontSize: FS.label,
          fontFamily: THEME.fonts.sans,
          fontWeight: 700,
          color: THEME.colors.textPrimary,
        }}
      >
        {zh}
      </div>
      <div
        style={{
          fontSize: FS.labelSm,
          fontFamily: THEME.fonts.mono,
          color: THEME.colors.textMuted,
          marginTop: 2,
        }}
      >
        {en}
      </div>
    </div>
  );

  const renderErrorStory = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
      {phaseTitle("编译期反馈", "Compile-Time Feedback", title1Op)}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          minHeight: 0,
        }}
      >
        <div
          style={{
            opacity: tradPanelSpring,
            transform: `translateX(${interpolate(tradPanelSpring, [0, 1], [-20, 0])}px)`,
          }}
        >
          <DeviceShell title="Traditional DSL · CUDA" width="100%" height={shellH}>
            <div
              style={{
                padding: "16px 20px",
                fontFamily: THEME.fonts.mono,
                fontSize: FS.labelSm,
                background: THEME.colors.bgBase,
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                border:
                  tradError > 0.3
                    ? `2px solid ${THEME.colors.danger}${Math.round(errorPulse * 180).toString(16).padStart(2, "0")}`
                    : "2px solid transparent",
                borderRadius: `0 0 ${THEME.radius.lg} ${THEME.radius.lg}`,
              }}
            >
              {termLine(tradLine1, <>$ nvcc matmul_kernel.cu -o matmul</>)}
              {termLine(tradCompile, <>Compiling...</>, THEME.colors.textMuted)}
              {termLine(tradSuccess, <>✓ Compiled successfully</>, THEME.colors.primary)}
              {termLine(tradLine2, <>$ ./matmul</>)}
              {termLine(tradRunning, <>Running on GPU...</>, THEME.colors.textMuted)}
              {tradGpuWait > 0.2 && (
                <div
                  style={{
                    opacity: tradGpuWait,
                    fontFamily: THEME.fonts.mono,
                    fontSize: FS.labelSm,
                    color: THEME.colors.textMuted,
                  }}
                >
                  {"▸".repeat(Math.floor(1 + tradGpuWait * 3))} device running...
                </div>
              )}
              {termLine(
                tradError,
                <>CUDA Error: device-side assert triggered</>,
                THEME.colors.danger,
              )}
              <div
                style={{
                  opacity: tradDebugTime,
                  marginTop: "auto",
                  padding: "8px 12px",
                  borderRadius: THEME.radius.sm,
                  background: `${THEME.colors.danger}18`,
                  border: `1px solid ${THEME.colors.danger}55`,
                  fontFamily: THEME.fonts.mono,
                  fontSize: FS.labelSm,
                  color: THEME.colors.danger,
                  fontWeight: 600,
                }}
              >
                debug time: ~30–60 min
              </div>
            </div>
          </DeviceShell>
        </div>

        <div
          style={{
            opacity: croqSlide,
            transform: `translateX(${interpolate(croqSlide, [0, 1], [40, 0])}px)`,
          }}
        >
          <DeviceShell title="CroqTile · compile-time ✓" width="100%" height={shellH}>
            <div
              style={{
                padding: "16px 20px",
                fontFamily: THEME.fonts.mono,
                fontSize: FS.labelSm,
                background: THEME.colors.bgBase,
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {termLine(croqLine1, <>$ croqc build matmul.tile</>)}
              <div
                style={{
                  opacity: croqError,
                  transform: `translateY(${interpolate(croqError, [0, 1], [10, 0])}px)`,
                  padding: "12px 14px",
                  borderRadius: THEME.radius.sm,
                  background: `${THEME.colors.danger}10`,
                  border: `1px solid ${THEME.colors.danger}44`,
                  lineHeight: 1.65,
                }}
              >
                <div style={{ color: THEME.colors.danger, fontWeight: 700 }}>
                  error[E0042]: tile M=96 not divisible by WARP_M=64
                </div>
                <div style={{ color: THEME.colors.textMuted, marginTop: 4 }}>
                  {"  --> matmul.tile:23:5"}
                </div>
                <div style={{ color: THEME.colors.primary, marginTop: 6 }}>
                  fix: adjust WARP_M to a divisor of M
                </div>
              </div>
              <div
                style={{
                  opacity: croqFixTime,
                  padding: "8px 12px",
                  borderRadius: THEME.radius.sm,
                  background: `${THEME.colors.primary}18`,
                  border: `1px solid ${THEME.colors.primary}55`,
                  fontFamily: THEME.fonts.mono,
                  fontSize: FS.labelSm,
                  color: THEME.colors.primary,
                  fontWeight: 600,
                }}
              >
                fix time: ~3–8 seconds
              </div>
              <div
                style={{
                  opacity: croqSubtitle,
                  marginTop: "auto",
                  fontFamily: THEME.fonts.sans,
                  fontSize: FS.labelSm,
                  color: THEME.colors.textSecondary,
                  fontStyle: "italic",
                }}
              >
                为 AI Agent 阅读专门设计的错误信息
              </div>
            </div>
          </DeviceShell>
        </div>
      </div>
    </div>
  );

  const loopSteps = (steps: string[], progress: number, color: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {steps.map((step, i) => {
        const stepOp = interpolate(progress, [i / steps.length, (i + 1) / steps.length], [0.35, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <React.Fragment key={step}>
            {i > 0 && (
              <span style={{ color: THEME.colors.textMuted, fontSize: FS.labelSm, opacity: stepOp }}>
                →
              </span>
            )}
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: FS.labelSm,
                color,
                opacity: stepOp,
                fontWeight: i === steps.length - 1 ? 700 : 500,
              }}
            >
              {step}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderFeedbackLoop = () => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        opacity: loopReveal,
        transform: `translateY(${interpolate(loopReveal, [0, 1], [16, 0])}px)`,
      }}
    >
      {phaseTitle("迭代效率", "Iteration Efficiency", title2Op)}
      <div
        style={{
          borderRadius: THEME.radius.lg,
          background: THEME.colors.bgCard,
          padding: "18px 24px",
          border: `1px solid rgba(255,255,255,0.06)`,
          boxShadow: THEME.shadows.card,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          <div>
            <div
              style={{
                fontSize: FS.labelSm,
                color: THEME.colors.primary,
                fontFamily: THEME.fonts.mono,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              CroqTile · 353 checks + 1,319 asserts
            </div>
            {loopSteps(["编写", "编译", "反馈"], croqLoopSpring, THEME.colors.primary)}
            <div
              style={{
                marginTop: 12,
                height: 10,
                borderRadius: THEME.radius.full,
                background: THEME.colors.bgBase,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${croqLoopSpring * 100}%`,
                  height: "100%",
                  borderRadius: THEME.radius.full,
                  background: `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.primaryDark})`,
                  boxShadow: THEME.shadows.glowSm,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: FS.label,
                fontFamily: THEME.fonts.mono,
                color: THEME.colors.primary,
                fontWeight: 700,
              }}
            >
              秒级迭代
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: FS.labelSm,
                color: THEME.colors.danger,
                fontFamily: THEME.fonts.mono,
                marginBottom: 10,
                fontWeight: 600,
              }}
            >
              Traditional DSL · GPU runtime path
            </div>
            {loopSteps(
              ["编写", "编译", "GPU运行", "等待...", "模糊错误"],
              tradLoopSpring,
              THEME.colors.danger,
            )}
            <div
              style={{
                marginTop: 12,
                height: 10,
                borderRadius: THEME.radius.full,
                background: THEME.colors.bgBase,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${tradLoopSpring * 100}%`,
                  height: "100%",
                  borderRadius: THEME.radius.full,
                  background: `linear-gradient(90deg, ${THEME.colors.danger}, ${THEME.colors.accentWarm})`,
                  opacity: 0.88,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, transparent, transparent 88%, ${THEME.colors.danger}${Math.round((0.15 + 0.4 * tick) * 255).toString(16).padStart(2, "0")})`,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: FS.label,
                fontFamily: THEME.fonts.mono,
                color: THEME.colors.danger,
                fontWeight: 700,
              }}
            >
              分钟级迭代
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            textAlign: "center",
            opacity: magnitudeSpring,
            transform: `scale(${interpolate(magnitudeSpring, [0, 1], [0.92, 1])})`,
          }}
        >
          <span
            style={{
              fontFamily: THEME.fonts.sans,
              fontSize: FS.mainAccent,
              fontWeight: 700,
              color: THEME.colors.textPrimary,
            }}
          >
            快至少一个数量级
          </span>
        </div>
      </div>

      <div
        style={{
          borderRadius: THEME.radius.lg,
          background: THEME.colors.bgCard,
          padding: "16px 24px",
          border: `1px solid rgba(255,255,255,0.06)`,
          boxShadow: THEME.shadows.card,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: FS.labelSm,
            fontFamily: THEME.fonts.mono,
            color: THEME.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            opacity: passSprings[0],
          }}
        >
          pass@1 · AI Agent 编译首次成功率
        </div>
        {passAt1Rows.map((row, i) => {
          const p = passSprings[i];
          const barW = row.value * p;
          return (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 72px",
                alignItems: "center",
                gap: 14,
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-16, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: THEME.fonts.mono,
                  fontSize: FS.labelSm,
                  color: row.color,
                  fontWeight: 600,
                }}
              >
                {row.label}
              </span>
              <div
                style={{
                  height: 22,
                  borderRadius: THEME.radius.full,
                  background: THEME.colors.bgBase,
                  overflow: "hidden",
                  border: `1px solid rgba(255,255,255,0.06)`,
                }}
              >
                <div
                  style={{
                    width: `${barW}%`,
                    height: "100%",
                    borderRadius: THEME.radius.full,
                    background: row.glow
                      ? `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.primaryDark})`
                      : row.color,
                    boxShadow: row.glow ? THEME.shadows.glowSm : undefined,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: THEME.fonts.mono,
                  fontSize: FS.mono,
                  color: row.color,
                  textAlign: "right",
                  fontWeight: 700,
                }}
              >
                {row.value.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <SegmentWrap duration={SEG.D.seqDur}>
      <PageContainer
        tag="Segment 06"
        title="Compile feedback speed"
        subtitle={
          title2Op > 0.5
            ? "Seconds per iteration — not minutes of GPU debugging"
            : "Errors caught at compile time — not after a 30-minute GPU debug session"
        }
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: phase1Op,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderErrorStory()}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: phase2Op,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderFeedbackLoop()}
          </div>
        </div>
      </PageContainer>
    </SegmentWrap>
  );
};

const Sub6E: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame;

  /** Stack floats: aligned to voiceover cues seg6-09(48), seg6-10(273), seg6-11(581) */
  const l1 = spring({
    frame: t - 30,
    fps,
    config: { damping: 17, stiffness: 102 },
    from: 0,
    to: 1,
  });
  const l2 = spring({
    frame: t - 260,
    fps,
    config: { damping: 17, stiffness: 98 },
    from: 0,
    to: 1,
  });
  const l3 = spring({
    frame: t - 565,
    fps,
    config: { damping: 17, stiffness: 94 },
    from: 0,
    to: 1,
  });

  const layer = (
    height: number,
    yFrom: number,
    progress: number,
    bg: string,
    border: string,
    labelMono: string,
    labelColor: string,
    title: string,
    subtitle: string,
  ) => {
    const rise = interpolate(progress, [0, 1], [yFrom, 0]);
    const op = progress;
    return (
      <div
        style={{
          height,
          borderRadius: THEME.radius.md,
          background: bg,
          border: `1px solid ${border}`,
          boxShadow: THEME.shadows.card,
          transform: `translateY(${rise}px)`,
          opacity: op,
          padding: "16px 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: FS.labelSm,
            fontFamily: THEME.fonts.mono,
            color: labelColor,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {labelMono}
        </div>
        <div
          style={{
            fontSize: FS.main,
            fontWeight: 700,
            fontFamily: THEME.fonts.sans,
            color: THEME.colors.textPrimary,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: FS.labelSm,
            fontFamily: THEME.fonts.sans,
            fontWeight: 400,
            color: THEME.colors.textSecondary,
            lineHeight: 1.45,
          }}
        >
          {subtitle}
        </div>
      </div>
    );
  };

  return (
    <SegmentWrap duration={SEG.E.seqDur}>
      <PageContainer
        tag="Segment 06"
        title="Harness tools in CroqTile"
        subtitle="Unified profiler interface + pre-packaged programming knowledge"
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 6,
            maxHeight: BODY_MAX_HEIGHT,
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: 760,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: -36,
                transform: "translateX(-50%)",
                width: 2,
                height: 468,
                background: `linear-gradient(180deg, transparent, ${THEME.colors.primaryGlow})`,
                opacity: 0.75,
              }}
            />
            {layer(
              100,
              48,
              l1,
              THEME.colors.bgElevated,
              `${THEME.colors.textSecondary}73`,
              "Layer 01",
              THEME.colors.textMuted,
              "Compiler Guardrail",
              "Types + tile contracts catch mistakes before they become silent wrong answers.",
            )}
            {layer(
              118,
              58,
              l2,
              `linear-gradient(135deg, ${THEME.colors.primaryGlow}, ${THEME.colors.bgCard})`,
              `${THEME.colors.primary}8C`,
              "Layer 02",
              THEME.colors.primary,
              "Profiler CLI",
              "ncu + DSA profilers unified — evidence travels with the kernel.",
            )}
            {layer(
              138,
              68,
              l3,
              `linear-gradient(135deg, ${THEME.colors.accentWarm}33, ${THEME.colors.bgCard})`,
              `${THEME.colors.accentWarm}8C`,
              "Layer 03",
              THEME.colors.accentWarm,
              "CroqTile Skills",
              "Docs + templates + patterns — agents ship structure, not just snippets.",
            )}
          </div>
        </div>
      </PageContainer>
    </SegmentWrap>
  );
};

const Sub6F: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame;

  const glowPulse = 0.4 + 0.6 * Math.sin(t * 0.12);

  const sloganSpring = spring({ frame: t - 12, fps, config: { damping: 16, stiffness: 90 }, from: 0, to: 1 });
  const qrSpring = spring({ frame: t - 60, fps, config: { damping: 17, stiffness: 88 }, from: 0, to: 1 });
  const linkSpring = spring({ frame: t - 100, fps, config: { damping: 18, stiffness: 84 }, from: 0, to: 1 });

  return (
    <SegmentWrap duration={SEG.F.seqDur}>
      <AbsoluteFill style={{ background: THEME.colors.bgBase, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <NoiseOverlay opacity={0.028} blendMode="soft-light" />
        <div style={{ opacity: sloganSpring, transform: `translateY(${interpolate(sloganSpring, [0, 1], [28, 0])}px) scale(${interpolate(sloganSpring, [0, 1], [0.94, 1])})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 64, fontFamily: THEME.fonts.sans, fontWeight: 700, color: THEME.colors.textPrimary, textAlign: "center", lineHeight: 1.35, textShadow: `0 0 48px ${THEME.colors.primaryGlow}` }}>
            {"你的编程体验，值得被"}
            <span style={{ color: THEME.colors.primary, textShadow: `0 0 ${24 + 28 * glowPulse}px ${THEME.colors.primaryGlow}` }}>{"重新定义"}</span>
          </div>
          <div style={{ fontSize: 26, fontFamily: THEME.fonts.sans, color: THEME.colors.textSecondary, textAlign: "center", letterSpacing: "0.04em" }}>
            Your programming experience deserves to be redefined.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 48, opacity: qrSpring, transform: `translateY(${interpolate(qrSpring, [0, 1], [20, 0])}px)` }}>
          <img src={staticFile("croqtile-qr.png")} alt="" style={{ width: 180, height: 180, borderRadius: THEME.radius.lg, border: `2px solid ${THEME.colors.primary}55`, boxShadow: `0 0 32px ${THEME.colors.primaryGlow}` }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 42, fontFamily: THEME.fonts.sans, fontWeight: 700, background: `linear-gradient(120deg, ${THEME.colors.primary}, ${THEME.colors.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              CroqTile
            </div>
            <div style={{ fontSize: FS.label, fontFamily: THEME.fonts.sans, color: THEME.colors.textSecondary, lineHeight: 1.5 }}>
              The Next-Gen GPU & DSA Language
            </div>
          </div>
        </div>
        <div style={{ opacity: linkSpring, fontSize: FS.monoLg, fontFamily: THEME.fonts.mono, color: THEME.colors.textMuted, letterSpacing: "0.02em" }}>
          github.com/LancerLab/croqtile
        </div>
      </AbsoluteFill>
    </SegmentWrap>
  );
};


export const AINative: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.colors.bgBase }}>
      <Sequence from={SEG.A.seqFrom} durationInFrames={SEG.A.seqDur}>
        <Sub6A />
      </Sequence>
      <Sequence from={SEG.C.seqFrom} durationInFrames={SEG.C.seqDur}>
        <Sub6C />
      </Sequence>
      <Sequence from={SEG.D.seqFrom} durationInFrames={SEG.D.seqDur}>
        <Sub6D />
      </Sequence>
      <Sequence from={SEG.E.seqFrom} durationInFrames={SEG.E.seqDur}>
        <Sub6E />
      </Sequence>
      <Sequence from={SEG.B.seqFrom} durationInFrames={SEG.B.seqDur}>
        <Sub6B />
      </Sequence>
      <Sequence from={SEG.F.seqFrom} durationInFrames={SEG.F.seqDur}>
        <Sub6F />
      </Sequence>
    </AbsoluteFill>
  );
};
