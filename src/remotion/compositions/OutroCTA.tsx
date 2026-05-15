/**
 * remotion/compositions/OutroCTA.tsx
 * Segment 7 — Outro CTA (5:20–5:30, 10 s = 300 frames @30fps)
 *
 * 0–45f:   Scene lifts from black into base background
 * 45–90f:  CroqTile logo springs in (mint “Tile”, white “Croq”)
 * 90–150f: Hero title fades / rises into place
 * 150–210f: Subtitle dissolves in
 * 210–270f: CTA button slides up + GitHub badge appears
 * 270–300f: Locked hero frame for clean resolve
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

const DURATION_FRAMES = 300;
const LOGO_BLOCK_FROM = 45;
const LOGO_BLOCK_DURATION = DURATION_FRAMES - LOGO_BLOCK_FROM;
const CTA_FROM = 210;
const CTA_DURATION = DURATION_FRAMES - CTA_FROM;

export const OutroCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = THEME.video.fps;

  const blackoutOpacity = interpolate(frame, [0, 45], [1, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const noiseOpacity = interpolate(frame, [12, 45], [0, 0.038], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const logoScale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 13, stiffness: 128, mass: 0.78 },
    from: 0.62,
    to: 1,
  });

  const logoOpacity = interpolate(frame, [42, 86], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const logoGlow = interpolate(frame, [60, 120, 195], [0, 40, 32], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const titleOpacity = interpolate(frame, [92, 144], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const titleY = interpolate(frame, [92, 144], [28, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const subtitleOpacity = interpolate(frame, [154, 202], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const subtitleY = interpolate(frame, [154, 202], [18, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const ctaY = interpolate(frame, [210, 258], [48, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const ctaOpacity = interpolate(frame, [210, 248], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const githubOpacity = interpolate(frame, [226, 264], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const githubY = interpolate(frame, [226, 268], [18, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const vignette = interpolate(frame, [0, 60], [0.55, 0.92], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: THEME.colors.bgBase,
        overflow: "hidden",
        fontFamily: THEME.fonts.sans,
      }}
    >
      <NoiseOverlay opacity={noiseOpacity} />

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
          background: `radial-gradient(ellipse 78% 64% at 50% 36%, rgba(110,231,183,${vignette * 0.065}) 0%, transparent 72%)`,
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
          gap: 22,
          padding: "0 96px",
        }}
      >
        <Sequence from={LOGO_BLOCK_FROM} durationInFrames={LOGO_BLOCK_DURATION} layout="none">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
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
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 200 + logoGlow * 2,
                  height: 200 + logoGlow * 2,
                  borderRadius: THEME.radius.full,
                  background: THEME.colors.primaryGlow,
                  filter: `blur(${logoGlow}px)`,
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
                Croq
                <span style={{ color: THEME.colors.primary }}>Tile</span>
              </span>
            </div>

            {/* Main title */}
            <h1
              style={{
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
                margin: 0,
                maxWidth: 1180,
                textAlign: "center",
                fontSize: THEME.fontSize["2xl"],
                fontWeight: 700,
                lineHeight: 1.18,
                color: THEME.colors.textPrimary,
                letterSpacing: "-0.02em",
              }}
            >
              Welcome to the New Era of Compute Programming
            </h1>

            {/* Subtitle */}
            <p
              style={{
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px)`,
                margin: 0,
                maxWidth: 820,
                textAlign: "center",
                fontSize: THEME.fontSize.lg,
                lineHeight: 1.45,
                color: THEME.colors.textSecondary,
                fontWeight: 450,
              }}
            >
              Your kernel development productivity deserves to be redefined
            </p>
          </div>
        </Sequence>

        <Sequence from={CTA_FROM} durationInFrames={CTA_DURATION} layout="none">
          <div
            style={{
              marginTop: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                opacity: ctaOpacity,
                transform: `translateY(${ctaY}px)`,
                padding: "16px 36px",
                borderRadius: THEME.radius.lg,
                fontFamily: THEME.fonts.sans,
                fontSize: THEME.fontSize.base,
                fontWeight: 600,
                letterSpacing: "0.01em",
                color: THEME.colors.bgBase,
                background: `linear-gradient(130deg, ${THEME.colors.primary} 0%, #34D399 100%)`,
                boxShadow: `${THEME.shadows.glow}, ${THEME.shadows.inset}`,
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              Get Started → lancerlab.github.io/croqtile-tutorial
            </div>

            <div
              style={{
                opacity: githubOpacity,
                transform: `translateY(${githubY}px)`,
                padding: "10px 20px",
                borderRadius: THEME.radius.full,
                fontFamily: THEME.fonts.mono,
                fontSize: THEME.fontSize.sm,
                color: THEME.colors.textSecondary,
                background: THEME.colors.bgCard,
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: THEME.shadows.card,
                letterSpacing: "0.04em",
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
