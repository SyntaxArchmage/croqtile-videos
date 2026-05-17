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
import { Subtitle, type SubtitleCue } from "../components/Subtitle";
import { SUBTITLES } from "../data/subtitles";

const SEG0_DURATION = 439;
const SEG1_DURATION = 1393;
const SEG2_DURATION = 1390;
const SEG3_DURATION = 750;

const SEG0_CUES = ["seg0-01", "seg0-02"];
const SEG1_CUES = ["seg1-01", "seg1-02", "seg1-03", "seg1-04", "seg1-05"];
const SEG2_CUES = ["seg2-01", "seg2-02", "seg2-03"];
const SEG3_CUES = ["seg3-01", "seg3-02", "seg3-03"];

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
    startFrame: sub.startFrame - baseOffset,
    endFrame: sub.endFrame - baseOffset,
  }));
}

const seg0Subs = filterSubtitles(SEG0_CUES, 0);
const seg1Subs = filterSubtitles(SEG1_CUES, 439);
const seg2Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= 1832 && sub.startFrame < 1832 + SEG2_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - 1832,
  endFrame: sub.endFrame - 1832,
}));
const seg3Subs = SUBTITLES.filter(
  (sub) => sub.startFrame >= 3222 && sub.startFrame < 3222 + SEG3_DURATION,
).map((sub) => ({
  ...sub,
  startFrame: sub.startFrame - 3222,
  endFrame: sub.endFrame - 3222,
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

export { SEG0_DURATION, SEG1_DURATION, SEG2_DURATION, SEG3_DURATION };
