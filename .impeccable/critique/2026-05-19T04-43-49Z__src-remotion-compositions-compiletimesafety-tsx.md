---
target: CompileTimeSafety (Segment 4)
total_score: 16
p0_count: 0
p1_count: 0
timestamp: 2026-05-19T04-43-49Z
slug: src-remotion-compositions-compiletimesafety-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress rail well-executed; phase transitions legible but some overlap during fast transitions (P3-P5) |
| 2 | Match System / Real World | 4 | CUDA error codes, pipeline stages, bug types speak audience language fluently |
| 3 | User Control and Freedom | N/A | Video composition |
| 4 | Consistency and Standards | 3 | Mostly consistent with THEME tokens; a few inline hardcoded values |
| 5 | Error Prevention | N/A | Non-interactive |
| 6 | Recognition Rather Than Recall | 3 | Shield icon + title, pipeline labels, bug-type cards self-explanatory |
| 7 | Flexibility and Efficiency | N/A | Non-interactive |
| 8 | Aesthetic and Minimalist Design | 3 | Strong hierarchy; Phases 3-5 feel crowded |
| 9 | Error Recovery | N/A | Non-interactive |
| 10 | Help and Documentation | N/A | Not applicable to video |
| **Total (scored)** | | **16/20** | **Good** |

## Anti-Patterns Verdict

LLM assessment: Passes the brand slop test. 9-phase additive layering with dimming is a deliberate cinematographic choice. Shield-icon entrance, GPU shake physics, bug-card morph are all distinctive.

Deterministic scan: Clean. No banned anti-patterns detected.

## Overall Impression

Confident, well-structured 48-second piece. Narrative arc is clear and emotionally effective. Biggest opportunity: middle phases (3-5) spatial collision.

## What's Working

1. The morph transition (Phases 8-9): smooth-step color interpolation on bug cards is technically impressive and narratively satisfying.
2. Additive layering with dimAfter(): cinematic technique most compositions skip.
3. Compiler pipeline visualization (Phase 6-7): sequential entrance + checkmark badges.

## Priority Issues

[P2] Phase 3-5 spatial collision: time overlay floats on top of code block area. Fix: stagger timing or reposition.
[P2] Hardcoded values: paddingBottom: 200, multiple ad-hoc rgba(255,255,255,0.0x) values.
[P2] Other kernel DSLs panel too dim (0.7 opacity): content barely readable.
[P3] Progress rail gradient uses indigo accent off-brand. Fix: use mint-to-emerald-deep.
[P3] Phase 2 efficiency bar same off-brand gradient.

## Persona Red Flags

Dr. Chen (Senior CUDA Engineer): Phases 1-2 spend 7s explaining what she already knows.
Wei (ML Framework Team Lead): Competitive comparison too dim to read.

## Minor Observations

- cl() and dimAfter() helpers could be shared utils
- Custom lc()/px() could use Remotion's interpolateColors
- Unicode ✓/✗ may render inconsistently; prefer SVG
- 56px title has no named scale entry
