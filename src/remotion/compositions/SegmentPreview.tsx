/**
 * SegmentPreview.tsx
 * Standalone preview wrappers for individual segments with embedded voiceover.
 * Renders much faster than FullVideo since only the target segment is included.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { PainPoint } from "./PainPoint";
import { IterativeDev } from "./IterativeDev";
import { FeatureSpotlight } from "./FeatureSpotlight";
import { PerfChart } from "./PerfChart";
import { CompileTimeSafety } from "./CompileTimeSafety";
import { HeterogeneousCompute } from "./HeterogeneousCompute";
import { AINative } from "./AINative";
import { OutroCTA } from "./OutroCTA";
import { Subtitle, type SubtitleCue } from "../components/Subtitle";
import { SUBTITLES } from "../data/subtitles";

const SEG0_DURATION = 439;
const SEG1_DURATION = 1393;
const SEG2_DURATION = 1390;
const SEG3_DURATION = 750;
const SEG4_DURATION = 1430;
const SEG5_DURATION = 1120;
const SEG6_DURATION = 3880;
const SEG7_DURATION = 300;

const SEG0_CUES = ["seg0-01", "seg0-02"];
const SEG1_CUES = ["seg1-01", "seg1-02", "seg1-03", "seg1-04", "seg1-05"];
const _SEG2_CUES = ["seg2-01", "seg2-02", "seg2-03"];
const _SEG3_CUES = ["seg3-01", "seg3-02", "seg3-03"];

const SEG0_VO_FRAMES: [string, number][] = [
  ["seg0-01", 0],
  ["seg0-02", 165],
];

const SEG1_VO_FRAMES: [string, number][] = [
  ["seg1-01", 0],
  ["seg1-02", 166],
  ["seg1-03", 557],
  ["seg1-04", 848],
  ["seg1-05", 994],
];

const SEG2_VO_FRAMES: [string, number][] = [
  ["seg2-01", 0],
  ["seg2-02", 510],
  ["seg2-03", 1100],
];

const SEG3_VO_FRAMES: [string, number][] = [
  ["seg3-01", 0],
  ["seg3-02", 250],
  ["seg3-03", 500],
];

const SEG4_VO_FRAMES: [string, number][] = [
  ["seg4-01", 20],
  ["seg4-02", 210],
  ["seg4-03", 640],
  ["seg4-04", 1000],
];

const SEG5_VO_FRAMES: [string, number][] = [
  ["seg5-01", 10],
  ["seg5-02", 490],
];

const SEG6_VO_FRAMES: [string, number][] = [
  ["seg6-01", 20],
  ["seg6-02", 274],
  ["seg6-03", 497],
  ["seg6-04", 768],
  ["seg6-05", 1017],
  ["seg6-06", 1276],
  ["seg6-07", 1542],
  ["seg6-08", 1785],
  ["seg6-09", 2144],
  ["seg6-10", 2369],
  ["seg6-11", 2677],
  ["seg6-12", 2927],
  ["seg6-13", 3626],
  ["seg6-14", 3768],
];

const SEG7_VO_FRAMES: [string, number][] = [
  ["seg7-01", 40],
];

function sliceSubtitlesEarly(
  timelineStart: number,
  duration: number,
): SubtitleCue[] {
  return SUBTITLES.filter(
    (sub) => sub.startFrame >= timelineStart && sub.startFrame < timelineStart + duration,
  ).map((sub) => ({
    ...sub,
    startFrame: sub.startFrame - timelineStart,
    endFrame: sub.endFrame - timelineStart,
  }));
}

const seg0Subs = sliceSubtitlesEarly(0, SEG0_DURATION);
const seg1Subs = sliceSubtitlesEarly(SEG0_DURATION, SEG1_DURATION);
const SEG2_TIMELINE_START = SEG0_DURATION + SEG1_DURATION;
const SEG3_TIMELINE_START = SEG2_TIMELINE_START + SEG2_DURATION;
const seg2Subs = sliceSubtitlesEarly(SEG2_TIMELINE_START, SEG2_DURATION);
const seg3Subs = sliceSubtitlesEarly(SEG3_TIMELINE_START, SEG3_DURATION);

const seg4Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= 3972 && sub.startFrame < 3972 + SEG4_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - 3972,
  endFrame: sub.endFrame - 3972,
}));

const SEG5_TIMELINE_START = 5402;
const seg5Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= SEG5_TIMELINE_START && sub.startFrame < SEG5_TIMELINE_START + SEG5_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - SEG5_TIMELINE_START,
  endFrame: sub.endFrame - SEG5_TIMELINE_START,
}));

const SEG6_TIMELINE_START = 6720;
const seg6Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= SEG6_TIMELINE_START && sub.startFrame < SEG6_TIMELINE_START + SEG6_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - SEG6_TIMELINE_START,
  endFrame: sub.endFrame - SEG6_TIMELINE_START,
}));

const SEG7_TIMELINE_START = 11172;
const seg7Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= SEG7_TIMELINE_START && sub.startFrame < SEG7_TIMELINE_START + SEG7_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - SEG7_TIMELINE_START,
  endFrame: sub.endFrame - SEG7_TIMELINE_START,
}));

interface SegPreviewProps {
  lang: "cn" | "en";
}

export const Seg0PreviewInner: React.FC<SegPreviewProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <PainPoint />
    <Subtitle cues={seg0Subs} />
    {SEG0_VO_FRAMES.map(([id, frame]) => (
      <Sequence key={id} from={frame} layout="none">
        <Audio src={staticFile(`voiceover/${lang}/${id}.mp3`)} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Seg1PreviewInner: React.FC<SegPreviewProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: "#0A0E1A" }}>
    <IterativeDev />
    <Subtitle cues={seg1Subs} />
    {SEG1_VO_FRAMES.map(([id, frame]) => (
      <Sequence key={id} from={frame} layout="none">
        <Audio src={staticFile(`voiceover/${lang}/${id}.mp3`)} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Seg2PreviewInner: React.FC<SegPreviewProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: "#0A0E1A" }}>
    <FeatureSpotlight />
    <Subtitle cues={seg2Subs} />
    {SEG2_VO_FRAMES.map(([id, frame]) => (
      <Sequence key={id} from={frame} layout="none">
        <Audio src={staticFile(`voiceover/${lang}/${id}.mp3`)} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Seg0PreviewCN: React.FC = () => <Seg0PreviewInner lang="cn" />;
export const Seg0PreviewEN: React.FC = () => <Seg0PreviewInner lang="en" />;
export const Seg1PreviewCN: React.FC = () => <Seg1PreviewInner lang="cn" />;
export const Seg1PreviewEN: React.FC = () => <Seg1PreviewInner lang="en" />;
export const Seg3PreviewInner: React.FC<SegPreviewProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: "#0A0E1A" }}>
    <PerfChart />
    <Subtitle cues={seg3Subs} />
    {SEG3_VO_FRAMES.map(([id, frame]) => (
      <Sequence key={id} from={frame} layout="none">
        <Audio src={staticFile(`voiceover/${lang}/${id}.mp3`)} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Seg2PreviewCN: React.FC = () => <Seg2PreviewInner lang="cn" />;
export const Seg2PreviewEN: React.FC = () => <Seg2PreviewInner lang="en" />;
export const Seg3PreviewCN: React.FC = () => <Seg3PreviewInner lang="cn" />;
export const Seg3PreviewEN: React.FC = () => <Seg3PreviewInner lang="en" />;

export const Seg4PreviewInner: React.FC<SegPreviewProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: "#0A0E1A" }}>
    <CompileTimeSafety />
    <Subtitle cues={seg4Subs} />
    {SEG4_VO_FRAMES.map(([id, frame]) => (
      <Sequence key={id} from={frame} layout="none">
        <Audio src={staticFile(`voiceover/${lang}/${id}.mp3`)} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Seg5PreviewInner: React.FC<SegPreviewProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: "#0A0E1A" }}>
    <HeterogeneousCompute />
    <Subtitle cues={seg5Subs} />
    {SEG5_VO_FRAMES.map(([id, frame]) => (
      <Sequence key={id} from={frame} layout="none">
        <Audio src={staticFile(`voiceover/${lang}/${id}.mp3`)} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Seg6PreviewInner: React.FC<SegPreviewProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: "#0A0E1A" }}>
    <AINative />
    <Subtitle cues={seg6Subs} />
    {SEG6_VO_FRAMES.map(([id, frame]) => (
      <Sequence key={id} from={frame} layout="none">
        <Audio src={staticFile(`voiceover/${lang}/${id}.mp3`)} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Seg7PreviewInner: React.FC<SegPreviewProps> = ({ lang }) => (
  <AbsoluteFill style={{ background: "#0A0E1A" }}>
    <OutroCTA />
    <Subtitle cues={seg7Subs} />
    {SEG7_VO_FRAMES.map(([id, frame]) => (
      <Sequence key={id} from={frame} layout="none">
        <Audio src={staticFile(`voiceover/${lang}/${id}.mp3`)} volume={0.9} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const Seg4PreviewCN: React.FC = () => <Seg4PreviewInner lang="cn" />;
export const Seg4PreviewEN: React.FC = () => <Seg4PreviewInner lang="en" />;
export const Seg5PreviewCN: React.FC = () => <Seg5PreviewInner lang="cn" />;
export const Seg5PreviewEN: React.FC = () => <Seg5PreviewInner lang="en" />;
export const Seg6PreviewCN: React.FC = () => <Seg6PreviewInner lang="cn" />;
export const Seg6PreviewEN: React.FC = () => <Seg6PreviewInner lang="en" />;
export const Seg7PreviewCN: React.FC = () => <Seg7PreviewInner lang="cn" />;
export const Seg7PreviewEN: React.FC = () => <Seg7PreviewInner lang="en" />;

export {
  SEG0_DURATION,
  SEG1_DURATION,
  SEG2_DURATION,
  SEG3_DURATION,
  SEG4_DURATION,
  SEG5_DURATION,
  SEG6_DURATION,
  SEG7_DURATION,
};
