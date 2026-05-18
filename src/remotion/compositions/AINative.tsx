/**
 * remotion/compositions/AINative.tsx
 * Segment 6 — AI-native features (3:36–5:59 @ 30fps = 4300 frames)
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

const TOTAL_FRAMES = 4300;

const FADE_FRAMES = 24;

/** Body stacks below PageContainer header; keep primary visuals above ~y=700 for subtitle safe zone */
const BODY_MAX_HEIGHT = 432;

/** Typography — Segment 6 (42–58px body, 18–28px labels) */
const FS = {
  main: 48,
  mainAccent: 52,
  label: 22,
  labelSm: 18,
  mono: 20,
  monoLg: 24,
} as const;

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
        tag="Segment 06"
        title="From easy to AI-native"
        subtitle="One stack that grows with your agent"
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 48,
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT,
          }}
        >
          <div style={{ flex: 1, maxWidth: 1100 }}>
            <div
              style={{
                fontSize: FS.main,
                fontFamily: THEME.fonts.sans,
                color: THEME.colors.textSecondary,
                lineHeight: 1.45,
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
                marginTop: 22,
                fontSize: FS.mainAccent,
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
                fontSize: FS.labelSm,
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
  const { fps } = useVideoConfig();
  const t = frame;

  const croqLinesF = spring({
    frame: t - 12,
    fps,
    config: { damping: 18, stiffness: 95 },
    from: 0,
    to: 1,
  });
  const croqLines = Math.round(interpolate(croqLinesF, [0, 1], [1, 36]));

  const croqTokF = spring({
    frame: t - 28,
    fps,
    config: { damping: 16, stiffness: 88 },
    from: 0,
    to: 1,
  });
  const croqTokens = Math.round(interpolate(croqTokF, [0, 1], [0, 500]));

  const cudaLinesF = spring({
    frame: t - 100,
    fps,
    config: { damping: 17, stiffness: 85 },
    from: 0,
    to: 1,
  });
  const cudaLines = Math.round(interpolate(cudaLinesF, [0, 1], [1, 180]));

  const cudaTokF = spring({
    frame: t - 160,
    fps,
    config: { damping: 16, stiffness: 82 },
    from: 0,
    to: 1,
  });
  const cudaTokLow = Math.round(interpolate(cudaTokF, [0, 1], [0, 2000]));
  const cudaTokHigh = Math.round(interpolate(cudaTokF, [0, 1], [0, 4000]));

  const windowPulse = spring({
    frame: t - 40,
    fps,
    config: { damping: 14, stiffness: 70 },
    from: 0,
    to: 1,
  });

  const overflow = spring({
    frame: t - 150,
    fps,
    config: { damping: 18, stiffness: 72 },
    from: 0,
    to: 1,
  });

  const innerScaleCroq = spring({
    frame: t - 55,
    fps,
    config: { damping: 16, stiffness: 78 },
    from: 0.92,
    to: 1,
  });

  const innerScaleCuda = spring({
    frame: t - 130,
    fps,
    config: { damping: 14, stiffness: 68 },
    from: 0.78,
    to: 1.42,
  });

  const redEdge = interpolate(overflow, [0, 1], [0, 0.95]);

  const shellH = 392;

  return (
    <SegmentWrap duration={SEG.B.seqDur}>
      <PageContainer
        tag="Segment 06"
        title="Ultra-compact context"
        subtitle="More reasoning budget for strategy, less for boilerplate"
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "stretch",
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT,
          }}
        >
          <DeviceShell title="tokens-per-kernel.tsx" width="100%" height={shellH}>
            <div
              style={{
                padding: 22,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                height: "100%",
                boxSizing: "border-box",
                background: THEME.colors.bgBase,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: FS.labelSm,
                    color: THEME.colors.textMuted,
                    fontFamily: THEME.fonts.mono,
                    marginBottom: 6,
                  }}
                >
                  CroqTile kernel
                </div>
                <div
                  style={{
                    fontSize: FS.mainAccent,
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.primary,
                    fontWeight: 700,
                  }}
                >
                  {croqLines} lines
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: FS.monoLg,
                    fontFamily: THEME.fonts.mono,
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
                  margin: "6px 0",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: FS.labelSm,
                    color: THEME.colors.textMuted,
                    fontFamily: THEME.fonts.mono,
                    marginBottom: 6,
                  }}
                >
                  CUDA + CuTe surface
                </div>
                <div
                  style={{
                    fontSize: FS.mainAccent,
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.textSecondary,
                    fontWeight: 700,
                  }}
                >
                  {cudaLines} lines
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: FS.monoLg,
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.accentWarm,
                  }}
                >
                  ≈ {cudaTokLow}–{cudaTokHigh} tokens
                </div>
              </div>
              <div
                style={{
                  marginTop: "auto",
                  fontSize: FS.labelSm,
                  fontFamily: THEME.fonts.sans,
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
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              border: `1px solid rgba(255,255,255,0.06)`,
            }}
          >
            <div
              style={{
                fontSize: FS.label,
                color: THEME.colors.textPrimary,
                fontFamily: THEME.fonts.sans,
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
                minHeight: 280,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 16,
                  borderRadius: THEME.radius.sm,
                  border: `${2 + windowPulse * 2}px solid rgba(110,231,183,${0.32 + 0.38 * windowPulse})`,
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
                    fontSize: FS.mono,
                    color: THEME.colors.primary,
                    textAlign: "center",
                    padding: 12,
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
                    opacity: interpolate(t, [70, 130], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 20,
                    right: 22,
                    fontFamily: THEME.fonts.sans,
                    fontSize: FS.labelSm,
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
  const { fps } = useVideoConfig();
  const t = frame;

  const instrOp = spring({
    frame: t - 8,
    fps,
    config: { damping: 17, stiffness: 105 },
    from: 0,
    to: 1,
  });

  const showCroq = spring({
    frame: t - 55,
    fps,
    config: { damping: 16, stiffness: 100 },
    from: 0,
    to: 1,
  });
  const showCuda = spring({
    frame: t - 130,
    fps,
    config: { damping: 16, stiffness: 95 },
    from: 0,
    to: 1,
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

  const shellH = 388;

  return (
    <SegmentWrap duration={SEG.C.seqDur}>
      <PageContainer
        tag="Segment 06"
        title="Zero context waste"
        subtitle="Agents edit intent-sized regions — not constellation surgery"
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            opacity: instrOp,
            transform: `translateY(${interpolate(instrOp, [0, 1], [14, 0])}px)`,
            marginBottom: 18,
            padding: "16px 24px",
            borderRadius: THEME.radius.md,
            background: THEME.colors.bgElevated,
            border: `1px solid rgba(129,140,248,0.35)`,
            alignSelf: "flex-start",
            maxWidth: 920,
            boxShadow: THEME.shadows.card,
          }}
        >
          <span
            style={{
              fontSize: FS.labelSm,
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
              fontSize: FS.label,
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
            gap: 36,
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT,
          }}
        >
          <DeviceShell title="croqtile_gemm.ct" width="100%" height={shellH}>
            <div
              style={{
                position: "relative",
                padding: "18px 22px",
                fontFamily: THEME.fonts.mono,
                fontSize: FS.mono,
                lineHeight: 1.65,
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
                {showCroq > 0.08 &&
                  highlightBox(132, 68, 44, 22, THEME.colors.primary, showCroq)}
              </div>
              <div>{"  "}...</div>

              <div
                style={{
                  position: "absolute",
                  left: 18,
                  bottom: 14,
                  fontSize: FS.monoLg,
                  fontFamily: THEME.fonts.mono,
                  color: THEME.colors.primary,
                  fontWeight: 700,
                  opacity: interpolate(showCroq, [0.45, 1], [0, 1]),
                }}
              >
                1 change site
              </div>
            </div>
          </DeviceShell>

          <DeviceShell title="cuda_cute_attn.cuh" width="100%" height={shellH}>
            <div
              style={{
                position: "relative",
                padding: "18px 22px",
                fontFamily: THEME.fonts.mono,
                fontSize: FS.mono,
                lineHeight: 1.62,
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
                  left: 18,
                  bottom: 14,
                  fontSize: FS.monoLg,
                  fontFamily: THEME.fonts.mono,
                  color: THEME.colors.danger,
                  fontWeight: 700,
                  opacity: interpolate(showCuda, [0.5, 1], [0, 1]),
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
    { label: "Triton", value: 7.5, color: THEME.colors.accent },
    { label: "CUDA", value: 10.0, color: THEME.colors.textCode },
    { label: "Helion", value: 23.3, color: THEME.colors.textMuted },
  ];

  const maxPct = 25;

  const barProgress = rows.map((_, i) =>
    spring({
      frame: t - 20 - i * 14,
      fps,
      config: { damping: 15, stiffness: 155 },
      from: 0,
      to: 1,
    }),
  );

  const loopReveal = spring({
    frame: t - 285,
    fps,
    config: { damping: 17, stiffness: 82 },
    from: 0,
    to: 1,
  });

  const croqtileScan = spring({
    frame: t - 340,
    fps,
    config: { damping: 16, stiffness: 88 },
    from: 0,
    to: 1,
  });

  const otherRuntime = spring({
    frame: t - 365,
    fps,
    config: { damping: 17, stiffness: 74 },
    from: 0,
    to: 1,
  });

  const tick = 0.5 + 0.5 * Math.sin(t * 0.29);

  const barGradient = (label: string, base: string) => {
    if (label === "CroqTile") {
      return `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.primaryDark})`;
    }
    if (label === "Helion") {
      return `linear-gradient(90deg, ${THEME.colors.textMuted}, ${THEME.colors.textSecondary})`;
    }
    return `linear-gradient(90deg, ${base}, ${THEME.colors.accent})`;
  };

  return (
    <SegmentWrap duration={SEG.D.seqDur}>
      <PageContainer
        tag="Segment 06"
        title="Lowest compile failure rate"
        subtitle="Fast feedback beats long GPU tails"
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT,
          }}
        >
          <div style={{ flex: 1.05, minHeight: 0 }}>
            <div
              style={{
                fontSize: FS.labelSm,
                fontFamily: THEME.fonts.sans,
                color: THEME.colors.textMuted,
                marginBottom: 12,
              }}
            >
              Compile failures per attempt (%)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {rows.map((row, i) => {
                const w = (row.value / maxPct) * 100 * barProgress[i];
                return (
                  <div
                    key={row.label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "128px 1fr 88px",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: THEME.fonts.mono,
                        color: THEME.colors.textSecondary,
                        fontSize: FS.mono,
                      }}
                    >
                      {row.label}
                    </span>
                    <div
                      style={{
                        height: 24,
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
                          background: barGradient(row.label, row.color),
                          boxShadow:
                            row.label === "CroqTile" ? THEME.shadows.glowSm : undefined,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: THEME.fonts.mono,
                        color: THEME.colors.textPrimary,
                        fontSize: FS.mono,
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
              padding: 22,
              border: `1px solid rgba(255,255,255,0.06)`,
              boxShadow: THEME.shadows.card,
              opacity: loopReveal,
              transform: `translateY(${interpolate(loopReveal, [0, 1], [18, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: FS.label,
                fontFamily: THEME.fonts.sans,
                fontWeight: 600,
                color: THEME.colors.textPrimary,
                marginBottom: 16,
              }}
            >
              Feedback loop latency
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 28,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: FS.labelSm,
                    color: THEME.colors.primary,
                    fontFamily: THEME.fonts.mono,
                    marginBottom: 10,
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
                      background: `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.primaryDark})`,
                      boxShadow: THEME.shadows.glowSm,
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: FS.mainAccent,
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.primary,
                    fontWeight: 700,
                  }}
                >
                  ≈ 3s
                </div>
                <div
                  style={{
                    fontSize: FS.labelSm,
                    fontFamily: THEME.fonts.sans,
                    color: THEME.colors.textMuted,
                  }}
                >
                  Static guarantees + deterministic errors · iterate like a linter
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: FS.labelSm,
                    color: THEME.colors.textMuted,
                    fontFamily: THEME.fonts.mono,
                    marginBottom: 10,
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
                      background: `linear-gradient(90deg, ${THEME.colors.danger}, ${THEME.colors.accentWarm})`,
                      opacity: 0.88,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(90deg, transparent, transparent 92%, rgba(248,113,113,${0.12 + 0.38 * tick}))`,
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: FS.mainAccent,
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.danger,
                    fontWeight: 700,
                  }}
                >
                  ~30s GPU path
                </div>
                <div
                  style={{
                    fontSize: FS.labelSm,
                    fontFamily: THEME.fonts.sans,
                    color: THEME.colors.textMuted,
                  }}
                >
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

  /** Stack floats strictly bottom→top: each layer springs after the previous beat */
  const l1 = spring({
    frame: t - 18,
    fps,
    config: { damping: 17, stiffness: 102 },
    from: 0,
    to: 1,
  });
  const l2 = spring({
    frame: t - 145,
    fps,
    config: { damping: 17, stiffness: 98 },
    from: 0,
    to: 1,
  });
  const l3 = spring({
    frame: t - 275,
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
            color: THEME.colors.primary,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
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
        title="Extra guardrail layers"
        subtitle="Compiler truth + on-device evidence + packaged playbooks"
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
              108,
              48,
              l1,
              THEME.colors.bgElevated,
              "rgba(156,163,175,0.45)",
              "Layer 01",
              "Compiler Guardrail",
              "Types + tile contracts catch mistakes before they become silent wrong answers.",
            )}
            {layer(
              118,
              58,
              l2,
              `linear-gradient(135deg, rgba(110,231,183,0.18), ${THEME.colors.bgCard})`,
              "rgba(110,231,183,0.55)",
              "Layer 02",
              "Profiler CLI",
              "ncu + DSA profilers unified — evidence travels with the kernel.",
            )}
            {layer(
              126,
              68,
              l3,
              `linear-gradient(135deg, rgba(252,211,77,0.2), ${THEME.colors.bgCard})`,
              "rgba(252,211,77,0.55)",
              "Layer 03",
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

  const points = [671, 784, 902, 1051, 1127];
  const STAGGER = 46;

  const yForTflops = (v: number) =>
    interpolate(v, [660, 1140], [328, 62], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const xs = points.map(
    (_, i) => 80 + (i * (900 - 80)) / (points.length - 1),
  );
  const ys = points.map((v) => yForTflops(v));

  const segLens = points.slice(0, -1).map((_, i) => {
    const dx = xs[i + 1] - xs[i];
    const dy = ys[i + 1] - ys[i];
    return Math.max(1, Math.hypot(dx, dy));
  });

  const segmentSprings = segLens.map((_, i) =>
    spring({
      frame: t - 26 - i * STAGGER,
      fps,
      config: { damping: 16, stiffness: 112 },
      from: 0,
      to: 1,
    }),
  );

  const pointSprings = points.map((_, i) =>
    spring({
      frame: t - 22 - i * STAGGER,
      fps,
      config: { damping: 14, stiffness: 130 },
      from: 0,
      to: 1,
    }),
  );

  const fillReveal = spring({
    frame: t - 22 - (points.length - 1) * STAGGER - 28,
    fps,
    config: { damping: 18, stiffness: 92 },
    from: 0,
    to: 1,
  });

  const compilePass = spring({
    frame: t - 12,
    fps,
    config: { damping: 16, stiffness: 120 },
    from: 0,
    to: 1,
  });

  const agentType = spring({
    frame: t - 28,
    fps,
    config: { damping: 17, stiffness: 96 },
    from: 0,
    to: 1,
  });

  const bottomOp = spring({
    frame: t - 210,
    fps,
    config: { damping: 18, stiffness: 84 },
    from: 0,
    to: 1,
  });

  const pathD = points
    .map((_, i) =>
      `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`,
    )
    .join(" ");

  const shellH = 312;

  return (
    <SegmentWrap duration={SEG.F.seqDur}>
      <PageContainer
        tag="Segment 06"
        title="Real results · new paradigm"
        subtitle="Upstream AI exploration with human review — not downstream patchwork"
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minHeight: 0,
            maxHeight: BODY_MAX_HEIGHT - 12,
          }}
        >
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "0.95fr 1.05fr",
              gap: 32,
              minHeight: 0,
            }}
          >
            <DeviceShell title="agent_session.log" width="100%" height={shellH}>
              <div
                style={{
                  padding: 20,
                  fontFamily: THEME.fonts.mono,
                  fontSize: FS.mono,
                  color: THEME.colors.textSecondary,
                  background: THEME.colors.bgBase,
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
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
                    fontFamily: THEME.fonts.mono,
                    fontWeight: 700,
                    fontSize: FS.label,
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
                padding: "18px 22px 10px",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <div
                style={{
                  fontSize: FS.labelSm,
                  fontFamily: THEME.fonts.sans,
                  color: THEME.colors.textMuted,
                  marginBottom: 6,
                }}
              >
                Tuning convergence · throughput (TFLOPS) · 671 → 1127
              </div>
              <svg
                viewBox="0 0 960 380"
                style={{ width: "100%", height: 270 }}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="seg06CurveFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={THEME.colors.primary} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={THEME.colors.primary} stopOpacity="0" />
                  </linearGradient>
                </defs>
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
                <path
                  d={`${pathD} L ${xs[xs.length - 1]} 348 L ${xs[0]} 348 Z`}
                  fill="url(#seg06CurveFill)"
                  opacity={fillReveal}
                />
                {segLens.map((len, i) => {
                  const d = `M ${xs[i]} ${ys[i]} L ${xs[i + 1]} ${ys[i + 1]}`;
                  const p = segmentSprings[i];
                  return (
                    <path
                      key={i}
                      d={d}
                      fill="none"
                      stroke={THEME.colors.primary}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={len}
                      strokeDashoffset={len * (1 - p)}
                      style={{ filter: `drop-shadow(${THEME.shadows.glowSm})` }}
                    />
                  );
                })}
                {points.map((v, i) => {
                  const dot = pointSprings[i];
                  return (
                    <g key={i} opacity={dot}>
                      <circle
                        cx={xs[i]}
                        cy={ys[i]}
                        r={5 + 4 * dot}
                        fill={THEME.colors.bgBase}
                        stroke={THEME.colors.primary}
                        strokeWidth={2}
                      />
                      <text
                        x={xs[i]}
                        y={ys[i] - 14}
                        textAnchor="middle"
                        fill={THEME.colors.textPrimary}
                        fontSize={FS.mono}
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
              gap: 20,
              opacity: bottomOp,
              transform: `translateY(${interpolate(bottomOp, [0, 1], [14, 0])}px)`,
            }}
          >
            <div
              style={{
                borderRadius: THEME.radius.md,
                padding: 18,
                background: THEME.colors.bgElevated,
                border: `1px solid rgba(248,113,113,0.35)`,
              }}
            >
              <div
                style={{
                  fontSize: FS.labelSm,
                  color: THEME.colors.danger,
                  fontFamily: THEME.fonts.mono,
                  marginBottom: 6,
                }}
              >
                Current default
              </div>
              <div
                style={{
                  fontSize: FS.label,
                  fontFamily: THEME.fonts.sans,
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
                padding: 18,
                background: `linear-gradient(135deg, rgba(110,231,183,0.14), ${THEME.colors.bgElevated})`,
                border: `1px solid rgba(110,231,183,0.45)`,
                boxShadow: THEME.shadows.glowSm,
              }}
            >
              <div
                style={{
                  fontSize: FS.labelSm,
                  color: THEME.colors.primary,
                  fontFamily: THEME.fonts.mono,
                  marginBottom: 6,
                }}
              >
                CroqTile workflow
              </div>
              <div
                style={{
                  fontSize: FS.label,
                  fontFamily: THEME.fonts.sans,
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
