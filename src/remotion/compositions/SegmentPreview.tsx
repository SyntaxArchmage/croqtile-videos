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
import { DynamicShape } from "./DynamicShape";
import { AINative } from "./AINative";
import { OutroCTA } from "./OutroCTA";
import { Subtitle, type SubtitleCue } from "../components/Subtitle";
import { SUBTITLES } from "../data/subtitles";

const SEG0_DURATION = 439;
const SEG1_DURATION = 1393;
const SEG2_DURATION = 1390;
const SEG3_DURATION = 750;
const SEG4_DURATION = 900;
const SEG5_DURATION = 900;
const SEG6_DURATION = 4650;
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
  ["seg4-02", 300],
  ["seg4-03", 560],
];

const SEG5_VO_FRAMES: [string, number][] = [
  ["seg5-01", 20],
  ["seg5-02", 300],
  ["seg5-03", 560],
];

const SEG6_VO_FRAMES: [string, number][] = [
  ["seg6a-01", 20],
  ["seg6a-02", 240],
  ["seg6b-01", 470],
  ["seg6b-02", 760],
  ["seg6b-03", 1010],
  ["seg6c-01", 1220],
  ["seg6c-02", 1510],
  ["seg6c-03", 1760],
  ["seg6d-01", 1970],
  ["seg6d-02", 2210],
  ["seg6d-03", 2480],
  ["seg6e-01", 2720],
  ["seg6e-02", 2990],
  ["seg6e-03", 3290],
  ["seg6f-01", 3620],
  ["seg6f-02", 3910],
  ["seg6f-03", 4210],
  ["seg6f-04", 4500],
];

const SEG7_VO_FRAMES: [string, number][] = [
  ["seg7-01", 40],
];

function filterSubtitles(
  cueIds: string[],
  baseOffset: number,
): SubtitleCue[] {
  return SUBTITLES.filter((_, i) => {
    const sub = SUBTITLES[i];
    return sub.startFrame >= baseOffset &&
      sub.startFrame < baseOffset + (cueIds[0].startsWith("seg0") ? SEG0_DURATION : SEG1_DURATION);
  }).map((sub) => ({
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

const seg5Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= 4872 && sub.startFrame < 4872 + SEG5_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - 4872,
  endFrame: sub.endFrame - 4872,
}));

const seg6Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= 5772 && sub.startFrame < 5772 + SEG6_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - 5772,
  endFrame: sub.endFrame - 5772,
}));

const seg7Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= 10422 && sub.startFrame < 10422 + SEG7_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - 10422,
  endFrame: sub.endFrame - 10422,
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
    <DynamicShape />
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
