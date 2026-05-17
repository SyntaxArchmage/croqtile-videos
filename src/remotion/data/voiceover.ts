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
  // Seg 4: CompileTimeSafety (3542–4441)
  ["seg4-01", 3562],
  ["seg4-02", 3842],
  ["seg4-03", 4102],
  // Seg 5: DynamicShape (4442–5341)
  ["seg5-01", 4462],
  ["seg5-02", 4742],
  ["seg5-03", 5002],
  // Seg 6: AINative (5342–9991)
  ["seg6a-01", 5362],
  ["seg6a-02", 5582],
  ["seg6b-01", 5812],
  ["seg6b-02", 6102],
  ["seg6b-03", 6352],
  ["seg6c-01", 6562],
  ["seg6c-02", 6852],
  ["seg6c-03", 7102],
  ["seg6d-01", 7312],
  ["seg6d-02", 7552],
  ["seg6d-03", 7822],
  ["seg6e-01", 8062],
  ["seg6e-02", 8332],
  ["seg6e-03", 8632],
  ["seg6f-01", 8962],
  ["seg6f-02", 9252],
  ["seg6f-03", 9552],
  ["seg6f-04", 9842],
  // Seg 7: OutroCTA (9992–10291)
  ["seg7-01", 10032],
];

export function getVoiceoverCues(lang: "cn" | "en"): VoiceoverCue[] {
  return CUE_IDS_WITH_FRAMES.map(([id, startFrame]) => ({
    id,
    startFrame,
    file: `voiceover/${lang}/${id}.mp3`,
  }));
}
