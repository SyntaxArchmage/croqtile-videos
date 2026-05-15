/**
 * remotion/compositions/HeroIntro.tsx
 * 段 1 — CroqTile Logo reveal  0:30–0:48 (18 s = 540 帧 @30fps)
 *
 * 节奏：
 *  0–15f   背景渐显
 *  15–45f  Logo 从中心缩放入场 + 绿色辉光
 *  45–90f  Tagline 逐词出现
 *  90–150f 副标题淡入
 *  150+    静止保持
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../theme";
import { NoiseOverlay } from "../theme/noise";

export const HeroIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale + opacity
  const logoScale = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
    from: 0.6,
    to: 1,
  });
  const logoOpacity = interpolate(frame, [15, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse (after 45f)
  const glowSize = interpolate(
    frame,
    [45, 90, 135, 180],
    [0, 48, 32, 40],
    { extrapolateRight: "clamp" }
  );

  // Tagline (每 12 帧一个词)
  const taglineWords = ["Zero-cost", "abstractions.", "GPU-native", "safety."];
  const taglineStart = 45;

  // Subtitle
  const subtitleOpacity = interpolate(frame, [120, 150], [0, 1], {
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
        fontFamily: THEME.fonts.sans,
      }}
    >
      <NoiseOverlay />

      {/* Logo block */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          position: "relative",
        }}
      >
        {/* Glow disc */}
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

        {/* Logo text */}
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
          const wordStart = taglineStart + i * 12;
          const opacity = interpolate(
            frame,
            [wordStart, wordStart + 8],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );
          const y = interpolate(frame, [wordStart, wordStart + 12], [12, 0], {
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
                  i % 2 === 0
                    ? THEME.colors.textPrimary
                    : THEME.colors.primary,
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
        CroqTile · High-performance GPU kernel DSL
      </p>
    </AbsoluteFill>
  );
};
