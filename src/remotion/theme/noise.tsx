/**
 * remotion/theme/noise.ts
 * 背景噪点纹理 — SVG feTurbulence 实现，纯 CSS 无需图片资源
 */
import React from "react";
import { THEME } from "./index";

interface NoiseOverlayProps {
  opacity?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
}

/**
 * 叠加在场景最底层，给暗色背景加细腻颗粒感（Vibero 常见手法）
 */
export const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
  opacity = 0.04,
  blendMode = "overlay",
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        opacity,
        mixBlendMode: blendMode,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

/**
 * 场景根容器：全屏 + 背景色 + 噪点
 */
export const SceneBase: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      width: THEME.video.width,
      height: THEME.video.height,
      background: THEME.colors.bgBase,
      position: "relative",
      overflow: "hidden",
      fontFamily: THEME.fonts.sans,
      ...style,
    }}
  >
    <NoiseOverlay />
    {children}
  </div>
);
