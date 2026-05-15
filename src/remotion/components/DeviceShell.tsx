/**
 * remotion/components/DeviceShell.tsx
 * 通用设备外壳 — macOS 风格深色窗口
 * 用于包裹代码块、终端输出、浏览器 UI 等"屏幕内内容"
 */
import React from "react";
import { THEME } from "../theme";

interface DeviceShellProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  title?: string;
  style?: React.CSSProperties;
}

const TRAFFIC_LIGHT_COLORS = ["#FF5F57", "#FFBD2E", "#28C840"];

export const DeviceShell: React.FC<DeviceShellProps> = ({
  children,
  width = 1200,
  height = 700,
  title = "",
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: THEME.radius.lg,
        background: THEME.colors.bgCard,
        boxShadow: `${THEME.shadows.card}, ${THEME.shadows.inset}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 40,
          background: THEME.colors.bgElevated,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          flexShrink: 0,
          borderBottom: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        {/* Traffic lights */}
        {TRAFFIC_LIGHT_COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: THEME.radius.full,
              background: color,
              opacity: 0.85,
            }}
          />
        ))}

        {/* Title */}
        {title && (
          <span
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: THEME.fontSize.sm,
              color: THEME.colors.textMuted,
              fontFamily: THEME.fonts.mono,
              letterSpacing: "0.02em",
            }}
          >
            {title}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
};
