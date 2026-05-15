/**
 * VoiceSampler.tsx
 * 临时组件 — 在 Remotion Studio 中对比不同 TTS 语音
 * 每个样本播放相同的两句话，之间有 2 秒间隔
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

const SAMPLE_DUR = 15 * 30;
const GAP = 2 * 30;

const CN_SAMPLES = [
  { file: "sample-cn-yunxi-normal", label: "#1 云曦 YunxiNeural ♂ 活泼阳光 (当前)" },
  { file: "sample-cn-yunxi-slow", label: "#2 云曦 YunxiNeural ♂ 活泼阳光 (慢速)" },
  { file: "sample-cn-yunyang-normal", label: "#3 云扬 YunyangNeural ♂ 专业可靠" },
  { file: "sample-cn-yunyang-slow", label: "#4 云扬 YunyangNeural ♂ 专业可靠 (慢速)" },
  { file: "sample-cn-yunjian-normal", label: "#5 云健 YunjianNeural ♂ 激情有力" },
  { file: "sample-cn-xiaoxiao-normal", label: "#6 晓晓 XiaoxiaoNeural ♀ 温暖亲切" },
  { file: "sample-cn-xiaoxiao-slow", label: "#7 晓晓 XiaoxiaoNeural ♀ 温暖亲切 (慢速)" },
  { file: "sample-cn-xiaoyi-normal", label: "#8 晓伊 XiaoyiNeural ♀ 活泼" },
  { file: "sample-cn-yunxia-normal", label: "#9 云夏 YunxiaNeural ♂ 可爱少年" },
];

const EN_SAMPLES = [
  { file: "sample-en-eric-normal", label: "#1 Eric 🇺🇸 Rational (edge-tts)" },
  { file: "sample-en-eric-slow", label: "#2 Eric 🇺🇸 Rational slow (edge-tts)" },
  { file: "sample-en-ryan-gb", label: "#3 Ryan 🇬🇧 British (edge-tts)" },
  { file: "sample-en-ryan-gb-slow", label: "#4 Ryan 🇬🇧 British slow (edge-tts)" },
  { file: "sample-piper-alan-gb", label: "#5 Alan 🇬🇧 British (piper-tts, local)" },
  { file: "sample-piper-northern-gb", label: "#6 Northern Male 🇬🇧 North England (piper-tts)" },
];

const SamplerInner: React.FC<{ samples: typeof CN_SAMPLES; lang: string }> = ({ samples, lang }) => {
  const frame = useCurrentFrame();
  const segLen = SAMPLE_DUR + GAP;
  const activeIdx = Math.floor(frame / segLen);
  const active = samples[Math.min(activeIdx, samples.length - 1)];

  return (
    <AbsoluteFill
      style={{
        background: THEME.colors.bgBase,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 30,
        fontFamily: THEME.fonts.sans,
      }}
    >
      <div style={{ fontSize: 18, color: THEME.colors.textMuted, fontFamily: THEME.fonts.mono }}>
        Voice Sampler ({lang}) — {activeIdx + 1}/{samples.length}
      </div>

      <div style={{ fontSize: 32, fontWeight: 700, color: THEME.colors.primary, textAlign: "center" }}>
        {active?.label}
      </div>

      <div style={{ fontSize: 22, color: THEME.colors.textSecondary, maxWidth: 1000, textAlign: "center", lineHeight: 1.6 }}>
        Same text for all samples — listen and compare voices
      </div>

      <div style={{ position: "absolute", bottom: 60, fontSize: 16, color: THEME.colors.textMuted, fontFamily: THEME.fonts.mono }}>
        {(frame / 30).toFixed(1)}s — Sample {activeIdx + 1} of {samples.length}
      </div>

      {samples.map((s, i) => (
        <Sequence key={s.file} from={i * segLen} layout="none">
          <Audio src={staticFile(`voiceover/samples/${s.file}.mp3`)} volume={0.9} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const VoiceSamplerCN: React.FC = () => <SamplerInner samples={CN_SAMPLES} lang="CN" />;
export const VoiceSamplerEN: React.FC = () => <SamplerInner samples={EN_SAMPLES} lang="EN" />;

export const SAMPLER_CN_DURATION = CN_SAMPLES.length * (SAMPLE_DUR + GAP);
export const SAMPLER_EN_DURATION = EN_SAMPLES.length * (SAMPLE_DUR + GAP);
