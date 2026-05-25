/**
 * data/voiceover.ts
 * Maps each subtitle cue to its corresponding voiceover audio file.
 * startFrame values are absolute frame numbers in the FullVideo timeline.
 *
 * Segment offsets (rate=+0%, 8f gaps):
 *   PainPoint: 0–381  (382f)
 *   IterativeDev: 382–1516  (1135f)
 *   FeatureSpotlight: 1517–2936  (1420f)
 *   PerfChart: 2937–3611  (675f)
 *   CompileTimeSafety: 3612–4912  (1301f)
 *   HeterogeneousCompute: 4913–5910  (998f)
 *   AINative: 5911–9670  (3760f)
 *   OutroCTA: 9671–9885  (215f)
 */

export interface VoiceoverCue {
  id: string;
  startFrame: number;
  file: string;
}

const CUE_IDS_WITH_FRAMES: [string, number][] = [
  // Seg 0: PainPoint (0–381, 382f)
  ["seg0-01", 4],
  ["seg0-02", 151],
  // Seg 1: IterativeDev (382–1516, 1135f)
  ["seg1-01", 386],
  ["seg1-02", 534],
  ["seg1-03", 857],
  ["seg1-04", 1095],
  ["seg1-05", 1238],
  // Seg 2: FeatureSpotlight (1517–2936, 1420f)
  ["seg2-01", 1521],
  ["seg2-02", 2113],
  ["seg2-03", 2630],
  // Seg 3: PerfChart (2937–3611, 675f)
  ["seg3-01", 2941],
  ["seg3-02", 3168],
  ["seg3-03", 3398],
  // Seg 4: CompileTimeSafety (3612–4912, 1301f)
  ["seg4-01", 3616],
  ["seg4-02", 3798],
  ["seg4-03", 4206],
  ["seg4-04", 4547],
  // Seg 5: HeterogeneousCompute (4913–5910, 998f)
  ["seg5-01", 4917],
  ["seg5-02", 5360],
  // Seg 6: AINative (5911–9670, 3760f)
  ["seg6-01", 5915],
  ["seg6-02", 6169],
  ["seg6-03", 6393],
  ["seg6-04", 6665],
  ["seg6-05", 6915],
  ["seg6-06", 7175],
  ["seg6-07", 7442],
  ["seg6-08", 7686],
  ["seg6-09", 8045],
  ["seg6-10", 8271],
  ["seg6-11", 8580],
  ["seg6-12", 8831],
  ["seg6-13", 9532],
  // Seg 7: OutroCTA (9671–9885, 215f)
  ["seg7-01", 9675],
];

export function getVoiceoverCues(lang: "cn" | "en"): VoiceoverCue[] {
  return CUE_IDS_WITH_FRAMES.map(([id, startFrame]) => ({
    id,
    startFrame,
    file: `voiceover/${lang}/${id}.mp3`,
  }));
}
