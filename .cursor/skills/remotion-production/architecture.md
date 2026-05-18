# Project Architecture Reference

## State File

Location: `.production-state/segN.md` (project root)

This is a structured markdown file for agent consumption. The agent reads it on
session resume and updates it after each phase transition.

### Template

````markdown
# Segment N: SegmentName

Status: phase8_animation
Absolute offset: 3222
Total frames: 750

## Narrative Route
LOC comparison → zero-cost abstraction → simplicity-vs-perf scatter

## Script
- [x] Script approved
- [x] Animation concept approved

## Voiceover Cues

| Cue | CN | EN | CN dur | EN dur | Start frame |
|-----|----|----|--------|--------|-------------|
| seg3-01 | 和其他内核 DSL 相比... | Compared to other kernel DSLs... | 7.63s | 7.37s | 0 |
| seg3-02 | 这种简洁性没有以性能为代价... | This level of simplicity... | 7.70s | 8.54s | 250 |
| seg3-03 | 这使得 CroqTile 成为... | This makes CroqTile... | 7.30s | 6.58s | 500 |

## Phase Boundaries

| Phase | Frames | Description | Status |
|-------|--------|-------------|--------|
| A | 0–249 | LOC bar chart | done |
| B | 250–499 | Zero-Cost Abstraction | done |
| C | 500–749 | Simplicity vs Perf scatter | in_progress |

## Consistency Check
- [x] VO files exist (cn + en)
- [x] Subtitles wired
- [x] Preview registered in Root.tsx
- [ ] FullVideo duration matches
- [ ] Render test passed

## User Feedback
- Phase A LOC bars look good
- 语音段间隔有点空，稍微变无缝点
````

### Status Values

Per-segment status (Phases 2–10 repeat for each segment):

```
phase2_segment_script → phase3_animation_concept →
phase4_cue_split → phase5_voiceover → phase6_timing →
phase7_script_update → phase8_animation → phase9_consistency_check →
phase10_user_review → done
```

## File Roles

Discover actual paths by reading the project structure. Typical layout:

| Role | Typical Path | When Modified |
|------|-------------|---------------|
| Script document | `SCRIPT-v1.md` or similar | Phase 1, 2, 7 |
| VO generation script | `scripts/generate-voiceover.py` | Phase 4 |
| VO audio files | `public/voiceover/{cn,en}/segN-XX.mp3` | Phase 5 |
| Animation component | `src/remotion/compositions/SegmentName.tsx` | Phase 8 |
| Subtitle data | `src/remotion/data/subtitles.ts` | Phase 8 |
| Voiceover data | `src/remotion/data/voiceover.ts` | Phase 8 |
| Segment preview | `src/remotion/compositions/SegmentPreview.tsx` | Phase 8 |
| Full video sequence | `src/remotion/compositions/FullVideo.tsx` | Phase 8 |
| Composition registry | `src/remotion/Root.tsx` | Phase 8 |
| Segment state | `.production-state/segN.md` | Every phase |
| Theme constants | `src/remotion/theme/index.ts` | Read-only |
| Layout wrapper | `src/remotion/components/PageContainer.tsx` | Read-only |
| Subtitle renderer | `src/remotion/components/Subtitle.tsx` | Read-only |

## Voiceover Conventions

- Default engine: `edge_tts` (Python, `pip install edge-tts`)
- CN voice: `zh-CN-YunxiNeural`, rate `-5%`
- EN voice: `en-GB-RyanNeural`, rate `-5%`
- Duration measurement: `mutagen.mp3` (Python, `pip install mutagen`)
- Cue naming: `segN-01`, `segN-02`, ... (zero-padded two digits)

## Animation Conventions

- Frame rate: 30fps, 1920×1080 (read from theme `video` config)
- All animation: `useCurrentFrame()` + `interpolate()` or `spring()`
- No CSS transitions, no CSS animations, no Tailwind animation classes
- Colors/fonts/sizes: always from project theme, never hardcoded
- Layout: wrap in `PageContainer` (or project equivalent)
- Phase gating: define constants like `PHASE_A_END`, `PHASE_B_END`

## Subtitle Conventions

- Bilingual: CN (primary, larger) + EN (secondary, smaller)
- Keyword highlighting via `highlights` array
- Frame numbers in subtitle data are **absolute** (relative to FullVideo timeline)
- `endFrame` is **exclusive** — the component uses `frame < endFrame`
- Inter-cue gap: ~8 frames (0.27s) between subtitles

## Preview Server

Always use `screen` for persistence:

```bash
screen -dmS remotion-studio bash -c "cd $(pwd) && npx remotion studio --port=3000 2>&1 | tee /tmp/remotion-studio.log"
```

Verify: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000`

Management:
- Attach: `screen -r remotion-studio`
- Kill: `screen -S remotion-studio -X quit`
- List: `screen -ls`

## Frame Offset Cascade

When a segment's duration changes, all downstream segments shift:

```
seg0_start = 0
seg1_start = seg0_start + seg0_duration
seg2_start = seg1_start + seg1_duration
...
```

Files affected by a cascade:
1. `FullVideo.tsx` — SEGMENTS duration
2. `subtitles.ts` — all downstream absolute frame numbers
3. `voiceover.ts` — all downstream absolute start frames

When redesigning a segment, update its own files first, note downstream
cascade as pending, and handle it when those segments are redesigned.
