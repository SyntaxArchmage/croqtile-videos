/**
 * remotion/compositions/DynamicShape.tsx
 * Segment 5 — Dynamic Symbolic Dimensions (3:06–3:36, 890 frames @ 30fps)
 *
 * 0–120f:   CroqTile kernel signature slides in; M, N, K highlighted in mint
 * 120–600f: Dimension preset selector cycles (~120f per preset), values crossfade
 * 600–750f: Triton comparison panel slides in from the right
 * 750–890f: Hold with both columns visible
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";
import { DeviceShell } from "../components/DeviceShell";

const DURATION_FRAMES = 890;
const CYCLE_START = 120;
const CYCLE_END = 600;
const SLOT_FRAMES = 120;
const TRITON_ENTER_START = 600;

const CODE_SIZE = 46;
const LABEL_SIZE = 22;
const MONO_DIMS = 42;

const PRESETS = [
  { label: "Small", M: 64, N: 64, K: 32 },
  { label: "Medium", M: 256, N: 256, K: 128 },
  { label: "Large", M: 4096, N: 4096, K: 2048 },
  { label: "Rectangular", M: 8192, N: 16384, K: 512 },
] as const;

function formatDims(p: (typeof PRESETS)[number]): string {
  return `${p.M.toLocaleString()} × ${p.N.toLocaleString()} × ${p.K.toLocaleString()}`;
}

const CROSSFADE = 28;

const presetDimWeight = (j: number, cycleFrame: number): number => {
  const enter =
    j === 0
      ? 1
      : interpolate(
          cycleFrame,
          [j * SLOT_FRAMES - CROSSFADE, j * SLOT_FRAMES],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
  const exit =
    j === PRESETS.length - 1
      ? 1
      : interpolate(
          cycleFrame,
          [(j + 1) * SLOT_FRAMES - CROSSFADE, (j + 1) * SLOT_FRAMES],
          [1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
  return enter * exit;
};

const PresetDimsLine: React.FC<{ preset: (typeof PRESETS)[number]; opacity: number }> = ({
  preset,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      fontFamily: THEME.fonts.mono,
      fontSize: MONO_DIMS,
      lineHeight: 1.35,
      color: THEME.colors.textPrimary,
      opacity,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ color: THEME.colors.textMuted }}>M × N × K → </span>
    <span style={{ color: THEME.colors.primary }}>{formatDims(preset)}</span>
  </div>
);

export const DynamicShape: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = THEME.video.fps;

  const codeSlide = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 140, mass: 0.85 },
    from: -96,
    to: 0,
  });
  const codeOpacity = interpolate(frame, [0, 96], [0, 1], {
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

  const selectorOpacity = interpolate(frame, [120, 152], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const activePresetSpring = spring({
    frame: frame - CYCLE_START - presetIndex * SLOT_FRAMES,
    fps,
    config: { damping: 15, stiffness: 190, mass: 0.55 },
    from: 0.94,
    to: 1,
  });

  const leftShrink = interpolate(frame, [594, 668], [0, 540], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mintGlow = interpolate(
    presetDimWeight(presetIndex, cycleT),
    [0.35, 1],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const tritonSlide = spring({
    frame: frame - TRITON_ENTER_START,
    fps,
    config: { damping: 24, stiffness: 110, mass: 1 },
    from: 120,
    to: 0,
  });
  const tritonOpacity = interpolate(
    frame,
    [TRITON_ENTER_START, TRITON_ENTER_START + 72],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <PageContainer tag="Segment 05" title="Symbolic dimensions, one kernel">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxHeight: 498,
        }}
      >
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.028} blendMode="soft-light" />
        </AbsoluteFill>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            {/* Left stack: CroqTile kernel + presets */}
            <div
              style={{
                transform: `translateX(${codeSlide}px) scale(${codeScale})`,
                opacity: codeOpacity,
                transformOrigin: "left center",
                paddingRight: leftShrink,
                maxWidth: 1180,
              }}
            >
              <div
                style={{
                  fontFamily: THEME.fonts.sans,
                  fontSize: LABEL_SIZE,
                  fontWeight: 600,
                  color: THEME.colors.primary,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                CroqTile
              </div>

              <DeviceShell title="matmul.croq" width={1040} height={228}>
                <div
                  style={{
                    padding: "18px 26px",
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
                      fontSize: CODE_SIZE,
                      lineHeight: 1.55,
                      color: THEME.colors.textSecondary,
                    }}
                  >
                    <span style={{ color: THEME.colors.textMuted }}>{"__co__ "}</span>
                    <span style={{ color: THEME.colors.textCode }}>
                      {"auto matmul(global f16 ["}
                      <span style={{ color: THEME.colors.primary }}>{"M"}</span>
                      <span>{", "}</span>
                      <span style={{ color: THEME.colors.primary }}>{"K"}</span>
                      <span>{"] lhs, global f16 ["}</span>
                      <span style={{ color: THEME.colors.primary }}>{"N"}</span>
                      <span>{", "}</span>
                      <span style={{ color: THEME.colors.primary }}>{"K"}</span>
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
                <div style={{ marginTop: 14, opacity: selectorOpacity }}>
                  <div
                    style={{
                      fontFamily: THEME.fonts.sans,
                      fontSize: LABEL_SIZE - 2,
                      color: THEME.colors.textSecondary,
                      marginBottom: 10,
                    }}
                  >
                    Dimension preset
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    {PRESETS.map((p, i) => {
                      const active = i === presetIndex;
                      const peak = active ? activePresetSpring : 1;

                      return (
                        <div
                          key={p.label}
                          style={{
                            padding: "10px 20px",
                            borderRadius: THEME.radius.full,
                            fontFamily: THEME.fonts.mono,
                            fontSize: THEME.fontSize.lg,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            border: `1px solid ${
                              active
                                ? "rgba(110,231,183,0.55)"
                                : "rgba(255,255,255,0.08)"
                            }`,
                            color: active
                              ? THEME.colors.textPrimary
                              : THEME.colors.textMuted,
                            background: active
                              ? "linear-gradient(135deg, rgba(110,231,183,0.14) 0%, rgba(129,140,248,0.1) 100%)"
                              : "rgba(17,24,39,0.65)",
                            boxShadow: active
                              ? `${THEME.shadows.glowSm}, inset 0 1px 0 rgba(255,255,255,0.07)`
                              : THEME.shadows.inset,
                            opacity: active ? peak : 0.74,
                            transform: `scale(${active ? peak : 0.98})`,
                          }}
                        >
                          {p.label}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: THEME.radius.md,
                      background: THEME.colors.bgCard,
                      border: `1px solid rgba(110,231,183,0.22)`,
                      boxShadow: `${THEME.shadows.card}, 0 0 ${Math.round(mintGlow * 36)}px rgba(110,231,183,0.12)`,
                      position: "relative",
                      minHeight: 62,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: THEME.fonts.sans,
                        fontSize: LABEL_SIZE - 4,
                        color: THEME.colors.textMuted,
                        marginBottom: 8,
                        letterSpacing: "0.03em",
                      }}
                    >
                      Resolved launch shape
                    </div>
                    <div style={{ position: "relative", minHeight: MONO_DIMS * 1.35 }}>
                      {PRESETS.map((p, j) => (
                        <PresetDimsLine
                          key={p.label}
                          preset={p}
                          opacity={presetDimWeight(j, cycleT)}
                        />
                      ))}
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
                  width: 520,
                  transform: `translateX(${tritonSlide}px)`,
                  opacity: tritonOpacity,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontFamily: THEME.fonts.sans,
                    fontSize: LABEL_SIZE,
                    fontWeight: 600,
                    color: THEME.colors.textMuted,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    alignSelf: "flex-end",
                    paddingRight: 8,
                  }}
                >
                  Triton
                </div>
                <DeviceShell
                  title="triton_compare.py"
                  width={520}
                  height={352}
                  style={{
                    background: THEME.colors.bgBase,
                    boxShadow: `${THEME.shadows.card}, inset 0 1px 0 rgba(255,255,255,0.03)`,
                    opacity: 0.94,
                    filter: "saturate(0.82)",
                  }}
                >
                  <div style={{ padding: "18px 22px", height: "100%", boxSizing: "border-box" }}>
                    <pre
                      style={{
                        margin: 0,
                        fontFamily: THEME.fonts.mono,
                        fontSize: 42,
                        lineHeight: 1.58,
                        color: THEME.colors.textMuted,
                      }}
                    >
                      <span style={{ color: THEME.colors.textMuted }}>
                        {"# Block sizes must be tl.constexpr\n"}
                      </span>
                      <span style={{ color: THEME.colors.accentWarm }}>{"BLOCK_M"}</span>
                      <span style={{ color: THEME.colors.textSecondary }}>
                        {": tl.constexpr = "}
                      </span>
                      <span style={{ color: THEME.colors.textMuted }}>{"128"}</span>
                      {"\n"}
                      <span style={{ color: THEME.colors.accent }}>
                        {"# Fixed at compile time — not symbolic\n"}
                      </span>
                      <span
                        style={{
                          color: THEME.colors.textMuted,
                          opacity: 0.88,
                        }}
                      >
                        {"# New shapes → retune & recompile\n"}
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
