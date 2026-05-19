# Seg 5 — Heterogeneous Computing (Write Once, Run Everywhere)

## Status: script-redesign-in-progress

## Content Direction (aligned with slides Chapter 3)
- **Slide 1**: Write Once, Run Everywhere — same CroqTile source → multiple backends (H800, A100, AMD MI300, Custom DSA) via `-t` compiler flags
- **Slide 2**: Multi-Device Programming — `parallel-by mpi` distributes work across nodes, compiler auto-generates host dispatch

## Timeline
- Absolute start frame: 5600
- Duration: 1120 frames (~37s)
- Absolute end frame: 6719

## Voiceover Cues (2 cues)
| Cue | Abs Frame | Rel Frame | Duration | Content |
|-----|-----------|-----------|----------|---------|
| seg5-01 | 5610 | 10 | ~19s (CN) / ~19s (EN) | Multi-backend support, one config, no migration needed |
| seg5-02 | 6090 | 490 | ~15s (CN) / ~15s (EN) | Multi-device collaboration: parallel-by mpi, compiler handles partitioning |

## Script Updated
- [x] Subtitles rewritten to match slides Chapter 3
- [ ] Voiceover re-generation needed (CN+EN)
- [ ] Animation redesign needed (DynamicShape.tsx → HeterogeneousCompute.tsx)
- [ ] User review pending
