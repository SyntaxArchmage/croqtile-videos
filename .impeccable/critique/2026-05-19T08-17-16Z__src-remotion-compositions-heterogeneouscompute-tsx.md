---
target: seg5 video and voice
total_score: 19
p0_count: 0
p1_count: 2
timestamp: 2026-05-19T08-17-16Z
slug: src-remotion-compositions-heterogeneouscompute-tsx
---
# Seg5 Critique: HeterogeneousCompute.tsx + Voiceover

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Phase B cycling could use a progress indicator |
| 2 | Match System / Real World | 4 | Authentic hardware names and compile flags |
| 4 | Consistency and Standards | 3 | Phase C amber label breaks mint branding |
| 6 | Recognition Rather Than Recall | 3 | No persistent flag-to-device legend |
| 8 | Aesthetic and Minimalist Design | 3 | Phase C overloads with code+grid+bullets simultaneously |
| 10 | Help and Documentation | 3 | Bottom tagline too small at 14px |
| **Total** | | **19/24** | **Solid foundation, polish-level issues** |

## Anti-Patterns Verdict
No AI slop detected. Authentic code, real hardware targets, project-native tokens.

## Priority Issues

### [P1] Voiceover-Animation Phase Mismatch at Phase B/C Boundary
Phase C visual and seg5-03 voiceover both start at frame 560. No visual lead-in. Fix: start Phase C Sequence at 536f or shift VO to 580f.

### [P1] Phase C Visual Overload
Code + grid + bullets appear within ~100 frames. Fix: delay bullets to local-160 so viewer processes code→grid first.

### [P2] Phase B Cycling Too Fast
70 frames (2.3s) per target. Compile flags barely readable. Fix: extend first/last target dwell times.

### [P2] Bottom Tagline Too Small
14px text invisible at playback speed. Fix: bump to 16px or remove.

### [P3] Phase C Label Color Inconsistency
"Multi-device layer" uses amber instead of mint. Breaks CroqTile branding convention.

## Voiceover Sync
- seg5-01: +20f lead (good)
- seg5-02: +20f lead (marginal)
- seg5-03: 0f lead (bad, needs fix)
