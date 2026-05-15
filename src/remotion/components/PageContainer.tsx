/**
 * remotion/components/PageContainer.tsx
 * 通用页面容器 — 居中布局 + 可选标题 + padding
 * 所有场景的基础包裹层
 */
import React from "react";
import { THEME } from "../theme";
import { SceneBase } from "../theme/noise";

interface PageContainerProps {
  children: React.ReactNode;
  /** 左上角小标签（段号或功能名），可选 */
  tag?: string;
  /** 主标题，可选 */
  title?: string;
  /** 副标题 / 英文小字，可选 */
  subtitle?: string;
  /** 强制覆盖背景色 */
  bg?: string;
  style?: React.CSSProperties;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  tag,
  title,
  subtitle,
  bg,
  style,
}) => {
  return (
    <SceneBase style={bg ? { background: bg } : undefined}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "72px 96px",
          zIndex: 1,
          ...style,
        }}
      >
        {/* Section tag */}
        {tag && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: THEME.radius.full,
                background: THEME.colors.primary,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: THEME.fontSize.sm,
                color: THEME.colors.primary,
                fontFamily: THEME.fonts.mono,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {tag}
            </span>
          </div>
        )}

        {/* Main title */}
        {title && (
          <h1
            style={{
              fontSize: THEME.fontSize["3xl"],
              color: THEME.colors.textPrimary,
              fontFamily: THEME.fonts.sans,
              fontWeight: 700,
              lineHeight: 1.15,
              margin: 0,
              marginBottom: 12,
            }}
          >
            {title}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontSize: THEME.fontSize.lg,
              color: THEME.colors.textSecondary,
              margin: 0,
              marginBottom: 40,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Main content */}
        {children}
      </div>
    </SceneBase>
  );
};
