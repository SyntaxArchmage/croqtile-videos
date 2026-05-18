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
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";
// DeviceShell used by dead code below (prefixed _)

const W = THEME.video.width;
const H = THEME.video.height;
const CX = W / 2;
const _CY = H / 2;

/* ═══════════════════════════════════════════════════════════════════════════
 * SECTION 1 — Thread-view intro (0–510f)
 * Continuous animation: code line → threadIdx + offset move out → horizontal
 * thread row → offset row → mapping arrows to buffer
 * ═══════════════════════════════════════════════════════════════════════════ */

const BUFFER_CELLS = 16;
const BUFFER_CELL_W = 72;
const BUFFER_GAP = 3;
const BUFFER_H = 40;
const BUFFER_TOTAL_W = BUFFER_CELLS * BUFFER_CELL_W + (BUFFER_CELLS - 1) * BUFFER_GAP;

const THREAD_IDS = [0, 1, 2, 3] as const;
const THREAD_TARGETS = [2, 5, 9, 13];
const THREAD_OFFSETS = [
  "0*BK + 0*TK",
  "1*BK + 0*TK",
  "2*BK + 1*TK",
  "3*BK + 1*TK",
];

const THREAD_COL_W = 200;
const THREADS_TOTAL_W = THREAD_IDS.length * THREAD_COL_W;

const ThreadViewIntro: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // --- Stage 1: code line + annotation tabs (0–140f) ---
  const codeOp = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const annotTabOp = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ptrBlinkRaw = interpolate(frame, [40, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ptrBlink = ptrBlinkRaw > 0 && ptrBlinkRaw < 1
    ? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * 0.35))
    : ptrBlinkRaw >= 1 ? 1 : 0;

  const offsetBlinkRaw = interpolate(frame, [80, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const offsetBlink = offsetBlinkRaw > 0 && offsetBlinkRaw < 1
    ? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * 0.35))
    : offsetBlinkRaw >= 1 ? 1 : 0;

  // --- Transition (140–210f): continuous move ---
  const t = interpolate(frame, [140, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const extrasOp = 1 - t;

  const CODE_Y = 260;
  const HEADER_Y = 200;

  // Transition threshold: when to switch from inline to absolute rendering
  const inlineMode = t < 0.02;

  const tidEndX = CX - THREADS_TOTAL_W / 2 - 200;
  const tidStartX = CX - 210;
  const tidX = interpolate(t, [0, 1], [tidStartX, tidEndX]);
  const tidY = interpolate(t, [0, 1], [CODE_Y, HEADER_Y]);
  const tidScale = interpolate(t, [0, 1], [1, 0.55]);

  const OFFSET_ROW_Y = 270;
  const offsetStartX = CX + 20;
  const offsetEndX = CX - THREADS_TOTAL_W / 2;
  const offsetMoveX = interpolate(t, [0, 1], [offsetStartX, offsetEndX]);
  const offsetMoveY = interpolate(t, [0, 1], [CODE_Y, OFFSET_ROW_Y]);
  const offsetScale = interpolate(t, [0, 1], [1, 0.48]);

  // --- Stage 3: peer threads + individual offsets (200–300f) ---
  const threadListOp = interpolate(frame, [200, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const offsetExprOp = interpolate(frame, [240, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Buffer bar ---
  const bufferOp = interpolate(frame, [180, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Stage 4: mapping arrows (300–440f) ---
  const arrowsOp = interpolate(frame, [300, 340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const annotationOp = interpolate(frame, [420, 460], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [475, 510], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bufferTop = 540;
  const bufferLeft = CX - BUFFER_TOTAL_W / 2;
  const threadsLeft = CX - THREADS_TOTAL_W / 2;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <NoiseOverlay opacity={0.028} blendMode="soft-light" />

      {/* Annotation tabs — fade out during transition */}
      <svg
        style={{
          position: "absolute",
          left: 0, top: 0, width: W, height: H,
          pointerEvents: "none",
          opacity: annotTabOp * extrasOp,
        }}
      >
        <g opacity={ptrBlink > 0.2 ? 0.5 + 0.5 * ptrBlink : 0.6}>
          <rect x={CX - 310} y={CODE_Y - 90} width={160} height={32} rx={6}
            fill="rgba(252,211,77,0.15)" stroke="rgba(252,211,77,0.4)" strokeWidth={1} />
          <text x={CX - 230} y={CODE_Y - 70} fill="#FCD34D"
            fontSize={17} fontFamily="'Inter', sans-serif" textAnchor="middle" fontWeight={600}>
            buffer pointer
          </text>
          <line x1={CX - 230} y1={CODE_Y - 54} x2={CX - 230} y2={CODE_Y - 24}
            stroke="rgba(252,211,77,0.5)" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#tabAA)" />
        </g>
        <g opacity={offsetBlink > 0.2 ? 0.5 + 0.5 * offsetBlink : 0.6}>
          <rect x={CX + 60} y={CODE_Y - 90} width={100} height={32} rx={6}
            fill="rgba(248,113,113,0.15)" stroke="rgba(248,113,113,0.4)" strokeWidth={1} />
          <text x={CX + 110} y={CODE_Y - 70} fill="#F87171"
            fontSize={17} fontFamily="'Inter', sans-serif" textAnchor="middle" fontWeight={600}>
            offset
          </text>
          <line x1={CX + 110} y1={CODE_Y - 54} x2={CX + 110} y2={CODE_Y - 24}
            stroke="rgba(248,113,113,0.5)" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#tabAR)" />
        </g>
        <defs>
          <marker id="tabAA" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(252,211,77,0.6)" /></marker>
          <marker id="tabAR" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="rgba(248,113,113,0.6)" /></marker>
        </defs>
      </svg>

      {/* ── Stage 1 inline mode: full code as one seamless line ── */}
      {inlineMode && (
        <div
          style={{
            position: "absolute",
            top: CODE_Y,
            width: W,
            textAlign: "center",
            opacity: codeOp,
            pointerEvents: "none",
          }}
        >
          <span style={{ fontSize: 58, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.3 }}>
            <span style={{
              color: "#FCD34D",
              textShadow: ptrBlink > 0.3 ? `0 0 ${20 * ptrBlink}px rgba(252,211,77,${0.5 * ptrBlink})` : "none",
              opacity: 0.5 + 0.5 * ptrBlink,
            }}>A</span>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>[</span>
            <span style={{
              color: "#F87171",
              textShadow: offsetBlink > 0.3 ? `0 0 ${18 * offsetBlink}px rgba(248,113,113,${0.45 * offsetBlink})` : "none",
              opacity: 0.5 + 0.5 * offsetBlink,
            }}>threadIdx.x*BK + iv_k*TILE_K</span>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>]</span>
          </span>
        </div>
      )}

      {/* ── Transition mode: absolute elements moving to final positions ── */}
      {!inlineMode && (
        <>
          {/* A[ ... ] scaffolding fades out */}
          <div
            style={{
              position: "absolute",
              top: CODE_Y,
              width: W,
              textAlign: "center",
              opacity: codeOp * extrasOp,
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: 58, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.3 }}>
              <span style={{ color: "#FCD34D", opacity: 0.5 + 0.5 * ptrBlink }}>A</span>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>[</span>
              <span style={{ visibility: "hidden" }}>threadIdx.x*BK + iv_k*TILE_K</span>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>]</span>
            </span>
          </div>

          {/* threadIdx.x — moves from inline position to header */}
          <div
            style={{
              position: "absolute",
              left: tidX,
              top: tidY,
              transform: `scale(${tidScale})`,
              transformOrigin: "left center",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 58,
              fontWeight: 700,
              color: "#F87171",
              opacity: codeOp,
              whiteSpace: "nowrap",
            }}
          >
            threadIdx.x{t > 0.8 ? " =" : ""}
          </div>

          {/* offset tail — moves from inline to offset row, fades out by end */}
          {t < 0.99 && (
            <div
              style={{
                position: "absolute",
                left: offsetMoveX,
                top: offsetMoveY,
                transform: `scale(${offsetScale})`,
                transformOrigin: "left center",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 58,
                color: "#F87171",
                opacity: codeOp * (1 - Math.max((t - 0.6) / 0.4, 0)),
                whiteSpace: "nowrap",
              }}
            >
              *BK + iv_k*TILE_K
            </div>
          )}
        </>
      )}

      {/* Horizontal thread IDs row (after transition) */}
      {t > 0.5 && (
        <div
          style={{
            position: "absolute",
            left: threadsLeft,
            top: HEADER_Y,
            display: "flex",
            gap: 0,
            width: THREADS_TOTAL_W,
          }}
        >
          {THREAD_IDS.map((tid, i) => {
            const delay = i * 6;
            const colOp = interpolate(frame, [200 + delay, 225 + delay], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={tid}
                style={{
                  width: THREAD_COL_W,
                  textAlign: "center",
                  opacity: colOp * threadListOp,
                  transform: `translateY(${interpolate(colOp, [0, 1], [15, 0])}px)`,
                }}
              >
                <div style={{
                  fontSize: 28,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: "#FCD34D",
                }}>
                  {tid}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Horizontal offset expressions row */}
      {t > 0.8 && (
        <div
          style={{
            position: "absolute",
            left: threadsLeft,
            top: OFFSET_ROW_Y,
            display: "flex",
            gap: 0,
            width: THREADS_TOTAL_W,
          }}
        >
          {THREAD_IDS.map((tid, i) => {
            const delay = i * 8;
            const colOp = interpolate(frame, [250 + delay, 280 + delay], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={tid}
                style={{
                  width: THREAD_COL_W,
                  textAlign: "center",
                  opacity: colOp * offsetExprOp,
                  transform: `translateY(${interpolate(colOp, [0, 1], [20, 0])}px)`,
                }}
              >
                <div style={{
                  fontSize: 20,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#F87171",
                }}>
                  {THREAD_OFFSETS[i]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Buffer bar */}
      <div
        style={{
          position: "absolute",
          left: bufferLeft,
          top: bufferTop,
          display: "flex",
          gap: BUFFER_GAP,
          opacity: bufferOp,
        }}
      >
        {Array.from({ length: BUFFER_CELLS }).map((_, i) => {
          const isTarget = THREAD_TARGETS.includes(i);
          const targetIdx = THREAD_TARGETS.indexOf(i);
          const glowStr = isTarget && arrowsOp > 0.5
            ? interpolate(frame, [340 + targetIdx * 15, 380 + targetIdx * 15], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 0;

          return (
            <div
              key={i}
              style={{
                width: BUFFER_CELL_W,
                height: BUFFER_H,
                borderRadius: 6,
                background: isTarget && glowStr > 0.2
                  ? `rgba(248,113,113,${0.18 + 0.3 * glowStr})`
                  : "rgba(255,255,255,0.10)",
                border: `1px solid ${
                  isTarget && glowStr > 0.2
                    ? `rgba(248,113,113,${0.5 + 0.4 * glowStr})`
                    : "rgba(255,255,255,0.18)"
                }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isTarget && glowStr > 0.5
                  ? `0 0 18px rgba(248,113,113,${0.35 * glowStr})`
                  : "none",
              }}
            >
              <span style={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                color: isTarget && glowStr > 0.5 ? "#F9FAFB" : "rgba(255,255,255,0.5)",
              }}>
                {`0x${(i * 256).toString(16).toUpperCase().padStart(3, "0")}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Buffer label */}
      <div
        style={{
          position: "absolute",
          left: bufferLeft,
          top: bufferTop + BUFFER_H + 8,
          width: BUFFER_TOTAL_W,
          textAlign: "center",
          opacity: bufferOp,
        }}
      >
        <span style={{ fontSize: 16, fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>
          Memory View as Buffer
        </span>
      </div>

      {/* Mapping arrows from offset row → buffer */}
      {arrowsOp > 0.01 && (
        <svg
          style={{
            position: "absolute",
            left: 0, top: 0, width: W, height: H,
            pointerEvents: "none",
            opacity: arrowsOp,
          }}
        >
          <defs>
            <marker id="mapArr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#F87171" opacity={0.8} />
            </marker>
          </defs>
          {THREAD_IDS.map((tid, i) => {
            const delay = i * 15;
            const lineOp = interpolate(frame, [320 + delay, 370 + delay], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const fromX = threadsLeft + i * THREAD_COL_W + THREAD_COL_W / 2;
            const fromY = OFFSET_ROW_Y + 30;
            const toX = bufferLeft + THREAD_TARGETS[i] * (BUFFER_CELL_W + BUFFER_GAP) + BUFFER_CELL_W / 2;
            const toY = bufferTop - 4;
            const currentX = fromX + (toX - fromX) * lineOp;
            const currentY = fromY + (toY - fromY) * lineOp;

            return (
              <line
                key={tid}
                x1={fromX}
                y1={fromY}
                x2={currentX}
                y2={currentY}
                stroke="#F87171"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                markerEnd="url(#mapArr)"
                opacity={0.7 * lineOp}
              />
            );
          })}
        </svg>
      )}

      {/* Annotation banner */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
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
            padding: "12px 32px",
            borderRadius: 20,
            background: "rgba(248,113,113,0.12)",
            border: "1px solid rgba(248,113,113,0.3)",
          }}
        >
          <span style={{
            fontSize: 24,
            fontFamily: "'Inter', sans-serif",
            color: "#F87171",
            fontWeight: 600,
          }}>
            Every thread manually computes memory addresses
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

const _PANEL_W = 818;
const _PANEL_H = 620;
const CODE_SIZE = 13;
const CODE_LINE_H = 20;
const CODE_PAD = 20;

const DIM_LABELS = [
  "Tensor, not buffer",
  "subspan · chunkat · .at()",
  "parallel by — unified",
] as const;

type DimIndex = 0 | 1 | 2;

const _CROQ_DIM: Record<DimIndex, string[]> = {
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

const _CUDA_DIM: Record<DimIndex, string[]> = {
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

const _HIGHLIGHT_CROQ: Record<DimIndex, number[]> = {
  0: [2, 3, 4, 5],
  1: [3, 6, 9],
  2: [2, 3, 5],
};

const _HIGHLIGHT_CUDA: Record<DimIndex, number[]> = {
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

const _CodePane: React.FC<CodePaneProps> = ({
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

const _DimensionPills: React.FC<{ localFrame: number }> = ({ localFrame }) => (
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
}) => {
  const GRID_ROWS = 12;
  const GRID_COLS = 12;
  const CELL = 30;
  const GAP = 2;
  const GRID_W = GRID_COLS * CELL + (GRID_COLS - 1) * GAP;
  const GRID_H = GRID_ROWS * CELL + (GRID_ROWS - 1) * GAP;
  const GRID_LEFT = CX - GRID_W / 2;
  const GRID_TOP = 310;
  const CODE_B_Y = 200;
  const AXIS_PAD = 28;

  // --- 3-stage cycle ---
  type Stage = 0 | 1 | 2;
  const stage: Stage = localFrame < 200 ? 0 : localFrame < 400 ? 1 : 2;

  const stageOp = (s: Stage) => {
    if (s === 0) return interpolate(localFrame, [0, 30, 170, 200], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (s === 1) return interpolate(localFrame, [200, 230, 370, 400], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return interpolate(localFrame, [400, 430, 560, 590], [0, 1, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  };

  const currentOp = stageOp(stage);

  const stageCode = [
    { pre: "tma.copy ", obj: "rhs", call: ".chunkat(bn, iv_k)" },
    { pre: "tile = ", obj: "lhs", call: ".subspan(WARP_M, TILE_K).at(bm, iv_k)" },
    { pre: "b = ", obj: "a", call: ".view(16, 8).from(1, 0)" },
  ] as const;

  const stageLabels = [
    { name: "chunkat", desc: "non-overlapping block partition" },
    { name: "subspan.at", desc: "overlapping tiles by anchor" },
    { name: "view.from", desc: "arbitrary offset window" },
  ] as const;

  const stageAnnot = [
    { tabLabel: "tensor", sliceLabel: "block slice" },
    { tabLabel: "tensor", sliceLabel: "overlap tile" },
    { tabLabel: "tensor", sliceLabel: "offset window" },
  ] as const;

  // Grid highlight pattern per stage — all animated dynamically
  const CHUNK_W = 3;
  const TILE_W = 4;
  const TILE_STEP = 2; // overlap = TILE_W - TILE_STEP = 2 cols overlap

  const isHighlighted = (r: number, c: number): number => {
    if (stage === 0) {
      // chunkat: non-overlapping blocks sweep left-to-right
      const chunkIdx = Math.floor(c / CHUNK_W);
      const activeChunk = Math.floor(interpolate(localFrame, [30, 170], [0, 3.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return chunkIdx === activeChunk ? currentOp : 0;
    }
    if (stage === 1) {
      // subspan.at: overlapping tiles sweep — tile is TILE_W wide, advances by TILE_STEP
      const maxTiles = Math.floor((GRID_COLS - TILE_W) / TILE_STEP) + 1;
      const activeTile = Math.floor(interpolate(localFrame, [230, 370], [0, maxTiles - 0.01], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const tileStart = activeTile * TILE_STEP;
      const tileEnd = tileStart + TILE_W - 1;
      const inTile = c >= tileStart && c <= tileEnd;
      // Show previous tile ghost to visualize overlap
      const prevStart = (activeTile - 1) * TILE_STEP;
      const prevEnd = prevStart + TILE_W - 1;
      const inPrev = activeTile > 0 && c >= prevStart && c <= prevEnd;
      if (inTile) return currentOp;
      if (inPrev) return currentOp * 0.25;
      return 0;
    }
    // view.from: window starts from column offset=1, slides across rows
    const VIEW_W = 8;
    const VIEW_H = 4;
    const COL_OFFSET = 1;
    const maxSlide = GRID_ROWS - VIEW_H;
    const slideRow = Math.floor(interpolate(localFrame, [430, 560], [0, maxSlide], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    const inView = r >= slideRow && r < slideRow + VIEW_H && c >= COL_OFFSET && c < COL_OFFSET + VIEW_W;
    // Dim the skipped first column to show offset
    if (c < COL_OFFSET) return currentOp * 0.08;
    return inView ? currentOp : 0;
  };

  // Bounding box per stage — animated to match highlight pattern
  const boundingBox = () => {
    if (stage === 0) {
      // chunkat: full-height block sweeps
      const activeChunk = Math.floor(interpolate(localFrame, [30, 170], [0, 3.99], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return { r0: 0, r1: GRID_ROWS - 1, c0: activeChunk * CHUNK_W, c1: Math.min(activeChunk * CHUNK_W + CHUNK_W - 1, GRID_COLS - 1) };
    }
    if (stage === 1) {
      // subspan: overlapping tile
      const maxTiles = Math.floor((GRID_COLS - TILE_W) / TILE_STEP) + 1;
      const activeTile = Math.floor(interpolate(localFrame, [230, 370], [0, maxTiles - 0.01], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      const tileStart = activeTile * TILE_STEP;
      return { r0: 0, r1: GRID_ROWS - 1, c0: tileStart, c1: Math.min(tileStart + TILE_W - 1, GRID_COLS - 1) };
    }
    // view.from: sliding window with offset
    const VIEW_W = 8, VIEW_H = 4, COL_OFFSET = 1;
    const maxSlide = GRID_ROWS - VIEW_H;
    const slideRow = Math.floor(interpolate(localFrame, [430, 560], [0, maxSlide], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    return { r0: slideRow, r1: slideRow + VIEW_H - 1, c0: COL_OFFSET, c1: COL_OFFSET + VIEW_W - 1 };
  };

  const bb = boundingBox();

  const gridOp = interpolate(localFrame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bbOp = interpolate(localFrame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pill tabs for operations
  const pillOp = (s: number) => {
    const o = stageOp(s as Stage);
    return o > 0.3 ? 1 : 0.35;
  };

  const fadeAll = interpolate(localFrame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const { pre, obj, call } = stageCode[stage];
  const { tabLabel, sliceLabel } = stageAnnot[stage];

  return (
    <div style={{ flex: 1, minHeight: 0, position: "relative", opacity: fadeAll }}>
      <NoiseOverlay opacity={0.02} blendMode="soft-light" />

      {/* Operation pills */}
      <div style={{
        position: "absolute",
        top: 10,
        left: CX - 380,
        display: "flex",
        gap: 12,
      }}>
        {stageLabels.map((sl, i) => (
          <div key={sl.name} style={{
            padding: "8px 18px",
            borderRadius: 20,
            fontSize: 14,
            fontFamily: THEME.fonts.mono,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            border: `1px solid ${pillOp(i) > 0.5 ? "rgba(110,231,183,0.5)" : "rgba(255,255,255,0.08)"}`,
            color: pillOp(i) > 0.5 ? "#E5E7EB" : "rgba(255,255,255,0.35)",
            background: pillOp(i) > 0.5
              ? "linear-gradient(135deg, rgba(110,231,183,0.12), rgba(129,140,248,0.08))"
              : "rgba(17,24,39,0.5)",
            opacity: pillOp(i),
          }}>
            {sl.name}
          </div>
        ))}
      </div>

      {/* Annotation tabs */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: W, height: H, pointerEvents: "none", opacity: currentOp * 0.85 }}>
        {obj && (
          <g>
            <rect x={CX - 280} y={CODE_B_Y - 70} width={90} height={28} rx={6}
              fill="rgba(110,231,183,0.15)" stroke="rgba(110,231,183,0.4)" strokeWidth={1} />
            <text x={CX - 235} y={CODE_B_Y - 52} fill="#6EE7B7"
              fontSize={14} fontFamily="'Inter', sans-serif" textAnchor="middle" fontWeight={600}>
              {tabLabel}
            </text>
            <line x1={CX - 235} y1={CODE_B_Y - 40} x2={CX - 235} y2={CODE_B_Y - 16}
              stroke="rgba(110,231,183,0.5)" strokeWidth={1.5} strokeDasharray="4 3" />
          </g>
        )}
        <g>
          <rect x={CX + 40} y={CODE_B_Y - 70} width={130} height={28} rx={6}
            fill="rgba(129,140,248,0.15)" stroke="rgba(129,140,248,0.4)" strokeWidth={1} />
          <text x={CX + 105} y={CODE_B_Y - 52} fill="#818CF8"
            fontSize={14} fontFamily="'Inter', sans-serif" textAnchor="middle" fontWeight={600}>
            {sliceLabel}
          </text>
          <line x1={CX + 105} y1={CODE_B_Y - 40} x2={CX + 105} y2={CODE_B_Y - 16}
            stroke="rgba(129,140,248,0.5)" strokeWidth={1.5} strokeDasharray="4 3" />
        </g>
      </svg>

      {/* CroqTile code line */}
      <div style={{
        position: "absolute",
        top: CODE_B_Y,
        width: W,
        textAlign: "center",
        opacity: currentOp,
      }}>
        <span style={{ fontSize: 42, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.3 }}>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>{pre}</span>
          {obj && <span style={{ color: "#6EE7B7" }}>{obj}</span>}
          <span style={{ color: "#818CF8" }}>{call}</span>
        </span>
      </div>

      {/* Description below code */}
      <div style={{
        position: "absolute",
        top: CODE_B_Y + 58,
        width: W,
        textAlign: "center",
        opacity: currentOp * 0.7,
      }}>
        <span style={{ fontSize: 16, fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
          {stageLabels[stage].desc}
        </span>
      </div>

      {/* Axis labels */}
      <div style={{
        position: "absolute",
        left: GRID_LEFT - AXIS_PAD - 20,
        top: GRID_TOP + GRID_H / 2,
        transform: "rotate(-90deg)",
        transformOrigin: "center",
        opacity: gridOp * 0.6,
      }}>
        <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#6EE7B7", letterSpacing: "0.1em" }}>
          M (rows)
        </span>
      </div>
      <div style={{
        position: "absolute",
        left: GRID_LEFT + GRID_W / 2,
        top: GRID_TOP + GRID_H + 10,
        transform: "translateX(-50%)",
        opacity: gridOp * 0.6,
      }}>
        <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#818CF8", letterSpacing: "0.1em" }}>
          K (cols)
        </span>
      </div>

      {/* 2D tensor grid */}
      <div style={{
        position: "absolute",
        left: GRID_LEFT,
        top: GRID_TOP,
        opacity: gridOp,
      }}>
        {Array.from({ length: GRID_ROWS }).map((_, r) =>
          Array.from({ length: GRID_COLS }).map((_, c) => {
            const hi = isHighlighted(r, c);
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: "absolute",
                  left: c * (CELL + GAP),
                  top: r * (CELL + GAP),
                  width: CELL,
                  height: CELL,
                  borderRadius: 4,
                  background: hi > 0.1
                    ? `rgba(110,231,183,${0.08 + 0.28 * hi})`
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    hi > 0.1
                      ? `rgba(110,231,183,${0.25 + 0.5 * hi})`
                      : "rgba(255,255,255,0.08)"
                  }`,
                  boxShadow: hi > 0.5
                    ? `0 0 10px rgba(110,231,183,${0.2 * hi})`
                    : "none",
                }}
              />
            );
          })
        )}

        {/* Bounding box overlay */}
        {bbOp > 0.05 && currentOp > 0.1 && (
          <div style={{
            position: "absolute",
            left: bb.c0 * (CELL + GAP) - 3,
            top: bb.r0 * (CELL + GAP) - 3,
            width: (bb.c1 - bb.c0 + 1) * (CELL + GAP) - GAP + 6,
            height: (bb.r1 - bb.r0 + 1) * (CELL + GAP) - GAP + 6,
            border: `2px solid rgba(110,231,183,${0.55 * bbOp * currentOp})`,
            borderRadius: 6,
            boxShadow: `0 0 16px rgba(110,231,183,${0.2 * bbOp * currentOp})`,
            pointerEvents: "none",
            transition: "left 0.4s, top 0.4s, width 0.4s, height 0.4s",
          }} />
        )}
      </div>

      {/* Tensor label */}
      <div style={{
        position: "absolute",
        left: GRID_LEFT,
        top: GRID_TOP + GRID_H + 28,
        width: GRID_W,
        textAlign: "center",
        opacity: gridOp * 0.5,
      }}>
        <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
          Tensor View — 2D semantic layout
        </span>
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

const CONCLUSION_DUR = 290;
const MORPH_START = 210;

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

  // Morph phase: text fades out, bars translate/scale toward Seg 3 positions
  const morphT = interpolate(localFrame, [MORPH_START, CONCLUSION_DUR - 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const textFadeOut = interpolate(localFrame, [MORPH_START, MORPH_START + 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Target: match Seg 3 Phase A layout (PerfChart) at frame 0
  // Measured from screenshots: CroqTile bar center ≈ Y175, CUTLASS center ≈ Y295
  // Distance between bar centers = ~120px. Bar track is 34px in Seg 3 (inside 62px row).
  // The morph end should visually match, not pixel-perfect math.
  const barContainerWidth = interpolate(morphT, [0, 1], [640, 1036]);
  const barHeight = interpolate(morphT, [0, 1], [24, 34]);
  const barContainerY = interpolate(morphT, [0, 1], [0, -247]);
  const barGap = interpolate(morphT, [0, 1], [10, 246]);

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
          const op = lineSpring * textFadeOut;

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

        {/* LOC comparison bars — morph toward Seg 3 layout */}
        <div style={{
          opacity: locBarOp,
          marginTop: 12,
          width: barContainerWidth,
          transform: `translateY(${barContainerY}px)`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: interpolate(morphT, [0, 1], [12, 0]), marginBottom: barGap, height: barHeight }}>
            <span style={{ fontSize: interpolate(morphT, [0, 1], [16, 18]), fontFamily: THEME.fonts.sans, color: THEME.colors.textSecondary, fontWeight: 600, width: interpolate(morphT, [0, 1], [90, 240]), flexShrink: 0, textAlign: "right", paddingRight: interpolate(morphT, [0, 1], [12, 18]) }}>
              CroqTile
            </span>
            <div style={{ flex: 1, height: "100%", borderRadius: THEME.radius.sm, background: "rgba(255,255,255,0.06)", overflow: "hidden", position: "relative" }}>
              <div style={{ width: `${(36 / 280) * 100 * locBarWidth}%`, height: "100%", borderRadius: THEME.radius.sm, background: `linear-gradient(90deg, ${THEME.colors.primary}, ${THEME.colors.accent})`, boxShadow: THEME.shadows.glowSm }} />
            </div>
            <span style={{ fontSize: interpolate(morphT, [0, 1], [18, 16]), fontFamily: THEME.fonts.mono, color: THEME.colors.textMuted, fontWeight: 600, marginLeft: interpolate(morphT, [0, 1], [0, 16]), minWidth: interpolate(morphT, [0, 1], [56, 52]) }}>
              36
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: interpolate(morphT, [0, 1], [12, 0]), height: barHeight }}>
            <span style={{ fontSize: interpolate(morphT, [0, 1], [16, 18]), fontFamily: THEME.fonts.sans, color: THEME.colors.textSecondary, fontWeight: 600, width: interpolate(morphT, [0, 1], [90, 240]), flexShrink: 0, textAlign: "right", paddingRight: interpolate(morphT, [0, 1], [12, 18]) }}>
              CUTLASS
            </span>
            <div style={{ flex: 1, height: "100%", borderRadius: THEME.radius.sm, background: "rgba(255,255,255,0.06)", overflow: "hidden", position: "relative" }}>
              <div style={{ width: `${100 * locBarWidth}%`, height: "100%", borderRadius: THEME.radius.sm, background: `linear-gradient(90deg, ${THEME.colors.accentWarm}, rgba(252,211,77,0.5))` }} />
            </div>
            <span style={{ fontSize: interpolate(morphT, [0, 1], [18, 16]), fontFamily: THEME.fonts.mono, color: THEME.colors.textMuted, fontWeight: 600, marginLeft: interpolate(morphT, [0, 1], [0, 16]), minWidth: interpolate(morphT, [0, 1], [56, 52]) }}>
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
    const conclusionLocal = frame - SPLIT_END;
    return (
      <PageContainer tag="Segment 02" style={{ pointerEvents: "none" }}>
        <ConclusionCard localFrame={conclusionLocal} fps={fps} />
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
