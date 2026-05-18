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
 *   DynamicShape:      5600–6489 (890f)
 *   AINative:          6490–10789 (4300f)
 *   OutroCTA:          10790–11089 (300f)
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
  ["seg4-02", 4272],
  ["seg4-03", 4532],
  // Seg 5: DynamicShape (4872–5771)
  ["seg5-01", 4892],
  ["seg5-02", 5172],
  ["seg5-03", 5432],
  // Seg 6: AINative (5772–10421)
  ["seg6a-01", 5792],
  ["seg6a-02", 6012],
  ["seg6b-01", 6242],
  ["seg6b-02", 6532],
  ["seg6b-03", 6782],
  ["seg6c-01", 6992],
  ["seg6c-02", 7282],
  ["seg6c-03", 7532],
  ["seg6d-01", 7742],
  ["seg6d-02", 7982],
  ["seg6d-03", 8252],
  ["seg6e-01", 8492],
  ["seg6e-02", 8762],
  ["seg6e-03", 9062],
  ["seg6f-01", 9392],
  ["seg6f-02", 9682],
  ["seg6f-03", 9982],
  ["seg6f-04", 10272],
  // Seg 7: OutroCTA (10422–10721)
  ["seg7-01", 10462],
];

export function getVoiceoverCues(lang: "cn" | "en"): VoiceoverCue[] {
  return CUE_IDS_WITH_FRAMES.map(([id, startFrame]) => ({
    id,
    startFrame,
    file: `voiceover/${lang}/${id}.mp3`,
  }));
}
