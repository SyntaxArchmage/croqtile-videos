/**
 * remotion/components/Subtitle.tsx
 * Bilingual subtitles (Chinese + English) with optional keyword highlighting.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";

import { THEME } from "../theme";

interface SubtitleCue {
  startFrame: number;
  endFrame: number;
  textCN: string;
  textEN: string;
  highlights?: string[];
}

interface SubtitleProps {
  cues: SubtitleCue[];
}

export type { SubtitleCue, SubtitleProps };

const HIGHLIGHT_SHADOW = `0 0 12px ${THEME.colors.primaryGlow}, 0 0 4px rgba(110,231,183,0.85)`;

const FADE_FRAMES = 8;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mergeIntervals(intervals: [number, number][]): [number, number][] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    const prev = merged[merged.length - 1];
    if (start <= prev[1]) {
      prev[1] = Math.max(prev[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

function collectHighlightIntervals(
  fullText: string,
  keywords: string[] | undefined,
): [number, number][] {
  if (!keywords?.length || !fullText) return [];

  const raw: [number, number][] = [];
  for (const keyword of keywords) {
    const trimmed = keyword.trim();
    if (!trimmed) continue;

    const re = new RegExp(escapeRegExp(trimmed), "gi");
    let match: RegExpExecArray | null;
    while ((match = re.exec(fullText)) !== null) {
      raw.push([match.index, match.index + match[0].length]);
      // Avoid infinite loop when regex matches zero-width (not expected here)
      if (match.index === re.lastIndex) {
        re.lastIndex++;
      }
    }
  }

  return mergeIntervals(raw);
}

/** Wraps substring matches from `highlights` in a mint-colored span with a soft glow */
function renderWithHighlights(
  text: string,
  highlights: string[] | undefined,
): React.ReactNode {
  const merged = collectHighlightIntervals(text, highlights);

  if (merged.length === 0) return text;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  merged.forEach(([start, end], index) => {
    if (cursor < start) {
      nodes.push(text.slice(cursor, start));
    }
    nodes.push(
      <span
        key={`hl-${start}-${end}-${index}`}
        style={{
          color: THEME.colors.primary,
          textShadow: HIGHLIGHT_SHADOW,
        }}
      >
        {text.slice(start, end)}
      </span>,
    );
    cursor = end;
  });
  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }
  return nodes;
}

function cueOpacity(frame: number, startFrame: number, endFrame: number): number {
  const cueLen = endFrame - startFrame;
  const fade = Math.min(FADE_FRAMES, Math.max(1, Math.floor(cueLen / 2)));
  const fadeInEnd = startFrame + fade;
  const fadeOutStart = endFrame - fade;

  if (fadeOutStart <= fadeInEnd) {
    return interpolate(
      frame,
      [startFrame, (startFrame + endFrame) / 2, endFrame],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  }

  if (frame < fadeInEnd) {
    return interpolate(frame, [startFrame, fadeInEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (frame >= fadeOutStart) {
    return interpolate(frame, [fadeOutStart, endFrame], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return 1;
}

const stripBaseStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: THEME.radius.md,
  padding: "18px 32px",
  fontFamily: THEME.fonts.sans,
  textAlign: "center",
};

const cnRowStyle: React.CSSProperties = {
  fontSize: 36,
  lineHeight: 1.4,
  fontWeight: 500,
  color: THEME.colors.textPrimary,
  marginBottom: 10,
};

const enRowStyle: React.CSSProperties = {
  fontSize: 28,
  lineHeight: 1.45,
  color: THEME.colors.textSecondary,
};

export const Subtitle: React.FC<SubtitleProps> = ({ cues }) => {
  const frame = useCurrentFrame();

  const active = cues.find(
    (c) => frame >= c.startFrame && frame < c.endFrame,
  );

  const opacity = active
    ? cueOpacity(frame, active.startFrame, active.endFrame)
    : 0;

  if (!active || opacity === 0) {
    return null;
  }

  const cnContent = renderWithHighlights(active.textCN, active.highlights);
  const enContent = renderWithHighlights(active.textEN, active.highlights);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 56,
        paddingLeft: 80,
        paddingRight: 80,
        zIndex: 100,
      }}
    >
      <div
        style={{
          ...stripBaseStyle,
          opacity,
          width: "100%",
          maxWidth: Math.min(THEME.video.width - 160, 1600),
          boxSizing: "border-box",
        }}
      >
        <div style={cnRowStyle}>{cnContent}</div>
        <div style={enRowStyle}>{enContent}</div>
      </div>
    </AbsoluteFill>
  );
};
