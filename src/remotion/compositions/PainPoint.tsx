/**
 * remotion/compositions/PainPoint.tsx
 * 段 0 — 痛点开场（前两句）  439 帧 @30fps
 *
 * 配音对齐 (0.1s gap, rate=-15%):
 *   0–162f     seg0-01: "写一个生产级GPU计算核…"  (5.38s)
 *   165–425f   seg0-02: "FlashAttention、Blockscale GEMM…"  (8.64s)
 *   425–439f   淡出过渡
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";

const CODE_LINES = [
  "  ...",
  "#include <cuda.h>",
  "#include <cute/tensor.hpp>",
  "",
  "template <int BLOCK_M, int BLOCK_N, int BLOCK_K>",
  "__global__ void flash_attention_kernel(",
  "    const half* __restrict__ Q,",
  "    const half* __restrict__ K,",
  "    const half* __restrict__ V,",
  "    half* __restrict__ O,",
  "    const int seq_len, const int head_dim) {",
  "",
  "  extern __shared__ half smem[];",
  "  auto thr_mma = ThrMMA{};",
  "  auto tiled_copy = make_tiled_copy(",
  "    Copy_Atom<SM80_CP_ASYNC_CACHEGLOBAL<uint128_t>, half>{},",
  "    Layout<Shape<_32, _4>>{},",
  "    Layout<Shape<_1, _8>>{});",
  "",
  "  for (int j = 0; j < seq_len; j += BLOCK_N) {",
  "    cute::copy(tiled_copy, tKgK, tKsK);",
  "    cp_async_fence();",
  "    cp_async_wait<0>();",
  "    __syncthreads();",
  "",
  "    gemm(thr_mma, tCrS, tCrK, tCrAcc);",
  "    float row_max = -INFINITY;",
  "    row_max = warp_reduce_max(row_max);",
  "    tCrAcc(i) = __expf(tCrAcc(i) - m_new);",
  "  }",
  "}",
  "  ...",
];

const LINE_HEIGHT = 30;
const CODE_FONT_SIZE = 19;
const BLOCK_LEFT = 200;
const BLOCK_TOP = 120;

type FragData = {
  text: string;
  scatterX: number;
  scatterY: number;
  rot: number;
  delay: number;
  targetX: number;
  targetY: number;
};

const CODE_FRAGMENTS: FragData[] = CODE_LINES.map((text, i) => {
  const angle = (i / CODE_LINES.length) * Math.PI * 2;
  const radius = 600 + (i % 3) * 200;
  return {
    text,
    scatterX: 960 + Math.cos(angle) * radius + (i % 5 - 2) * 80,
    scatterY: 540 + Math.sin(angle) * radius + (i % 3 - 1) * 60,
    rot: ((i % 7) - 3) * 3,
    delay: i * 1.5,
    targetX: BLOCK_LEFT + (text.length - text.trimStart().length) * 9,
    targetY: BLOCK_TOP + i * LINE_HEIGHT,
  };
});

/* ── Phase 1: Typewriter question (synced to seg0-01: 0–144f) ── */
const TypewriterQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const highlightPart = "How long";
  const restPart = " does it take to write a production-grade GPU kernel?";
  const fullText = highlightPart + restPart;

  const charCount = Math.floor(
    interpolate(frame, [5, 65], [0, fullText.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    })
  );

  const textOpacity = interpolate(frame, [0, 5, 150, 165], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const typingDone = charCount >= fullText.length;
  const cursorBlink = Math.floor(frame / 8) % 2 === 0;
  const visibleText = fullText.substring(0, charCount);
  const hlLen = highlightPart.length;

  const hlScale = typingDone
    ? interpolate(
        frame,
        [70, 80, 90, 100, 110],
        [1, 1.08, 1, 1.05, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;
  const hlGlow = typingDone
    ? interpolate(frame, [70, 85, 100], [20, 35, 20], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 20;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: textOpacity,
        zIndex: 10,
      }}
    >
      <div style={{ maxWidth: 1500, textAlign: "center", padding: "0 50px" }}>
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            fontFamily: THEME.fonts.sans,
            color: THEME.colors.textPrimary,
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
          }}
        >
          {charCount <= hlLen ? (
            <span style={{
              color: THEME.colors.primary,
              textShadow: `0 0 ${hlGlow}px ${THEME.colors.primaryGlow}`,
              display: "inline-block",
              transform: `scale(${hlScale})`,
            }}>
              {visibleText}
            </span>
          ) : (
            <>
              <span style={{
                color: THEME.colors.primary,
                textShadow: `0 0 ${hlGlow}px ${THEME.colors.primaryGlow}`,
                display: "inline-block",
                transform: `scale(${hlScale})`,
                transformOrigin: "center bottom",
              }}>
                {highlightPart}
              </span>
              {visibleText.substring(hlLen)}
            </>
          )}
        </span>
        {!typingDone && (
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: THEME.colors.primary,
              opacity: cursorBlink ? 1 : 0,
            }}
          >
            |
          </span>
        )}
      </div>
    </div>
  );
};

/* ── Computation graph node ── */
interface GraphNode {
  label: string;
  inputs: string[];
  outputs: string[];
  color: string;
  glowColor: string;
}

const FLASH_NODE: GraphNode = {
  label: "FlashAttention",
  inputs: ["Q", "K", "V"],
  outputs: ["O"],
  color: "#60A5FA",
  glowColor: "rgba(96,165,250,0.35)",
};

const GEMM_NODE: GraphNode = {
  label: "Blockscale GEMM",
  inputs: ["A", "B", "Scale"],
  outputs: ["C"],
  color: "#F59E0B",
  glowColor: "rgba(245,158,11,0.35)",
};

const OpNodeBox: React.FC<{
  node: GraphNode;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  blinkIntensity: number;
}> = ({ node, x, y, opacity, scale, blinkIntensity }) => {
  const boxW = 640;
  const ioSize = 60;
  const arrowLen = 38;
  const ioSpacing = node.inputs.length <= 3 ? 110 : 85;
  const _totalInputW = (node.inputs.length - 1) * ioSpacing;
  const _totalOutputW = (node.outputs.length - 1) * ioSpacing;
  const blinkGlow = blinkIntensity > 0 ? `0 0 ${40 + blinkIntensity * 30}px ${node.glowColor}` : `0 0 30px ${node.color}15`;

  return (
    <div style={{
      position: "absolute",
      left: x - boxW / 2,
      top: y - 140,
      width: boxW,
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: "center center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Input ports */}
      <div style={{ display: "flex", gap: ioSpacing - ioSize, justifyContent: "center", marginBottom: 0 }}>
        {node.inputs.map((inp) => (
          <div key={inp} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: ioSize }}>
            <div style={{
              width: ioSize, height: ioSize, borderRadius: 10,
              background: `${node.color}15`,
              border: `2px solid ${node.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, fontFamily: THEME.fonts.mono,
              color: `${node.color}CC`,
            }}>{inp}</div>
            <div style={{
              width: 2, height: arrowLen,
              background: `linear-gradient(to bottom, ${node.color}50, ${node.color}20)`,
            }} />
            <div style={{
              width: 0, height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `8px solid ${node.color}60`,
            }} />
          </div>
        ))}
      </div>

      {/* Main block */}
      <div style={{
        width: boxW,
        padding: "36px 0",
        marginTop: 8,
        background: `linear-gradient(135deg, ${node.color}18 0%, ${node.color}08 100%)`,
        border: `2px solid ${node.color}45`,
        borderRadius: 20,
        boxShadow: blinkGlow,
        textAlign: "center",
      }}>
        <span style={{
          fontSize: 44,
          fontWeight: 700,
          fontFamily: THEME.fonts.mono,
          color: node.color,
          letterSpacing: "-0.01em",
          textShadow: blinkIntensity > 0 ? `0 0 12px ${node.glowColor}` : "none",
        }}>{node.label}</span>
      </div>

      {/* Output ports */}
      <div style={{ display: "flex", gap: ioSpacing - ioSize, justifyContent: "center", marginTop: 6 }}>
        {node.outputs.map((out) => (
          <div key={out} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: ioSize }}>
            <div style={{
              width: 0, height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: `8px solid ${node.color}60`,
            }} />
            <div style={{
              width: 2, height: arrowLen,
              background: `linear-gradient(to bottom, ${node.color}20, ${node.color}50)`,
            }} />
            <div style={{
              width: ioSize, height: ioSize, borderRadius: 10,
              background: `${node.color}15`,
              border: `2px solid ${node.color}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, fontFamily: THEME.fonts.mono,
              color: `${node.color}CC`,
            }}>{out}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Phase 2: Code fragments (synced to seg0-02: 153–385f) ── */
const CodeFragments: React.FC = () => {
  const frame = useCurrentFrame();

  /* --- Compute graph: 0-100f --- */
  const graphFadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const graphScale = interpolate(frame, [0, 15], [0.88, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.1)),
  });

  /* Blink when voiceover mentions the operator name:
     "FlashAttention" ~1.5s in = ~frame 45, "Blockscale Gem" ~3s = ~frame 90 */
  const flashBlink = interpolate(frame, [40, 48, 56], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gemmBlink = interpolate(frame, [82, 90, 98], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* GEMM fades while FlashAttention zooms + moves to center */
  const gemmFade = interpolate(frame, [100, 125], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flashZoom = interpolate(frame, [100, 130], [1, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const flashMoveX = interpolate(frame, [100, 128], [520, 960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  /* Hold at center for 0.5s (15 frames: 130-145), then fade */
  const flashFadeOut = interpolate(frame, [145, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* --- Code fragments: appear 140-175f, assemble 155-200f --- */
  const halfLines = Math.ceil(CODE_FRAGMENTS.length / 2);
  const wave1Progress = interpolate(frame, [140, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const wave2Progress = interpolate(frame, [150, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const assembleProgress = interpolate(frame, [155, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const windowOpacity = interpolate(frame, [175, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* Code stays visible until the FadeOut overlay covers it */

  const windowWidth = 1440;
  const windowHeight = CODE_LINES.length * LINE_HEIGHT + 60;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
      {/* Computation graph nodes */}
      <OpNodeBox
        node={FLASH_NODE}
        x={flashMoveX}
        y={440}
        opacity={graphFadeIn * flashFadeOut}
        scale={graphScale * flashZoom}
        blinkIntensity={flashBlink}
      />
      <OpNodeBox
        node={GEMM_NODE}
        x={1400}
        y={440}
        opacity={graphFadeIn * gemmFade}
        scale={graphScale}
        blinkIntensity={gemmBlink}
      />

      {/* Code window background */}
      <div
        style={{
          position: "absolute",
          left: BLOCK_LEFT - 40,
          top: BLOCK_TOP - 50,
          width: windowWidth,
          height: windowHeight,
          borderRadius: 12,
          background: "#1E1E1E",
          border: "1px solid rgba(60,60,60,0.6)",
          opacity: windowOpacity,
          boxShadow: "0 12px 60px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ display: "flex", gap: 8, padding: "14px 18px", background: "#252526", borderRadius: "12px 12px 0 0" }}>
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FF5F56" }} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#27C93F" }} />
          <span style={{ marginLeft: 16, fontSize: 14, color: "#CCCCCC", fontFamily: THEME.fonts.mono }}>
            flash_attention_kernel.cu
          </span>
        </div>
      </div>

      {/* Code fragments */}
      {CODE_FRAGMENTS.map((frag, i) => {
        if (frag.text === "") return null;
        const isFirstWave = i < halfLines;
        const waveEntry = isFirstWave ? wave1Progress : wave2Progress;
        const entryProgress = interpolate(
          waveEntry, [0, 0.3 + (i % halfLines) * 0.03], [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const x = interpolate(assembleProgress, [0, 1], [frag.scatterX, frag.targetX]);
        const y = interpolate(assembleProgress, [0, 1], [frag.scatterY, frag.targetY]);
        const rot = frag.rot * (1 - assembleProgress);
        const bgOpacity = interpolate(assembleProgress, [0, 0.8], [0.5, 0]);
        const tokens = tokenizeLine(frag.text);

        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, opacity: entryProgress, whiteSpace: "nowrap" }}>
            <span
              style={{
                fontSize: CODE_FONT_SIZE,
                fontFamily: THEME.fonts.mono,
                background: `rgba(0,0,0,${bgOpacity})`,
                padding: assembleProgress < 0.8 ? "3px 8px" : "0",
                borderRadius: 4,
                borderLeft: assembleProgress < 0.5 ? "2px solid rgba(86,156,214,0.3)" : "none",
              }}
            >
              {tokens.map((tk, j) => (
                <span key={j} style={{ color: tk.color }}>{tk.text}</span>
              ))}
            </span>
          </div>
        );
      })}

      {/* Line numbers */}
      {CODE_LINES.map((line, i) => {
        if (line === "") return null;
        const lineNumOpacity = interpolate(assembleProgress, [0.7, 1], [0, 0.5], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <div key={`ln-${i}`} style={{ position: "absolute", left: BLOCK_LEFT - 35, top: BLOCK_TOP + i * LINE_HEIGHT, opacity: lineNumOpacity, fontSize: 14, fontFamily: THEME.fonts.mono, color: "#858585", textAlign: "right", width: 28 }}>
            {i + 1}
          </div>
        );
      })}
    </div>
  );
};

/* ── VS Code Dark+ inspired token colors for CUDA ── */
const SYN = {
  keyword:    "#C586C0",  // purple-pink: control flow, storage
  type:       "#4EC9B0",  // teal: types (half, int, float, auto, void)
  directive:  "#C586C0",  // preprocessor #include
  string:     "#CE9178",  // orange: string literals, includes
  number:     "#B5CEA8",  // green: numeric literals
  function:   "#DCDCAA",  // yellow: function names
  macro:      "#569CD6",  // blue: __global__, __shared__, BLOCK_M, etc
  operator:   "#D4D4D4",  // light gray: operators, punctuation
  comment:    "#6A9955",  // green: comments
  plain:      "#D4D4D4",  // default text
  bracket:    "#FFD700",  // gold: template brackets
};

interface Token { text: string; color: string }

function tokenizeLine(line: string): Token[] {
  if (line.trim() === "") return [{ text: " ", color: SYN.plain }];
  if (line.trim() === "...") return [{ text: line, color: SYN.comment }];

  const tokens: Token[] = [];
  const indent = line.length - line.trimStart().length;
  if (indent > 0) tokens.push({ text: line.slice(0, indent), color: SYN.plain });

  const rest = line.trimStart();

  if (rest.startsWith("//")) {
    tokens.push({ text: rest, color: SYN.comment });
    return tokens;
  }
  if (rest.startsWith("#include")) {
    tokens.push({ text: "#include ", color: SYN.directive });
    const arg = rest.slice(9);
    tokens.push({ text: arg, color: SYN.string });
    return tokens;
  }

  const patterns: [RegExp, string][] = [
    [/\b(__global__|__shared__|__restrict__|__syncthreads|__expf|SM80_CP_ASYNC_CACHEGLOBAL)\b/g, SYN.macro],
    [/\b(template|extern|const|typename|using|return|for|if|else|break|continue)\b/g, SYN.keyword],
    [/\b(void|int|float|half|auto|uint128_t|bool|char|size_t)\b/g, SYN.type],
    [/\b(BLOCK_M|BLOCK_N|BLOCK_K|INFINITY|Shape|Layout|Copy_Atom|ThrMMA)\b/g, SYN.macro],
    [/\b(_32|_4|_1|_8)\b/g, SYN.number],
    [/\b\d+\b/g, SYN.number],
    [/\b(flash_attention_kernel|make_tiled_copy|gemm|cute::copy|cp_async_fence|cp_async_wait|warp_reduce_max)\b/g, SYN.function],
    [/<[^>]+>/g, SYN.bracket],
  ];

  let _remaining = rest;
  let _pos = 0;
  const colored: { start: number; end: number; color: string }[] = [];

  for (const [re, color] of patterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(rest)) !== null) {
      colored.push({ start: m.index, end: m.index + m[0].length, color });
    }
  }

  colored.sort((a, b) => a.start - b.start);

  const merged: { start: number; end: number; color: string }[] = [];
  for (const c of colored) {
    if (merged.length > 0 && c.start < merged[merged.length - 1].end) continue;
    merged.push(c);
  }

  let cursor = 0;
  for (const seg of merged) {
    if (seg.start > cursor) {
      tokens.push({ text: rest.slice(cursor, seg.start), color: SYN.plain });
    }
    tokens.push({ text: rest.slice(seg.start, seg.end), color: seg.color });
    cursor = seg.end;
  }
  if (cursor < rest.length) {
    tokens.push({ text: rest.slice(cursor), color: SYN.plain });
  }

  return tokens;
}

const FadeOut: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  return <div style={{ position: "absolute", inset: 0, background: THEME.colors.bgBase, opacity, zIndex: 20 }} />;
};

const AmbientGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const glowOpacity = interpolate(frame, [100, 180, 400, 439], [0, 0.15, 0.15, 0], {
    extrapolateRight: "clamp", extrapolateLeft: "clamp",
  });
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(ellipse 600px 400px at 30% 40%, ${THEME.colors.primaryGlow} 0%, transparent 100%)`,
      opacity: glowOpacity, zIndex: 1,
    }} />
  );
};

export const PainPoint: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000000", fontFamily: THEME.fonts.sans }}>
      <NoiseOverlay opacity={0.04} />
      <AmbientGlow />

      {/* seg0-01: Typewriter (0–165f, fades out before seg0-02) */}
      <Sequence durationInFrames={165}>
        <TypewriterQuestion />
      </Sequence>

      {/* seg0-02: Code assembly (165–end, code stays visible) */}
      <Sequence from={165} durationInFrames={274}>
        <CodeFragments />
      </Sequence>

      {/* Quick fade out at the very end (425–439f, 14 frames) */}
      <Sequence from={425} durationInFrames={14}>
        <FadeOut />
      </Sequence>
    </AbsoluteFill>
  );
};
