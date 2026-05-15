/**
 * remotion/compositions/AINative.tsx
 * Segment 6 — AI-native features (2:45–5:20 @ 30fps = 4650 frames)
 *
 * 6A 0–450f   From Easy to AI-native
 * 6B 450–1200 Ultra-compact Context
 * 6C 1200–1950 Zero Context Waste
 * 6D 1950–2700 Lowest Compile Failure Rate
 * 6E 2700–3600 Extra Guardrail Layers
 * 6F 3600–4650 Real Results & New Paradigm
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";
import { DeviceShell } from "../components/DeviceShell";

const FADE_FRAMES = 24;

const SEG = {
  A: { seqFrom: 0, seqDur: 450, start: 0, end: 450 },
  B: { seqFrom: 426, seqDur: 774, start: 450, end: 1200 },
  C: { seqFrom: 1176, seqDur: 774, start: 1200, end: 1950 },
  D: { seqFrom: 1926, seqDur: 774, start: 1950, end: 2700 },
  E: { seqFrom: 2676, seqDur: 924, start: 2700, end: 3600 },
  F: { seqFrom: 3576, seqDur: 1074, start: 3600, end: 4650 },
} as const;

const SegmentWrap: React.FC<{
  duration: number;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [duration - FADE_FRAMES, duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
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
          border: `1px solid rgba(110,231,183,0.35)`,
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
            fontSize: THEME.fontSize.xs,
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

  const line1 = spring({
    frame: t - 18,
    fps,
    config: { damping: 18, stiffness: 100 },
    from: 0,
    to: 1,
  });
  const line2 = spring({
    frame: t - 120,
    fps,
    config: { damping: 16, stiffness: 90 },
    from: 0,
    to: 1,
  });
  const extend = spring({
    frame: t - 260,
    fps,
    config: { damping: 14, stiffness: 80 },
    from: 0,
    to: 1,
  });

  const badgeScale = spring({
    frame: t - 8,
    fps,
    config: { damping: 12, stiffness: 120 },
    from: 0.85,
    to: 1,
  });

  return (
    <SegmentWrap duration={SEG.A.seqDur}>
      <PageContainer
        tag="Segment 6A"
        title="From easy to AI-native"
        subtitle="One stack that grows with your agent"
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 64,
            minHeight: 0,
          }}
        >
          <div style={{ flex: 1, maxWidth: 1100 }}>
            <div
              style={{
                fontSize: THEME.fontSize.xl,
                fontFamily: THEME.fonts.sans,
                color: THEME.colors.textSecondary,
                lineHeight: 1.5,
                opacity: line1,
                transform: `translateY(${interpolate(line1, [0, 1], [12, 0])}px)`,
              }}
            >
              <span style={{ color: THEME.colors.textPrimary, fontWeight: 600 }}>
                entry-level performance engineer
              </span>
              <span style={{ color: THEME.colors.textMuted }}> → </span>
              <span style={{ color: THEME.colors.primary, fontWeight: 700 }}>
                CroqTile
              </span>
              <span style={{ color: THEME.colors.textMuted }}> → </span>
              <span style={{ color: THEME.colors.textCode, fontWeight: 600 }}>
                production kernel
              </span>
            </div>
            <div
              style={{
                marginTop: 28,
                fontSize: THEME.fontSize["2xl"],
                fontFamily: THEME.fonts.mono,
                color: THEME.colors.accentWarm,
                opacity: line2,
                transform: `translateY(${interpolate(line2, [0, 1], [16, 0])}px)`,
                textShadow: `0 0 24px rgba(252,211,77,0.25)`,
              }}
            >
              × coding agent
              <span style={{ color: THEME.colors.textMuted, fontWeight: 400 }}>
                {" "}
                →{" "}
              </span>
              <span style={{ color: THEME.colors.primary, fontWeight: 800 }}>
                10×
              </span>
            </div>
            <div
              style={{
                marginTop: 20,
                height: 4,
                width: interpolate(extend, [0, 1], [0, 420]),
                borderRadius: THEME.radius.full,
                background: `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.accent})`,
                opacity: extend,
                boxShadow: THEME.shadows.glowSm,
              }}
            />
          </div>
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              transform: `scale(${badgeScale})`,
            }}
          >
            <AgentBadge />
            <span
              style={{
                fontSize: THEME.fontSize.sm,
                color: THEME.colors.textMuted,
                fontFamily: THEME.fonts.mono,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Agent-native surface
            </span>
          </div>
        </div>
      </PageContainer>
    </SegmentWrap>
  );
};

const Sub6B: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame;

  const croqLines = Math.round(
    interpolate(t, [20, 90], [1, 36], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );
  const croqTokens = Math.round(
    interpolate(t, [40, 110], [0, 500], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }),
  );
  const cudaLines = Math.round(
    interpolate(t, [130, 220], [1, 180], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );
  const cudaTokLow = Math.round(
    interpolate(t, [220, 300], [0, 2000], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }),
  );
  const cudaTokHigh = Math.round(
    interpolate(t, [220, 300], [0, 4000], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }),
  );

  const windowPulse = interpolate(
    t,
    [60, 200],
    [0, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  const overflow = interpolate(t, [160, 280], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const innerScaleCroq = interpolate(t, [80, 200], [0.92, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const innerScaleCuda = interpolate(t, [100, 240], [0.75, 1.45], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const redEdge = interpolate(overflow, [0, 1], [0, 0.95]);

  return (
    <SegmentWrap duration={SEG.B.seqDur}>
      <PageContainer
        tag="Segment 6B"
        title="Ultra-compact context"
        subtitle="More reasoning budget for strategy, less for boilerplate"
      >
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "stretch",
            minHeight: 0,
          }}
        >
          <DeviceShell title="tokens-per-kernel.tsx" width="100%" height={620}>
            <div
              style={{
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 28,
                height: "100%",
                boxSizing: "border-box",
                background: THEME.colors.bgBase,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: THEME.fontSize.sm,
                    color: THEME.colors.textMuted,
                    fontFamily: THEME.fonts.mono,
                    marginBottom: 8,
                  }}
                >
                  CroqTile kernel
                </div>
                <div
                  style={{
                    fontSize: THEME.fontSize["3xl"],
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.primary,
                    fontWeight: 700,
                  }}
                >
                  {croqLines} lines
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: THEME.fontSize.xl,
                    color: THEME.colors.textCode,
                  }}
                >
                  ≈ ~{croqTokens} tokens
                </div>
              </div>
              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.08)",
                  margin: "8px 0",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: THEME.fontSize.sm,
                    color: THEME.colors.textMuted,
                    fontFamily: THEME.fonts.mono,
                    marginBottom: 8,
                  }}
                >
                  CUDA + CuTe surface
                </div>
                <div
                  style={{
                    fontSize: THEME.fontSize["3xl"],
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.textSecondary,
                    fontWeight: 700,
                  }}
                >
                  {cudaLines} lines
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: THEME.fontSize.xl,
                    color: THEME.colors.accentWarm,
                  }}
                >
                  ≈ {cudaTokLow}–{cudaTokHigh} tokens
                </div>
              </div>
              <div
                style={{
                  marginTop: "auto",
                  fontSize: THEME.fontSize.sm,
                  color: THEME.colors.textMuted,
                  lineHeight: 1.45,
                }}
              >
                Smaller literals mean agents can retain surrounding system state —
                fused layouts, tiling policy, safety — without drowning in STL-shaped
                noise.
              </div>
            </div>
          </DeviceShell>

          <div
            style={{
              borderRadius: THEME.radius.lg,
              background: THEME.colors.bgCard,
              boxShadow: THEME.shadows.card,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              border: `1px solid rgba(255,255,255,0.06)`,
            }}
          >
            <div
              style={{
                fontSize: THEME.fontSize.lg,
                color: THEME.colors.textPrimary,
                fontWeight: 600,
              }}
            >
              Context window utilization
            </div>
            <div
              style={{
                flex: 1,
                position: "relative",
                borderRadius: THEME.radius.md,
                background: THEME.colors.bgBase,
                overflow: "hidden",
                border: `1px solid rgba(129,140,248,0.35)`,
                minHeight: 420,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 18,
                  borderRadius: THEME.radius.sm,
                  border: `${2 + windowPulse}px solid rgba(110,231,183,${0.35 + 0.35 * windowPulse})`,
                  boxShadow: THEME.shadows.glowSm,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${innerScaleCroq})`,
                  transformOrigin: "50% 45%",
                }}
              >
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: THEME.fontSize.base,
                    color: THEME.colors.primary,
                    textAlign: "center",
                    padding: 16,
                  }}
                >
                  CroqTile kernel
                  <br />
                  <span style={{ color: THEME.colors.textSecondary }}>
                    fits comfortably
                  </span>
                </span>
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    width: "118%",
                    height: "118%",
                    borderRadius: THEME.radius.md,
                    border: `${3}px solid rgba(248,113,113,${redEdge})`,
                    boxShadow: `0 0 48px rgba(248,113,113,${0.15 + 0.55 * overflow})`,
                    transform: `scale(${innerScaleCuda}) rotate(${interpolate(
                      overflow,
                      [0, 1],
                      [0, 1.8],
                    )}deg)`,
                    opacity: interpolate(t, [120, 200], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 28,
                    right: 32,
                    fontFamily: THEME.fonts.mono,
                    fontSize: THEME.fontSize.sm,
                    color: THEME.colors.danger,
                    opacity: overflow,
                  }}
                >
                  CUDA variant spills context window
                </span>
              </div>
            </div>
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
  const t = frame;

  const instrOp = interpolate(t, [0, 36], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const showCroq = interpolate(t, [40, 80], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const showCuda = interpolate(t, [110, 160], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const cudaSites = [
    { top: 44, left: 14, w: 132, h: 18 },
    { top: 66, left: 14, w: 268, h: 18 },
    { top: 112, left: 14, w: 284, h: 18 },
    { top: 134, left: 220, w: 148, h: 18 },
    { top: 178, left: 14, w: 228, h: 18 },
    { top: 222, left: 170, w: 192, h: 18 },
    { top: 266, left: 14, w: 220, h: 18 },
  ];

  return (
    <SegmentWrap duration={SEG.C.seqDur}>
      <PageContainer
        tag="Segment 6C"
        title="Zero context waste"
        subtitle="Agents edit intent-sized regions — not constellation surgery"
      >
        <div
          style={{
            opacity: instrOp,
            transform: `translateY(${interpolate(instrOp, [0, 1], [14, 0])}px)`,
            marginBottom: 28,
            padding: `16px ${THEME.radius.lg}px`,
            borderRadius: THEME.radius.md,
            background: THEME.colors.bgElevated,
            border: `1px solid rgba(129,140,248,0.35)`,
            alignSelf: "flex-start",
            maxWidth: 900,
            boxShadow: THEME.shadows.card,
          }}
        >
          <span
            style={{
              fontSize: THEME.fontSize.sm,
              color: THEME.colors.accent,
              fontFamily: THEME.fonts.mono,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Agent instruction ·
          </span>
          <span
            style={{
              marginLeft: 8,
              fontSize: THEME.fontSize.lg,
              color: THEME.colors.textPrimary,
              fontFamily: THEME.fonts.mono,
            }}
          >
            Optimize TILE_K to reduce bank conflict
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            minHeight: 0,
          }}
        >
          <DeviceShell title="croqtile_gemm.ct" width="100%" height={540}>
            <div
              style={{
                position: "relative",
                padding: "20px 24px",
                fontFamily: THEME.fonts.mono,
                fontSize: THEME.fontSize.sm,
                lineHeight: 1.7,
                color: THEME.colors.textSecondary,
                background: THEME.colors.bgBase,
                height: "100%",
                boxSizing: "border-box",
                opacity: showCroq,
              }}
            >
              <div style={{ color: THEME.colors.textMuted }}>@kernel</div>
              <div style={{ color: THEME.colors.textCode }}>
                def gemm[M, N, K]():
              </div>
              <div>{"  "}tile_m = TILE_M</div>
              <div>{"  "}tile_n = TILE_N</div>
              <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                <span style={{ color: THEME.colors.textPrimary }}>
                  {"  "}tile_k =
                </span>{" "}
                <span style={{ color: THEME.colors.primary }}>96</span>{" "}
                <span style={{ color: THEME.colors.textMuted }}>
                  {"// tuned for SRAM banks"}
                </span>
                {showCroq > 0.2 &&
                  highlightBox(138, 70, 44, 22, THEME.colors.primary, showCroq)}
              </div>
              <div>{"  "}...</div>

              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 18,
                  fontSize: THEME.fontSize.base,
                  color: THEME.colors.primary,
                  fontWeight: 700,
                  opacity: interpolate(showCroq, [0.5, 1], [0, 1]),
                }}
              >
                1 change site
              </div>
            </div>
          </DeviceShell>

          <DeviceShell title="cuda_cute_attn.cuh" width="100%" height={540}>
            <div
              style={{
                position: "relative",
                padding: "20px 24px",
                fontFamily: THEME.fonts.mono,
                fontSize: THEME.fontSize.sm,
                lineHeight: 1.65,
                color: THEME.colors.textSecondary,
                background: THEME.colors.bgBase,
                height: "100%",
                boxSizing: "border-box",
                opacity: showCuda,
              }}
            >
              {[
                "#define TILE_K 128",
                "using BlockShape = Shape<_128,_64,_128>;",
                "// bank conflict heuristic spread across:",
                "__device__ inline void prefetch_K_tile(...){ /* ... */ }",
                "__device__ inline void softmax_row(...){ /* uses TILE_K */ }",
                "// shared memory tiling policy",
                "auto sK_layout = composition(Swizzle<3,4,3>{}, ...);",
                "copy_atom_K.with(TILE_K).invoke(...);",
                "warpgroup_fence();",
                "// epilogue reshapes TILE_K-bound accumulators",
                " tiled_mma.consume_tile<TILE_K>(frag);",
              ].map((line, i) => (
                <div key={i} style={{ whiteSpace: "pre" }}>
                  {line}
                </div>
              ))}

              {cudaSites.map((s) =>
                highlightBox(s.top, s.left, s.w, s.h, THEME.colors.danger, showCuda),
              )}

              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 18,
                  fontSize: THEME.fontSize.base,
                  color: THEME.colors.danger,
                  fontWeight: 700,
                  opacity: interpolate(showCuda, [0.55, 1], [0, 1]),
                }}
              >
                7 change sites
              </div>
            </div>
          </DeviceShell>
        </div>
      </PageContainer>
    </SegmentWrap>
  );
};

const Sub6D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame;

  const rows = [
    { label: "CroqTile", value: 3.5, color: THEME.colors.primary },
    { label: "Triton", value: 7.5, color: "#5EEAD4" },
    { label: "CUDA", value: 10.0, color: "#60A5FA" },
    { label: "Helion", value: 23.3, color: THEME.colors.textMuted },
  ];

  const maxPct = 25;

  const barProgress = rows.map((_, i) =>
    spring({
      frame: t - 24 - i * 10,
      fps,
      config: { damping: 16, stiffness: 140 },
      from: 0,
      to: 1,
    }),
  );

  const loopReveal = interpolate(t, [320, 400], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const croqtileScan = interpolate(t, [400, 520], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const otherRuntime = interpolate(t, [430, 650], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const tick = (t % 45) / 45;

  return (
    <SegmentWrap duration={SEG.D.seqDur}>
      <PageContainer
        tag="Segment 6D"
        title="Lowest compile failure rate"
        subtitle="Fast feedback beats long GPU tails"
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 36 }}>
          <div style={{ flex: 1.1, minHeight: 0 }}>
            <div
              style={{
                fontSize: THEME.fontSize.sm,
                color: THEME.colors.textMuted,
                marginBottom: 16,
              }}
            >
              Compile failures per attempt (%)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {rows.map((row, i) => {
                const w = (row.value / maxPct) * 100 * barProgress[i];
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "120px 1fr 80px",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: THEME.fonts.mono,
                        color: THEME.colors.textSecondary,
                        fontSize: THEME.fontSize.sm,
                      }}
                    >
                      {row.label}
                    </span>
                    <div
                      style={{
                        height: 22,
                        borderRadius: THEME.radius.full,
                        background: THEME.colors.bgElevated,
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
                              ? `linear-gradient(90deg, ${THEME.colors.primary}, #34D399)`
                              : row.label === "Helion"
                                ? "linear-gradient(90deg, #6B7280, #9CA3AF)"
                                : `linear-gradient(90deg, ${row.color}, ${THEME.colors.accent})`,
                          boxShadow:
                            row.label === "CroqTile" ? THEME.shadows.glowSm : undefined,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: THEME.fonts.mono,
                        color: THEME.colors.textPrimary,
                        textAlign: "right",
                      }}
                    >
                      {row.value.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              borderRadius: THEME.radius.lg,
              background: THEME.colors.bgCard,
              padding: 28,
              border: `1px solid rgba(255,255,255,0.06)`,
              boxShadow: THEME.shadows.card,
              opacity: loopReveal,
              transform: `translateY(${interpolate(loopReveal, [0, 1], [20, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: THEME.fontSize.lg,
                fontWeight: 600,
                color: THEME.colors.textPrimary,
                marginBottom: 20,
              }}
            >
              Feedback loop latency
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: THEME.fontSize.sm,
                    color: THEME.colors.primary,
                    fontFamily: THEME.fonts.mono,
                    marginBottom: 12,
                  }}
                >
                  CroqTile compiler
                </div>
                <div
                  style={{
                    height: 12,
                    borderRadius: THEME.radius.full,
                    background: THEME.colors.bgBase,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: THEME.colors.bgElevated,
                    }}
                  />
                  <div
                    style={{
                      width: `${croqtileScan * 100}%`,
                      height: "100%",
                      borderRadius: THEME.radius.full,
                      background: `linear-gradient(90deg, ${THEME.colors.primary}, #34D399)`,
                      boxShadow: THEME.shadows.glowSm,
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: THEME.fontSize["2xl"],
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.primary,
                    fontWeight: 700,
                  }}
                >
                  ≈ 3s
                </div>
                <div style={{ fontSize: THEME.fontSize.sm, color: THEME.colors.textMuted }}>
                  Static guarantees + deterministic errors · iterate like a linter
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: THEME.fontSize.sm,
                    color: THEME.colors.textMuted,
                    fontFamily: THEME.fonts.mono,
                    marginBottom: 12,
                  }}
                >
                  Typical GPU-first DSL iteration
                </div>
                <div
                  style={{
                    height: 12,
                    borderRadius: THEME.radius.full,
                    background: THEME.colors.bgBase,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: `${otherRuntime * 100}%`,
                      height: "100%",
                      borderRadius: THEME.radius.full,
                      background: `linear-gradient(90deg, ${THEME.colors.danger}, #FB923C)`,
                      opacity: 0.85,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(90deg, transparent, transparent 92%, rgba(248,113,113,${0.15 + 0.35 * tick}))`,
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: THEME.fontSize["2xl"],
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.danger,
                    fontWeight: 700,
                  }}
                >
                  ~30s GPU path
                </div>
                <div style={{ fontSize: THEME.fontSize.sm, color: THEME.colors.textMuted }}>
                  Kernel launch + synchronization + profiler round-trips
                </div>
              </div>
            </div>
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

  const l1 = spring({
    frame: t - 10,
    fps,
    config: { damping: 18, stiffness: 100 },
    from: 0,
    to: 1,
  });
  const l2 = spring({
    frame: t - 120,
    fps,
    config: { damping: 18, stiffness: 95 },
    from: 0,
    to: 1,
  });
  const l3 = spring({
    frame: t - 240,
    fps,
    config: { damping: 18, stiffness: 90 },
    from: 0,
    to: 1,
  });

  const layer = (
    height: number,
    yFrom: number,
    progress: number,
    bg: string,
    border: string,
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
          padding: "18px 22px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: THEME.fontSize.lg,
            fontWeight: 700,
            color: THEME.colors.textPrimary,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary }}>
          {subtitle}
        </div>
      </div>
    );
  };

  return (
    <SegmentWrap duration={SEG.E.seqDur}>
      <PageContainer
        tag="Segment 6E"
        title="Extra guardrail layers"
        subtitle="Compiler truth + on-device evidence + packaged playbooks"
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 12,
          }}
        >
          <div
            style={{
              width: 720,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: -40,
                transform: "translateX(-50%)",
                width: 2,
                height: 520,
                background: "linear-gradient(180deg, transparent, rgba(110,231,183,0.35))",
                opacity: 0.7,
              }}
            />
            {layer(
              110,
              40,
              l1,
              THEME.colors.bgElevated,
              "rgba(156,163,175,0.45)",
              "Layer 1 · Compiler guardrail",
              "Types + tile contracts catch mistakes before they become silent wrong answers",
            )}
            {layer(
              120,
              55,
              l2,
              `linear-gradient(135deg, rgba(110,231,183,0.18), ${THEME.colors.bgCard})`,
              "rgba(110,231,183,0.55)",
              "Layer 2 · Integrated profiler CLI",
              "ncu + DSA profilers unified — evidence travels with the kernel",
            )}
            {layer(
              130,
              70,
              l3,
              `linear-gradient(135deg, rgba(252,211,77,0.2), ${THEME.colors.bgCard})`,
              "rgba(252,211,77,0.55)",
              "Layer 3 · CroqTile Skills",
              "Docs + templates + patterns — agents ship structure, not just snippets",
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

  const points = [671, 784, 902, 1051, 1127];
  const progress = spring({
    frame: t - 30,
    fps,
    config: { damping: 20, stiffness: 80 },
    from: 0,
    to: 1,
  });

  const compilePass = spring({
    frame: t - 10,
    fps,
    config: { damping: 16, stiffness: 120 },
    from: 0,
    to: 1,
  });

  const agentType = interpolate(t, [20, 90], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const bottomOp = interpolate(t, [280, 360], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const yForTflops = (v: number) =>
    interpolate(v, [660, 1140], [360, 76], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const pathD = points
    .map((v, i) => {
      const x = 80 + (i * (920 - 80)) / (points.length - 1);
      const y = yForTflops(v);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const strokeDash = 1400;
  const strokeOffset = interpolate(progress, [0, 1], [strokeDash, 0]);

  return (
    <SegmentWrap duration={SEG.F.seqDur}>
      <PageContainer
        tag="Segment 6F"
        title="Real results · new paradigm"
        subtitle="Upstream AI exploration with human review — not downstream patchwork"
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: 40,
              minHeight: 0,
            }}
          >
            <DeviceShell title="agent_session.log" width="100%" height={460}>
              <div
                style={{
                  padding: 24,
                  fontFamily: THEME.fonts.mono,
                  fontSize: THEME.fontSize.sm,
                  color: THEME.colors.textSecondary,
                  background: THEME.colors.bgBase,
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ color: THEME.colors.textMuted }}>
                  [agent] planning structural change: tile_swizzle + epilogue fusion
                </div>
                <div
                  style={{
                    color: THEME.colors.textCode,
                    opacity: agentType,
                  }}
                >
                  {" "}
                  ▸ applying patch to `gemm_kernel.ct` (layout + policy)
                </div>
                <div style={{ color: THEME.colors.textMuted, opacity: agentType }}>
                  ▸ running croq build — target sm_90a
                </div>
                <div
                  style={{
                    marginTop: "auto",
                    alignSelf: "flex-start",
                    padding: "10px 18px",
                    borderRadius: THEME.radius.md,
                    background: `rgba(110,231,183,${0.12 + 0.18 * compilePass})`,
                    border: `1px solid rgba(110,231,183,0.45)`,
                    color: THEME.colors.primary,
                    fontWeight: 700,
                    transform: `scale(${0.96 + 0.04 * compilePass})`,
                    opacity: compilePass,
                    boxShadow: THEME.shadows.glowSm,
                  }}
                >
                  compile pass
                </div>
              </div>
            </DeviceShell>

            <div
              style={{
                borderRadius: THEME.radius.lg,
                background: THEME.colors.bgCard,
                border: `1px solid rgba(255,255,255,0.06)`,
                boxShadow: THEME.shadows.card,
                padding: "20px 24px 12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: THEME.fontSize.sm,
                  color: THEME.colors.textMuted,
                  marginBottom: 8,
                }}
              >
                Throughput climb (TFLOPS) · 68 iterations · +67.9%
              </div>
              <svg
                viewBox="0 0 960 420"
                style={{ width: "100%", flex: 1 }}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME.colors.primary} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={THEME.colors.primary} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1={60}
                    x2={900}
                    y1={60 + i * 80}
                    y2={60 + i * 80}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={1}
                  />
                ))}
                <path
                  d={`${pathD} L 900 400 L 80 400 Z`}
                  fill="url(#curveFill)"
                  opacity={progress}
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke={THEME.colors.primary}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={strokeDash}
                  strokeDashoffset={strokeOffset}
                  style={{ filter: `drop-shadow(${THEME.shadows.glowSm})` }}
                />
                {points.map((v, i) => {
                  const x = 80 + (i * (920 - 80)) / (points.length - 1);
                  const y = yForTflops(v);
                  const dot = spring({
                    frame: t - 60 - i * 18,
                    fps,
                    config: { damping: 12, stiffness: 140 },
                    from: 0,
                    to: 1,
                  });
                  return (
                    <g key={i} opacity={dot}>
                      <circle
                        cx={x}
                        cy={y}
                        r={6 + 3 * dot}
                        fill={THEME.colors.bgBase}
                        stroke={THEME.colors.primary}
                        strokeWidth={2}
                      />
                      <text
                        x={x}
                        y={y - 14}
                        textAnchor="middle"
                        fill={THEME.colors.textPrimary}
                        fontSize={13}
                        fontFamily={THEME.fonts.mono}
                      >
                        {v}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              opacity: bottomOp,
              transform: `translateY(${interpolate(bottomOp, [0, 1], [16, 0])}px)`,
            }}
          >
            <div
              style={{
                borderRadius: THEME.radius.md,
                padding: 20,
                background: THEME.colors.bgElevated,
                border: `1px solid rgba(248,113,113,0.35)`,
              }}
            >
              <div
                style={{
                  fontSize: THEME.fontSize.sm,
                  color: THEME.colors.danger,
                  fontFamily: THEME.fonts.mono,
                  marginBottom: 8,
                }}
              >
                Current default
              </div>
              <div
                style={{
                  fontSize: THEME.fontSize.lg,
                  color: THEME.colors.textPrimary,
                  lineHeight: 1.45,
                }}
              >
                Human writes kernel → AI assists{" "}
                <span style={{ color: THEME.colors.textMuted }}>(downstream)</span>
              </div>
            </div>
            <div
              style={{
                borderRadius: THEME.radius.md,
                padding: 20,
                background: `linear-gradient(135deg, rgba(110,231,183,0.14), ${THEME.colors.bgElevated})`,
                border: `1px solid rgba(110,231,183,0.45)`,
                boxShadow: THEME.shadows.glowSm,
              }}
            >
              <div
                style={{
                  fontSize: THEME.fontSize.sm,
                  color: THEME.colors.primary,
                  fontFamily: THEME.fonts.mono,
                  marginBottom: 8,
                }}
              >
                CroqTile workflow
              </div>
              <div
                style={{
                  fontSize: THEME.fontSize.lg,
                  color: THEME.colors.textPrimary,
                  lineHeight: 1.45,
                }}
              >
                AI explores + optimizes{" "}
                <span style={{ color: THEME.colors.textMuted }}>(upstream)</span> → Human
                reviews
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </SegmentWrap>
  );
};

export const AINative: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: THEME.colors.bgBase }}>
      <NoiseOverlay />
      <Sequence from={SEG.A.seqFrom} durationInFrames={SEG.A.seqDur}>
        <Sub6A />
      </Sequence>
      <Sequence from={SEG.B.seqFrom} durationInFrames={SEG.B.seqDur}>
        <Sub6B />
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
      <Sequence from={SEG.F.seqFrom} durationInFrames={SEG.F.seqDur}>
        <Sub6F />
      </Sequence>
    </AbsoluteFill>
  );
};
