/**
 * remotion/compositions/PerfChart.tsx
 * Segment 3 — Performance Data (1:35–1:45, 10 s = 300 frames @ 30fps)
 *
 * Minimal animated bar chart: CroqTile vs PyTorch TFLOPS, spring growth, annotation.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";
import { PageContainer } from "../components/PageContainer";

const DURATION_FRAMES = 300;
const CROQ_TFLOPS = 471.3;
const TORCH_TFLOPS = 447.5;
const MAX_BAR_PX = 380;
const BAR_WIDTH = 132;
const BAR_GAP = 200;

export const PerfChart: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = THEME.video.fps;

  const growth = spring({
    frame: frame - 18,
    fps,
    config: { damping: 16, stiffness: 96, mass: 0.85 },
    from: 0,
    to: 1,
  });

  const croqH = growth * MAX_BAR_PX * (CROQ_TFLOPS / CROQ_TFLOPS);
  const torchH = growth * MAX_BAR_PX * (TORCH_TFLOPS / CROQ_TFLOPS);

  const valueOpacity = interpolate(frame, [78, 102], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const valueY = interpolate(frame, [78, 102], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const deltaScale = spring({
    frame: frame - 108,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.7 },
    from: 0.88,
    to: 1,
  });
  const deltaOpacity = interpolate(frame, [100, 124], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const footerOpacity = interpolate(frame, [0, 28], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <PageContainer tag="Performance" title="Zero-Cost Abstraction">
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <NoiseOverlay opacity={0.035} />
        </AbsoluteFill>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
          }}
        >
          {/* +5.3% badge */}
          <div
            style={{
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sequence from={92} layout="none">
              <div
                style={{
                  opacity: deltaOpacity,
                  transform: `scale(${deltaScale})`,
                  padding: "10px 22px",
                  borderRadius: THEME.radius.md,
                  background: `linear-gradient(135deg, rgba(110,231,183,0.18), rgba(129,140,248,0.12))`,
                  border: `1px solid rgba(110,231,183,0.35)`,
                  boxShadow: `${THEME.shadows.glowSm}, ${THEME.shadows.inset}`,
                  fontFamily: THEME.fonts.mono,
                  fontSize: THEME.fontSize.lg,
                  fontWeight: 700,
                  color: THEME.colors.primary,
                  letterSpacing: "0.04em",
                }}
              >
                +5.3%
              </div>
            </Sequence>
          </div>

          {/* Bars */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
              gap: BAR_GAP,
            }}
          >
            {/* CroqTile */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: BAR_WIDTH + 80,
              }}
            >
              <div
                style={{
                  opacity: valueOpacity,
                  transform: `translateY(${valueY}px)`,
                  marginBottom: 14,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: THEME.fontSize["2xl"],
                    fontWeight: 700,
                    color: THEME.colors.textPrimary,
                    lineHeight: 1.1,
                  }}
                >
                  {CROQ_TFLOPS.toFixed(1)}
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: THEME.fontSize.sm,
                      color: THEME.colors.textMuted,
                      fontWeight: 500,
                    }}
                  >
                    TFLOPS
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: MAX_BAR_PX,
                  width: BAR_WIDTH,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  borderRadius: THEME.radius.md,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.18))`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: Math.max(0, croqH),
                    borderRadius: THEME.radius.md,
                    background: `linear-gradient(180deg, ${THEME.colors.primary}, ${THEME.colors.primaryDark})`,
                    boxShadow: `${THEME.shadows.glow}, 0 12px 40px rgba(110,231,183,0.22)`,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: THEME.fonts.sans,
                  fontSize: THEME.fontSize.lg,
                  fontWeight: 600,
                  color: THEME.colors.primary,
                }}
              >
                CroqTile
              </div>
            </div>

            {/* PyTorch */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: BAR_WIDTH + 80,
              }}
            >
              <div
                style={{
                  opacity: valueOpacity,
                  transform: `translateY(${valueY}px)`,
                  marginBottom: 14,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: THEME.fontSize["2xl"],
                    fontWeight: 700,
                    color: THEME.colors.textSecondary,
                    lineHeight: 1.1,
                  }}
                >
                  {TORCH_TFLOPS.toFixed(1)}
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: THEME.fontSize.sm,
                      color: THEME.colors.textMuted,
                      fontWeight: 500,
                    }}
                  >
                    TFLOPS
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: MAX_BAR_PX,
                  width: BAR_WIDTH,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  borderRadius: THEME.radius.md,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: Math.max(0, torchH),
                    borderRadius: THEME.radius.md,
                    background: `linear-gradient(180deg, #6B7280, #374151)`,
                    boxShadow: `0 8px 28px rgba(0,0,0,0.45)`,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: THEME.fonts.sans,
                  fontSize: THEME.fontSize.lg,
                  fontWeight: 600,
                  color: THEME.colors.textSecondary,
                }}
              >
                PyTorch
              </div>
            </div>
          </div>

          {/* Footnote */}
          <p
            style={{
              margin: 0,
              marginTop: 8,
              opacity: footerOpacity,
              fontFamily: THEME.fonts.mono,
              fontSize: THEME.fontSize.sm,
              color: THEME.colors.textMuted,
              letterSpacing: "0.06em",
            }}
          >
            Hopper · GEMM FP16 · 8192×8192×8192
          </p>
        </div>

        {/* End-card subtle pulse on last frames (readability) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: interpolate(frame, [DURATION_FRAMES - 40, DURATION_FRAMES], [0, 0.08], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            background:
              "radial-gradient(ellipse 80% 60% at 50% 55%, rgba(110,231,183,0.15), transparent 70%)",
            zIndex: 0,
          }}
        />
      </div>
    </PageContainer>
  );
};
