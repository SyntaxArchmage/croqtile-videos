/**
 * remotion/compositions/FullVideo.tsx
 * 完整视频 — 将所有段落按脚本顺序拼接
 *
 * 时间轴 (v2):
 *   0:00–0:14    段 0  PainPoint       (439f)  前两句话
 *   0:14–1:01    段 1  IterativeDev    (1393f) 迭代开发 + CroqTile揭晓
 *   1:01–1:47    段 2  FeatureSpotlight(1390f)
 *   1:47–2:12    段 3  PerfChart       (750f)
 *   2:13–2:43    段 4  CompileTimeSafety(900f)
 *   2:43–3:13    段 5  DynamicShape    (900f)
 *   3:13–5:48    段 6  AINative        (4650f)
 *   5:48–5:58    段 7  OutroCTA        (300f)
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { THEME } from "../theme";
import { PainPoint } from "./PainPoint";
import { IterativeDev } from "./IterativeDev";
import { FeatureSpotlight } from "./FeatureSpotlight";
import { PerfChart } from "./PerfChart";
import { CompileTimeSafety } from "./CompileTimeSafety";
import { DynamicShape } from "./DynamicShape";
import { AINative } from "./AINative";
import { OutroCTA } from "./OutroCTA";
import { Subtitle } from "../components/Subtitle";
import { SUBTITLES } from "../data/subtitles";
import { getVoiceoverCues } from "../data/voiceover";

const SEGMENTS = [
  { id: "PainPoint", component: PainPoint, duration: 439 },
  { id: "IterativeDev", component: IterativeDev, duration: 1393 },
  { id: "FeatureSpotlight", component: FeatureSpotlight, duration: 1390 },
  { id: "PerfChart", component: PerfChart, duration: 750 },
  { id: "CompileTimeSafety", component: CompileTimeSafety, duration: 900 },
  { id: "DynamicShape", component: DynamicShape, duration: 900 },
  { id: "AINative", component: AINative, duration: 4650 },
  { id: "OutroCTA", component: OutroCTA, duration: 300 },
] as const;

export const FULL_VIDEO_DURATION = SEGMENTS.reduce(
  (sum, s) => sum + s.duration,
  0,
);

interface FullVideoProps {
  lang?: "cn" | "en" | "none";
}

const FullVideoInner: React.FC<FullVideoProps> = ({ lang = "none" }) => {
  let offset = 0;
  const voiceoverCues = lang !== "none" ? getVoiceoverCues(lang) : [];

  return (
    <AbsoluteFill style={{ background: THEME.colors.bgBase }}>
      {SEGMENTS.map((seg) => {
        const from = offset;
        offset += seg.duration;
        const Comp = seg.component;
        return (
          <Sequence
            key={seg.id}
            from={from}
            durationInFrames={seg.duration}
            name={seg.id}
          >
            <Comp />
          </Sequence>
        );
      })}
      <Subtitle cues={SUBTITLES} />
      {voiceoverCues.map((cue) => (
        <Sequence key={cue.id} from={cue.startFrame} layout="none">
          <Audio src={staticFile(cue.file)} volume={0.9} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const FullVideo: React.FC = () => <FullVideoInner lang="none" />;
export const FullVideoCN: React.FC = () => <FullVideoInner lang="cn" />;
export const FullVideoEN: React.FC = () => <FullVideoInner lang="en" />;
