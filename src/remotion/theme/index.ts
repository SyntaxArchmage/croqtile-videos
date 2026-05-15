/**
 * remotion/theme/index.ts
 * 全局主题变量 — Vibero 风格
 * 所有场景共用此文件，不要在场景内 hardcode 颜色/字号
 */

export const THEME = {
  // ── 色板 ────────────────────────────────────────────────────────────────
  colors: {
    // 主色：薄荷绿 (CroqTile brand)
    primary:        "#6EE7B7",   // emerald-300
    primaryDark:    "#059669",   // emerald-600
    primaryGlow:    "rgba(110,231,183,0.25)",

    // 背景
    bgBase:         "#0A0E1A",   // 深蓝黑
    bgCard:         "#111827",   // gray-900
    bgElevated:     "#1F2937",   // gray-800

    // 文字
    textPrimary:    "#F9FAFB",   // gray-50
    textSecondary:  "#9CA3AF",   // gray-400
    textMuted:      "#4B5563",   // gray-600
    textCode:       "#A7F3D0",   // emerald-200

    // 强调
    accent:         "#818CF8",   // indigo-400 (for annotations)
    accentWarm:     "#FCD34D",   // amber-300  (for highlights)
    danger:         "#F87171",   // red-400    (for error states)
  },

  // ── 字体 ────────────────────────────────────────────────────────────────
  fonts: {
    // 正文 + UI 文字
    sans:           "'Inter', 'PingFang SC', 'Noto Sans SC', sans-serif",
    // 代码块
    mono:           "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },

  // ── 字号 ────────────────────────────────────────────────────────────────
  fontSize: {
    xs:    12,
    sm:    14,
    base:  16,
    lg:    20,
    xl:    28,
    "2xl": 38,
    "3xl": 52,
    "4xl": 72,
  },

  // ── 圆角 ────────────────────────────────────────────────────────────────
  radius: {
    sm:   6,
    md:   12,
    lg:   20,
    xl:   32,
    full: 9999,
  },

  // ── 阴影 / 辉光 (CSS box-shadow) ────────────────────────────────────────
  shadows: {
    card:    "0 4px 24px rgba(0,0,0,0.5)",
    glow:    "0 0 32px rgba(110,231,183,0.3)",
    glowSm:  "0 0 12px rgba(110,231,183,0.2)",
    inset:   "inset 0 1px 0 rgba(255,255,255,0.06)",
  },

  // ── 动画时长（帧，30fps）──────────────────────────────────────────────
  // 使用帧数而非毫秒，配合 Remotion interpolate
  timing: {
    fastest: 6,   //  0.2 s
    fast:    9,   //  0.3 s
    normal:  15,  //  0.5 s
    slow:    24,  //  0.8 s
    slower:  45,  //  1.5 s
  },

  // ── 视频规格 ────────────────────────────────────────────────────────────
  video: {
    width:  1920,
    height: 1080,
    fps:    30,
    // 总时长 5:30
    durationInFrames: 9900,
  },
} as const;

export type Theme = typeof THEME;
