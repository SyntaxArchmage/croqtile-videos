/**
 * remotion/compositions/FullVideo.tsx
 * 完整视频 — 将所有段落按脚本顺序拼接
 *
 * 时间轴 (v3 — aligned to SCRIPT-v1.md VO durations):
 *   0:00–0:15    段 0  PainPoint        (460f)
 *   0:15–1:04    段 1  IterativeDev     (1470f)
 *   1:04–1:53    段 2  FeatureSpotlight (1470f)
 *   1:53–2:19    段 3  PerfChart        (770f)
 *   2:19–3:06    段 4  CompileTimeSafety(1430f)
 *   3:06–3:43    段 5  HeterogeneousCompute (1120f)
 *   3:43–5:52    段 6  AINative         (3880f)
 *   6:18–6:28    段 7  OutroCTA         (300f)
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { THEME } from "../theme";
import { PainPoint } from "./PainPoint";
import { IterativeDev } from "./IterativeDev";
import { FeatureSpotlight } from "./FeatureSpotlight";
import { PerfChart } from "./PerfChart";
import { CompileTimeSafety } from "./CompileTimeSafety";
import { HeterogeneousCompute } from "./HeterogeneousCompute";
import { AINative } from "./AINative";
import { OutroCTA } from "./OutroCTA";
import { Subtitle } from "../components/Subtitle";
import { SUBTITLES } from "../data/subtitles";
import { getVoiceoverCues } from "../data/voiceover";

const SEGMENTS = [
  { id: "PainPoint", component: PainPoint, duration: 460 },
  { id: "IterativeDev", component: IterativeDev, duration: 1470 },
  { id: "FeatureSpotlight", component: FeatureSpotlight, duration: 1470 },
  { id: "PerfChart", component: PerfChart, duration: 770 },
  { id: "CompileTimeSafety", component: CompileTimeSafety, duration: 1430 },
  { id: "HeterogeneousCompute", component: HeterogeneousCompute, duration: 1120 },
  { id: "AINative", component: AINative, duration: 3880 },
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
