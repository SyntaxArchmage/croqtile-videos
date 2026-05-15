/**
 * remotion/compositions/IterativeDev.tsx
 * 段 1 — 迭代开发的痛苦 + CroqTile 揭晓
 * 1311 帧 @30fps (~43.7s)
 *
 * 配音对齐 (相对帧号, 0.3s gap):
 *   0–150f    seg1-01 "这不仅仅是因为实现复杂…"  (5.02s)
 *   160–507f  seg1-02 "多轮编写——编译调试…"      (11.57s)
 *   517–774f  seg1-03 "需要编程能力+硬件知识…"    (8.59s)
 *   784–922f  seg1-04 "这些门槛大大限制了…"       (4.63s)
 *   932–1271f seg1-05 "所以我们造了CroqTile…"     (11.30s)
 *   1272–1311f 淡出
 *
 * 画面设计：
 *   Phase A (0–517f): 环形迭代流程图 — 四阶段循环展示
 *   Phase B (517–922f): 多轮迭代加速 + 错误闪烁 + 性能曲线 + 门槛文字
 *   Phase C (932–1311f): 画面收暗 → CroqTile logo 揭晓
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Sequence,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";

const STAGES = [
  { label: "Code", icon: "{ }", color: "#60A5FA" },
  { label: "Debug", icon: "!!", color: "#F87171" },
  { label: "Profile", icon: "▶", color: "#FBBF24" },
  { label: "Tune", icon: "⚙", color: "#34D399" },
];

const RING_RADIUS = 180;
const CENTER_X = 960;
const CENTER_Y = 460;

/* ── Iterative cycle ring ───────────────────────── */
const CycleRing: React.FC = () => {
  const frame = useCurrentFrame();

  const ringOpacity = interpolate(frame, [0, 30, 882, 932], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotation = interpolate(frame, [0, 922], [0, 720], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const iterationCount = Math.floor(
    interpolate(frame, [60, 852], [1, 12], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const pulsePhase = (frame % 30) / 30;
  const pulseScale = 1 + Math.sin(pulsePhase * Math.PI * 2) * 0.02;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: ringOpacity,
        zIndex: 3,
      }}
    >
      {/* Central ring path */}
      <div
        style={{
          position: "absolute",
          left: CENTER_X - RING_RADIUS,
          top: CENTER_Y - RING_RADIUS,
          width: RING_RADIUS * 2,
          height: RING_RADIUS * 2,
          borderRadius: "50%",
          border: "2px solid rgba(110,231,183,0.2)",
          transform: `scale(${pulseScale})`,
        }}
      />

      {/* Rotating highlight arc */}
      <div
        style={{
          position: "absolute",
          left: CENTER_X - RING_RADIUS - 4,
          top: CENTER_Y - RING_RADIUS - 4,
          width: RING_RADIUS * 2 + 8,
          height: RING_RADIUS * 2 + 8,
          borderRadius: "50%",
          border: "3px solid transparent",
          borderTopColor: THEME.colors.primary,
          borderRightColor: "rgba(110,231,183,0.3)",
          transform: `rotate(${rotation}deg)`,
        }}
      />

      {/* Stage nodes */}
      {STAGES.map((stage, i) => {
        const angle = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
        const x = CENTER_X + Math.cos(angle) * RING_RADIUS;
        const y = CENTER_Y + Math.sin(angle) * RING_RADIUS;

        const nodeEntry = interpolate(
          frame,
          [15 + i * 12, 35 + i * 12],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const isActive =
          Math.floor(((rotation % 360) + 360) % 360 / 90) === i;
        const activeScale = isActive ? 1.15 : 1;
        const activeGlow = isActive ? 0.6 : 0;

        return (
          <div
            key={stage.label}
            style={{
              position: "absolute",
              left: x - 50,
              top: y - 50,
              width: 100,
              height: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: nodeEntry,
              transform: `scale(${activeScale})`,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: `${stage.color}18`,
                border: `2px solid ${stage.color}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 ${activeGlow * 30}px ${stage.color}40`,
              }}
            >
              <span style={{ fontSize: 24, color: stage.color }}>
                {stage.icon}
              </span>
            </div>
            <span
              style={{
                marginTop: 8,
                fontSize: 14,
                fontFamily: THEME.fonts.mono,
                color: stage.color,
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              {stage.label}
            </span>
          </div>
        );
      })}

      {/* Arrows between stages */}
      {STAGES.map((_, i) => {
        const a1 = (i / STAGES.length) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / STAGES.length) * Math.PI * 2 - Math.PI / 2;
        const midAngle = (a1 + a2) / 2;
        const arrowX = CENTER_X + Math.cos(midAngle) * (RING_RADIUS + 35);
        const arrowY = CENTER_Y + Math.sin(midAngle) * (RING_RADIUS + 35);
        const arrowRot = (midAngle * 180) / Math.PI + 90;

        const arrowOpacity = interpolate(
          frame,
          [40 + i * 10, 55 + i * 10],
          [0, 0.4],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={`arrow-${i}`}
            style={{
              position: "absolute",
              left: arrowX - 8,
              top: arrowY - 8,
              fontSize: 16,
              color: THEME.colors.textMuted,
              opacity: arrowOpacity,
              transform: `rotate(${arrowRot}deg)`,
            }}
          >
            →
          </div>
        );
      })}

      {/* Iteration counter */}
      <div
        style={{
          position: "absolute",
          left: CENTER_X - 40,
          top: CENTER_Y - 24,
          width: 80,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 800,
            fontFamily: THEME.fonts.mono,
            color: THEME.colors.textPrimary,
          }}
        >
          {iterationCount}
        </span>
        <div
          style={{
            fontSize: 11,
            color: THEME.colors.textMuted,
            fontFamily: THEME.fonts.mono,
            letterSpacing: "0.1em",
            marginTop: 2,
          }}
        >
          ITERATION
        </div>
      </div>
    </div>
  );
};

/* ── Error flashes around the ring ──────────────── */
const ErrorOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const errors = [
    { text: "CUDA error: illegal memory access", x: 200, y: 320 },
    { text: "Shape mismatch: [64,64] vs [64,128]", x: 1400, y: 380 },
    { text: "DMA buffer overflow at line 187", x: 300, y: 680 },
    { text: "Bank conflict: 32-way on smem", x: 1300, y: 600 },
    { text: "Misaligned address in async copy", x: 500, y: 250 },
  ];

  const groupOpacity = interpolate(frame, [160, 190, 782, 922], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{ position: "absolute", inset: 0, opacity: groupOpacity, zIndex: 5 }}
    >
      {errors.map((err, i) => {
        const cycle = 80;
        const offset = i * 15;
        const localFrame = (frame - 200 + offset) % cycle;
        const errOpacity = interpolate(localFrame, [0, 5, 25, 35], [0, 0.85, 0.85, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: err.x,
              top: err.y,
              opacity: errOpacity,
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 6,
              padding: "5px 12px",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontFamily: THEME.fonts.mono,
                color: THEME.colors.danger,
                whiteSpace: "nowrap",
              }}
            >
              ✕ {err.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ── Performance curve (slowly climbing) ─────────── */
const PerfCurve: React.FC = () => {
  const frame = useCurrentFrame();

  const curveOpacity = interpolate(frame, [250, 290, 882, 922], [0, 0.7, 0.7, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const points: string[] = [];
  const w = 400;
  const h = 120;
  const baseX = 1350;
  const baseY = 800;
  const numPts = 40;

  for (let p = 0; p < numPts; p++) {
    const t = p / (numPts - 1);
    const progress = interpolate(frame, [250, 850], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const visible = t <= progress;
    if (!visible) break;
    const px = baseX + t * w;
    const rawY = 1 - Math.pow(t, 0.6);
    const jitter = Math.sin(t * 20 + frame * 0.1) * 5;
    const py = baseY - rawY * h + jitter;
    points.push(`${px},${py}`);
  }

  return (
    <div style={{ position: "absolute", inset: 0, opacity: curveOpacity, zIndex: 4 }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {points.length > 1 && (
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke={THEME.colors.primary}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.7}
          />
        )}
      </svg>
      {/* Label */}
      <div
        style={{
          position: "absolute",
          left: baseX,
          top: baseY + 10,
          fontSize: 12,
          fontFamily: THEME.fonts.mono,
          color: THEME.colors.textMuted,
          letterSpacing: "0.08em",
        }}
      >
        THROUGHPUT (TFLOPS)
      </div>
      {/* Target line */}
      <div
        style={{
          position: "absolute",
          left: baseX,
          top: baseY - h - 5,
          width: w,
          borderTop: `1px dashed ${THEME.colors.danger}40`,
        }}
      />
      <span
        style={{
          position: "absolute",
          left: baseX + w + 8,
          top: baseY - h - 12,
          fontSize: 11,
          fontFamily: THEME.fonts.mono,
          color: THEME.colors.danger,
          opacity: 0.6,
        }}
      >
        target
      </span>
    </div>
  );
};

/* ── "barriers" text overlay ────────────────────── */
const BarriersText: React.FC = () => {
  const frame = useCurrentFrame();

  const barriers = [
    { text: "Low-level programming", delay: 0, x: 150, y: 160 },
    { text: "Hardware expertise", delay: 15, x: 1450, y: 200 },
    { text: "Optimization experience", delay: 30, x: 200, y: 880 },
    { text: "Weeks → Months", delay: 45, x: 1380, y: 850 },
  ];

  const groupOpacity = interpolate(frame, [517, 557, 882, 922], [0, 0.8, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: groupOpacity, zIndex: 6 }}>
      {barriers.map((b, i) => {
        const entryOp = interpolate(
          frame,
          [520 + b.delay, 545 + b.delay],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              opacity: entryOp,
              fontSize: 18,
              fontFamily: THEME.fonts.sans,
              fontWeight: 600,
              color: THEME.colors.accentWarm,
              letterSpacing: "0.02em",
              textShadow: "0 0 20px rgba(251,191,36,0.3)",
            }}
          >
            {b.text}
          </div>
        );
      })}
    </div>
  );
};

/* ── CroqTile logo reveal ───────────────────────── */
const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const logoScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    from: 0.6,
    to: 1,
  });
  const logoOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });

  const glowSize = interpolate(frame, [50, 100, 150, 200], [0, 48, 32, 40], {
    extrapolateRight: "clamp",
  });

  const taglineWords = [
    "5× Productivity.",
    "GPU-native.",
    "AI era.",
  ];
  const taglineStart = 80;

  const subtitleOpacity = interpolate(frame, [140, 170], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: THEME.colors.bgBase,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        opacity: bgOpacity,
        zIndex: 15,
      }}
    >
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 160 + glowSize * 2,
            height: 160 + glowSize * 2,
            borderRadius: THEME.radius.full,
            background: THEME.colors.primaryGlow,
            filter: `blur(${glowSize}px)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
        />
        <span
          style={{
            fontSize: THEME.fontSize["4xl"],
            fontWeight: 800,
            color: THEME.colors.textPrimary,
            letterSpacing: "-0.03em",
            position: "relative",
            zIndex: 1,
          }}
        >
          Croq<span style={{ color: THEME.colors.primary }}>Tile</span>
        </span>
      </div>

      {/* Tagline */}
      <div
        style={{
          display: "flex",
          gap: 12,
          fontSize: THEME.fontSize.xl,
          fontWeight: 500,
          color: THEME.colors.textSecondary,
          zIndex: 1,
        }}
      >
        {taglineWords.map((word, i) => {
          const wordStart = taglineStart + i * 15;
          const opacity = interpolate(
            frame,
            [wordStart, wordStart + 10],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );
          const y = interpolate(frame, [wordStart, wordStart + 15], [12, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          return (
            <span
              key={word}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                color:
                  i === 0 ? THEME.colors.primary : THEME.colors.textPrimary,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      <p
        style={{
          opacity: subtitleOpacity,
          fontSize: THEME.fontSize.base,
          color: THEME.colors.textMuted,
          margin: 0,
          fontFamily: THEME.fonts.mono,
          letterSpacing: "0.05em",
          zIndex: 1,
        }}
      >
        Next-gen GPU & DSA kernel programming language
      </p>
    </AbsoluteFill>
  );
};

/* ── Main composition ───────────────────────────── */
export const IterativeDev: React.FC = () => {
  return (
    <AbsoluteFill
      style={{ background: THEME.colors.bgBase, fontFamily: THEME.fonts.sans }}
    >
      <NoiseOverlay opacity={0.03} />

      {/* Iterative cycle ring (0–932f) */}
      <CycleRing />

      {/* Error flashes (aligned with seg1-02 start: 160f) */}
      <Sequence from={0} durationInFrames={932}>
        <ErrorOverlay />
      </Sequence>

      {/* Performance curve (aligned with seg1-02: 250f onward) */}
      <Sequence from={0} durationInFrames={932}>
        <PerfCurve />
      </Sequence>

      {/* Barriers text (aligned with seg1-03+04: 517–922f) */}
      <Sequence from={0} durationInFrames={932}>
        <BarriersText />
      </Sequence>

      {/* CroqTile logo reveal (aligned with seg1-05: 932–1311f) */}
      <Sequence from={932} durationInFrames={379}>
        <LogoReveal />
      </Sequence>
    </AbsoluteFill>
  );
};
