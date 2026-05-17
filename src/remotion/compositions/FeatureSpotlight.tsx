/**
 * remotion/compositions/FeatureSpotlight.tsx
 * Segment 2 — "Simple & Intuitive"  (46.3 s = 1390 frames @ 30fps)
 *
 * Narrative: thread-view (CUDA/OpenCL) vs tensor-view (CroqTile)
 *
 * 2-intro  (0–300f,   10s): thread-view chaos — buffer+offset complexity grows
 * 2A       (300–900f, 20s): CroqTile tensor-view vs CUDA thread-view code split
 * 2B       (900–1260f,12s): TMA & MMA zero-boilerplate + LOC comparison
 * 2-outro  (1260–1410f,5s): conclusion card — intuitive + AI-readable + less code
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";
import { DeviceShell } from "../components/DeviceShell";

const W = THEME.video.width;
const H = THEME.video.height;
const CX = W / 2;
const CY = H / 2;

/* ═══════════════════════════════════════════════════════════════════════════
 * SECTION 1 — Thread-view intro (0–300f)
 * Shows how SIMD / thread-view programming makes addresses complex
 * ═══════════════════════════════════════════════════════════════════════════ */

const THREAD_EXPRESSIONS = [
  { label: "Thread 0", expr: "buf[0 * stride + 0]" },
  { label: "Thread 1", expr: "buf[1 * stride + offset]" },
  { label: "Thread 2", expr: "buf[bm * M + tid * K + iv_k]" },
  { label: "Thread 3", expr: "buf[blockIdx.x * BM * stride + threadIdx.x * BK + iv_k * TILE_K]" },
];

const ThreadViewIntro: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const titleOp = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gridOp = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chaosProgress = interpolate(frame, [60, 400], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const annotationOp = interpolate(frame, [300, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [475, 510], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const COLS = 4;
  const ROWS = 4;
  const CELL_W = 340;
  const CELL_H = 90;
  const GAP = 16;
  const gridW = COLS * CELL_W + (COLS - 1) * GAP;
  const gridH = ROWS * CELL_H + (ROWS - 1) * GAP;
  const gridLeft = CX - gridW / 2;
  const gridTop = CY - gridH / 2 + 30;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <NoiseOverlay opacity={0.028} blendMode="soft-light" />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          width: W,
          textAlign: "center",
          opacity: titleOp,
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            fontFamily: THEME.fonts.sans,
            color: THEME.colors.textPrimary,
          }}
        >
          Traditional SIMD Programming
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: THEME.fonts.sans,
            color: THEME.colors.textSecondary,
            marginTop: 12,
          }}
        >
          Every thread manually computes its own address
        </div>
      </div>

      {/* Thread grid */}
      <div
        style={{
          position: "absolute",
          left: gridLeft,
          top: gridTop,
          width: gridW,
          opacity: gridOp,
        }}
      >
        {Array.from({ length: ROWS }).map((_, row) =>
          Array.from({ length: COLS }).map((_, col) => {
            const idx = row * COLS + col;
            const exprIdx = Math.min(
              Math.floor(chaosProgress * THREAD_EXPRESSIONS.length),
              THREAD_EXPRESSIONS.length - 1,
            );
            const visibleIdx = Math.min(exprIdx, THREAD_EXPRESSIONS.length - 1);
            const entry = THREAD_EXPRESSIONS[visibleIdx];

            const cellDelay = (row + col) * 3;
            const cellOp = interpolate(
              frame,
              [30 + cellDelay, 50 + cellDelay],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

            const exprScale =
              1 + chaosProgress * 0.12 * Math.sin(idx * 1.7 + frame * 0.05);

            const borderRed = interpolate(chaosProgress, [0.5, 1], [0, 0.6], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={`${row}-${col}`}
                style={{
                  position: "absolute",
                  left: col * (CELL_W + GAP),
                  top: row * (CELL_H + GAP),
                  width: CELL_W,
                  height: CELL_H,
                  borderRadius: THEME.radius.md,
                  background: THEME.colors.bgCard,
                  border: `1px solid rgba(${
                    borderRed > 0.3 ? "248,113,113" : "255,255,255"
                  },${0.1 + borderRed * 0.3})`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: cellOp,
                  transform: `scale(${exprScale})`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: THEME.fonts.mono,
                    color: THEME.colors.textMuted,
                    marginBottom: 6,
                  }}
                >
                  Thread {idx}
                </div>
                <div
                  style={{
                    fontSize: Math.max(11, 15 - entry.expr.length * 0.08),
                    fontFamily: THEME.fonts.mono,
                    color:
                      chaosProgress > 0.6
                        ? THEME.colors.danger
                        : THEME.colors.textCode,
                    textAlign: "center",
                    padding: "0 8px",
                    wordBreak: "break-all",
                  }}
                >
                  {entry.expr}
                </div>
              </div>
            );
          }),
        )}
      </div>

      {/* Annotation */}
      <div
        style={{
          position: "absolute",
          bottom: 130,
          width: W,
          textAlign: "center",
          opacity: annotationOp,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 36px",
            borderRadius: THEME.radius.lg,
            background: "rgba(248,113,113,0.12)",
            border: "1px solid rgba(248,113,113,0.3)",
          }}
        >
          <span style={{ fontSize: 28 }}>!</span>
          <span
            style={{
              fontSize: 22,
              fontFamily: THEME.fonts.sans,
              color: THEME.colors.danger,
              fontWeight: 600,
            }}
          >
            Data blocking? Manual offset arithmetic everywhere.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
 * SECTION 2A — CroqTile vs CUDA code contrast (300–900f)
 * Three dimensions + chunkat / subspan / .at() showcase
 * ═══════════════════════════════════════════════════════════════════════════ */

const PANEL_W = 818;
const PANEL_H = 620;
const CODE_SIZE = 13;
const CODE_LINE_H = 20;
const CODE_PAD = 20;

const DIM_LABELS = [
  "Tensor, not buffer",
  "subspan · chunkat · .at()",
  "parallel by — unified",
] as const;

type DimIndex = 0 | 1 | 2;

const CROQ_DIM: Record<DimIndex, string[]> = {
  0: [
    "// CroqTile — tensor declaration",
    "__co__ void matmul(",
    "    global f16 [M, K] lhs,",
    "    global f16 [N, K] rhs,",
    "    global f16 [M, N] output)",
  ],
  1: [
    "// CroqTile — tile operations",
    "// subspan: describe a sub-region",
    "auto tile = lhs.subspan(WARP_M, TILE_K);",
    "",
    "// chunkat: slice by block index",
    "tma.copy rhs.chunkat(bn, iv_k) => rhs_s;",
    "",
    "// .at(): locate iteration position",
    "tma.copy tile.at(bm, iv_k) => lhs_s;",
  ],
  2: [
    "// CroqTile — all parallelism levels",
    "parallel {block_m, block_n}",
    "    by [cdiv(M, WARP_M), cdiv(N, WARP_N)]",
    "    : block {",
    "  parallel p by 1 : group-4 {",
    "    ...",
    "  }",
    "}",
  ],
};

const CUDA_DIM: Record<DimIndex, string[]> = {
  0: [
    "// CUDA + CuTe — pointer + strides",
    "void matmul(",
    "    half* lhs, int lhs_stride0,",
    "    int lhs_stride1,",
    "    half* rhs, int rhs_stride0,",
    "    int rhs_stride1, ...)",
  ],
  1: [
    "// CUDA — manual offset arithmetic",
    "int off_lhs = bm * WARP_M * stride",
    "            + iv_k * TILE_K;",
    "cp.async.cg.shared.global",
    "    [lhs_s], [lhs + off_lhs], 16;",
    "",
    "int off_rhs = bn * WARP_N * stride",
    "            + iv_k * TILE_K;",
    "cp.async.cg.shared.global",
    "    [rhs_s], [rhs + off_rhs], 16;",
  ],
  2: [
    "// CUDA — thread / warp plumbing",
    "int bm = blockIdx.x;",
    "int bn = blockIdx.y;",
    "int tid = threadIdx.x;",
    "// cooperative groups for warp group",
    "auto group = cg::tiled_partition<128>(block);",
  ],
};

const HIGHLIGHT_CROQ: Record<DimIndex, number[]> = {
  0: [2, 3, 4, 5],
  1: [3, 6, 9],
  2: [2, 3, 5],
};

const HIGHLIGHT_CUDA: Record<DimIndex, number[]> = {
  0: [2, 3, 4, 5, 6],
  1: [2, 3, 5, 7, 8, 10],
  2: [2, 3, 4, 6],
};

function dimContentOpacity(dim: DimIndex, localFrame: number): number {
  const f = localFrame;
  if (dim === 0) {
    return interpolate(f, [0, 30, 170, 200], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (dim === 1) {
    return interpolate(f, [200, 230, 400, 430], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return interpolate(f, [430, 460, 580, 600], [0, 1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function pillStrength(idx: DimIndex, localFrame: number): number {
  const base = dimContentOpacity(idx, localFrame);
  const next = idx < 2 ? dimContentOpacity((idx + 1) as DimIndex, localFrame) : 0;
  return Math.max(0, Math.min(1, base * (1 - next * 0.35)));
}

interface CodePaneProps {
  lines: string[];
  highlightRows: Set<number>;
  glow: number;
  accent: "mint" | "amber";
  layout?: "fill" | "shrink";
}

const CodePane: React.FC<CodePaneProps> = ({
  lines,
  highlightRows,
  glow,
  accent,
  layout = "fill",
}) => {
  const accentBg =
    accent === "mint"
      ? "rgba(110,231,183,0.14)"
      : "rgba(252,211,77,0.12)";
  const accentGlow =
    accent === "mint"
      ? "0 0 24px rgba(110,231,183,0.22)"
      : "0 0 22px rgba(252,211,77,0.2)";
  const accentBorder =
    accent === "mint"
      ? "rgba(110,231,183,0.35)"
      : "rgba(252,211,77,0.35)";

  return (
    <div
      style={{
        flex: layout === "fill" ? 1 : undefined,
        flexShrink: layout === "shrink" ? 0 : undefined,
        minHeight: layout === "fill" ? 0 : undefined,
        overflow: "hidden",
        padding: CODE_PAD,
        fontFamily: THEME.fonts.mono,
        fontSize: CODE_SIZE,
        color: THEME.colors.textSecondary,
        lineHeight: `${CODE_LINE_H}px`,
      }}
    >
      {lines.map((line, i) => {
        const row = i + 1;
        const hi = highlightRows.has(row);
        const rowGlow = hi ? interpolate(glow, [0, 1], [0.35, 1]) : 0;

        return (
          <div
            key={`${row}-${line.slice(0, 16)}`}
            style={{
              position: "relative",
              minHeight: CODE_LINE_H,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              paddingLeft: 36,
              borderRadius: THEME.radius.sm,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 28,
                textAlign: "right",
                fontSize: THEME.fontSize.xs,
                color: THEME.colors.textMuted,
                opacity: 0.55,
                userSelect: "none",
              }}
            >
              {row}
            </span>
            {hi && (
              <div
                style={{
                  position: "absolute",
                  inset: "0 0 0 20px",
                  borderRadius: THEME.radius.sm,
                  background: `linear-gradient(90deg, ${accentBg} 0%, rgba(129,140,248,0.08) 100%)`,
                  border: `1px solid ${accentBorder}`,
                  boxShadow: accentGlow,
                  opacity: rowGlow,
                  pointerEvents: "none",
                }}
              />
            )}
            <span
              style={{
                position: "relative",
                zIndex: 1,
                color: line.startsWith("//")
                  ? THEME.colors.textMuted
                  : hi
                    ? THEME.colors.textCode
                    : THEME.colors.textSecondary,
                textShadow: hi
                  ? `0 0 ${8 + 10 * rowGlow}px rgba(110,231,183,0.25)`
                  : undefined,
              }}
            >
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DimensionPills: React.FC<{ localFrame: number }> = ({ localFrame }) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
    {DIM_LABELS.map((label, i) => {
      const idx = i as DimIndex;
      const strength = pillStrength(idx, localFrame);
      const isPeak = strength > 0.55;

      return (
        <div
          key={label}
          style={{
            padding: "10px 18px",
            borderRadius: THEME.radius.full,
            fontSize: THEME.fontSize.sm,
            fontFamily: THEME.fonts.mono,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            border: `1px solid ${
              isPeak ? "rgba(110,231,183,0.55)" : "rgba(255,255,255,0.08)"
            }`,
            color: isPeak ? THEME.colors.textPrimary : THEME.colors.textMuted,
            background: isPeak
              ? "linear-gradient(135deg, rgba(110,231,183,0.12) 0%, rgba(129,140,248,0.08) 100%)"
              : "rgba(17,24,39,0.6)",
            boxShadow: isPeak ? `${THEME.shadows.glowSm}, inset 0 1px 0 rgba(255,255,255,0.06)` : THEME.shadows.inset,
            opacity: interpolate(strength, [0, 1], [0.55, 1]),
            transform: `scale(${interpolate(strength, [0, 1], [0.97, 1])})`,
          }}
        >
          {label}
        </div>
      );
    })}
  </div>
);

const SplitSection: React.FC<{ localFrame: number; fps: number }> = ({
  localFrame,
  fps,
}) => {
  const enterL = spring({
    frame: localFrame - 4,
    fps,
    config: { damping: 17, stiffness: 110, mass: 0.75 },
    from: -110,
    to: 0,
  });
  const enterR = spring({
    frame: localFrame - 14,
    fps,
    config: { damping: 17, stiffness: 110, mass: 0.75 },
    from: 110,
    to: 0,
  });
  const fade = spring({
    frame: localFrame,
    fps,
    config: { damping: 24, stiffness: 90, mass: 1 },
    from: 0,
    to: 1,
  });

  const glowPulse = interpolate(
    localFrame % 120,
    [0, 30, 90, 120],
    [0.55, 1, 0.65, 0.55],
    { extrapolateRight: "clamp" },
  );

  const dims: DimIndex[] = [0, 1, 2];

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        opacity: fade,
      }}
    >
      <DimensionPills localFrame={localFrame} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "row",
          gap: 28,
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        {/* CroqTile panel */}
        <div
          style={{
            transform: `translateX(${enterL}px)`,
            filter: "drop-shadow(0 0 18px rgba(110,231,183,0.12))",
          }}
        >
          <DeviceShell
            width={PANEL_W}
            height={PANEL_H}
            title="croqtile KERNEL"
            style={{ border: "1px solid rgba(110,231,183,0.18)" }}
          >
            <AbsoluteFill>
              {dims.map((d) => {
                const o = dimContentOpacity(d, localFrame);
                if (o < 0.002) return null;
                const rows = new Set(HIGHLIGHT_CROQ[d]);
                return (
                  <div
                    key={d}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: o,
                      pointerEvents: "none",
                    }}
                  >
                    <CodePane
                      lines={CROQ_DIM[d]}
                      highlightRows={rows}
                      glow={glowPulse}
                      accent="mint"
                    />
                  </div>
                );
              })}
            </AbsoluteFill>
          </DeviceShell>
        </div>

        {/* CUDA panel */}
        <div
          style={{
            transform: `translateX(${enterR}px)`,
            filter: "drop-shadow(0 0 18px rgba(252,211,77,0.08))",
          }}
        >
          <DeviceShell
            width={PANEL_W}
            height={PANEL_H}
            title="cuda + cute"
            style={{ border: "1px solid rgba(252,211,77,0.14)" }}
          >
            <AbsoluteFill>
              {dims.map((d) => {
                const o = dimContentOpacity(d, localFrame);
                if (o < 0.002) return null;
                const rows = new Set(HIGHLIGHT_CUDA[d]);
                return (
                  <div
                    key={d}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: o,
                      pointerEvents: "none",
                    }}
                  >
                    <CodePane
                      lines={CUDA_DIM[d]}
                      highlightRows={rows}
                      glow={glowPulse}
                      accent="amber"
                    />
                  </div>
                );
              })}
            </AbsoluteFill>
          </DeviceShell>
        </div>
      </div>
    </div>
  );
};

/* BoilerplateSection removed — LOC bars integrated into ConclusionCard */

/* ═══════════════════════════════════════════════════════════════════════════
 * SECTION 2-outro — Conclusion card (1260–1410f)
 * ═══════════════════════════════════════════════════════════════════════════ */

const CONCLUSION_LINES = [
  { text: "Super intuitive", sub: "Code reads like logic — no hidden offsets", color: THEME.colors.primary },
  { text: "Readable by human & AI", sub: "Engineers and AI agents understand at a glance", color: THEME.colors.accent },
  { text: "60% less code", sub: "", color: THEME.colors.accentWarm },
];

const ConclusionCard: React.FC<{ localFrame: number; fps: number }> = ({
  localFrame,
  fps,
}) => {
  const fadeIn = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const locBarOp = interpolate(localFrame, [80, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const locBarWidth = interpolate(localFrame, [110, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <NoiseOverlay opacity={0.028} blendMode="soft-light" />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 36,
          alignItems: "center",
        }}
      >
        {CONCLUSION_LINES.map((line, i) => {
          const lineSpring = spring({
            frame: localFrame - 10 - i * 18,
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.8 },
            from: 0,
            to: 1,
          });
          const y = interpolate(lineSpring, [0, 1], [40, 0]);
          const op = lineSpring;

          return (
            <div
              key={line.text}
              style={{
                opacity: op,
                transform: `translateY(${y}px)`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  fontFamily: THEME.fonts.sans,
                  color: line.color,
                  textShadow: `0 0 24px ${line.color}44`,
                  marginBottom: line.sub ? 8 : 0,
                }}
              >
                {line.text}
              </div>
              {line.sub && (
                <div
                  style={{
                    fontSize: 20,
                    fontFamily: THEME.fonts.sans,
                    color: THEME.colors.textSecondary,
                  }}
                >
                  {line.sub}
                </div>
              )}
            </div>
          );
        })}

        {/* LOC comparison bars */}
        <div style={{ opacity: locBarOp, marginTop: 12, width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 16, fontFamily: THEME.fonts.mono, color: THEME.colors.primary, fontWeight: 700, minWidth: 90 }}>
              CroqTile
            </span>
            <div style={{ flex: 1, height: 24, borderRadius: THEME.radius.sm, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ width: `${(36 / 280) * 100 * locBarWidth}%`, height: "100%", borderRadius: THEME.radius.sm, background: `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.accent})`, boxShadow: THEME.shadows.glowSm }} />
            </div>
            <span style={{ fontSize: 18, fontFamily: THEME.fonts.mono, color: THEME.colors.primary, fontWeight: 700, minWidth: 70 }}>
              36
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 16, fontFamily: THEME.fonts.mono, color: THEME.colors.accentWarm, fontWeight: 700, minWidth: 90 }}>
              CUDA
            </span>
            <div style={{ flex: 1, height: 24, borderRadius: THEME.radius.sm, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ width: `${100 * locBarWidth}%`, height: "100%", borderRadius: THEME.radius.sm, background: "linear-gradient(90deg, rgba(252,211,77,0.6), rgba(252,211,77,0.3))" }} />
            </div>
            <span style={{ fontSize: 18, fontFamily: THEME.fonts.mono, color: THEME.colors.accentWarm, fontWeight: 700, minWidth: 70 }}>
              280
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ═══════════════════════════════════════════════════════════════════════════ */

const INTRO_END = 510;
const SPLIT_END = 1100;
const TOTAL_FRAMES = 1390;

export const FeatureSpotlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const section =
    frame < INTRO_END
      ? "intro"
      : frame < SPLIT_END
        ? "split"
        : "conclusion";

  const headerTitle =
    section === "intro"
      ? "Thread-view: the SIMD challenge"
      : section === "split"
        ? "Tensor-view: CroqTile's macro approach"
        : "";

  const headerSub =
    section === "intro"
      ? "Each thread manually computes physical addresses — data blocking requires offset arithmetic"
      : section === "split"
        ? "subspan · chunkat · .at() — tile-level primitives replace manual address math"
        : "";

  const titleBlend =
    section === "split"
      ? interpolate(frame, [INTRO_END - 24, INTRO_END + 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  if (section === "conclusion") {
    return (
      <PageContainer tag="Segment 02" style={{ pointerEvents: "none" }}>
        <ConclusionCard localFrame={frame - SPLIT_END} fps={fps} />
      </PageContainer>
    );
  }

  return (
    <PageContainer tag="Segment 02" style={{ pointerEvents: "none" }}>
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              position: "relative",
            }}
          >
            {/* Header */}
            {headerTitle && (
              <div style={{ position: "relative", minHeight: 110, marginBottom: 8 }}>
                <div style={{ opacity: titleBlend }}>
                  <h1
                    style={{
                      fontSize: THEME.fontSize["2xl"],
                      color: THEME.colors.textPrimary,
                      fontFamily: THEME.fonts.sans,
                      fontWeight: 700,
                      lineHeight: 1.18,
                      margin: 0,
                      marginBottom: 10,
                    }}
                  >
                    {headerTitle}
                  </h1>
                  <p
                    style={{
                      margin: 0,
                      fontSize: THEME.fontSize.base,
                      color: THEME.colors.textSecondary,
                      maxWidth: 1180,
                      lineHeight: 1.5,
                    }}
                  >
                    {headerSub}
                  </p>
                </div>
              </div>
            )}

            {/* Section body */}
            <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
              {section === "intro" && (
                <ThreadViewIntro frame={frame} fps={fps} />
              )}
              {section === "split" && (
                <SplitSection localFrame={frame - INTRO_END} fps={fps} />
              )}
            </div>

            {/* Progress rail */}
            <div
              style={{
                marginTop: 18,
                height: 3,
                borderRadius: THEME.radius.full,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(Math.min(frame + 1, TOTAL_FRAMES) / TOTAL_FRAMES) * 100}%`,
                  height: "100%",
                  borderRadius: THEME.radius.full,
                  background: `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.accent})`,
                  boxShadow: THEME.shadows.glowSm,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
