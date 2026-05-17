/**
 * remotion/compositions/OutroCTA.tsx
 * Segment 7 — Outro CTA (5:20–5:30, 10 s = 300 frames @30fps)
 *
 * 0–45f:    Scene lifts from black into base background
 * 45–90f:   CroqTile logo springs in (mint “Tile”, white “Croq”)
 * 90–150f:  Hero title fades / rises (bilingual)
 * 150–210f: Subtitle fades / rises (bilingual)
 * 210–270f: CTA button + GitHub badge
 * 270–300f: Hold — clean resolve
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";

const DURATION_FRAMES = 300;
const SPRING_ORGANIC = { damping: 13, stiffness: 128, mass: 0.78 } as const;
const MINT_HEX = "#6EE7B7";

const LOGO_BLOCK_FROM = 45;
const LOGO_BLOCK_DURATION = DURATION_FRAMES - LOGO_BLOCK_FROM;
const CTA_FROM = 210;
const CTA_DURATION = DURATION_FRAMES - CTA_FROM;

export const OutroCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blackoutOpacity = interpolate(frame, [0, 28, 45], [1, 0.14, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const noiseOpacity = interpolate(frame, [12, 45], [0, 0.032], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const logoScale = spring({
    frame: frame - 45,
    fps,
    config: SPRING_ORGANIC,
    from: 0.62,
    to: 1,
  });

  const logoOpacity = interpolate(frame, [42, 78], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const logoGlowBlur = interpolate(frame, [58, 100, 180], [0, 44, 34], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const titleProgress = spring({
    frame: frame - 90,
    fps,
    config: SPRING_ORGANIC,
    from: 0,
    to: 1,
  });
  const titleOpacity = interpolate(titleProgress, [0, 0.92, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const titleY = spring({
    frame: frame - 90,
    fps,
    config: SPRING_ORGANIC,
    from: 22,
    to: 0,
  });

  const subtitleProgress = spring({
    frame: frame - 150,
    fps,
    config: SPRING_ORGANIC,
    from: 0,
    to: 1,
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 0.92, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const subtitleY = spring({
    frame: frame - 150,
    fps,
    config: SPRING_ORGANIC,
    from: 18,
    to: 0,
  });

  const ctaProgress = spring({
    frame: frame - 210,
    fps,
    config: SPRING_ORGANIC,
    from: 0,
    to: 1,
  });
  const ctaOpacity = interpolate(ctaProgress, [0, 0.88, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const ctaY = spring({
    frame: frame - 210,
    fps,
    config: SPRING_ORGANIC,
    from: 36,
    to: 0,
  });

  const ghProgress = spring({
    frame: frame - 222,
    fps,
    config: SPRING_ORGANIC,
    from: 0,
    to: 1,
  });
  const githubOpacity = interpolate(ghProgress, [0, 0.9, 1], [0, 1, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const githubY = spring({
    frame: frame - 222,
    fps,
    config: { ...SPRING_ORGANIC, mass: 0.82 },
    from: 14,
    to: 0,
  });

  const vignetteMint = interpolate(frame, [0, 55], [0.5, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const logoTextShadow = `0 0 28px rgba(110,231,183,0.35), 0 0 56px rgba(110,231,183,0.12), 0 6px 32px rgba(0,0,0,0.55)`;

  return (
    <AbsoluteFill
      style={{
        background: THEME.colors.bgBase,
        overflow: "hidden",
        fontFamily: THEME.fonts.sans,
      }}
    >
      <NoiseOverlay opacity={noiseOpacity} blendMode="soft-light" />

      <AbsoluteFill
        style={{
          background: "#000000",
          opacity: blackoutOpacity,
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          zIndex: 0,
          background: `radial-gradient(ellipse 82% 68% at 50% 38%, rgba(110,231,183,${0.055 * vignetteMint}) 0%, transparent 74%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 72px",
          transform: "translateY(-26px)",
        }}
      >
        <Sequence from={LOGO_BLOCK_FROM} durationInFrames={LOGO_BLOCK_DURATION} layout="none">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
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
                  width: 220 + logoGlowBlur * 2.2,
                  height: 220 + logoGlowBlur * 2.2,
                  borderRadius: THEME.radius.full,
                  background: THEME.colors.primaryGlow,
                  filter: `blur(${logoGlowBlur}px)`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                }}
              />
              <span
                style={{
                  fontSize: 78,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.035em",
                  position: "relative",
                  zIndex: 1,
                  textShadow: logoTextShadow,
                }}
              >
                Croq
                <span style={{ color: MINT_HEX, textShadow: `${logoTextShadow}, 0 0 64px rgba(110,231,183,0.45)` }}>
                  Tile
                </span>
              </span>
            </div>

            <div
              style={{
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
                textAlign: "center",
                maxWidth: 1200,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 60,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: THEME.colors.textPrimary,
                  letterSpacing: "-0.02em",
                }}
              >
                欢迎来到计算编程的新时代
              </h1>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 56,
                  fontWeight: 600,
                  lineHeight: 1.22,
                  color: "rgba(249,250,251,0.94)",
                  letterSpacing: "-0.018em",
                }}
              >
                Welcome to the new era of compute programming
              </p>
            </div>

            <div
              style={{
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px)`,
                textAlign: "center",
                maxWidth: 920,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 32,
                  lineHeight: 1.42,
                  color: THEME.colors.textSecondary,
                  fontWeight: 480,
                }}
              >
                你的性能开发效率，值得被重新定义
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 30,
                  lineHeight: 1.45,
                  color: "rgba(156,163,175,0.98)",
                  fontWeight: 450,
                }}
              >
                Your kernel development productivity deserves to be redefined
              </p>
            </div>
          </div>
        </Sequence>

        <Sequence from={CTA_FROM} durationInFrames={CTA_DURATION} layout="none">
          <div
            style={{
              marginTop: 22,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                opacity: ctaOpacity,
                transform: `translateY(${ctaY}px)`,
                padding: 2,
                borderRadius: THEME.radius.lg + 2,
                background: `linear-gradient(135deg, ${MINT_HEX} 0%, #34D399 42%, ${THEME.colors.primaryDark} 100%)`,
                boxShadow: `0 0 0 1px rgba(110,231,183,0.25), 0 0 56px rgba(110,231,183,0.32), 0 18px 48px rgba(0,0,0,0.45), ${THEME.shadows.inset}`,
              }}
            >
              <div
                style={{
                  borderRadius: THEME.radius.lg,
                  padding: "14px 34px",
                  fontFamily: THEME.fonts.sans,
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  color: THEME.colors.bgBase,
                  background: `linear-gradient(145deg, ${MINT_HEX} 0%, #5EEAD4 45%, #34D399 100%)`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                Get Started → lancerlab.github.io/croqtile-tutorial
              </div>
            </div>

            <div
              style={{
                opacity: githubOpacity,
                transform: `translateY(${githubY}px)`,
                padding: "9px 22px",
                borderRadius: THEME.radius.full,
                fontFamily: THEME.fonts.mono,
                fontSize: 13,
                color: "rgba(209,213,219,0.92)",
                background: "rgba(17,24,39,0.72)",
                border: "1px solid rgba(110,231,183,0.14)",
                boxShadow: `${THEME.shadows.card}, 0 0 28px rgba(110,231,183,0.06)`,
                letterSpacing: "0.06em",
              }}
            >
              github.com/LancerLab/croqtile
            </div>
          </div>
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
