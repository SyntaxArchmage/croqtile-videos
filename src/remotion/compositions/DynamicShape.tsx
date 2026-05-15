/**
 * remotion/compositions/DynamicShape.tsx
 * Segment 5 — Dynamic Symbolic Dimensions (2:15–2:45, 30 s = 900 frames @ 30fps)
 *
 * 0–120f:   CroqTile kernel signature slides in; M, N, K highlighted in mint
 * 120–600f: Dimension preset selector cycles (~120f per preset), values crossfade
 * 600–750f: Triton comparison panel slides in from the right
 * 750–900f: Hold with both columns visible
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

const DURATION_FRAMES = 900;
const CYCLE_START = 120;
const CYCLE_END = 600;
const SLOT_FRAMES = 120;
const TRITON_ENTER_START = 600;
const TRITON_ENTER_END = 750;

const PRESETS = [
  { label: "Small", M: 64, N: 64, K: 32 },
  { label: "Medium", M: 256, N: 256, K: 128 },
  { label: "Large", M: 4096, N: 4096, K: 2048 },
  { label: "Rectangular", M: 8192, N: 16384, K: 512 },
] as const;

function formatDims(p: (typeof PRESETS)[number]): string {
  return `M × N × K  →  ${p.M.toLocaleString()} × ${p.N.toLocaleString()} × ${p.K.toLocaleString()}`;
}

export const DynamicShape: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = THEME.video.fps;

  const codeSlide = interpolate(frame, [0, 120], [-88, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const codeOpacity = interpolate(frame, [0, 96], [0, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const codeScale = spring({
    frame: frame - 6,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.75 },
    from: 0.92,
    to: 1,
  });

  const cycleT = Math.min(Math.max(frame - CYCLE_START, 0), CYCLE_END - CYCLE_START);
  const presetIndex = Math.min(
    PRESETS.length - 1,
    Math.floor(cycleT / SLOT_FRAMES)
  );
  const intraSlot = cycleT - presetIndex * SLOT_FRAMES;
  const dimsPulse = interpolate(
    intraSlot,
    [0, 16, 104, SLOT_FRAMES],
    [0.92, 1, 1, 0.42],
    {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const preset = PRESETS[presetIndex];
  const selectorOpacity = interpolate(frame, [120, 152], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const activePresetSpring = spring({
    frame: frame - CYCLE_START - presetIndex * SLOT_FRAMES,
    fps,
    config: { damping: 15, stiffness: 190, mass: 0.55 },
    from: 0.9,
    to: 1,
  });

  const leftPadRight = interpolate(frame, [594, 664], [0, 524], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dimGlow = interpolate(dimsPulse, [0.55, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tritonX = interpolate(frame, [TRITON_ENTER_START, TRITON_ENTER_END], [110, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tritonOpacity = interpolate(frame, [TRITON_ENTER_START, TRITON_ENTER_START + 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <PageContainer tag="Flexibility" title="Write Once, Run Any Shape">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.032} />
        </AbsoluteFill>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            {/* Left stack: CroqTile kernel + presets */}
            <div
              style={{
                transform: `translateX(${codeSlide}px) scale(${codeScale})`,
                opacity: codeOpacity,
                transformOrigin: "left center",
                paddingRight: leftPadRight,
                maxWidth: 1100,
              }}
            >
              <DeviceShell title="matmul.croq" width={1000} height={296}>
                <div
                  style={{
                    padding: "28px 32px",
                    height: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      padding: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontFamily: THEME.fonts.mono,
                      fontSize: THEME.fontSize.sm,
                      lineHeight: 1.65,
                      color: THEME.colors.textSecondary,
                    }}
                  >
                    <span style={{ color: THEME.colors.textMuted }}>
                      {"__co__ "}
                    </span>
                    <span style={{ color: THEME.colors.textCode }}>
                      {"auto matmul(global f16 ["}
                      <span style={{ color: THEME.colors.primary }}>
                        {"M"}
                      </span>
                      <span>{", "}</span>
                      <span style={{ color: THEME.colors.primary }}>
                        {"K"}
                      </span>
                      <span>{"] lhs, global f16 ["}</span>
                      <span style={{ color: THEME.colors.primary }}>
                        {"N"}
                      </span>
                      <span>{", "}</span>
                      <span style={{ color: THEME.colors.primary }}>
                        {"K"}
                      </span>
                      <span>{"] rhs) { ... }"}</span>
                    </span>
                  </pre>
                </div>
              </DeviceShell>

              <Sequence
                from={CYCLE_START}
                durationInFrames={DURATION_FRAMES - CYCLE_START}
                layout="none"
              >
                <div style={{ marginTop: 22, opacity: selectorOpacity }}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    {PRESETS.map((p, i) => {
                      const active = i === presetIndex;
                      return (
                        <div
                          key={p.label}
                          style={{
                            padding: "8px 18px",
                            borderRadius: THEME.radius.full,
                            fontFamily: THEME.fonts.mono,
                            fontSize: THEME.fontSize.xs,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: active
                              ? THEME.colors.bgBase
                              : THEME.colors.textSecondary,
                            background: active
                              ? `linear-gradient(135deg, ${THEME.colors.primary}, #34D399)`
                              : THEME.colors.bgElevated,
                            border: `1px solid ${
                              active
                                ? "rgba(110,231,183,0.65)"
                                : "rgba(255,255,255,0.08)"
                            }`,
                            boxShadow: active
                              ? `${THEME.shadows.glowSm}, ${THEME.shadows.inset}`
                              : "none",
                            transform: active
                              ? `scale(${activePresetSpring})`
                              : "scale(1)",
                          }}
                        >
                          {p.label}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      padding: "18px 22px",
                      borderRadius: THEME.radius.md,
                      background: THEME.colors.bgCard,
                      border: "1px solid rgba(110,231,183,0.18)",
                      boxShadow: THEME.shadows.card,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: THEME.fonts.mono,
                        fontSize: THEME.fontSize.sm,
                        color: THEME.colors.textMuted,
                        marginBottom: 8,
                        letterSpacing: "0.04em",
                      }}
                    >
                      Resolved launch shape
                    </div>
                    <div
                      style={{
                        fontFamily: THEME.fonts.mono,
                        fontSize: THEME.fontSize.base,
                        color: THEME.colors.textPrimary,
                        opacity: dimsPulse,
                        textShadow: `0 0 ${Math.round(dimGlow * 14)}px rgba(110,231,183,0.45)`,
                      }}
                    >
                      {formatDims(preset)}
                    </div>
                  </div>
                </div>
              </Sequence>
            </div>

            {/* Triton comparison — mounts at 600 through scene end */}
            <Sequence
              from={TRITON_ENTER_START}
              durationInFrames={DURATION_FRAMES - TRITON_ENTER_START}
              layout="none"
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 500,
                  transform: `translateX(${tritonX}px)`,
                  opacity: tritonOpacity,
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <DeviceShell
                  title="triton_compare.py"
                  width={480}
                  height={420}
                  style={{
                    boxShadow: `${THEME.shadows.card}, 0 0 0 1px rgba(129,140,248,0.22)`,
                  }}
                >
                  <div style={{ padding: "24px 26px", height: "100%" }}>
                    <pre
                      style={{
                        margin: 0,
                        fontFamily: THEME.fonts.mono,
                        fontSize: THEME.fontSize.sm,
                        lineHeight: 1.7,
                        color: THEME.colors.textSecondary,
                      }}
                    >
                      <span style={{ color: THEME.colors.textMuted }}>
                        {"# Triton: block size must be compile-time constant\n"}
                      </span>
                      <span style={{ color: THEME.colors.accentWarm }}>
                        {"BLOCK_M"}
                      </span>
                      <span>{": tl.constexpr  "}</span>
                      <span style={{ color: THEME.colors.danger }}>
                        {"# cannot be symbolic\n"}
                      </span>
                      <span style={{ color: THEME.colors.textMuted }}>
                        {
                          "# Each shape needs separate tuning and recompilation\n"
                        }
                      </span>
                    </pre>
                  </div>
                </DeviceShell>
              </div>
            </Sequence>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
