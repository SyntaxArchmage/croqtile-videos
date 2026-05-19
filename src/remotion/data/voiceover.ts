/**
 * data/voiceover.ts
 * Maps each subtitle cue to its corresponding voiceover audio file.
 * startFrame values are absolute frame numbers in the FullVideo timeline.
 *
 * Segment offsets (from FullVideo.tsx SEGMENTS v3):
 *   PainPoint:         0–459   (460f)
 *   IterativeDev:      460–1929 (1470f)
 *   FeatureSpotlight:  1930–3399 (1470f)
 *   PerfChart:         3400–4169 (770f)
 *   CompileTimeSafety: 4170–5599 (1430f)
 *   HeterogeneousCompute: 5600–6719 (1120f)
 *   AINative:          6720–11369 (4650f)
 *   OutroCTA:          11370–11669 (300f)
 */

export interface VoiceoverCue {
  id: string;
  startFrame: number;
  file: string;
}

const CUE_IDS_WITH_FRAMES: [string, number][] = [
  // Seg 0: PainPoint (0–459, 460f)
  ["seg0-01", 0],
  ["seg0-02", 165],
  // Seg 1: IterativeDev (439–1831, 1393f)
  ["seg1-01", 439],
  ["seg1-02", 605],
  ["seg1-03", 996],
  ["seg1-04", 1287],
  ["seg1-05", 1433],
  // Seg 2: FeatureSpotlight (1832–3241)
  ["seg2a-01", 1852],
  ["seg2a-02", 2132],
  ["seg2a-03", 2312],
  ["seg2a-04", 2592],
  ["seg2b-01", 2872],
  ["seg2b-02", 3082],
  // Seg 3: PerfChart (3242–3541)
  ["seg3-01", 3262],
  ["seg3-02", 3432],
  // Seg 4: CompileTimeSafety (3972–4871)
  ["seg4-01", 3992],
  ["seg4-02", 4182],
  ["seg4-03", 4612],
  ["seg4-04", 4972],
  // Seg 5: HeterogeneousCompute (5600–6719)
  ["seg5-01", 5610],
  ["seg5-02", 6090],
  // Seg 6: AINative (6720–11369, 14 cues, rate=+0%, gap=8f)
  ["seg6-01", 6740],
  ["seg6-02", 6994],
  ["seg6-03", 7217],
  ["seg6-04", 7488],
  ["seg6-05", 7737],
  ["seg6-06", 7996],
  ["seg6-07", 8262],
  ["seg6-08", 8505],
  ["seg6-09", 8864],
  ["seg6-10", 9089],
  ["seg6-11", 9397],
  ["seg6-12", 9647],
  ["seg6-13", 10346],
  // seg6-14 removed: "你的编程体验" now visual-only slogan on back cover
  // Seg 7: OutroCTA (11370–11669)
  ["seg7-01", 11410],
];

export function getVoiceoverCues(lang: "cn" | "en"): VoiceoverCue[] {
  return CUE_IDS_WITH_FRAMES.map(([id, startFrame]) => ({
    id,
    startFrame,
    file: `voiceover/${lang}/${id}.mp3`,
  }));
}
