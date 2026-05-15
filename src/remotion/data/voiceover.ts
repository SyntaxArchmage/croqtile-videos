/**
 * data/voiceover.ts
 * Maps each subtitle cue to its corresponding voiceover audio file.
 * startFrame values are absolute frame numbers in the FullVideo timeline.
 */

export interface VoiceoverCue {
  id: string;
  startFrame: number;
  file: string;
}

const CUE_IDS_WITH_FRAMES: [string, number][] = [
  // Seg 0: PainPoint (0–438, 439f)
  ["seg0-01", 0],
  ["seg0-02", 165],
  // Seg 1: IterativeDev (439–1749, 1311f)
  ["seg1-01", 439],
  ["seg1-02", 599],
  ["seg1-03", 956],
  ["seg1-04", 1223],
  ["seg1-05", 1371],
  // Seg 2: FeatureSpotlight (1750–3159)
  ["seg2a-01", 1770],
  ["seg2a-02", 2050],
  ["seg2a-03", 2230],
  ["seg2a-04", 2510],
  ["seg2b-01", 2790],
  ["seg2b-02", 3000],
  // Seg 3: PerfChart (3160–3459)
  ["seg3-01", 3180],
  ["seg3-02", 3350],
  // Seg 4: CompileTimeSafety (3460–4359)
  ["seg4-01", 3480],
  ["seg4-02", 3760],
  ["seg4-03", 4020],
  // Seg 5: DynamicShape (4360–5259)
  ["seg5-01", 4380],
  ["seg5-02", 4660],
  ["seg5-03", 4920],
  // Seg 6: AINative (5260–9909)
  ["seg6a-01", 5280],
  ["seg6a-02", 5500],
  ["seg6b-01", 5730],
  ["seg6b-02", 6020],
  ["seg6b-03", 6270],
  ["seg6c-01", 6480],
  ["seg6c-02", 6770],
  ["seg6c-03", 7020],
  ["seg6d-01", 7230],
  ["seg6d-02", 7470],
  ["seg6d-03", 7740],
  ["seg6e-01", 7980],
  ["seg6e-02", 8250],
  ["seg6e-03", 8550],
  ["seg6f-01", 8880],
  ["seg6f-02", 9170],
  ["seg6f-03", 9470],
  ["seg6f-04", 9760],
  // Seg 7: OutroCTA (9910–10209)
  ["seg7-01", 9950],
];

export function getVoiceoverCues(lang: "cn" | "en"): VoiceoverCue[] {
  return CUE_IDS_WITH_FRAMES.map(([id, startFrame]) => ({
    id,
    startFrame,
    file: `voiceover/${lang}/${id}.mp3`,
  }));
}
