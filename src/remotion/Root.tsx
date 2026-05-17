import React from "react";
import { Composition } from "remotion";
import { THEME } from "./theme";
import { PainPoint } from "./compositions/PainPoint";
import { IterativeDev } from "./compositions/IterativeDev";
import { HeroIntro } from "./compositions/HeroIntro";
import { FeatureSpotlight } from "./compositions/FeatureSpotlight";
import { PerfChart } from "./compositions/PerfChart";
import { CompileTimeSafety } from "./compositions/CompileTimeSafety";
import { DynamicShape } from "./compositions/DynamicShape";
import { AINative } from "./compositions/AINative";
import { OutroCTA } from "./compositions/OutroCTA";
import {
  FullVideo,
  FullVideoCN,
  FullVideoEN,
  FULL_VIDEO_DURATION,
} from "./compositions/FullVideo";
import {
  VoiceoverPreviewCN,
  VoiceoverPreviewEN,
  VOICEOVER_PREVIEW_DURATION,
} from "./compositions/VoiceoverPreview";
import {
  VoiceSamplerCN,
  VoiceSamplerEN,
  SAMPLER_CN_DURATION,
  SAMPLER_EN_DURATION,
} from "./compositions/VoiceSampler";
import {
  Seg0PreviewCN,
  Seg0PreviewEN,
  Seg1PreviewCN,
  Seg1PreviewEN,
  Seg2PreviewCN,
  Seg2PreviewEN,
  Seg3PreviewCN,
  Seg3PreviewEN,
  SEG0_DURATION,
  SEG1_DURATION,
  SEG2_DURATION,
  SEG3_DURATION,
} from "./compositions/SegmentPreview";

const { width, height, fps } = THEME.video;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ═══ 语音对比试听 ═══ */}
      <Composition
        id="VoiceSampler-CN"
        component={VoiceSamplerCN}
        durationInFrames={SAMPLER_CN_DURATION}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="VoiceSampler-EN"
        component={VoiceSamplerEN}
        durationInFrames={SAMPLER_EN_DURATION}
        fps={fps}
        width={width}
        height={height}
      />

      {/* ═══ 配音预览 ═══ */}
      <Composition
        id="VoiceoverPreview-CN"
        component={VoiceoverPreviewCN}
        durationInFrames={VOICEOVER_PREVIEW_DURATION}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="VoiceoverPreview-EN"
        component={VoiceoverPreviewEN}
        durationInFrames={VOICEOVER_PREVIEW_DURATION}
        fps={fps}
        width={width}
        height={height}
      />

      {/* ═══ 完整视频 5:30 ═══ */}
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="FullVideo-CN"
        component={FullVideoCN}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="FullVideo-EN"
        component={FullVideoEN}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={fps}
        width={width}
        height={height}
      />

      {/* ═══ 分段带配音预览 ═══ */}
      <Composition
        id="Seg0-Preview-CN"
        component={Seg0PreviewCN}
        durationInFrames={SEG0_DURATION}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="Seg0-Preview-EN"
        component={Seg0PreviewEN}
        durationInFrames={SEG0_DURATION}
        fps={fps}
        width={width}
        height={height}
      />

      <Composition
        id="Seg1-Preview-CN"
        component={Seg1PreviewCN}
        durationInFrames={SEG1_DURATION}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="Seg1-Preview-EN"
        component={Seg1PreviewEN}
        durationInFrames={SEG1_DURATION}
        fps={fps}
        width={width}
        height={height}
      />

      <Composition
        id="Seg2-Preview-CN"
        component={Seg2PreviewCN}
        durationInFrames={SEG2_DURATION}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="Seg2-Preview-EN"
        component={Seg2PreviewEN}
        durationInFrames={SEG2_DURATION}
        fps={fps}
        width={width}
        height={height}
      />

      <Composition
        id="Seg3-Preview-CN"
        component={Seg3PreviewCN}
        durationInFrames={SEG3_DURATION}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="Seg3-Preview-EN"
        component={Seg3PreviewEN}
        durationInFrames={SEG3_DURATION}
        fps={fps}
        width={width}
        height={height}
      />

      {/* ═══ 单段预览(无配音) ═══ */}
      <Composition
        id="PainPoint"
        component={PainPoint}
        durationInFrames={439}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="IterativeDev"
        component={IterativeDev}
        durationInFrames={1393}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="HeroIntro"
        component={HeroIntro}
        durationInFrames={540}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="FeatureSpotlight"
        component={FeatureSpotlight}
        durationInFrames={1410}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="PerfChart"
        component={PerfChart}
        durationInFrames={750}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="CompileTimeSafety"
        component={CompileTimeSafety}
        durationInFrames={900}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="DynamicShape"
        component={DynamicShape}
        durationInFrames={900}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="AINative"
        component={AINative}
        durationInFrames={4650}
        fps={fps}
        width={width}
        height={height}
      />
      <Composition
        id="OutroCTA"
        component={OutroCTA}
        durationInFrames={300}
        fps={fps}
        width={width}
        height={height}
      />
    </>
  );
};
