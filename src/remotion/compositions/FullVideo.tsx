/**
 * remotion/compositions/FullVideo.tsx
 * 完整视频 — 将所有段落按脚本顺序拼接
 *
 * 时间轴 (v5 — rate=+0%, 8f gaps):
 *   0:00–0:12.7  段 0  PainPoint        (382f)
 *   0:12.7–0:50.5 段 1  IterativeDev    (1135f)
 *   0:50.5–1:37.9 段 2  FeatureSpotlight(1420f)
 *   1:37.9–2:00.4 段 3  PerfChart       (675f)
 *   2:00.4–2:43.7 段 4  CompileTimeSafety(1301f)
 *   2:43.7–3:17.0 段 5  HeterogeneousCompute (998f)
 *   3:17.0–5:29.3 段 6  AINative        (3760f)
 *   5:29.3–5:36.5 段 7  OutroCTA        (215f)
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
  { id: "PainPoint", component: PainPoint, duration: 382 },
  { id: "IterativeDev", component: IterativeDev, duration: 1135 },
  { id: "FeatureSpotlight", component: FeatureSpotlight, duration: 1420 },
  { id: "PerfChart", component: PerfChart, duration: 675 },
  { id: "CompileTimeSafety", component: CompileTimeSafety, duration: 1301 },
  { id: "HeterogeneousCompute", component: HeterogeneousCompute, duration: 998 },
  { id: "AINative", component: AINative, duration: 3760 },
  { id: "OutroCTA", component: OutroCTA, duration: 215 },
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
