/**
 * remotion/compositions/FeatureSpotlight.tsx
 * Segment 2 — Feature spotlight  0:48–1:35 (47 s = 1410 frames @ 30fps)
 *
 * 2A (0–1020f): CroqTile vs CUDA split; three dimensions, sequential emphasis
 * 2B (1020–1410f): TMA & MMA “zero boilerplate” dual panels
 */
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
import { DeviceShell } from "../components/DeviceShell";

const SEG_2A_FRAMES = 1020;
const SEG_2B_FRAMES = 390;
const TOTAL_FRAMES = SEG_2A_FRAMES + SEG_2B_FRAMES;

const PANEL_W = 818;
const PANEL_H = 620;
const CODE_SIZE = 13;
const CODE_LINE_H = 20;
const CODE_PAD = 20;

const DIM_LABELS = [
  "Tensor, not buffer",
  "Slicing, not offsets",
  "Group-view, not SIMD",
] as const;

type DimIndex = 0 | 1 | 2;

const CROQ_DIM: Record<DimIndex, string[]> = {
  0: [
    "// CroqTile",
    "__co__ void matmul(",
    "    global f16 [M, K] lhs, global f16 [N, K] rhs,",
    "    global f16 [M, N] output)",
  ],
  1: [
    "// CroqTile — loads",
    "tma.copy lhs.subspan(WARP_M, TILE_K).at(bm, iv_k) => lhs_s;",
    "tma.copy rhs.chunkat(bn, iv_k) => rhs_s;",
  ],
  2: [
    "// CroqTile — grid & groups",
    "parallel {block_m, block_n}",
    "    by [cdiv(M, WARP_M), cdiv(N, WARP_N)] : block {",
    "  parallel p by 1 : group-4 {",
    "    ...",
    "  }",
    "}",
  ],
};

const CUDA_DIM: Record<DimIndex, string[]> = {
  0: [
    "// CUDA + CuTe",
    "void matmul(half* lhs, int lhs_stride0, int lhs_stride1,",
    "            half* rhs, int rhs_stride0, int rhs_stride1,",
    "            ...)",
  ],
  1: [
    "// CUDA — manual offsets + async",
    "int offset_lhs = bm * WARP_M * lhs_stride + iv_k * TILE_K;",
    "cp.async.cg.shared.global [lhs_s], [lhs + offset_lhs], 16;",
  ],
  2: [
    "// CUDA — thread/warp plumbing",
    "int bm = blockIdx.x;",
    "int bn = blockIdx.y;",
    "int tid = threadIdx.x;",
    "// warp group needs cooperative groups API",
  ],
};

const HIGHLIGHT_ROWS_CROQ: Record<DimIndex, number[]> = {
  0: [2, 3, 4],
  1: [2, 3],
  2: [2, 3, 4, 5, 6, 7],
};

const HIGHLIGHT_ROWS_CUDA: Record<DimIndex, number[]> = {
  0: [2, 3, 4],
  1: [2, 3],
  2: [2, 3, 4, 5],
};

function opacityForDimContent(dim: DimIndex, frame: number): number {
  const f = frame;
  if (dim === 0) {
    return interpolate(f, [312, 344], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  }
  if (dim === 1) {
    const enter = interpolate(f, [312, 352], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const exit = interpolate(f, [648, 688], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    });
    return enter * exit;
  }
  return interpolate(f, [648, 692], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function pillStrength(idx: DimIndex, frame: number): number {
  const base = opacityForDimContent(idx, frame);
  const neighbor =
    idx < 2 ? opacityForDimContent((idx + 1) as DimIndex, frame) : 0;
  return Math.max(0, Math.min(1, base * (1 - neighbor * 0.35)));
}

function highlightNonComments(lines: string[]): Set<number> {
  const s = new Set<number>();
  lines.forEach((line, i) => {
    if (!line.startsWith("//")) s.add(i + 1);
  });
  return s;
}

interface CodePaneProps {
  lines: string[];
  highlightRows: Set<number>;
  glow: number;
  accent: "mint" | "amber";
  /** stacked panes inside one shell — top uses shrink, bottom grows */
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
                  inset: `0 0 0 20px`,
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

const DimensionPills: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 20,
        flexWrap: "wrap",
      }}
    >
      {DIM_LABELS.map((label, i) => {
        const idx = i as DimIndex;
        const strength = pillStrength(idx, frame);
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
                isPeak
                  ? "rgba(110,231,183,0.55)"
                  : "rgba(255,255,255,0.08)"
              }`,
              color: isPeak
                ? THEME.colors.textPrimary
                : THEME.colors.textMuted,
              background: isPeak
                ? "linear-gradient(135deg, rgba(110,231,183,0.12) 0%, rgba(129,140,248,0.08) 100%)"
                : "rgba(17,24,39,0.6)",
              boxShadow: isPeak
                ? `${THEME.shadows.glowSm}, inset 0 1px 0 rgba(255,255,255,0.06)`
                : THEME.shadows.inset,
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
};

const SplitSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const enterL = spring({
    frame: frame - 4,
    fps,
    config: { damping: 17, stiffness: 110, mass: 0.75 },
    from: -110,
    to: 0,
  });
  const enterR = spring({
    frame: frame - 14,
    fps,
    config: { damping: 17, stiffness: 110, mass: 0.75 },
    from: 110,
    to: 0,
  });
  const fade = spring({
    frame: frame - 0,
    fps,
    config: { damping: 24, stiffness: 90, mass: 1 },
    from: 0,
    to: 1,
  });

  const highlightPulse = interpolate(
    frame % 120,
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
      <DimensionPills frame={frame} />

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
            style={{
              border: `1px solid rgba(110,231,183,0.18)`,
            }}
          >
            <AbsoluteFill>
              {dims.map((d) => {
                const o = opacityForDimContent(d, frame);
                if (o < 0.002) return null;
                const rows = new Set(HIGHLIGHT_ROWS_CROQ[d]);
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
                      glow={highlightPulse}
                      accent="mint"
                    />
                  </div>
                );
              })}
            </AbsoluteFill>
          </DeviceShell>
        </div>

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
            style={{
              border: `1px solid rgba(252,211,77,0.14)`,
            }}
          >
            <AbsoluteFill>
              {dims.map((d) => {
                const o = opacityForDimContent(d, frame);
                if (o < 0.002) return null;
                const rows = new Set(HIGHLIGHT_ROWS_CUDA[d]);
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
                      glow={highlightPulse}
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

const CROQ_TMA = [
  "// TMA tile copy",
  "tma.copy.swiz<128> lhs.subspan(WARP_M, TILE_K).at(bm, iv_k) => lhs_s;",
];

const CUDA_TMA = [
  "// CuTe / PTX — explicit TMA setup",
  "auto tma = make_tma_copy_atom(",
  "    SM90_TMA_LOAD{}, gmem_layout, smem_layout);",
  "auto coord = make_coord(block_m, iv_k);",
  "Tensor gV = partitioned_gmem_lhs(coord);",
  "Tensor sV = partitioned_smem_lhs();",
  "cp_async_bulk_tensor_g2s(",
  "    tma, sV, gV, size<2>(tma));",
  "__syncwarp();",
];

const CROQ_MMA = [
  "// MMA tile",
  "mma.row.row mc, ma, mb;",
];

const CUDA_MMA = [
  "// WMMA / tiled MMA — thread slice wiring",
  "using Mma = TiledMMA<SM80_16x8x16_F32F16F16F32_TN>;",
  "auto tiled_mma = make_tiled_mma(Mma{}, Layout{});",
  "auto thr = tiled_mma.get_slice(threadIdx.x % 128);",
  "auto fragA = thr.partition_A(sA);",
  "auto fragB = thr.partition_B(sB);",
  "auto fragC = thr.partition_C(sC);",
  "gemm(tiled_mma, fragA, fragB, fragC);",
  "__syncthreads();",
];

const BoilerplateSection: React.FC<{ localFrame: number; fps: number }> = ({
  localFrame,
  fps,
}) => {
  const sectionFade = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateRight: "clamp",
  });

  const tmaScale = spring({
    frame: localFrame - 6,
    fps,
    config: { damping: 14, stiffness: 128, mass: 0.65 },
    from: 0.88,
    to: 1,
  });
  const tmaY = spring({
    frame: localFrame - 6,
    fps,
    config: { damping: 15, stiffness: 115, mass: 0.7 },
    from: 40,
    to: 0,
  });

  const mmaScale = spring({
    frame: localFrame - 22,
    fps,
    config: { damping: 14, stiffness: 128, mass: 0.65 },
    from: 0.88,
    to: 1,
  });
  const mmaY = spring({
    frame: localFrame - 22,
    fps,
    config: { damping: 15, stiffness: 115, mass: 0.7 },
    from: 40,
    to: 0,
  });

  const glowPulse = interpolate(
    localFrame,
    [0, 120, 220, 390],
    [0.65, 1, 0.75, 0.85],
    { extrapolateRight: "clamp" },
  );

  const cudaTmaHi = highlightNonComments(CUDA_TMA);
  const cudaMmaHi = highlightNonComments(CUDA_MMA);

  const stackStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        opacity: sectionFade,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          gap: 36,
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${tmaY}px) scale(${tmaScale})`,
            transformOrigin: "50% 60%",
          }}
        >
          <DeviceShell
            width={860}
            height={520}
            title="TMA — tensor memory accelerator"
            style={{
              border: `1px solid rgba(110,231,183,0.22)`,
              boxShadow: `${THEME.shadows.card}, ${THEME.shadows.glowSm}`,
            }}
          >
            <div style={stackStyle}>
              <CodePane
                layout="shrink"
                lines={CROQ_TMA}
                highlightRows={new Set([2])}
                glow={glowPulse}
                accent="mint"
              />
              <div
                style={{
                  height: 1,
                  margin: "4px 16px 8px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                }}
              />
              <CodePane
                layout="fill"
                lines={CUDA_TMA}
                highlightRows={cudaTmaHi}
                glow={glowPulse * 0.55}
                accent="amber"
              />
            </div>
          </DeviceShell>
        </div>

        <div
          style={{
            transform: `translateY(${mmaY}px) scale(${mmaScale})`,
            transformOrigin: "50% 60%",
          }}
        >
          <DeviceShell
            width={860}
            height={520}
            title="MMA — matrix multiply-accumulate"
            style={{
              border: `1px solid rgba(129,140,248,0.22)`,
              boxShadow: `${THEME.shadows.card}, 0 0 28px rgba(129,140,248,0.12)`,
            }}
          >
            <div style={stackStyle}>
              <CodePane
                layout="shrink"
                lines={CROQ_MMA}
                highlightRows={new Set([2])}
                glow={glowPulse}
                accent="mint"
              />
              <div
                style={{
                  height: 1,
                  margin: "4px 16px 8px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                }}
              />
              <CodePane
                layout="fill"
                lines={CUDA_MMA}
                highlightRows={cudaMmaHi}
                glow={glowPulse * 0.55}
                accent="amber"
              />
            </div>
          </DeviceShell>
        </div>
      </div>
    </div>
  );
};

export const FeatureSpotlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const in2B = frame >= SEG_2A_FRAMES;
  const local2B = frame - SEG_2A_FRAMES;

  const title2A = "More intuitive programming abstractions";
  const title2B = "Zero boilerplate: TMA & MMA";
  const subtitle2A = "Side-by-side with CUDA + CuTe — three ideas, one mindset shift.";
  const subtitle2B =
    "The same accelerators — CroqTile says it in one line; CUDA stacks ceremony.";

  const titleBlend = interpolate(
    frame,
    [SEG_2A_FRAMES - 24, SEG_2A_FRAMES + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <PageContainer tag="Segment 02" style={{ pointerEvents: "none" }}>
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <NoiseOverlay opacity={0.028} blendMode="soft-light" />

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
            {/* Crossfading header (2A ⇄ 2B) */}
            <div style={{ position: "relative", minHeight: 132, marginBottom: 8 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(titleBlend, [0, 1], [1, 0]),
                }}
              >
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
                  {title2A}
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
                  {subtitle2A}
                </p>
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(titleBlend, [0, 1], [0, 1]),
                }}
              >
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
                  {title2B}
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
                  {subtitle2B}
                </p>
              </div>
            </div>

            {/* Section body */}
            <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
              {!in2B && <SplitSection frame={frame} fps={fps} />}
              {in2B && (
                <BoilerplateSection localFrame={local2B} fps={fps} />
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
