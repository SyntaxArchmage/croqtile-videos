---
name: remotion-production
description: >-
  Orchestrates segment-based Remotion production: iterative script design with
  user review gates, bilingual voiceover generation, frame-accurate animation
  implementation, subtitle wiring, and cross-file consistency checks. Maintains
  a state file for breakpoint-resume across sessions. Use when creating,
  redesigning, or continuing work on any Remotion segment.
disable-model-invocation: true
---

# Remotion Segment Production Pipeline

## Quick Start

On every session start or `继续工作`, read the state file first:

```bash
cat .production-state/seg*.md 2>/dev/null
```

If a state file exists, resume from its `Status` line. If not, start Phase 1.

## State Management

Every segment has a state file at `.production-state/segN.md` (project root).
This is a structured markdown file the agent reads on session resume and
updates after each phase transition. It is the source of truth for
breakpoint-resume.

See [architecture.md](architecture.md) for the state file template and file role map.

After each phase, update the `Status` line and append decisions to the
appropriate section. Keep it concise and factual — this file is for agent
consumption, not human documentation.

## Pipeline Overview

**Phase 1** is a one-time batch step — write the full video script covering all segments.
**Phases 2–10** run per-segment, sequentially: finish seg N (phases 2–10), then seg N+1, etc.

The user may refine or replace a segment's script text when starting that segment's
Phase 2, so Phase 1's output is a starting draft, not final.

## Pipeline Phases

### Phase 1: Full Script Draft (one-time, USER REVIEW GATE)

Write the entire video script covering all segments:

1. Structure the narrative arc across all segments
2. Write CN/EN parallel narration for each segment
3. Estimate per-segment durations
4. Define segment boundaries and time slots
5. Write to the project's script document (e.g., `SCRIPT-v1.md`)

**Do NOT proceed** without user approval of the overall structure.
After Phase 1, work proceeds segment-by-segment through Phases 2–10.

---

*Phases 2–10 below are repeated for each segment in order.*

### Phase 2: Segment Script Refinement (USER REVIEW GATE)

When starting a new segment, the user typically provides updated narrative direction.

1. Revise or rewrite this segment's CN/EN narration
2. User reviews for wording, emphasis, technical accuracy
3. Iterate on corrections (restructuring, term changes)

**Do NOT proceed** without user approval.

### Phase 3: Animation Concept (USER REVIEW GATE)

1. For each narration beat, write `[画面]` animation descriptions
2. Include specific visual elements (charts, code panels, diagrams)
3. User approves or redirects visual approach

**Do NOT proceed** without user approval.

### Phase 4: Voiceover Cue Split (autonomous)

Split approved script into voiceover cues:
- Each cue = one semantic unit (1-3 sentences)
- Naming: `segN-01`, `segN-02`, `segN-03`...
- Add to the project's voiceover generation script as `(id, cn_text, en_text)` tuples
- Update state with cue list

### Phase 5: Voiceover Generation (autonomous)

```bash
rm -f public/voiceover/cn/segN-*.mp3 public/voiceover/en/segN-*.mp3
python3 scripts/generate-voiceover.py
```

Verify files exist after generation.

### Phase 6: Timing Self-Check (autonomous)

Measure VO durations, compute frame layout:

```python
from mutagen.mp3 import MP3
# For each cue, measure max(cn, en) duration × fps = frames needed
```

Rules:
- Total VO must fit within the segment's allotted frames
- If too long → trim script, regenerate, re-measure (loop back to Phase 4)
- Inter-cue gap target: ~8 frames (0.27s at 30fps)
- VO start frames define animation phase boundaries

Update state with measured durations, phase boundaries, total frames.

### Phase 7: Script Timing Update (autonomous)

Update the project's script document with:
- Exact frame ranges per cue
- Phase boundary table
- Total segment duration and timestamp

### Phase 8: Animation + Wiring (autonomous)

The core implementation. For each animation phase:

1. **Implement animation component** (`src/remotion/compositions/SegmentName.tsx`):
   - All animation via `interpolate()` / `spring()` — NO CSS transitions
   - All visual constants from the project's theme — never hardcode
   - Define `TOTAL_FRAMES` matching segment duration
   - Use phase boundary constants to gate animation sections

2. **Wire subtitles** (project's subtitle data file):
   - Absolute frame numbers = previous segment end + relative offset
   - `endFrame` is exclusive (`frame < endFrame` in Subtitle component)
   - Include `highlights` array for keyword emphasis

3. **Wire voiceover** (project's voiceover data file):
   - Map `[cueId, absoluteStartFrame]`

4. **Create preview composition** (SegmentPreview file):
   - Inner component: segment + subtitles + audio sequences
   - Export CN/EN variants and duration constant

5. **Register** in Root.tsx and update FullVideo segment duration

**Render-test each animation phase:**
```bash
npx remotion still SegN-Preview-CN --frame=N --output=/tmp/phaseX.png
```

**Phase 8 quality gates** (auto-check every rendered frame):
- [ ] Text is readable at 1920×1080 — minimum font size ~20px for body, ~36px for headings
- [ ] No element clips outside the 1920×1080 frame or hides behind subtitle area (bottom 200px)
- [ ] Colors come from THEME, not hardcoded hex values
- [ ] Phase transitions are seamless — last frame of phase N matches first frame of phase N+1 in position, size, color, and icons
- [ ] Animated elements (charts, code blocks) are large enough to read at a glance
- [ ] Subtitle area (bottom ~200px) is kept clear of important content

### Phase 9: Consistency Check (autonomous)

Cross-file validation:
- [ ] Cue IDs match: voiceover script ↔ subtitle data ↔ voiceover data ↔ preview
- [ ] MP3 files exist for all cues in both languages
- [ ] Subtitle frames use correct absolute offsets
- [ ] FullVideo segment duration matches component's TOTAL_FRAMES
- [ ] Preview composition builds and renders

**Phase 9 quality gates** (render and inspect):
- [ ] VO inter-cue gaps are ~8 frames (0.27s) — not 15+ frames of silence
- [ ] Subtitle text matches voiceover script text exactly
- [ ] Subtitle `endFrame` is exclusive (add +1 if needed for correct display)
- [ ] No subtitle is missing at the start of the segment (frame 0 cue often missed)
- [ ] Preview server runs via `screen` — never blocks the terminal

Update state: all `consistency_check` fields.

### Phase 10: User Review (USER REVIEW GATE)

1. Ensure persistent preview server (non-blocking):
   ```bash
   screen -S remotion-studio -X quit 2>/dev/null
   screen -dmS remotion-studio bash -c "cd $(pwd) && ./node_modules/.bin/remotion studio --port=3000 2>&1 | tee /tmp/remotion-studio.log"
   ```
2. Poll for HTTP 200 on port 3000 (up to 15s for cold build)
3. Present checkpoint to user: select `SegN-Preview-CN/EN`, press Play
4. User feedback loops back to the relevant phase

## Anti-Patterns

### Process
1. **Never block agent shell** with `remotion studio` — always `screen -dmS` then poll for HTTP 200
2. **Never iterate on FullVideo** — use per-segment preview compositions
3. **Always verify VO duration fits** before starting animation work
4. **Never invent narrative** — only structure what the user provides
5. **Never skip user review gates** at Phases 1, 2, 3, and 10

### Animation
6. **Never hardcode colors/fonts/sizes** — read from the project's theme
7. **Never use CSS transitions or Tailwind animation classes** — only `interpolate()` / `spring()`
8. **Start with large, readable elements** — text ≥20px body / ≥36px headings at 1920×1080
9. **Keep bottom 200px clear** for subtitle overlay — no important content there
10. **Phase transitions must be visually seamless** — if phase N ends with 3 keywords at specific positions/sizes/colors, phase N+1 must start with the exact same positions/sizes/colors
11. **Code blocks and charts must be large enough** to read at a glance — err on the side of too large

### Subtitles
12. **Subtitle endFrame is exclusive** — component uses `frame < endFrame`
13. **Don't forget frame-0 subtitle** — the first cue often starts at frame 0, easy to miss
14. **Subtitle text must match VO script** exactly — copy-paste, don't retype

### Voiceover
15. **VO gap target: ~8 frames** (0.27s) between cues — 15+ frames feels too silent

## Session Resumption Protocol

On session start:
1. Read all `.production-state/seg*.md`
2. Find any segment with status != `done`
3. Report current state and resume from that phase
4. If studio is not running, launch it first

## Additional Resources

- For project architecture and file roles, see [architecture.md](architecture.md)
