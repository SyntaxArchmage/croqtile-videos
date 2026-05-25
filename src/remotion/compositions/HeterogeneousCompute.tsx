/**
 * remotion/compositions/HeterogeneousCompute.tsx
 * Segment 5 — Heterogeneous Computing (998 frames @ 30fps, ~33s)
 *
 * Phase A 0–125f     One DSL, Multiple Devices — source + 3 target cards enter
 * Phase B 125–443f   Compiler flag flash → cycling highlight across backends
 * Phase C 443–997f   Multi-device programming — distributed_matmul + node grid
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";
import { DeviceShell } from "../components/DeviceShell";

const DURATION = 998;
const PHASE_A_END = 125;
const PHASE_B_END = 443;
const PHASE_C_START = 443;
const FADE = 24;

const BODY_MAX = 496;
const CODE_SIZE = THEME.fontSize["2xl"];
const CODE_SIZE_C = THEME.fontSize.xl;
const LABEL_SIZE = THEME.fontSize.lg;
const MONO_SM = THEME.fontSize.sm;
const CARD_TITLE = THEME.fontSize.base;

const AMBER = "#FB923C";
const PINK = "#F472B6";
const AMBER_GLOW = "rgba(251,146,60,0.22)";
const PINK_GLOW = "rgba(244,114,182,0.22)";
const MINT_BORDER = THEME.colors.primaryGlow;
const MINT_BORDER_SOFT = `${THEME.colors.primary}38`;
const ACCENT_WARM = THEME.colors.accentWarm;
const accentWarmAlpha = (a: number): string =>
  `rgba(252,211,77,${a.toFixed(3)})`;
const CARD_GRADIENT_END = THEME.colors.bgCard;
const CROSSFADE = 18;

const TARGETS = [
  {
    name: "NVIDIA H800 / H100",
    subtitle: "Hopper SM90a",
    flag: "-t cute -arch=sm_90a",
    border: THEME.colors.primary,
    glow: THEME.colors.primaryGlow,
  },
  {
    name: "AMD RX 6900 XT",
    subtitle: "RDNA2",
    flag: "-t hip -arch=gfx1030",
    border: AMBER,
    glow: AMBER_GLOW,
  },
  {
    name: "Custom DSA",
    subtitle: "Pluggable backend",
    flag: "-t dsa_x",
    border: PINK,
    glow: PINK_GLOW,
  },
] as const;

const BULLETS = [
  "Kernel launch → compiler generates host dispatch",
  "Type conversion & alignments → handled automatically",
  "Data partitioning → parallel-by mpi splits work across ranks",
] as const;

const NODE_GRID = [
  { id: "0,0", gpu: "GPU 0", range: "M[0:4096] N[0:4096]" },
  { id: "0,1", gpu: "GPU 1", range: "M[0:4096] N[4096:8192]" },
  { id: "1,0", gpu: "GPU 2", range: "M[4096:8192] N[0:4096]" },
  { id: "1,1", gpu: "GPU 3", range: "M[4096:8192] N[4096:8192]" },
] as const;

function clampFade(
  frame: number,
  start: number,
  end: number,
  fade = FADE,
): number {
  const inOp = interpolate(frame, [start, start + fade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const outOp = interpolate(frame, [end - fade, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return Math.min(inOp, outOp);
}

const SLOT_BOUNDS = [0, 100, 200, 305] as const;

const flagWeight = (j: number, cycleFrame: number): number => {
  const start = SLOT_BOUNDS[j];
  const end = SLOT_BOUNDS[j + 1];
  const enter =
    j === 0
      ? 1
      : interpolate(
          cycleFrame,
          [start - CROSSFADE, start],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
  const exit =
    j === TARGETS.length - 1
      ? 1
      : interpolate(
          cycleFrame,
          [end - CROSSFADE, end],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
  return enter * exit;
};

const BranchArrows: React.FC<{
  cardTops: number[];
  opacity: number;
}> = ({ cardTops, opacity }) => {
  const originX = 0;
  const originY = 116;
  const endX = 76;

  return (
    <svg
      viewBox="0 0 84 240"
      style={{
        position: "absolute",
        left: -12,
        top: 32,
        width: 84,
        height: 240,
        opacity,
        overflow: "visible",
      }}
    >
      {cardTops.map((y, i) => {
        const color = TARGETS[i].border;
        return (
          <g key={TARGETS[i].name}>
            <path
              d={`M ${originX} ${originY} C ${originX + 32} ${originY}, ${endX - 24} ${y}, ${endX} ${y}`}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeOpacity={0.6}
            />
            <polygon
              points={`${endX},${y} ${endX - 8},${y - 4.5} ${endX - 8},${y + 4.5}`}
              fill={color}
              opacity={0.8}
            />
          </g>
        );
      })}
    </svg>
  );
};

const KW = "#C678DD";
const FN = "#61AFEF";
const TYPE = "#E5C07B";
const STR = "#98C379";
const OP = "#56B6C2";
const IDENT = "#ABB2BF";
const DECORATOR = "#D19A66";
const COMMENT_CLR = THEME.colors.textMuted;

const MatmulCode: React.FC = () => (
  <pre
    style={{
      margin: 0,
      padding: 0,
      whiteSpace: "pre-wrap",
      fontFamily: THEME.fonts.mono,
      fontSize: THEME.fontSize.base,
      fontWeight: 400,
      lineHeight: 1.55,
      color: IDENT,
    }}
  >
    <span style={{ color: DECORATOR }}>{"@kernel"}</span>{"\n"}
    <span style={{ color: KW }}>{"def "}</span>
    <span style={{ color: FN }}>{"matmul"}</span>
    <span style={{ color: IDENT }}>{"["}</span>
    <span style={{ color: TYPE }}>{"M, N, K"}</span>
    <span style={{ color: IDENT }}>{"]("}</span>{"\n"}
    {"  lhs: "}
    <span style={{ color: KW }}>{"global "}</span>
    <span style={{ color: TYPE }}>{"f16"}</span>
    {"[M, K],\n"}
    {"  rhs: "}
    <span style={{ color: KW }}>{"global "}</span>
    <span style={{ color: TYPE }}>{"f16"}</span>
    {"[N, K],\n"}
    {"):\n"}
    {"  acc "}
    <span style={{ color: OP }}>{"= "}</span>
    <span style={{ color: FN }}>{"zeros"}</span>
    {"[TILE_M, TILE_N]\n"}
    {"  "}
    <span style={{ color: KW }}>{"for "}</span>
    {"k "}
    <span style={{ color: KW }}>{"in "}</span>
    <span style={{ color: FN }}>{"range"}</span>
    {"(0, K, TILE_K):\n"}
    {"    acc "}
    <span style={{ color: OP }}>{"+= "}</span>
    <span style={{ color: FN }}>{"load_tile"}</span>
    {"(lhs, k) "}
    <span style={{ color: OP }}>{"@ "}</span>
    <span style={{ color: FN }}>{"load_tile"}</span>
    {"(rhs, k)\n"}
    {"  "}
    <span style={{ color: FN }}>{"store"}</span>
    {"(acc)"}
  </pre>
);

const PhaseAB: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = THEME.video.fps;

  const phaseOp = clampFade(frame, 0, PHASE_B_END);

  const codeSlide = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.85 },
    from: -72,
    to: 0,
  });
  const codeOp = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isPhaseB = frame >= PHASE_A_END;
  const cycleFrame = Math.max(0, frame - PHASE_A_END);
  const activeIndex = isPhaseB
    ? SLOT_BOUNDS.findIndex((_, i) => i < TARGETS.length && cycleFrame < SLOT_BOUNDS[i + 1]) 
    : -1;

  const cardTops = [16, 96, 176];

  const bottomLabelOp = interpolate(frame, [85, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phaseBMsgOp = interpolate(frame, [PHASE_A_END + 16, PHASE_A_END + 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: phaseOp, pointerEvents: "none" }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxHeight: BODY_MAX,
          minHeight: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1.08fr 0.92fr",
            gap: 32,
            alignItems: "stretch",
            minHeight: 0,
          }}
        >
          {/* Left — source code */}
          <div
            style={{
              transform: `translateX(${codeSlide}px)`,
              opacity: codeOp,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: THEME.fonts.sans,
                fontSize: LABEL_SIZE,
                fontWeight: 700,
                color: THEME.colors.primary,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              CroqTile source
            </div>

            {/* Compile flag crossfade + flash at Phase B start */}
            <div
              style={{
                position: "relative",
                minHeight: THEME.fontSize.xl + 12,
                marginBottom: 4,
                opacity: interpolate(frame, [53, 89], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {TARGETS.map((t, j) => {
                const w = isPhaseB ? flagWeight(j, cycleFrame) : (j === 0 ? 1 : 0);
                const flashPulse = (j === 0 && isPhaseB && cycleFrame < 20)
                  ? interpolate(cycleFrame, [0, 6, 12, 18], [1, 2.2, 1.4, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })
                  : 1;
                return (
                  <div
                    key={t.flag}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      fontFamily: THEME.fonts.mono,
                      fontSize: THEME.fontSize.lg,
                      fontWeight: 600,
                      color: t.border,
                      opacity: w,
                      letterSpacing: "0.02em",
                      background: w > 0.3 ? `${t.glow}` : "transparent",
                      borderRadius: THEME.radius.sm,
                      padding: "2px 8px",
                      filter: `brightness(${flashPulse})`,
                      boxShadow: flashPulse > 1.2 ? `0 0 16px ${t.border}` : "none",
                    }}
                  >
                    croqc {t.flag}
                  </div>
                );
              })}
            </div>

            <DeviceShell
              title="matmul.croq"
              width="100%"
              height={256}
              style={{
                border: `1px solid ${MINT_BORDER}`,
                boxShadow: `${THEME.shadows.card}, ${THEME.shadows.glowSm}, 0 0 24px ${THEME.colors.primaryGlow}`,
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  height: "100%",
                  boxSizing: "border-box",
                  background: THEME.colors.bgBase,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <MatmulCode />
              </div>
            </DeviceShell>

            {isPhaseB && (
              <div
                style={{
                  marginTop: 8,
                  fontFamily: THEME.fonts.sans,
                  fontSize: THEME.fontSize.sm,
                  fontWeight: 400,
                  color: THEME.colors.textSecondary,
                  opacity: phaseBMsgOp,
                  lineHeight: 1.45,
                }}
              >
                Same kernel — only the{" "}
                <span style={{ color: THEME.colors.accentWarm, fontWeight: 600 }}>
                  compile target
                </span>{" "}
                changes
              </div>
            )}
          </div>

          {/* Right — arrows + device cards */}
          <div style={{ position: "relative", minHeight: 0 }}>
            <BranchArrows
              cardTops={cardTops}
              opacity={interpolate(frame, [14, 50], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                paddingLeft: 68,
              }}
            >
              {TARGETS.map((target, i) => {
                const enter = spring({
                  frame: frame - 8 - i * 10,
                  fps,
                  config: { damping: 18, stiffness: 130, mass: 0.8 },
                  from: 0,
                  to: 1,
                });

                const active = isPhaseB && i === activeIndex;
                const dimmed = isPhaseB && !active;
                const cardOp = dimmed ? 0.42 : 1;
                const glow = active
                  ? spring({
                      frame: frame - PHASE_A_END - (activeIndex >= 0 ? SLOT_BOUNDS[activeIndex] : 0),
                      fps,
                      config: { damping: 18, stiffness: 130, mass: 0.75 },
                      from: 0.6,
                      to: 1,
                    })
                  : 1;

                return (
                  <div
                    key={target.name}
                    style={{
                      opacity: enter * cardOp,
                      transform: `translateX(${interpolate(enter, [0, 1], [40, 0])}px) scale(${active ? 0.98 + 0.02 * glow : 0.98 + 0.02 * enter})`,
                      padding: "12px 16px",
                      borderRadius: THEME.radius.md,
                      background: active
                        ? `linear-gradient(135deg, ${target.glow}, ${CARD_GRADIENT_END})`
                        : THEME.colors.bgCard,
                      border: `1.5px solid ${target.border}${active ? "" : "55"}`,
                      boxShadow: active
                        ? `0 0 ${Math.round(28 * glow)}px ${target.glow}, ${THEME.shadows.inset}`
                        : THEME.shadows.inset,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: THEME.fonts.sans,
                          fontSize: CARD_TITLE,
                          fontWeight: active ? 700 : 600,
                          color: active
                            ? THEME.colors.textPrimary
                            : THEME.colors.textSecondary,
                        }}
                      >
                        {target.name}
                      </span>
                      <span
                        style={{
                          fontFamily: THEME.fonts.mono,
                          fontSize: MONO_SM,
                          color: target.border,
                          opacity: 0.9,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {target.flag}
                      </span>
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontFamily: THEME.fonts.mono,
                        fontSize: MONO_SM,
                        fontWeight: 400,
                        color: THEME.colors.textMuted,
                      }}
                    >
                      {target.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom label */}
        <div
          style={{
            textAlign: "center",
            opacity: bottomLabelOp * (isPhaseB ? 0.6 : 1),
            fontFamily: THEME.fonts.mono,
            fontSize: THEME.fontSize.base,
            fontWeight: 400,
            color: THEME.colors.textSecondary,
            letterSpacing: "0.04em",
            paddingTop: 8,
            lineHeight: 1.5,
          }}
        >
          CroqTile program → different targets — the compiler lowers CroqTile IR to each backend's native ISA
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PhaseC: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = THEME.video.fps;
  const local = frame;

  const phaseOp = clampFade(local, 0, DURATION - PHASE_C_START + 24);

  const leftEnter = spring({
    frame: local - 4,
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.85 },
    from: -56,
    to: 0,
  });
  const rightEnter = spring({
    frame: local - 16,
    fps,
    config: { damping: 20, stiffness: 120, mass: 0.85 },
    from: 56,
    to: 0,
  });

  const highlightOp = interpolate(local, [24, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: phaseOp, pointerEvents: "none" }}>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1.08fr 0.92fr",
          gap: 32,
          maxHeight: BODY_MAX,
          minHeight: 0,
        }}
      >
        {/* Left — distributed matmul */}
        <div
          style={{
            transform: `translateX(${leftEnter}px)`,
            opacity: interpolate(local, [0, 20], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.sans,
              fontSize: LABEL_SIZE,
              fontWeight: 700,
              color: THEME.colors.primary,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Multi-device layer
          </div>

          <DeviceShell
            title="distributed_matmul.co"
            width="100%"
            height={420}
            style={{
              border: `1px solid ${MINT_BORDER}`,
              boxShadow: `${THEME.shadows.card}, ${THEME.shadows.glowSm}, 0 0 20px ${THEME.colors.primaryGlow}`,
            }}
          >
            <pre
              style={{
                margin: 0,
                padding: "16px 24px",
                height: "100%",
                boxSizing: "border-box",
                background: THEME.colors.bgBase,
                fontFamily: THEME.fonts.mono,
                fontSize: THEME.fontSize.lg,
                lineHeight: 1.6,
                color: IDENT,
                whiteSpace: "pre-wrap",
                position: "relative",
              }}
            >
              <span style={{ color: DECORATOR }}>{"@kernel"}</span>{" "}
              <span style={{ color: FN }}>{"distributed_matmul"}</span>
              {"["}<span style={{ color: TYPE }}>{"M, N, K"}</span>{"]\n"}
              {"lhs, rhs: "}
              <span style={{ color: KW }}>{"global "}</span>
              <span style={{ color: TYPE }}>{"f16"}</span>
              {"[...]\n\n"}
              <span
                style={{
                  color: ACCENT_WARM,
                  fontWeight: 600,
                  background: accentWarmAlpha(0.1 + 0.16 * highlightOp),
                  borderRadius: THEME.radius.sm,
                  boxShadow:
                    highlightOp > 0.1
                      ? `0 0 0 1px ${accentWarmAlpha(0.4 * highlightOp)}, 0 0 ${Math.round(16 * highlightOp)}px ${accentWarmAlpha(0.2 * highlightOp)}`
                      : undefined,
                  padding: "2px 4px",
                }}
              >
                <span style={{ color: KW }}>{"parallel"}</span>
                {" {node_m, node_n} "}
                <span style={{ color: KW }}>{"by"}</span>
                {" [world_size, 2] : "}
                <span style={{ color: TYPE }}>{"mpi"}</span>
                {" {"}
              </span>
              {"\n"}
              {"  local_M "}
              <span style={{ color: OP }}>{"= "}</span>
              <span style={{ color: FN }}>{"partition"}</span>
              {"(M, node_m)\n"}
              {"  local_N "}
              <span style={{ color: OP }}>{"= "}</span>
              <span style={{ color: FN }}>{"partition"}</span>
              {"(N, node_n)\n\n"}
              {"  "}
              <span style={{ color: FN }}>{"matmul"}</span>
              {"(local_M, local_N, K, lhs, rhs)\n"}
              {"}"}
            </pre>
          </DeviceShell>
        </div>

        {/* Right — node grid + bullets */}
        <div
          style={{
            transform: `translateX(${rightEnter}px)`,
            opacity: interpolate(local, [4, 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: THEME.fonts.sans,
              fontSize: LABEL_SIZE,
              fontWeight: 700,
              color: THEME.colors.textPrimary,
            }}
          >
            2×2 node partition
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              flex: 1,
              minHeight: 0,
            }}
          >
            {NODE_GRID.map((node, i) => {
              const cellEnter = spring({
                frame: local - 28 - i * 12,
                fps,
                config: { damping: 18, stiffness: 125, mass: 0.75 },
                from: 0,
                to: 1,
              });

              return (
                <div
                  key={node.id}
                  style={{
                    borderRadius: THEME.radius.md,
                    background: THEME.colors.bgCard,
                    border: `1px solid ${MINT_BORDER_SOFT}`,
                    padding: "16px",
                    opacity: cellEnter,
                    transform: `scale(${interpolate(cellEnter, [0, 1], [0.94, 1])})`,
                    boxShadow: THEME.shadows.inset,
                  }}
                >
                  <div
                    style={{
                      fontFamily: THEME.fonts.mono,
                      fontSize: THEME.fontSize.sm,
                      fontWeight: 600,
                      color: THEME.colors.primary,
                      marginBottom: 8,
                    }}
                  >
                    Node {node.id}
                  </div>
                  <div
                    style={{
                      fontFamily: THEME.fonts.mono,
                      fontSize: MONO_SM,
                      fontWeight: 400,
                      color: THEME.colors.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    {node.gpu}
                  </div>
                  <div
                    style={{
                      fontFamily: THEME.fonts.mono,
                      fontSize: THEME.fontSize.sm,
                      fontWeight: 400,
                      color: THEME.colors.textMuted,
                      lineHeight: 1.45,
                    }}
                  >
                    {node.range}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {BULLETS.map((text, i) => {
              const bulletEnter = spring({
                frame: local - 160 - i * 18,
                fps,
                config: { damping: 18, stiffness: 110, mass: 0.8 },
                from: 0,
                to: 1,
              });

              return (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    opacity: bulletEnter,
                    transform: `translateY(${interpolate(bulletEnter, [0, 1], [8, 0])}px)`,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: THEME.radius.full,
                      background: THEME.colors.primary,
                      marginTop: 8,
                      flexShrink: 0,
                      boxShadow: THEME.shadows.glowSm,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: THEME.fonts.sans,
                      fontSize: THEME.fontSize.sm,
                      fontWeight: 400,
                      color: THEME.colors.textSecondary,
                      lineHeight: 1.5,
                    }}
                  >
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const HeterogeneousCompute: React.FC = () => {
  return (
    <PageContainer
      tag="Segment 05"
      title="One DSL, Multiple Devices"
      subtitle="One CroqTile source — every backend, every scale"
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxHeight: BODY_MAX,
        }}
      >
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.028} blendMode="soft-light" />
        </AbsoluteFill>

        <div style={{ position: "relative", zIndex: 1, flex: 1, minHeight: 0 }}>
          <Sequence from={0} durationInFrames={443} layout="none">
            <PhaseAB />
          </Sequence>
          <Sequence from={421} durationInFrames={576} layout="none">
            <PhaseC />
          </Sequence>
        </div>
      </div>
    </PageContainer>
  );
};
