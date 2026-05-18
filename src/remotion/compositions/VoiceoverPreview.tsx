/**
 * VoiceoverPreview.tsx
 * 临时预览组件 — 用于在 Remotion Studio 中试听 Seg 0+1 配音
 */
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { THEME } from "../theme";

const CUES = [
  { id: "seg0-01", cn: "写一个生产级 GPU 计算核，需要多长时间？", dur: 5.0 },
  { id: "seg0-02", cn: "FlashAttention、Blockscale Gemm 这样的算子，顶尖专家也要花上几个星期来实现与调优。", dur: 7.8 },
  { id: "seg1-01", cn: "这不仅仅是因为实现复杂、代码行数多。", dur: 5.2 },
  { id: "seg1-02", cn: "而是因为一个生产级计算核，需要经过多轮编写、编译调试、性能剖析、参数调优的完整迭代，才能逐步逼近生产级性能。", dur: 11.2 },
  { id: "seg1-03", cn: "这个过程不仅需要扎实的编程能力，还需要深厚的硬件知识与丰富的性能优化经验。", dur: 8.2 },
  { id: "seg1-04", cn: "这些门槛，大大限制了计算核的开发效率。", dur: 4.8 },
  { id: "seg1-05", cn: "所以我们造了 CroqTile——新一代 GPU 和 DSA 内核编程语言，5 倍生产力，为 AI 时代而生。", dur: 9.8 },
];

const GAP = 0.8;

interface VoiceoverPreviewProps {
  lang?: "cn" | "en";
}

export const VoiceoverPreviewCN: React.FC = () => <VoiceoverPreviewInner lang="cn" />;
export const VoiceoverPreviewEN: React.FC = () => <VoiceoverPreviewInner lang="en" />;

const VoiceoverPreviewInner: React.FC<VoiceoverPreviewProps> = ({ lang = "cn" }) => {
  const frame = useCurrentFrame();

  let offset = 0;
  const cueTimeline = CUES.map((cue) => {
    const startFrame = Math.round(offset * 30);
    const durFrames = Math.round((cue.dur + GAP) * 30);
    offset += cue.dur + GAP;
    return { ...cue, startFrame, durFrames };
  });

  const activeCue = cueTimeline.find(
    (c) => frame >= c.startFrame && frame < c.startFrame + c.durFrames
  );

  return (
    <AbsoluteFill
      style={{
        background: THEME.colors.bgBase,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
        fontFamily: THEME.fonts.sans,
      }}
    >
      <div
        style={{
          fontSize: 20,
          color: THEME.colors.textMuted,
          fontFamily: THEME.fonts.mono,
        }}
      >
        Voiceover Preview ({lang.toUpperCase()}) — Seg 0 + Seg 1
      </div>

      {activeCue && (
        <div
          style={{
            maxWidth: 1200,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: THEME.colors.primary,
              marginBottom: 12,
              fontFamily: THEME.fonts.mono,
            }}
          >
            {activeCue.id} · {Math.round(activeCue.startFrame / 30)}s
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: THEME.colors.textPrimary,
              lineHeight: 1.5,
            }}
          >
            {activeCue.cn}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 16,
          color: THEME.colors.textMuted,
          fontFamily: THEME.fonts.mono,
        }}
      >
        {(frame / 30).toFixed(1)}s / {(offset).toFixed(1)}s
      </div>

      {cueTimeline.map((cue) => (
        <Sequence key={cue.id} from={cue.startFrame} layout="none">
          <Audio src={staticFile(`voiceover/${lang}/${cue.id}.mp3`)} volume={0.9} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const VOICEOVER_PREVIEW_DURATION = Math.round(
  CUES.reduce((sum, c) => sum + c.dur + GAP, 0) * 30
);
